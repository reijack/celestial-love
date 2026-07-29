import { useRef } from 'react'
import { LETTER, LETTER_CAT_IMG } from '../content'
import { spawnHearts } from '../hooks'

export default function Letter() {
  const cardRef = useRef(null)

  function handleMouseMove(e) {
    const el = cardRef.current
    const r = el.getBoundingClientRect()
    const rx = ((e.clientY - r.top - r.height/2) / (r.height/2)) * -2
    const ry = ((e.clientX - r.left - r.width/2) / (r.width/2)) * 2
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`
  }
  function handleMouseLeave() {
    cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)'
  }

  return (
    <section id="letter" style={{ maxWidth: '1200px' }}>
      <div className="section-header">
        <div className="section-eyebrow reveal">
          <span className="material-symbols-outlined filled" style={{ fontSize: '0.875rem' }}>edit_note</span>Written at Midnight
        </div>
        <h2 className="text-headline gradient-text reveal reveal-delay-1">A Letter from My Heart</h2>
      </div>
      <div className="letter-layout-solo">
        <article
          className="letter-card glass-panel reveal reveal-delay-1"
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="letter-glow" />
          <img className="letter-cat" src={LETTER_CAT_IMG} alt="" />
          <div className="letter-content">
            <div style={{ position: 'relative' }}>
              <h1 className="letter-title">A Letter from My Heart</h1>
              <div className="letter-divider" />
            </div>
            <p className="letter-body italic">{LETTER.greeting}</p>
            {LETTER.paragraphs.map((p, i) => (
              <p className="letter-body" style={{ textIndent: '2rem' }} key={i}>{p}</p>
            ))}
            <div className="letter-sign">
              Forever yours,
              <span className="letter-sign-name gradient-text">{LETTER.sign}</span>
            </div>
            <div className="letter-footer">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>schedule</span>Written at Midnight
              </div>
              <button className="letter-footer-btn" onClick={(e) => spawnHearts(e.clientX, e.clientY)}>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>favorite</span>Save to Heart
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
