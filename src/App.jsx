import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react'
import './App.css'
import useLocalStorage from './hooks/useLocalStorage'
import { scholarships } from './data/scholarships'
import { computeMatch, daysLeft } from './utils/helpers'
import Header from './components/Header'
import StatsBar from './components/StatsBar'
import Radar from './components/Radar'
import Filters from './components/Filters'
import ScholarshipCard from './components/ScholarshipCard'
import ScholarshipModal from './components/ScholarshipModal'
import EmptyState from './components/EmptyState'
import Toast from './components/Toast'

// These views are only downloaded when the user opens them (faster first load)
const Tracker = lazy(() => import('./components/Tracker'))
const DocumentVault = lazy(() => import('./components/DocumentVault'))
const ProfileForm = lazy(() => import('./components/ProfileForm'))

const DEFAULT_PROFILE = { name: '', level: 'Undergraduate', field: 'Engineering', gpa: '8', income: '5' }
const DEFAULT_FILTERS = { query: '', level: 'All', category: 'All', sort: 'match', eligibleOnly: false }
const PAGE_TITLES = { discover: 'Discover', tracker: 'Tracker', vault: 'Document vault', profile: 'Profile' }

export default function App() {
  const [view, setView] = useState('discover')
  const [theme, setTheme] = useLocalStorage('grantly-theme', 'dark')
  const [profile, setProfile] = useLocalStorage('grantly-profile', DEFAULT_PROFILE)
  const [tracked, setTracked] = useLocalStorage('grantly-tracked', {})
  const [docs, setDocs] = useLocalStorage('grantly-docs', {})
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [openId, setOpenId] = useState(null)
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)

  // Stable callbacks (they are used inside effects of child components)
  const notify = useCallback((message) => setToast(message), [])
  const clearToast = useCallback(() => setToast(''), [])
  const closeModal = useCallback(() => setOpenId(null), [])

  // Fake a short loading time so the skeleton cards are visible
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    document.title = `${PAGE_TITLES[view]} | Grantly`
    window.scrollTo(0, 0)
  }, [view])

  // Every scholarship with its match score and days left
  const items = useMemo(
    () =>
      scholarships.map((s) => ({
        ...s,
        match: computeMatch(s, profile),
        days: daysLeft(s.deadline),
      })),
    [profile],
  )

  const visible = useMemo(() => {
    const query = filters.query.trim().toLowerCase()
    const list = items.filter((s) => {
      const text = `${s.title} ${s.provider} ${s.summary} ${s.category}`.toLowerCase()
      if (query && !text.includes(query)) return false
      if (filters.level !== 'All' && !s.levels.includes(filters.level)) return false
      if (filters.category !== 'All' && s.category !== filters.category) return false
      if (filters.eligibleOnly && s.match.score < 100) return false
      return true
    })
    const sorters = {
      match: (a, b) => b.match.score - a.match.score || a.days - b.days,
      amount: (a, b) => b.amount - a.amount,
      deadline: (a, b) => a.days - b.days,
    }
    return [...list].sort(sorters[filters.sort])
  }, [items, filters])

  const trackedItems = useMemo(() => items.filter((s) => tracked[s.id]), [items, tracked])

  const stats = useMemo(() => {
    const open = trackedItems.filter((s) => s.days > 0 && tracked[s.id] !== 'Awarded')
    const nearest = [...(open.length ? open : items.filter((s) => s.days > 0))].sort((a, b) => a.days - b.days)[0]
    return {
      eligible: items.filter((s) => s.match.score === 100).length,
      tracked: trackedItems.length,
      funding: trackedItems.reduce((sum, s) => sum + s.amount, 0),
      awarded: trackedItems.filter((s) => tracked[s.id] === 'Awarded').reduce((sum, s) => sum + s.amount, 0),
      next: nearest ? { title: nearest.title, days: nearest.days } : null,
    }
  }, [items, trackedItems, tracked])

  const openItem = items.find((s) => s.id === openId)

  // ----- actions -----
  function updateFilter(key, value) {
    setFilters({ ...filters, [key]: value })
  }

  function toggleSave(id) {
    const title = items.find((s) => s.id === id).title
    if (tracked[id]) {
      const next = { ...tracked }
      delete next[id]
      setTracked(next)
      notify(`Removed “${title}” from your tracker`)
    } else {
      setTracked({ ...tracked, [id]: 'Saved' })
      notify(`Saved “${title}” to your tracker`)
    }
  }

  function changeStatus(id, status) {
    const title = items.find((s) => s.id === id).title
    setTracked({ ...tracked, [id]: status })
    notify(`${title} moved to ${status}`)
  }

  function removeTracked(id) {
    toggleSave(id)
  }

  function toggleDoc(id) {
    setDocs({ ...docs, [id]: !docs[id] })
  }

  function setAllDocs(ready) {
    const next = {}
    scholarships.forEach((s) => s.documents.forEach((d) => (next[d] = ready)))
    setDocs(next)
    notify(ready ? 'All documents marked ready' : 'Document checklist cleared')
  }

  function showEligibleOnly() {
    setFilters({ ...DEFAULT_FILTERS, eligibleOnly: true })
    setView('discover')
  }

  const greeting = profile.name ? `Hey ${profile.name}, welcome back` : 'Scholarships, minus the scavenger hunt'
  const profileIsDefault = !profile.name

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      <Header
        view={view}
        onView={setView}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        trackedCount={trackedItems.length}
      />

      <main id="main" className="container" tabIndex={-1}>
        {view === 'discover' && (
          <>
            <section className="hero" aria-labelledby="hero-title">
              <p className="eyebrow">{greeting}</p>
              <h1 id="hero-title">
                Find the money you already <span className="hl">qualify for.</span>
              </h1>
              <p className="hero-sub">
                Grantly matches scholarships to your profile, keeps every application in one place, and
                reminds you (politely) before a deadline slips away.
              </p>
              <div className="hero-actions">
                <button type="button" className="btn btn-primary" onClick={() => setView('profile')}>
                  {profileIsDefault ? 'Build my profile' : 'Tune my profile'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={showEligibleOnly}>
                  Show only what I qualify for
                </button>
              </div>
            </section>

            <StatsBar stats={stats} />

            {profileIsDefault && (
              <div className="notice" role="note">
                <span>Match scores are using sample details. Add yours for accurate results.</span>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setView('profile')}>
                  Set up profile
                </button>
              </div>
            )}

            <div className="discover-grid">
              <section aria-labelledby="results-title">
                <Filters filters={filters} onChange={updateFilter} onReset={() => setFilters(DEFAULT_FILTERS)} />

                <div className="results-head">
                  <h2 id="results-title">
                    {visible.length} scholarship{visible.length === 1 ? '' : 's'}{' '}
                    {filters.eligibleOnly ? 'you fully qualify for' : 'to explore'}
                  </h2>
                  <p className="muted small">Tap “View details” to see your eligibility breakdown</p>
                </div>

                {loading ? (
                  <div className="grid" role="status" aria-label="Loading scholarships">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div key={n} className="card skeleton" aria-hidden="true" />
                    ))}
                  </div>
                ) : visible.length === 0 ? (
                  <EmptyState
                    icon="🔍"
                    title="No scholarships match these filters"
                    text="Try a different keyword, or relax the filters. Your perfect match might be one click away."
                    actionLabel="Reset filters"
                    onAction={() => setFilters(DEFAULT_FILTERS)}
                  />
                ) : (
                  <div className="grid">
                    {visible.map((item, index) => (
                      <ScholarshipCard
                        key={item.id}
                        item={item}
                        index={index}
                        saved={Boolean(tracked[item.id])}
                        onSave={toggleSave}
                        onOpen={setOpenId}
                      />
                    ))}
                  </div>
                )}
              </section>

              <aside className="side" aria-label="Deadline radar">
                <Radar
                  items={trackedItems.length > 0 ? trackedItems : items}
                  hasTracked={trackedItems.length > 0}
                  onOpen={setOpenId}
                />
              </aside>
            </div>
          </>
        )}

        <Suspense fallback={<p className="loading" role="status">Loading…</p>}>
          {view === 'tracker' && (
            <Tracker
              items={trackedItems}
              tracked={tracked}
              docs={docs}
              onStatus={changeStatus}
              onRemove={removeTracked}
              onOpen={setOpenId}
              onGo={() => setView('discover')}
            />
          )}
          {view === 'vault' && (
            <DocumentVault docs={docs} trackedItems={trackedItems} onToggle={toggleDoc} onSetAll={setAllDocs} />
          )}
          {view === 'profile' && (
            <ProfileForm
              profile={profile}
              eligibleCount={stats.eligible}
              onChange={setProfile}
              onReset={() => {
                setProfile(DEFAULT_PROFILE)
                notify('Profile reset')
              }}
              onDone={() => {
                notify('Profile saved. Your matches are updated.')
                setView('discover')
              }}
            />
          )}
        </Suspense>
      </main>

      <footer className="footer">
        <p>Grantly · Built for THE OUTPOST hackathon · Sample data, saved only in your browser.</p>
      </footer>

      {openItem && (
        <ScholarshipModal
          item={openItem}
          status={tracked[openItem.id]}
          docs={docs}
          onClose={closeModal}
          onSave={toggleSave}
          onStatus={changeStatus}
          onNotify={notify}
        />
      )}

      <Toast message={toast} onDone={clearToast} />
    </div>
  )
}