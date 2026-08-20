import { useEffect, useState, useRef } from 'react'
import { HERO_IMG } from '../content'
import { spawnHearts } from '../hooks'
import { playStarChime, playHeartPop } from '../sound'

// Start date: 26 Agustus 2025 00:00:00 (WIB)
const START_DATE = new Date('2025-08-26T00:00:00+07:00').getTime()

function calculateLoveTime() {
  const now = new Date().getTime()
  const diff = Math.max(0, now - START_DATE)

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / 1000 / 60) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return { days, hours, minutes, seconds }
}

export default function Hero({ onNavigate }) {
  const [time, setTime] = useState(calculateLoveTime)
  const cardRef = useRef(null)
  const [showScrollHint, setShowScrollHint] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateLoveTime())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Hide scroll hint on scroll
  useEffect(() => {
    function onScroll() {
      if (window.scrollY > 100) setShowScrollHint(false)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleMouseMove(e) {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const rx = -(y / (rect.height / 2)) * 5
    const ry = (x / (rect.width / 2)) * 5
    card.style.transform = `perspective(1200px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`
  }

  function handleMouseLeave() {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    }
  }

  function handleImageClick(e) {
    playStarChime()
    spawnHearts(e.clientX, e.clientY)
  }

  return (
    <section id="hero">
      <div
        className="hero-card glass reveal"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <span className="material-symbols-outlined filled hero-deco-top twinkle" style={{ fontSize: '1.5rem' }}>stars</span>
        <span className="material-symbols-outlined hero-deco-bottom twinkle" style={{ fontSize: '1.25rem' }}>flare</span>

        {/* Zodiac Harmony Tag */}
        <div className="hero-zodiac-badge reveal">
          <span className="hero-zodiac-icon">♎</span>
          <span>Libra &amp; Aquarius Harmony</span>
          <span className="hero-zodiac-icon">♒</span>
        </div>

        {/* Hero Image with Orbit Rings */}
        <div
          className="hero-img-wrap"
          onClick={handleImageClick}
          title="Klik untuk mengirim pelukan cinta ✦"
          style={{ cursor: 'pointer' }}
        >
          <div className="hero-img-glow" />

          {/* Orbit Rings */}
          <div className="hero-orbit-ring">
            <div className="hero-orbit-dot" />
          </div>
          <div className="hero-orbit-ring-2">
            <div className="hero-orbit-dot-2" />
          </div>

          <img className="hero-img" src={HERO_IMG} alt="Cute celestial cat with heart balloon" />
          <div className="hero-img-badge floating-element">
            <span className="material-symbols-outlined filled" style={{ fontSize: '1rem', color: 'var(--error)' }}>favorite</span>
          </div>
        </div>

        <h1 className="hero-title reveal reveal-delay-1">Our Celestial Journey</h1>
        <p className="hero-sub reveal reveal-delay-2">
          Tertulis di antara gugusan bintang, dihangatkan oleh setiap detik yang kita lalui bersama. Kisah cinta abadi di bawah naungan semesta kita.
        </p>

        {/* Live Love Journey Counter */}
        <div
          className="hero-counter-box reveal reveal-delay-2"
          onClick={(e) => {
            playHeartPop()
            spawnHearts(e.clientX, e.clientY)
          }}
          title="Klik untuk merayakan setiap detik bersama ✦"
          style={{ cursor: 'pointer' }}
        >
          <div className="hero-counter-label">
            <span className="material-symbols-outlined filled" style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>auto_awesome</span>
            <span>Telah Menjalin Kasih Selama</span>
          </div>
          <div className="hero-counter-grid">
            <div className="hero-counter-item">
              <span className="hero-counter-num">{time.days}</span>
              <span className="hero-counter-unit">Hari</span>
            </div>
            <span className="hero-counter-colon">:</span>
            <div className="hero-counter-item">
              <span className="hero-counter-num">{String(time.hours).padStart(2, '0')}</span>
              <span className="hero-counter-unit">Jam</span>
            </div>
            <span className="hero-counter-colon">:</span>
            <div className="hero-counter-item">
              <span className="hero-counter-num">{String(time.minutes).padStart(2, '0')}</span>
              <span className="hero-counter-unit">Menit</span>
            </div>
            <span className="hero-counter-colon">:</span>
            <div className="hero-counter-item">
              <span className="hero-counter-num">{String(time.seconds).padStart(2, '0')}</span>
              <span className="hero-counter-unit">Detik</span>
            </div>
          </div>
        </div>

        <div className="hero-actions reveal reveal-delay-3">
          <button
            className="btn-celestial"
            onClick={() => {
              playStarChime()
              onNavigate('#timeline')
            }}
          >
            <span>Jelajahi Kisah Kita</span>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_forward</span>
          </button>
          <button
            className="btn-celestial-secondary"
            onClick={() => {
              playHeartPop()
              onNavigate('#letter')
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>mail</span>
            <span>Buka Surat</span>
          </button>
        </div>

        {/* Scroll Hint */}
        {showScrollHint && (
          <div className="scroll-hint">
            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', animation: 'scroll-hint-bounce 2s ease-in-out infinite' }}>
              keyboard_arrow_down
            </span>
            <span>Scroll ke bawah</span>
          </div>
        )}
      </div>
    </section>
  )
}
