import { useEffect, useRef } from 'react'
import MatchRing from './MatchRing'
import { formatMoney, formatDate, urgencyOf, readiness } from '../utils/helpers'

// What the main action button does for each stage of an application
const NEXT_STEP = {
  Saved: { status: 'Preparing', label: 'Start preparing' },
  Preparing: { status: 'Submitted', label: 'Mark as submitted' },
  Submitted: { status: 'Awarded', label: 'I won it! 🎉' },
}

export default function ScholarshipModal({ item, status, docs, onClose, onSave, onStatus, onNotify }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)

  // Focus handling: focus the dialog, trap Tab, close on Escape, restore focus after
  useEffect(() => {
    const previous = document.activeElement
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const focusable = dialogRef.current.querySelectorAll('button, select, input, [href]')
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      previous?.focus?.()
    }
  }, [onClose])

  const docState = readiness(item, docs)
  const urgency = urgencyOf(item.days)
  const next = NEXT_STEP[status]

  async function copySummary() {
    const text = `${item.title} by ${item.provider}: ${formatMoney(item.amount)}, apply by ${formatDate(item.deadline)}`
    try {
      await navigator.clipboard.writeText(text)
      onNotify('Summary copied to clipboard')
    } catch {
      onNotify('Could not copy. Your browser blocked it.')
    }
  }

  return (
    <div className="backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <p className="muted small">{item.provider}</p>
            <h2 id="modal-title">{item.title}</h2>
          </div>
          <button type="button" className="close-btn" ref={closeRef} onClick={onClose} aria-label="Close dialog">
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div className="modal-meta">
          <span className="badge">{item.category}</span>
          <span className={`deadline u-${urgency}`}>
            {item.days <= 0 ? 'Closed' : `${item.days} days left`} · {formatDate(item.deadline)}
          </span>
          <strong>{formatMoney(item.amount)}</strong>
          <span className="muted small">{item.renewable ? 'renewable every year' : 'one-time award'}</span>
        </div>

        <p>{item.summary}</p>

        <div className="modal-grid">
          <section aria-labelledby="match-title">
            <h3 className="section-title" id="match-title">
              Your eligibility
            </h3>
            <div className="modal-meta" style={{ margin: '0 0 0.6rem' }}>
              <MatchRing score={item.match.score} />
              <span className="small muted">
                {item.match.score === 100 ? 'You meet every rule' : 'Some rules are not met yet'}
              </span>
            </div>
            <ul className="check-list">
              {item.match.reasons.map((r) => (
                <li key={r}>
                  <span className="ok" aria-hidden="true">✓</span>
                  <span className="sr-only">Met: </span>
                  {r}
                </li>
              ))}
              {item.match.gaps.map((g) => (
                <li key={g}>
                  <span className="bad" aria-hidden="true">✗</span>
                  <span className="sr-only">Not met: </span>
                  {g}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="docs-title">
            <h3 className="section-title" id="docs-title">
              Documents needed ({docState.ready}/{docState.total} ready)
            </h3>
            <div
              className="progress sm"
              role="progressbar"
              aria-label="Document readiness"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={docState.pct}
              style={{ marginBottom: '0.7rem' }}
            >
              <span style={{ width: `${docState.pct}%` }} />
            </div>
            <ul className="check-list">
              {docState.items.map((d) => (
                <li key={d.id}>
                  <span className={d.ok ? 'ok' : 'bad'} aria-hidden="true">
                    {d.ok ? '✓' : '✗'}
                  </span>
                  {d.label}
                  <span className="sr-only">{d.ok ? ' (ready)' : ' (missing)'}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {status && (
          <p className="status-line">
            Current stage: <span className="badge">{status}</span>
          </p>
        )}

        <div className="modal-actions">
          {!status && (
            <>
              <button type="button" className="btn btn-primary" onClick={() => onStatus(item.id, 'Preparing')}>
                Start my application
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => onSave(item.id)}>
                ☆ Save for later
              </button>
            </>
          )}
          {status && next && (
            <button type="button" className="btn btn-primary" onClick={() => onStatus(item.id, next.status)}>
              {next.label}
            </button>
          )}
          {status && (
            <button type="button" className="btn btn-ghost" onClick={() => onSave(item.id)}>
              Remove from tracker
            </button>
          )}
          <button type="button" className="btn btn-ghost" onClick={copySummary}>
            Copy summary
          </button>
        </div>
      </div>
    </div>
  )
}