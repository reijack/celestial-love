import { useState, useEffect } from 'react'
import { spawnHearts } from '../hooks'
import { playHeartPop, playStarChime } from '../sound'

const LOVE_QUOTES = [
  '"In all the world, there is no heart for me like yours." ✦',
  '"I have found the one whom my soul loves." 🌙',
  '"Everywhere I look, I am reminded of your love." 💫',
  '"You are my today and all of my tomorrows." ✦',
  '"Two souls but a single thought, two hearts that beat as one." 🌟',
  '"Bersama kamu, setiap hari terasa seperti petualangan magis." ✦',
  '"Di antara bintang-bintang, cinta kita bersinar paling terang." 💫',
]

export default function Footer({ swUnlocked, onNavigate, onLockedClick }) {
  const [quoteIdx, setQuoteIdx] = useState(0)
  const [fadeIn, setFadeIn] = useState(true)

  useEffect(() => {
    const iv = setInterval(() => {
      setFadeIn(false)
      setTimeout(() => {
        setQuoteIdx((prev) => (prev + 1) % LOVE_QUOTES.length)
        setFadeIn(true)
      }, 500)
    }, 6000)
    return () => clearInterval(iv)
  }, [])

  const links = [
    { id: '#hero', label: 'Home' },
    { id: '#timeline', label: 'Timeline' },
    { id: '#letter', label: 'Letters' },
    { id: '#reasons', label: 'Reasons' },
    { id: '#starwishes', label: 'Star Wishes' },
  ]

  function handleSendLove(e) {
    playHeartPop()
    playStarChime()
    spawnHearts(e.clientX, e.clientY)
  }

  return (
    <footer>
      <div className="footer-inner">
        <div
          className="footer-brand"
          onClick={handleSendLove}
          style={{ cursor: 'pointer' }}
          title="Klik untuk mengirim cinta ✦"
        >
          <span className="material-symbols-outlined filled breathing-glow" style={{ fontSize: '1.2rem', color: 'var(--secondary)' }}>
            auto_awesome
          </span>
          <span>Celestial Love ✦</span>
        </div>

        <p
          className="footer-love-quote"
          style={{
            opacity: fadeIn ? 0.75 : 0,
            transform: fadeIn ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          {LOVE_QUOTES[quoteIdx]}
        </p>

        <div className="footer-links">
          {links.map((l) => (
            <a
              key={l.id}
              className={l.id === '#starwishes' && !swUnlocked ? 'sw-locked-link' : ''}
              onClick={() => (l.id === '#starwishes' && !swUnlocked ? onLockedClick() : onNavigate(l.id))}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <button
            onClick={handleSendLove}
            style={{
              background: 'rgba(227, 184, 234, 0.1)',
              border: '1px solid rgba(227, 184, 234, 0.25)',
              color: 'var(--secondary)',
              padding: '0.5rem 1.25rem',
              borderRadius: '999px',
              fontFamily: 'inherit',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="footer-love-btn"
          >
            <span className="material-symbols-outlined filled heartbeat" style={{ fontSize: '0.95rem', color: 'var(--error)' }}>
              favorite
            </span>
            <span>Kirim Bintang Cinta ke Seluruh Semesta</span>
          </button>
        </div>

        <p className="footer-copy" style={{ marginTop: '1.5rem', opacity: 0.55 }}>
          Dibuat dengan cinta tak terhingga di bawah naungan rasi bintang kita ✦
        </p>
      </div>
    </footer>
  )
}
