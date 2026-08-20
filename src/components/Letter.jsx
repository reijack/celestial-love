import { useState, useRef } from 'react'
import { LETTER, LETTER_CAT_IMG } from '../content'
import { spawnHearts } from '../hooks'

export default function Letter() {
  const [isOpen, setIsOpen] = useState(true)
  const [copied, setCopied] = useState(false)
  const cardRef = useRef(null)

  function handleMouseMove(e) {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -3
    const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 3
    el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
  }

  function handleMouseLeave() {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'
    }
  }

  function copyLetterText(e) {
    const fullText = `${LETTER.greeting}\n\n${LETTER.paragraphs.join('\n\n')}\n\nForever yours,\n${LETTER.sign}`
    navigator.clipboard?.writeText(fullText)
    setCopied(true)
    spawnHearts(e.clientX, e.clientY)
    setTimeout(() => setCopied(false), 2400)
  }

  function toggleOpen(e) {
    setIsOpen((prev) => !prev)
    spawnHearts(e.clientX, e.clientY)
  }

  return (
    <section id="letter" style={{ maxWidth: '1200px' }}>
      <div className="section-header">
        <div className="section-eyebrow reveal">
          <span className="material-symbols-outlined filled" style={{ fontSize: '0.875rem' }}>edit_note</span>
          <span>Tertulis di Bawah Bintang Tengah Malam</span>
        </div>
        <h2 className="text-headline gradient-text reveal reveal-delay-1">A Letter from My Heart</h2>
        <p className="text-body-lg reveal reveal-delay-2" style={{ color: 'var(--on-surface-variant)', maxWidth: '34rem', margin: '0.75rem auto 0' }}>
          Untaian kata yang dirajut di heningnya malam, khusus untukmu yang selalu menyinari semestaku.
        </p>
      </div>

      <div className="letter-layout-solo">
        {!isOpen ? (
          /* Sealed Envelope View */
          <div
            className="letter-envelope-sealed glass-panel reveal"
            onClick={toggleOpen}
            title="Klik segel untuk membuka surat cinta ✦"
          >
            <div className="envelope-glow" />
            <div className="envelope-stamp">
              <span className="material-symbols-outlined filled" style={{ fontSize: '1.25rem' }}>auto_awesome</span>
            </div>
            <div className="wax-seal floating-element">
              <div className="wax-seal-inner">
                <span className="wax-seal-symbol">✦</span>
                <span className="wax-seal-text">MOON &amp; STAR</span>
              </div>
            </div>
            <div className="envelope-meta">
              <span className="envelope-to">Kepada: Pemilik Hatiku</span>
              <span className="envelope-hint">Klik untuk Membuka Surat Cinta 💌</span>
            </div>
          </div>
        ) : (
          /* Unfolded Letter Card View */
          <article
            className="letter-card glass-panel reveal reveal-delay-1 letter-card-open"
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="letter-glow" />
            <img className="letter-cat" src={LETTER_CAT_IMG} alt="Cute cat peek" />

            <div className="letter-content">
              <div className="letter-header-row">
                <div>
                  <h1 className="letter-title">A Letter from My Heart</h1>
                  <div className="letter-divider" />
                </div>
                <button
                  className="letter-seal-toggle-btn"
                  onClick={toggleOpen}
                  title="Tutup kembali surat ke amplop"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>drafts</span>
                  <span>Tutup Amplop</span>
                </button>
              </div>

              <p className="letter-body italic letter-greeting">{LETTER.greeting}</p>

              {LETTER.paragraphs.map((p, i) => (
                <p className="letter-body letter-paragraph" key={i}>
                  {p}
                </p>
              ))}

              <div className="letter-sign">
                <span>Forever yours,</span>
                <span className="letter-sign-name gradient-text">{LETTER.sign}</span>
              </div>

              <div className="letter-footer">
                <div className="letter-footer-info">
                  <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>schedule</span>
                  <span>Ditulis di Heningnya Tengah Malam</span>
                </div>
                <div className="letter-footer-buttons">
                  <button className="letter-footer-btn" onClick={copyLetterText}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
                      {copied ? 'check' : 'content_copy'}
                    </span>
                    <span>{copied ? 'Tersalin di Hatimu ✦' : 'Salin Surat'}</span>
                  </button>
                  <button
                    className="letter-footer-btn letter-btn-heart"
                    onClick={(e) => spawnHearts(e.clientX, e.clientY)}
                  >
                    <span className="material-symbols-outlined filled" style={{ fontSize: '1rem', color: 'var(--error)' }}>
                      favorite
                    </span>
                    <span>Simpan ke Hati</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  )
}
