import { DOC_LIST } from '../data/scholarships'

export default function DocumentVault({ docs, trackedItems, onToggle, onSetAll }) {
  const readyCount = DOC_LIST.filter((d) => docs[d.id]).length
  const pct = Math.round((readyCount / DOC_LIST.length) * 100)

  return (
    <section aria-labelledby="vault-title">
      <div className="page-head">
        <h1 id="vault-title">Document vault</h1>
        <p className="muted">
          Tick off the documents you already have. Every scholarship shows how ready you are for it.
        </p>
      </div>

      <div
        className="progress"
        role="progressbar"
        aria-label="Documents ready"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <span style={{ width: `${pct}%` }} />
      </div>
      <p className="small muted" style={{ marginTop: '0.4rem' }}>
        {readyCount} of {DOC_LIST.length} documents ready
      </p>

      <div className="vault-actions">
        <button type="button" className="btn btn-primary btn-sm" onClick={() => onSetAll(true)}>
          Mark all ready
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => onSetAll(false)}>
          Clear all
        </button>
      </div>

      <ul className="vault-list">
        {DOC_LIST.map((doc) => {
          const needed = trackedItems.filter((i) => i.documents.includes(doc.id)).length
          return (
            <li key={doc.id} className={`vault-item ${docs[doc.id] ? 'is-ready' : ''}`}>
              <input
                id={`doc-${doc.id}`}
                type="checkbox"
                checked={Boolean(docs[doc.id])}
                onChange={() => onToggle(doc.id)}
              />
              <label htmlFor={`doc-${doc.id}`}>
                <span className="doc-name">{doc.label}</span>
                <span className="muted small">{doc.hint}</span>
              </label>
              <span className="badge">{needed > 0 ? `Needed by ${needed} saved` : 'Not needed yet'}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}