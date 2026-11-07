import { LEVELS, CATEGORIES } from '../data/scholarships'

export default function Filters({ filters, onChange, onReset }) {
  return (
    <form
      className="filters"
      role="search"
      aria-label="Filter scholarships"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="field grow">
        <label htmlFor="f-query">Search</label>
        <input
          id="f-query"
          type="search"
          placeholder="Try “STEM”, “women”, “merit”…"
          value={filters.query}
          onChange={(e) => onChange('query', e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="f-level">Study level</label>
        <select id="f-level" value={filters.level} onChange={(e) => onChange('level', e.target.value)}>
          <option value="All">All levels</option>
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="f-category">Category</label>
        <select id="f-category" value={filters.category} onChange={(e) => onChange('category', e.target.value)}>
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="f-sort">Sort by</label>
        <select id="f-sort" value={filters.sort} onChange={(e) => onChange('sort', e.target.value)}>
          <option value="match">Best match</option>
          <option value="amount">Highest amount</option>
          <option value="deadline">Closing soonest</option>
        </select>
      </div>

      <label className="check" htmlFor="f-eligible">
        <input
          id="f-eligible"
          type="checkbox"
          checked={filters.eligibleOnly}
          onChange={(e) => onChange('eligibleOnly', e.target.checked)}
        />
        Only what I fully qualify for
      </label>

      <button type="button" className="btn btn-ghost btn-sm" onClick={onReset}>
        Reset filters
      </button>
    </form>
  )
}