import { useState } from 'react'
import { TIMELINE } from '../content'
import { spawnHearts } from '../hooks'
import { playHeartPop } from '../sound'

export default function Timeline() {
  const [likes, setLikes] = useState(() => {
    const initial = {}
    TIMELINE.forEach((_, i) => {
      initial[i] = Math.floor(Math.random() * 8) + 12
    })
    return initial
  })

  function handleCardLike(idx, e) {
    e.stopPropagation()
    setLikes((prev) => ({ ...prev, [idx]: (prev[idx] || 0) + 1 }))
    playHeartPop()
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
        <h2 className="text-headline gradient-text reveal reveal-delay-1">Our Journey</h2>
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
          const delayClass = i % 3 === 0 ? 'reveal' : i % 3 === 1 ? 'reveal reveal-delay-1' : 'reveal reveal-delay-2'

          const card = (
            <div
              className={`timeline-card glass ${item.isToday ? 'today' : ''}`}
              onClick={(e) => handleCardLike(i, e)}
              title="Klik untuk memberi cinta pada kenangan ini ✦"
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
                  <span className="material-symbols-outlined filled" style={{ fontSize: '0.95rem', color: 'var(--error)' }}>
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
            <div className={`timeline-item ${delayClass}`} key={item.date + item.title}>
              {onLeft ? card : <div className="timeline-spacer" />}
              {dot}
              {onLeft ? <div className="timeline-spacer" /> : card}
            </div>
          )
        })}

        {/* Future Story Card */}
        <div className="timeline-future-wrap reveal reveal-delay-3">
          <div className="timeline-future-card glass">
            <span className="material-symbols-outlined filled twinkle" style={{ fontSize: '1.75rem', color: 'var(--secondary)' }}>
              auto_awesome
            </span>
            <h3>Menuju Selamanya</h3>
            <p>Dan masih banyak halaman indah yang menanti untuk kita tulis bersama di bawah langit yang sama ✦</p>
          </div>
        </div>
      </div>
    </section>
  )
}
