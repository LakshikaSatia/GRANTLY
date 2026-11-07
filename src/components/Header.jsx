const TABS = [
  { id: 'discover', label: 'Discover', icon: '🧭' },
  { id: 'tracker', label: 'Tracker', icon: '📌' },
  { id: 'vault', label: 'Vault', icon: '🗂️' },
  { id: 'profile', label: 'Profile', icon: '🙋' },
]

export default function Header({ view, onView, theme, onToggleTheme, trackedCount }) {
  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="grantly-logo" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ff7a59" />
                <stop offset="1" stopColor="#ffc857" />
              </linearGradient>
            </defs>
            <rect width="40" height="40" rx="12" fill="url(#grantly-logo)" />
            <path
              d="M8 16 20 10l12 6-12 6-12-6Zm5 4.5v5c0 2 3.2 4 7 4s7-2 7-4v-5l-7 3.5-7-3.5Z"
              fill="#1a0f0a"
            />
          </svg>
          <span>Grantly</span>
        </div>

        <nav className="nav" aria-label="Primary">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className="nav-btn"
              aria-current={view === tab.id ? 'page' : undefined}
              onClick={() => onView(tab.id)}
            >
              <span aria-hidden="true">{tab.icon}</span>
              {tab.label}
              {tab.id === 'tracker' && trackedCount > 0 && (
                <span className="nav-badge" aria-label={`${trackedCount} saved`}>
                  {trackedCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label={`Switch to ${nextTheme} theme`}
        >
          <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
        </button>
      </div>
    </header>
  )
}