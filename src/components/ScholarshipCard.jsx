import MatchRing from './MatchRing'
import { formatMoney, formatDate, urgencyOf } from '../utils/helpers'

export default function ScholarshipCard({ item, saved, index, onSave, onOpen }) {
  const urgency = urgencyOf(item.days)

  return (
    <article className="card" style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}>
      <div className="card-top">
        <span className="badge">{item.category}</span>
        <span className={`deadline u-${urgency}`}>
          {item.days <= 0 ? 'Closed' : `${item.days} days left`}
        </span>
      </div>

      <div className="card-main">
        <div>
          <h3 className="card-title">{item.title}</h3>
          <p className="muted small">{item.provider}</p>
        </div>
        <MatchRing score={item.match.score} />
      </div>

      <p className="amount">
        {formatMoney(item.amount)}
        <span> {item.renewable ? '/ year, renewable' : 'one-time'}</span>
      </p>

      <ul className="tags" aria-label="Who can apply">
        {item.levels.map((l) => (
          <li className="tag" key={l}>
            {l}
          </li>
        ))}
        {item.fields.map((f) => (
          <li className="tag" key={f}>
            {f === 'Any' ? 'Any field' : f}
          </li>
        ))}
      </ul>

      <p className="muted small">Apply by {formatDate(item.deadline)}</p>

      <div className="card-actions">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => onOpen(item.id)}
          aria-label={`View details for ${item.title}`}
        >
          View details
        </button>
        <button
          type="button"
          className={`btn btn-sm ${saved ? 'btn-saved' : 'btn-ghost'}`}
          aria-pressed={saved}
          aria-label={`Save ${item.title}`}
          onClick={() => onSave(item.id)}
        >
          {saved ? '★ Saved' : '☆ Save'}
        </button>
      </div>
    </article>
  )
}