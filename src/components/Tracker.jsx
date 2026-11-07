import EmptyState from './EmptyState'
import { STATUSES } from '../data/scholarships'
import { formatMoney, readiness } from '../utils/helpers'

export default function Tracker({ items, tracked, docs, onStatus, onRemove, onOpen, onGo }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon="📌"
        title="Your tracker is empty"
        text="Save a scholarship from Discover and it will show up here, ready to move from idea to submitted."
        actionLabel="Browse scholarships"
        onAction={onGo}
      />
    )
  }

  const submitted = items.filter((i) => ['Submitted', 'Awarded'].includes(tracked[i.id])).length
  const pct = Math.round((submitted / items.length) * 100)

  return (
    <section aria-labelledby="tracker-title">
      <div className="page-head">
        <h1 id="tracker-title">Application tracker</h1>
        <p className="muted">Move each scholarship through its stages. Your progress is saved automatically.</p>
      </div>

      <div
        className="progress"
        role="progressbar"
        aria-label="Applications submitted"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <span style={{ width: `${pct}%` }} />
      </div>
      <p className="small muted" style={{ marginTop: '0.4rem' }}>
        {submitted} of {items.length} applications submitted
      </p>

      <div className="board">
        {STATUSES.map((status) => {
          const column = items.filter((i) => tracked[i.id] === status)
          return (
            <section key={status} className="column" aria-labelledby={`col-${status}`}>
              <h2 id={`col-${status}`}>
                {status} <span className="count">{column.length}</span>
              </h2>
              {column.length === 0 && <p className="muted small empty-col">Nothing here yet.</p>}
              <ul className="col-list">
                {column.map((item) => {
                  const r = readiness(item, docs)
                  return (
                    <li key={item.id} className="track-card">
                      <button type="button" className="link-btn" onClick={() => onOpen(item.id)}>
                        {item.title}
                      </button>
                      <p className="small muted">
                        {formatMoney(item.amount)} · {item.days <= 0 ? 'Closed' : `${item.days} days left`}
                      </p>
                      <div
                        className="progress sm"
                        role="progressbar"
                        aria-label={`Documents ready for ${item.title}`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={r.pct}
                      >
                        <span style={{ width: `${r.pct}%` }} />
                      </div>
                      <p className="small muted">
                        {r.ready}/{r.total} documents ready
                      </p>
                      <div className="track-actions">
                        <label className="sr-only" htmlFor={`stage-${item.id}`}>
                          Move {item.title} to another stage
                        </label>
                        <select
                          id={`stage-${item.id}`}
                          value={status}
                          onChange={(e) => onStatus(item.id, e.target.value)}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => onRemove(item.id)}
                          aria-label={`Remove ${item.title} from tracker`}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    </section>
  )
}