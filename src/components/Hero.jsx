import { useEffect, useState, useRef } from 'react'
import { HERO_IMG } from '../content'
import { spawnHearts } from '../hooks'
import { playStarChime, playHeartPop, playLetterUnfold } from '../sound'

// Start date: 26 Agustus 2025 00:00:00 (WIB)
const START_DATE = new Date('2025-08-26T00:00:00+07:00').getTime()

function calculateLoveTime() {
  const now = new Date().getTime()
  const diff = Math.max(0, now - START_DATE)

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / 1000 / 60) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  // Average resting heart rate ~72 bpm -> ~1.2 beats per second
  const totalSeconds = Math.floor(diff / 1000)
  const heartbeats = Math.floor(totalSeconds * 1.2).toLocaleString('id-ID')

  return { days, hours, minutes, seconds, heartbeats }
}

export default function Hero({ onNavigate }) {
  const [time, setTime] = useState(calculateLoveTime)
  const [hugCount, setHugCount] = useState(143)
  const [hugToast, setHugToast] = useState(false)
  const cardRef = useRef(null)
  const [showScrollHint, setShowScrollHint] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateLoveTime())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    function onScroll() {
      if (window.scrollY > 120) setShowScrollHint(false)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleMouseMove(e) {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const rx = -(y / (rect.height / 2)) * 4.5
    const ry = (x / (rect.width / 2)) * 4.5
    card.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
  }

  function handleMouseLeave() {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
    }
  }

  function handleImageClick(e) {
    playStarChime()
    spawnHearts(e.clientX, e.clientY)
  }

  function handleSendHug(e) {
    e.stopPropagation()
    setHugCount((c) => c + 1)
    playLetterUnfold()
    spawnHearts(e.clientX, e.clientY)
    setHugToast(true)
    setTimeout(() => setHugToast(false), 2400)
  }

  return (
    <section id="hero">
      <div
        className="hero-card glass reveal"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <span className="material-symbols-outlined filled hero-deco-top twinkle" style={{ fontSize: '1.5rem' }}>
          stars
        </span>
        <span className="material-symbols-outlined hero-deco-bottom twinkle" style={{ fontSize: '1.25rem' }}>
          flare
        </span>

        {/* Zodiac Harmony Tag with Live Constellation Badge */}
        <div className="hero-zodiac-badge reveal">
          <span className="hero-zodiac-icon">♎</span>
          <span>Libra &amp; Aquarius • 100% Celestial Harmony</span>
          <span className="hero-zodiac-icon">♒</span>
        </div>

        {/* Hero Image with Orbit Rings */}
        <div
          className="hero-img-wrap"
          onClick={handleImageClick}
          title="Klik untuk mengirim sentuhan bintang ✦"
          style={{ cursor: 'pointer' }}
        >
          <div className="hero-img-glow" />

          {/* Dual Orbit Rings */}
          <div className="hero-orbit-ring">
            <div className="hero-orbit-dot" />
          </div>
          <div className="hero-orbit-ring-2">
            <div className="hero-orbit-dot-2" />
          </div>

          <img className="hero-img" src={HERO_IMG} alt="Cute celestial cat with heart balloon" />
          <div className="hero-img-badge floating-element">
            <span className="material-symbols-outlined filled" style={{ fontSize: '1rem', color: 'var(--error)' }}>
              favorite
            </span>
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
            <span className="material-symbols-outlined filled" style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>
              auto_awesome
            </span>
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

          {/* Interactive Heartbeat & Hug stats */}
          <div
            style={{
              marginTop: '0.9rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.74rem',
              color: 'var(--on-surface-variant)',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="material-symbols-outlined filled heartbeat" style={{ fontSize: '0.9rem', color: 'var(--error)' }}>
                favorite
              </span>
              <span>~{time.heartbeats} Detak Jantung Bersama</span>
            </span>
            <button
              style={{
                background: 'rgba(227,184,234,0.12)',
                border: '1px solid rgba(227,184,234,0.3)',
                color: 'var(--secondary)',
                padding: '0.25rem 0.65rem',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'all 0.25s',
              }}
              onClick={handleSendHug}
              title="Kirim pelukan hangat jarak jauh ✦"
            >
              <span>🤗 Kirim Pelukan</span>
              <span style={{ opacity: 0.8 }}>({hugCount})</span>
            </button>
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
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
              arrow_forward
            </span>
          </button>
          <button
            className="btn-celestial-secondary"
            onClick={() => {
              playHeartPop()
              onNavigate('#letter')
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>
              mail
            </span>
            <span>Buka Surat</span>
          </button>
        </div>

        {/* Scroll Hint */}
        {showScrollHint && (
          <div className="scroll-hint">
            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
              keyboard_arrow_down
            </span>
            <span>Scroll ke bawah</span>
          </div>
        )}

        {/* Hug Toast Notification */}
        {hugToast && (
          <div className="sw-toast show" style={{ bottom: '2rem' }}>
            Pelukan kosmik hangat berhasil terkirim ke hatinya ✦
          </div>
        )}
      </div>
    </section>
  )
}
