import { useMemo, useState } from 'react'
import { STAGES, stageById } from './data/stages.js'
import { SITES } from './data/orders.js'

const DAY = 86400000
const d = (s) => new Date(s + 'T00:00:00')
const fmt = (dt) => dt.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })

const ZOOMS = { year: [365, 9], quarter: [120, 16], month: [60, 34], week: [28, 74] } // [дней в окне, px/день]

export default function Gantt({ orders, selected, onSelect, stageFocus }) {
  const [zoom, setZoom] = useState('month')
  const [scrollDays, setScrollDays] = useState(0)
  const [hover, setHover] = useState(null)
  const [days, pxD] = ZOOMS[zoom]

  const today = useMemo(() => { const t = new Date(); t.setHours(0, 0, 0, 0); return t }, [])
  const winStart = useMemo(() => new Date(today - ((today.getTime() % DAY)) + scrollDays * DAY), [today, scrollDays])

  const W = days * pxD
  const x = (dateStr) => ((d(dateStr) - winStart) / DAY) * pxD

  const ticks = useMemo(() => {
    const out = []
    for (let i = 0; i <= days; i++) {
      const dt = new Date(winStart.getTime() + i * DAY)
      if (zoom === 'week' || zoom === 'month') {
        if (i === 0 || dt.getDay() === 1) out.push({ i, label: fmt(dt), sub: dt.toLocaleDateString('ru-RU', { weekday: 'short' }) })
      } else if (zoom === 'quarter') {
        if (i === 0 || dt.getDate() === 1) out.push({ i, label: dt.toLocaleDateString('ru-RU', { month: 'long', day: 'numeric' }) })
      } else {
        if (i === 0 || dt.getMonth() !== new Date(winStart.getTime() + (i - 1) * DAY).getMonth())
          out.push({ i, label: dt.toLocaleDateString('ru-RU', { month: 'short' }), sub: String(dt.getFullYear()) })
      }
    }
    return out
  }, [winStart, days, zoom])

  return (
    <div className="gantt">
      <div className="gantt-toolbar">
        <div className="seg small">
          {Object.keys(ZOOMS).map((z) => (
            <button key={z} className={zoom === z ? 'on' : ''} onClick={() => setZoom(z)}>{{ year: 'Год', quarter: 'Квартал', month: 'Месяц', week: 'Неделя' }[z]}</button>
          ))}
        </div>
        <div className="legend">
          <span><i style={{ background: SITES.msk.color }} /> Москва</span>
          <span><i style={{ background: SITES.tvr.color }} /> Тверь</span>
          <span><i className="lg done" /> выполнено</span>
          <span><i className="lg blocked" /> блокировка ⚠</span>
          <span><i className="lg overdue" /> просрочка ❗</span>
        </div>
      </div>

      <div className="gantt-scroll" onWheel={(e) => e.shiftKey && setScrollDays((s) => Math.max(-120, Math.min(400, s + Math.sign(e.deltaY) * 7)))}>
        <div className="gantt-inner" style={{ width: 240 + W }}>
          <div className="timehead" style={{ marginLeft: 240 }}>
            <div className="ticks" style={{ width: W }}>
              {ticks.map((t, k) => (
                <span key={k} className="tick" style={{ left: t.i * pxD }}>
                  <b>{t.label}</b>{t.sub && <em>{t.sub}</em>}
                </span>
              ))}
              {/* выходные */}
              {Array.from({ length: days }, (_, i) => {
                const wd = new Date(winStart.getTime() + i * DAY).getDay()
                return (wd === 0 || wd === 6) ? <span key={'w' + i} className="weekend" style={{ left: i * pxD, width: pxD }} /> : null
              })}
            </div>
          </div>

          <div className="nowline" style={{ left: 240 + ((today - winStart) / DAY) * pxD }}>
            <span className="nowbadge">Сегодня</span>
          </div>

          {orders.map((o) => {
            const site = SITES[o.site]
            return (
              <div key={o.id} className={'row' + (selected === o.id ? ' sel' : '')} onClick={() => onSelect(selected === o.id ? null : o.id)}>
                <div className="rowlabel">
                  <b>{o.serial}</b>
                  <small>{o.model} · {site.name}</small>
                </div>
                <div className="bars" style={{ width: W, marginLeft: 240 }}>
                  {o.stages.map((st) => {
                    const left = x(st.start)
                    const w = Math.max(((d(st.end) - d(st.start)) / DAY + 1) * pxD, pxD * 0.8)
                    if (left + w < 0 || left > W) return null
                    const meta = stageById(st.stageId)
                    return (
                      <div key={st.stageId}
                        className={`bar ${st.status}` + (stageFocus === st.stageId ? ' focus' : '')}
                        style={{ left, width: w, '--site': site.color }}
                        title={`${meta.name}\n${fmt(d(st.start))} → ${fmt(d(st.end))} · ${st.progress}%`}
                        onMouseEnter={() => setHover({ o, st, meta, left })}
                        onMouseLeave={() => setHover(null)}>
                        {w > pxD * 2 && <span className="fill" style={{ width: `${st.progress}%` }} />}
                        {['blocked', 'overdue'].includes(st.status) && <span className="flag">{st.status === 'blocked' ? '⚠' : '❗'}</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {hover && (
            <div className="tooltip" style={{ left: Math.min(hover.left + 250, window.innerWidth - 320), top: 150 }}>
              <b>{hover.meta.name}</b>
              <div>{fmt(d(hover.st.start))} — {fmt(d(hover.st.end))} · выполнение {hover.st.progress}%</div>
              <div className="muted">{hover.o.serial} · {hover.o.customer}</div>
              {hover.st.note && <div className="note">{hover.st.note}</div>}
            </div>
          )}
        </div>
      </div>
      <div className="hint">Shift+колесо — сдвиг по времени · клик по строке — панель системы</div>
    </div>
  )
}
