import { STAGES } from './data/stages.js'
import { SITES, ORDERS } from './data/orders.js'

// Лента этапов: на каком этапе сейчас стоит каждая система
export default function StageBoard({ orders, onFocus, focused }) {
  return (
    <div className="board">
      {STAGES.map((st, i) => {
        const here = orders.filter((o) => {
          const idx = o.stages.findIndex((s) => !['done'].includes(s.status))
          return idx === i && (focused ? st.id === focused : true)
        })
        const allHere = ORDERS.filter((o) => o.stages.findIndex((s) => !['done'].includes(s.status)) === i).length
        return (
          <button key={st.id}
            className={'col' + (focused === st.id ? ' on' : '')}
            onClick={() => onFocus(focused === st.id ? null : st.id)}>
            <header><small>{i + 1}</small><b>{st.short}</b><span className="cnt">{allHere}</span></header>
            {here.map((o) => {
              const cur = o.stages[i]
              return (
                <div key={o.id} className={'mini ' + cur.status}>
                  <i style={{ background: SITES[o.site].color }} />
                  <b>{o.serial}</b>
                  <small>{cur.progress}%{cur.note ? ' · ' + cur.note.slice(0, 24) : ''}</small>
                </div>
              )
            })}
          </button>
        )
      })}
    </div>
  )
}
