import { STAGES } from './data/stages.js'
import { SITES } from './data/orders.js'

const prio = { critical: ['Критичный', '#e5484d'], high: ['Высокий', '#f76b15'], normal: ['Обычный', '#8e8e93'], low: ['Низкий', '#5a5a60'] }

export default function Systems({ orders, onSelect }) {
  return (
    <div className="cards">
      {orders.map((o) => {
        const curIdx = o.stages.findIndex((s) => !['done'].includes(s.status))
        const done = curIdx === -1
        const cur = done ? o.stages.at(-1) : o.stages[curIdx]
        const meta = STAGES.find((s) => s.id === cur.stageId)
        const overall = Math.round(o.stages.reduce((n, s) => n + s.progress, 0) / o.stages.length)
        const [pl, pc] = prio[o.priority]
        return (
          <div key={o.id} className="card" onClick={() => onSelect(o.id)}>
            <div className="cardhead">
              <b>{o.serial}</b>
              <span className="pill" style={{ color: pc, borderColor: pc }}>{pl}</span>
            </div>
            <div className="muted">{o.model} · {o.customer}</div>
            <div className="where">
              <span className="site" style={{ background: SITES[o.site].color }}>{SITES[o.site].name}</span>
              {done
                ? <b className="ok">✅ Отгружена</b>
                : <b>Этап {curIdx + 1}/{STAGES.length} · {meta?.name}</b>}
              {!done && <em>{cur.status === 'blocked' ? '⚠ заблокирована' : cur.status === 'overdue' ? '❗ просрочка' : `${cur.progress}%`}</em>}
            </div>
            <div className="pipeline">
              {o.stages.map((s) => (
                <i key={s.stageId} className={'dot ' + s.status} title={STAGES.find((x) => x.id === s.stageId)?.name} />
              ))}
            </div>
            <div className="prog"><span style={{ width: overall + '%' }} /></div>
            <div className="cardfoot muted">План отгрузки: {new Date(o.planShip).toLocaleDateString('ru-RU')} · готовность {overall}%</div>
          </div>
        )
      })}
    </div>
  )
}
