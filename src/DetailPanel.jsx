import { STAGES } from './data/stages.js'
import { SITES } from './data/orders.js'

const STATUS_LABEL = { done: 'Готово', active: 'В работе', pending: 'Ожидает', blocked: '⚠ Блок', overdue: '❗ Просрочка' }

export default function DetailPanel({ order, onClose, stageFocus, setStageFocus }) {
  const site = SITES[order.site]
  return (
    <aside className="panel">
      <header>
        <div><b>{order.serial}</b><small>{order.model} · {order.customer}</small></div>
        <button onClick={onClose}>✕</button>
      </header>
      <div className="panelmeta">
        <span className="site" style={{ background: site.color }}>{site.name}</span>
        <span>План отгрузки: <b>{new Date(order.planShip).toLocaleDateString('ru-RU')}</b></span>
      </div>
      <ul className="stagelist">
        {order.stages.map((s, i) => {
          const meta = STAGES.find((x) => x.id === s.stageId)
          const dur = Math.round((new Date(s.end) - new Date(s.start)) / 86400000) + 1
          return (
            <li key={s.stageId}
              className={s.status + (stageFocus === s.stageId ? ' focus' : '')}
              onClick={() => setStageFocus(stageFocus === s.stageId ? null : s.stageId)}>
              <small>{i + 1}</small>
              <div className="sname">{meta.name}{s.note && <p>{s.note}</p>}</div>
              <div className="sdates">{new Date(s.start).toLocaleDateString('ru-RU')} → {new Date(s.end).toLocaleDateString('ru-RU')} · {dur}д</div>
              <span className={'st ' + s.status}>{STATUS_LABEL[s.status]}</span>
              <span className="spct">{s.progress}%</span>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
