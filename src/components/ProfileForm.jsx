import { LEVELS, FIELDS } from '../data/scholarships'

export default function ProfileForm({ profile, eligibleCount, onChange, onReset, onDone }) {
  const gpa = Number(profile.gpa)
  const income = Number(profile.income)
  const gpaError = profile.gpa === '' || gpa < 0 || gpa > 10 ? 'Enter a GPA between 0 and 10.' : ''
  const incomeError = profile.income === '' || income < 0 ? 'Enter your family income (0 or more).' : ''

  const update = (key) => (e) => onChange({ ...profile, [key]: e.target.value })

  function handleSubmit(e) {
    e.preventDefault()
    if (gpaError || incomeError) return
    onDone()
  }

  return (
    <section aria-labelledby="profile-title">
      <div className="page-head">
        <h1 id="profile-title">Your profile</h1>
        <p className="muted">
          Grantly uses these four details to score every scholarship. Nothing leaves your browser.
        </p>
      </div>

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="field full">
            <label htmlFor="p-name">Your first name</label>
            <input id="p-name" type="text" autoComplete="given-name" value={profile.name} onChange={update('name')} />
          </div>

          <div className="field">
            <label htmlFor="p-level">Study level</label>
            <select id="p-level" value={profile.level} onChange={update('level')}>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="p-field">Field of study</label>
            <select id="p-field" value={profile.field} onChange={update('field')}>
              {FIELDS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="p-gpa">GPA (out of 10)</label>
            <input
              id="p-gpa"
              type="number"
              min="0"
              max="10"
              step="0.1"
              inputMode="decimal"
              value={profile.gpa}
              onChange={update('gpa')}
              aria-invalid={Boolean(gpaError)}
              aria-describedby={gpaError ? 'gpa-error' : undefined}
            />
            {gpaError && (
              <span id="gpa-error" className="error">
                {gpaError}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="p-income">Family income (₹ lakh / year)</label>
            <input
              id="p-income"
              type="number"
              min="0"
              step="0.5"
              inputMode="decimal"
              value={profile.income}
              onChange={update('income')}
              aria-invalid={Boolean(incomeError)}
              aria-describedby={incomeError ? 'income-error' : undefined}
            />
            {incomeError && (
              <span id="income-error" className="error">
                {incomeError}
              </span>
            )}
          </div>
        </div>

        <p role="status" className="hint" style={{ marginBottom: '1rem' }}>
          Right now you fully qualify for <strong>{eligibleCount}</strong> scholarship{eligibleCount === 1 ? '' : 's'}.
        </p>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save &amp; see my matches
          </button>
          <button type="button" className="btn btn-ghost" onClick={onReset}>
            Reset profile
          </button>
        </div>
      </form>
    </section>
  )
}