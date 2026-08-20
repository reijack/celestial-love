import { useState, useRef } from 'react'
import { LETTERS, LETTER_CAT_IMG } from '../content'
import { spawnHearts } from '../hooks'
import { playLetterUnfold, playHeartPop, playStarChime } from '../sound'

export default function Letter() {
  const [isOpen, setIsOpen] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState(false)
  const [heartSaved, setHeartSaved] = useState(false)
  const cardRef = useRef(null)

  const currentLetter = LETTERS[activeTab] || LETTERS[0]

  function handleMouseMove(e) {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -2.5
    const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 2.5
    el.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
  }

  function handleMouseLeave() {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
    }
  }

  function copyLetterText(e) {
    const fullText = `${currentLetter.greeting}\n\n${currentLetter.paragraphs.join('\n\n')}\n\nForever yours,\n${currentLetter.sign}`
    navigator.clipboard?.writeText(fullText)
    setCopied(true)
    playHeartPop()
    spawnHearts(e.clientX, e.clientY)
    setTimeout(() => setCopied(false), 2400)
  }

  function toggleOpen(e) {
    const nextState = !isOpen
    setIsOpen(nextState)
    if (nextState) {
      playLetterUnfold()
    } else {
      playHeartPop()
    }
    spawnHearts(e.clientX, e.clientY)
  }

  function selectTab(index, e) {
    setActiveTab(index)
    playStarChime()
    spawnHearts(e.clientX, e.clientY)
  }

  function saveToHeart(e) {
    setHeartSaved(true)
    playHeartPop()
    spawnHearts(e.clientX, e.clientY)
    setTimeout(() => setHeartSaved(false), 2500)
  }

  return (
    <section id="letter" style={{ maxWidth: '1200px' }}>
      <div className="section-header">
        <div className="section-eyebrow reveal">
          <span className="material-symbols-outlined filled" style={{ fontSize: '0.875rem' }}>
            edit_note
          </span>
          <span>Surat Cinta di Bawah Bintang</span>
        </div>
        <h2 className="text-headline gradient-text-shimmer reveal reveal-delay-1">Letters from My Heart</h2>
        <p
          className="text-body-lg reveal reveal-delay-2"
          style={{ color: 'var(--on-surface-variant)', maxWidth: '36rem', margin: '0.75rem auto 0' }}
        >
          Untaian kata dan janji suci yang dirajut di heningnya malam, khusus untukmu yang selalu menyinari semestaku.
        </p>

        {/* Letter Tabs */}
        {isOpen && (
          <div className="letter-tabs-row reveal reveal-delay-2">
            {LETTERS.map((letter, idx) => (
              <button
                key={letter.id}
                className={`letter-tab-btn ${activeTab === idx ? 'active' : ''}`}
                onClick={(e) => selectTab(idx, e)}
              >
                <span className="material-symbols-outlined filled" style={{ fontSize: '0.9rem' }}>
                  {activeTab === idx ? 'drafts' : 'mail'}
                </span>
                <span>{letter.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="letter-layout-solo">
        {!isOpen ? (
          /* Sealed Envelope View */
          <div
            className="letter-envelope-sealed glass-panel reveal-scale"
            onClick={toggleOpen}
            title="Klik segel lilin untuk membuka surat cinta ✦"
          >
            <div className="envelope-glow" />
            <div className="envelope-stamp">
              <span className="material-symbols-outlined filled twinkle" style={{ fontSize: '1.25rem' }}>
                auto_awesome
              </span>
            </div>
            <div className="wax-seal floating-element">
              <div className="wax-seal-inner">
                <span className="wax-seal-symbol">✦</span>
                <span className="wax-seal-text">MOON &amp; STAR</span>
              </div>
            </div>
            <div className="envelope-meta">
              <span className="envelope-to">Kepada: Pemilik Hatiku</span>
              <span className="envelope-hint">
                <span
                  className="material-symbols-outlined filled"
                  style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.3rem' }}
                >
                  touch_app
                </span>
                Klik Segel untuk Membuka Surat Cinta
              </span>
            </div>
          </div>
        ) : (
          /* Unfolded Parchment Letter View */
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
                  <div className="letter-subtitle-tag">{currentLetter.subtitle}</div>
                  <h1 className="letter-title gradient-text">{currentLetter.title}</h1>
                  <div className="letter-divider" />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    className="letter-seal-toggle-btn"
                    onClick={(e) => {
                      playStarChime()
                      spawnHearts(e.clientX, e.clientY)
                    }}
                    title="Dengarkan harmoni bintang"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
                      music_note
                    </span>
                    <span>Melodi</span>
                  </button>
                  <button
                    className="letter-seal-toggle-btn"
                    onClick={toggleOpen}
                    title="Tutup kembali surat ke amplop"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
                      drafts
                    </span>
                    <span>Tutup Amplop</span>
                  </button>
                </div>
              </div>

              <p className="letter-body italic letter-greeting">{currentLetter.greeting}</p>

              {currentLetter.paragraphs.map((p, i) => (
                <p className="letter-body letter-paragraph" key={i}>
                  {p}
                </p>
              ))}

              <div className="letter-sign">
                <span>Forever yours,</span>
                <span className="letter-sign-name gradient-text-shimmer">{currentLetter.sign}</span>
              </div>

              <div className="letter-footer">
                <div className="letter-footer-info">
                  <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>
                    schedule
                  </span>
                  <span>Ditulis dengan Ketulusan Hati ✦</span>
                </div>
                <div className="letter-footer-buttons">
                  <button className="letter-footer-btn" onClick={copyLetterText}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
                      {copied ? 'check' : 'content_copy'}
                    </span>
                    <span>{copied ? 'Tersalin di Hatimu ✦' : 'Salin Surat'}</span>
                  </button>
                  <button className="letter-footer-btn letter-btn-heart" onClick={saveToHeart}>
                    <span
                      className="material-symbols-outlined filled heartbeat"
                      style={{ fontSize: '1rem', color: 'var(--error)' }}
                    >
                      favorite
                    </span>
                    <span>{heartSaved ? 'Tersimpan Selamanya ✦' : 'Simpan ke Hati'}</span>
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
