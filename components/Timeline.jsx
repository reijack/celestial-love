import { useState, useEffect } from 'react'
import { TIMELINE } from '../content'
import { spawnHearts } from '../hooks'
import { playHeartPop, playStarChime } from '../sound'

export default function Timeline() {
  const [likes, setLikes] = useState(() => {
    try {
      const saved = localStorage.getItem('celestial_timeline_likes')
      if (saved) return JSON.parse(saved)
    } catch (_) {}
    const initial = {}
    TIMELINE.forEach((_, i) => {
      initial[i] = Math.floor(Math.random() * 8) + 16
    })
    return initial
  })

  const [activeMemory, setActiveMemory] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem('celestial_timeline_likes', JSON.stringify(likes))
    } catch (_) {}
  }, [likes])

  function handleCardLike(idx, e) {
    e.stopPropagation()
    setLikes((prev) => ({ ...prev, [idx]: (prev[idx] || 0) + 1 }))
    playHeartPop()
    spawnHearts(e.clientX, e.clientY)
  }

  function handleOpenMemory(item, e) {
    setActiveMemory(item)
    playStarChime()
    spawnHearts(e.clientX, e.clientY)
  }

  return (
    <section id="timeline">
      <div className="section-header">
        <div className="section-eyebrow reveal">
          <span className="material-symbols-outlined filled" style={{ fontSize: '0.875rem' }}>
            star
          </span>
          <span>Jejak Langkah Bintang Kita</span>
        </div>
        <h2 className="text-headline gradient-text-shimmer reveal reveal-delay-1">Our Journey</h2>
        <p
          className="text-body-lg reveal reveal-delay-2"
          style={{ color: 'var(--on-surface-variant)', maxWidth: '38rem', margin: '0.75rem auto 0' }}
        >
          Setiap momen yang kita lalui bagaikan rasi bintang yang perlahan tersambung indah di angkasa malam kita.
        </p>
      </div>

      <div className="timeline-wrap">
        <div className="timeline-line" />
        {TIMELINE.map((item, i) => {
          const onLeft = i % 2 === 0
          const revealDir = onLeft ? 'reveal-left' : 'reveal-right'
          const delayClass = i % 3 === 0 ? '' : i % 3 === 1 ? 'reveal-delay-1' : 'reveal-delay-2'

          const card = (
            <div
              className={`timeline-card glass ${item.isToday ? 'today' : ''}`}
              onClick={(e) => handleOpenMemory(item, e)}
              title="Klik untuk melihat detail memori ✦"
              style={{ cursor: 'pointer' }}
            >
              <div className="timeline-card-header">
                <div className="timeline-date-wrap">
                  <span className={`timeline-date ${item.isToday ? 'today' : ''}`}>{item.date}</span>
                </div>
                <button
                  className="timeline-heart-reaction-btn"
                  onClick={(e) => handleCardLike(i, e)}
                  title="Cintai kenangan ini"
                >
                  <span className="material-symbols-outlined filled heartbeat" style={{ fontSize: '0.95rem', color: 'var(--error)' }}>
                    favorite
                  </span>
                  <span>{likes[i] || 0}</span>
                </button>
              </div>

              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          )

          const dot = (
            <div
              className={`timeline-dot ${item.isToday ? 'today' : ''}`}
              onClick={(e) => handleCardLike(i, e)}
              style={{ cursor: 'pointer' }}
              title="Kirim cinta ke momen ini ✦"
            >
              <span
                className="material-symbols-outlined filled"
                style={{
                  fontSize: item.isToday ? '1.5rem' : '1.125rem',
                  color: item.isToday ? 'var(--on-primary)' : undefined,
                }}
              >
                favorite
              </span>
            </div>
          )

          return (
            <div className={`timeline-item ${revealDir} ${delayClass}`} key={item.date + item.title}>
              {onLeft ? card : <div className="timeline-spacer" />}
              {dot}
              {onLeft ? <div className="timeline-spacer" /> : card}
            </div>
          )
        })}

        {/* Future Story Card */}
        <div className="timeline-future-wrap reveal-scale reveal-delay-3">
          <div className="timeline-future-card glass">
            <span className="material-symbols-outlined filled breathing-glow" style={{ fontSize: '1.75rem', color: 'var(--secondary)' }}>
              auto_awesome
            </span>
            <h3>Menuju Selamanya</h3>
            <p>Dan masih banyak halaman indah yang menanti untuk kita tulis bersama di bawah langit yang sama ✦</p>
          </div>
        </div>
      </div>

      {/* Memory Keepsake Detail Modal */}
      <div
        className={`sw-modal-backdrop ${activeMemory ? 'open' : ''}`}
        onClick={(e) => e.target === e.currentTarget && setActiveMemory(null)}
      >
        {activeMemory && (
          <div className="sw-modal love-note-modal">
            <button className="sw-modal-close" onClick={() => setActiveMemory(null)}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>close</span>
            </button>
            <div className="sw-modal-star">
              <span className="material-symbols-outlined filled heartbeat" style={{ fontSize: '2.2rem', color: 'var(--secondary)' }}>
                favorite
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', letterSpacing: '0.05em' }}>
              {activeMemory.date}
            </div>
            <h3 className="gradient-text" style={{ marginTop: '0.4rem' }}>{activeMemory.title}</h3>
            <div className="love-note-quote-box" style={{ marginTop: '1rem' }}>
              <p className="love-note-text" style={{ fontSize: '1rem', lineHeight: 1.7 }}>
                {activeMemory.text}
              </p>
            </div>
            <div className="sw-modal-actions" style={{ marginTop: '1.5rem' }}>
              <button
                className="sw-btn-save"
                onClick={(e) => {
                  playHeartPop()
                  spawnHearts(e.clientX, e.clientY)
                  setActiveMemory(null)
                }}
              >
                <span className="material-symbols-outlined filled" style={{ fontSize: '1rem' }}>favorite</span>
                <span>Kenangan Terindah ✦</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
