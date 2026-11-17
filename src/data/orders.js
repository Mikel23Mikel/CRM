import { STAGES } from './stages.js'

// Демо-данные. Целевая схема под интеграции (1С + Teamline + почта):
// {
//   serial, model, customer, site ('msk'|'tvr'), priority, planShip,
//   stages: [{ stageId, start, end, progress(0..100), status('done'|'active'|'pending'|'blocked'|'overdue'), note }]
// }

const iso = (d) => d.toISOString().slice(0, 10)
const addDays = (base, n) => { const x = new Date(base); x.setDate(x.getDate() + n); return x }
const TODAY = new Date()

// Генерирует маршрут из справочника этапов со сдвигом старта и «дыркой» на блокировке
function buildRoute(startOffsetDays, currentIdx, opts = {}) {
  let cursor = addDays(TODAY, startOffsetDays)
  return STAGES.map((s, i) => {
    const dur = opts.durations?.[s.id] ?? [2, 3, 2, 4, 2, 3, 2, 2, 4, 2, 3, 1, 2, 5, 4, 3, 2, 1, 1][i % 19]
    const start = cursor
    const end = addDays(start, dur - 1)
    cursor = addDays(end, 1)
    let status = 'pending', progress = 0
    if (i < currentIdx) { status = 'done'; progress = 100 }
    else if (i === currentIdx) {
      status = opts.blocked ? 'blocked' : opts.overdue ? 'overdue' : 'active'
      progress = opts.progressAt ?? 45
    }
    return { stageId: s.id, start: iso(start), end: iso(end), progress, status, note: opts.notes?.[s.id] }
  })
}

export const ORDERS = [
  {
    id: 'SYS-2411-001', serial: 'СХД-М-24117', model: 'StorEdge 24×SAS', customer: 'ПАО «СеверТрансГаз»',
    site: 'msk', priority: 'high', planShip: iso(addDays(TODAY, 26)),
    stages: buildRoute(-24, 8, { notes: { controllers: 'Установка КК v2 — плановый срок 3 дня' } }),
  },
  {
    id: 'SYS-2411-002', serial: 'СХД-Т-24093', model: 'StorEdge 12×NVMe', customer: 'Банк «Линия»',
    site: 'tvr', priority: 'critical', planShip: iso(addDays(TODAY, 9)),
    stages: buildRoute(-31, 13, { progressAt: 60, notes: { burnin: 'Burn-in 72ч, цикл 2 из 3' } }),
  },
  {
    id: 'SYS-2411-003', serial: 'СХД-М-24121', model: 'HybridStore 60', customer: 'Ростелеком (ДЗО)',
    site: 'msk', priority: 'normal', planShip: iso(addDays(TODAY, 41)),
    stages: buildRoute(-12, 4, { blocked: true, progressAt: 20, notes: { backplane: '⚠ Нет BP rev.C на складе — ждём поставку 21.11' } }),
  },
  {
    id: 'SYS-2411-004', serial: 'СХД-Т-24088', model: 'StorEdge 24×SAS', customer: 'Министерство цифрового развития',
    site: 'tvr', priority: 'high', planShip: iso(addDays(TODAY, -2)),
    stages: buildRoute(-38, 14, { overdue: true, progressAt: 30, notes: { testing: '❗ Просрочка: пересборка RAID-тестов после сбоя ПО' } }),
  },
  {
    id: 'SYS-2411-005', serial: 'СХД-М-24130', model: 'MicroStore 8×NVMe', customer: 'Альфа-Лизинг',
    site: 'msk', priority: 'low', planShip: iso(addDays(TODAY, 55)),
    stages: buildRoute(-5, 2, { progressAt: 70 }),
  },
  {
    id: 'SYS-2411-006', serial: 'СХД-Т-24070', model: 'HybridStore 60', customer: 'ТрансКонтейнер',
    site: 'tvr', priority: 'normal', planShip: iso(addDays(TODAY, -14)),
    stages: buildRoute(-60, 19, { progressAt: 100 }),
  },
  {
    id: 'SYS-2411-007', serial: 'СХД-М-24125', model: 'StorEdge 12×NVMe', customer: 'СберМаркет',
    site: 'msk', priority: 'critical', planShip: iso(addDays(TODAY, 18)),
    stages: buildRoute(-17, 10, { progressAt: 55, notes: { drives: 'Инстансинг 12×3.84TB NVMe' } }),
  },
]

export const SITES = {
  msk: { name: 'Москва', color: '#7c5cff' },
  tvr: { name: 'Тверь', color: '#2f9ee0' },
}
