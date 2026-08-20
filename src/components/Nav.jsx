import { useState } from 'react'
import { spawnHearts } from '../hooks'
import { toggleMute, getMuteState, playHeartPop, playStarChime, playShootingStarSound } from '../sound'

const LINKS = [
  { id: '#hero', label: 'Home', icon: 'home' },
  { id: '#timeline', label: 'Timeline', icon: 'auto_stories' },
  { id: '#coupons', label: 'Coupons', icon: 'confirmation_number' },
  { id: '#letter', label: 'Letters', icon: 'mail' },
  { id: '#reasons', label: 'Reasons', icon: 'favorite' },
  { id: '#oracle', label: 'Oracle', icon: 'auto_awesome' },
  { id: '#bucketlist', label: 'Bucket List', icon: 'checklist' },
  { id: '#starwishes', label: 'Star Wishes', icon: 'star' },
]

export default function Nav({ active, swUnlocked, onNavigate, onUnlockStarWishes }) {
  const [muted, setMuted] = useState(getMuteState)
  const [meteorActive, setMeteorActive] = useState(false)

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

  function handleTriggerMeteorShower(e) {
    playShootingStarSound()
    playStarChime()
    spawnHearts(e.clientX, e.clientY)
    window.dispatchEvent(new CustomEvent('celestial:meteor_shower'))
    setMeteorActive(true)
    setTimeout(() => setMeteorActive(false), 3000)
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
            {/* Meteor Shower Easter Egg Trigger */}
            <button
              title="Hujan Meteor Harapan 🌠"
              style={{
                background: meteorActive ? 'rgba(227, 184, 234, 0.25)' : 'rgba(255,255,255,0.06)',
                border: '1px solid var(--outline)',
                borderRadius: '50%',
                color: 'var(--secondary)',
                cursor: 'pointer',
                width: '2.4rem',
                height: '2.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: meteorActive ? '0 0 16px rgba(227, 184, 234, 0.6)' : 'none',
              }}
              onClick={handleTriggerMeteorShower}
            >
              <span className="material-symbols-outlined filled" style={{ fontSize: '1.15rem' }}>
                flare
              </span>
            </button>

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
