import { spawnHearts } from '../hooks'

const LINKS = [
  { id: '#hero', label: 'Home', icon: 'home' },
  { id: '#timeline', label: 'Timeline', icon: 'auto_stories' },
  { id: '#letter', label: 'Letter', icon: 'favorite' },
  { id: '#reasons', label: 'Reasons', icon: 'format_list_bulleted' },
  { id: '#starwishes', label: 'Star Wishes', icon: 'star' },
]

export default function Nav({ active, swUnlocked, onNavigate, onUnlockStarWishes }) {
  function handleClick(id) {
    if (id === '#starwishes' && !swUnlocked) { onUnlockStarWishes(); return }
    onNavigate(id)
  }

  return (
    <>
      <nav>
        <div className="nav-inner">
          <div className="nav-brand">Celestial Love ✦</div>
          <div className="nav-links">
            {LINKS.map((l) => (
              <button
                key={l.id}
                className={`nav-link ${active === l.id ? 'active' : ''} ${l.id === '#starwishes' && !swUnlocked ? 'sw-locked-link' : ''}`}
                onClick={() => handleClick(l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className="nav-actions">
            <button
              title="Send Love"
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '1.25rem', padding: '0.25rem' }}
              onClick={(e) => spawnHearts(e.clientX, e.clientY)}
            >
              <span className="material-symbols-outlined filled" style={{ fontSize: '1.375rem' }}>favorite</span>
            </button>
            <button className="btn-celestial" onClick={onUnlockStarWishes}>Star Wishes</button>
          </div>
        </div>
      </nav>
      <div className="mobile-nav">
        {LINKS.map((l) => (
          <button
            key={l.id}
            className={`mobile-nav-btn ${active === l.id ? 'active' : ''} ${l.id === '#starwishes' && !swUnlocked ? 'sw-locked-link' : ''}`}
            onClick={() => handleClick(l.id)}
          >
            <span className="material-symbols-outlined">{l.icon}</span>
            {l.label === 'Star Wishes' ? 'Wishes' : l.label}
          </button>
        ))}
      </div>
    </>
  )
}
