import { formatMoneyShort } from '../utils/helpers'

export default function StatsBar({ stats }) {
  return (
    <section aria-label="Your scholarship dashboard">
      <dl className="stats">
        <div className="stat">
          <dt>Full matches</dt>
          <dd>{stats.eligible}</dd>
        </div>
        <div className="stat">
          <dt>Being tracked</dt>
          <dd>{stats.tracked}</dd>
        </div>
        <div className="stat">
          <dt>Funding in play</dt>
          <dd>
            {formatMoneyShort(stats.funding)}
            {stats.awarded > 0 && <small>{formatMoneyShort(stats.awarded)} already won 🎉</small>}
          </dd>
        </div>
        <div className="stat">
          <dt>Next deadline</dt>
          <dd>
            {stats.next ? `${stats.next.days} days` : '—'}
            {stats.next && <small>{stats.next.title}</small>}
          </dd>
        </div>
      </dl>
    </section>
  )
}