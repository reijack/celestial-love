import { useState } from 'react'
import { spawnHearts } from '../hooks'
import { toggleMute, getMuteState, playHeartPop, playStarChime } from '../sound'

const LINKS = [
  { id: '#hero', label: 'Home', icon: 'home' },
  { id: '#timeline', label: 'Timeline', icon: 'auto_stories' },
  { id: '#letter', label: 'Letter', icon: 'favorite' },
  { id: '#reasons', label: 'Reasons', icon: 'format_list_bulleted' },
  { id: '#starwishes', label: 'Star Wishes', icon: 'star' },
]

export default function Nav({ active, swUnlocked, onNavigate, onUnlockStarWishes }) {
  const [muted, setMuted] = useState(getMuteState)

  function handleClick(id) {
    if (id === '#starwishes' && !swUnlocked) {
      onUnlockStarWishes()
      playStarChime()
      return
    }
    playHeartPop()
    onNavigate(id)
  }

  function handleMuteToggle() {
    const nextMuted = toggleMute()
    setMuted(nextMuted)
    if (!nextMuted) {
      playStarChime()
    }
  }

  return (
    <>
      <nav>
        <div className="nav-inner">
          <div
            className="nav-brand"
            onClick={() => {
              playStarChime()
              onNavigate('#hero')
            }}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <span className="material-symbols-outlined filled twinkle" style={{ fontSize: '1.25rem', color: 'var(--secondary)' }}>
              auto_awesome
            </span>
            <span>Celestial Love</span>
          </div>

          <div className="nav-links">
            {LINKS.map((l) => (
              <button
                key={l.id}
                className={`nav-link ${active === l.id ? 'active' : ''} ${
                  l.id === '#starwishes' && !swUnlocked ? 'sw-locked-link' : ''
                }`}
                onClick={() => handleClick(l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="nav-actions">
            {/* Audio Synth Mute / Unmute Button */}
            <button
              title={muted ? 'Aktifkan Suara Efek ✦' : 'Bisukan Suara Efek'}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--outline)',
                borderRadius: '50%',
                color: muted ? 'var(--on-surface-variant)' : 'var(--secondary)',
                cursor: 'pointer',
                width: '2.4rem',
                height: '2.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onClick={handleMuteToggle}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.15rem' }}>
                {muted ? 'volume_off' : 'volume_up'}
              </span>
            </button>

            {/* Send Love Heart Burst Button */}
            <button
              title="Kirim Cinta ✦"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--outline)',
                borderRadius: '50%',
                color: 'var(--error)',
                cursor: 'pointer',
                width: '2.4rem',
                height: '2.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s ease, background 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              onClick={(e) => {
                playHeartPop()
                spawnHearts(e.clientX, e.clientY)
              }}
            >
              <span className="material-symbols-outlined filled heartbeat" style={{ fontSize: '1.25rem' }}>
                favorite
              </span>
            </button>

            <button
              className="btn-celestial"
              onClick={() => {
                playStarChime()
                onUnlockStarWishes()
              }}
            >
              <span className="material-symbols-outlined filled" style={{ fontSize: '0.95rem' }}>star</span>
              <span>Star Wishes</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="mobile-nav">
        {LINKS.map((l) => (
          <button
            key={l.id}
            className={`mobile-nav-btn ${active === l.id ? 'active' : ''} ${
              l.id === '#starwishes' && !swUnlocked ? 'sw-locked-link' : ''
            }`}
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
