import { urgencyOf } from '../utils/helpers'

export default function Radar({ items, hasTracked, onOpen }) {
  const upcoming = items
    .filter((i) => i.days > 0)
    .sort((a, b) => a.days - b.days)
    .slice(0, 5)

  return (
    <section className="panel" aria-labelledby="radar-title">
      <div className="radar-head">
        <span className="radar-sweep" aria-hidden="true" />
        <div>
          <h2 id="radar-title" style={{ fontSize: '1.2rem' }}>
            Deadline radar
          </h2>
          <p className="small muted">
            {hasTracked ? 'Closing soonest on your list' : 'Closing soonest overall. Save a few to personalise this.'}
          </p>
        </div>
      </div>

      {upcoming.length === 0 ? (
        <p className="muted small">No upcoming deadlines. You are all caught up.</p>
      ) : (
        <ol className="radar-list">
          {upcoming.map((i) => {
            const urgency = urgencyOf(i.days)
            const fill = Math.max(6, Math.round(100 - (Math.min(i.days, 60) / 60) * 100))
            return (
              <li key={i.id}>
                <button
                  type="button"
                  className="radar-row"
                  onClick={() => onOpen(i.id)}
                  aria-label={`${i.title}, ${i.days} days left. Open details`}
                >
                  <span className="radar-title">{i.title}</span>
                  <span className={`deadline u-${urgency}`}>{i.days}d</span>
                  <span className="radar-bar" aria-hidden="true">
                    <span className={`fill u-${urgency}-bg`} style={{ width: `${fill}%` }} />
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}