import { useMemo, useState } from 'react'
import { ORDERS, SITES } from './data/orders.js'
import { STAGES } from './data/stages.js'
import Gantt from './Gantt.jsx'
import Systems from './Systems.jsx'
import StageBoard from './StageBoard.jsx'
import DetailPanel from './DetailPanel.jsx'

export default function App() {
  const [view, setView] = useState('gantt')          // gantt | systems | stages
  const [siteFilter, setSiteFilter] = useState('all') // all | msk | tvr
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)     // order id
  const [stageFocus, setStageFocus] = useState(null) // stage id

  const orders = useMemo(() => ORDERS.filter((o) => {
    if (siteFilter !== 'all' && o.site !== siteFilter) return false
    if (query) {
      const q = query.toLowerCase()
      if (![o.serial, o.model, o.customer].some((s) => s.toLowerCase().includes(q))) return false
    }
    return true
  }), [siteFilter, query])

  const stats = useMemo(() => {
    const inWork = ORDERS.filter((o) => o.stages.at(-1).status !== 'done').length
    const problems = ORDERS.reduce((n, o) => n + o.stages.filter((s) => ['blocked', 'overdue'].includes(s.status)).length, 0)
    const soon = ORDERS.filter((o) => {
      const d = (new Date(o.planShip) - Date.now()) / 86400000
      return d >= 0 && d <= 30 && o.stages.at(-1).status !== 'done'
    }).length
    return { inWork, problems, soon }
  }, [])

  const selOrder = ORDERS.find((o) => o.id === selected)

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="logo">▦</span>
          <div><b>Производство СХД</b><small>Планирование · Москва + Тверь</small></div>
        </div>
        <nav className="tabs">
          {[['gantt', 'Гант'], ['systems', 'Системы'], ['stages', 'Маршрут производства']].map(([id, label]) => (
            <button key={id} className={view === id ? 'tab active' : 'tab'} onClick={() => setView(id)}>{label}</button>
          ))}
        </nav>
        <div className="kpis">
          <span className="kpi">В работе <b>{stats.inWork}</b></span>
          <span className="kpi warn">Проблемных этапов <b>{stats.problems}</b></span>
          <span className="kpi">Отгрузка ≤30д <b>{stats.soon}</b></span>
        </div>
      </header>

      <div className="filters">
        <div className="seg">
          {[['all', 'Все площадки'], ['msk', 'Москва'], ['tvr', 'Тверь']].map(([id, label]) => (
            <button key={id} className={siteFilter === id ? 'on' : ''} onClick={() => setSiteFilter(id)}>
              {id !== 'all' && <i style={{ background: SITES[id].color }} />}{label}
            </button>
          ))}
        </div>
        <input placeholder="Поиск: серийник / модель / заказчик" value={query} onChange={(e) => setQuery(e.target.value)} />
        {stageFocus && (
          <button className="chip" onClick={() => setStageFocus(null)}>Этап: {STAGES.find((s) => s.id === stageFocus)?.short} ✕</button>
        )}
      </div>

      <main className="main">
        {view === 'gantt' && <Gantt orders={orders} selected={selected} onSelect={setSelected} stageFocus={stageFocus} />}
        {view === 'systems' && <Systems orders={orders} onSelect={(id) => { setSelected(id); setView('gantt') }} />}
        {view === 'stages' && <StageBoard orders={orders} onFocus={setStageFocus} focused={stageFocus} />}
      </main>

      {selOrder && <DetailPanel order={selOrder} onClose={() => setSelected(null)} stageFocus={stageFocus} setStageFocus={setStageFocus} />}
    </div>
  )
}
