import { useState, useEffect } from 'react'

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
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="material-symbols-outlined filled breathing-glow" style={{ fontSize: '1rem' }}>star</span>
          Celestial Love
        </div>

        <p
          className="footer-love-quote"
          style={{
            opacity: fadeIn ? 0.7 : 0,
            transform: fadeIn ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          {LOVE_QUOTES[quoteIdx]}
        </p>

        <div className="footer-links">
          {links.map((l) => (
            <a key={l.id} className={l.id === '#starwishes' && !swUnlocked ? 'sw-locked-link' : ''}
              onClick={() => (l.id === '#starwishes' && !swUnlocked ? onLockedClick() : onNavigate(l.id))}>
              {l.label}
            </a>
          ))}
        </div>

        <p className="footer-copy">
          Made with infinite love under the stars ✦
        </p>
      </div>
    </footer>
  )
}
