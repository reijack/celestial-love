import { useState, useRef, useEffect } from 'react'
import { LETTERS, LETTER_CAT_IMG } from '../content'
import { spawnHearts } from '../hooks'
import { playLetterUnfold, playHeartPop, playStarChime, playWishSavedSound } from '../sound'

export default function Letter() {
  const [isOpen, setIsOpen] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState(false)
  const [heartSaved, setHeartSaved] = useState(false)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [savedReplies, setSavedReplies] = useState(() => {
    try {
      const saved = localStorage.getItem('celestial_love_replies')
      if (saved) return JSON.parse(saved)
    } catch (_) {}
    return []
  })
  const cardRef = useRef(null)

  const currentLetter = LETTERS[activeTab] || LETTERS[0]

  useEffect(() => {
    try {
      localStorage.setItem('celestial_love_replies', JSON.stringify(savedReplies))
    } catch (_) {}
  }, [savedReplies])

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

  function handleSaveReply(e) {
    if (!replyText.trim()) return
    const newReply = {
      id: Date.now(),
      text: replyText.trim(),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    }
    setSavedReplies([newReply, ...savedReplies])
    setReplyText('')
    setShowReplyModal(false)
    playWishSavedSound()
    spawnHearts(e.clientX, e.clientY)
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
                <div className="letter-footer-buttons" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                  <button
                    className="letter-footer-btn"
                    onClick={(e) => {
                      setShowReplyModal(true)
                      playStarChime()
                      spawnHearts(e.clientX, e.clientY)
                    }}
                    style={{ background: 'rgba(227, 184, 234, 0.15)', borderColor: 'rgba(227, 184, 234, 0.35)' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'var(--secondary)' }}>
                      edit_heart
                    </span>
                    <span>Balas Surat Cinta</span>
                  </button>
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

              {/* Display Partner Saved Replies Keepsake */}
              {savedReplies.length > 0 && (
                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.9rem' }}>
                    <span className="material-symbols-outlined filled" style={{ fontSize: '1.1rem' }}>favorite</span>
                    <span>Balasan &amp; Catatan Cinta Kamu ({savedReplies.length})</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {savedReplies.map((r) => (
                      <div
                        key={r.id}
                        style={{
                          background: 'rgba(19, 18, 25, 0.7)',
                          border: '1px solid rgba(227, 184, 234, 0.2)',
                          borderRadius: '1rem',
                          padding: '1rem 1.25rem',
                        }}
                      >
                        <div style={{ fontSize: '0.72rem', color: 'var(--on-surface-variant)', marginBottom: '0.35rem' }}>
                          {r.date}
                        </div>
                        <p style={{ margin: 0, fontSize: '0.94rem', color: 'var(--on-surface)', fontStyle: 'italic', lineHeight: 1.6 }}>
                          "{r.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        )}
      </div>

      {/* Reply Modal */}
      <div
        className={`sw-modal-backdrop ${showReplyModal ? 'open' : ''}`}
        onClick={(e) => e.target === e.currentTarget && setShowReplyModal(false)}
      >
        <div className="sw-modal love-note-modal" style={{ maxWidth: '32rem' }}>
          <button className="sw-modal-close" onClick={() => setShowReplyModal(false)}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>close</span>
          </button>
          <div className="sw-modal-star">
            <span className="material-symbols-outlined filled heartbeat" style={{ fontSize: '2.2rem', color: 'var(--secondary)' }}>
              favorite
            </span>
          </div>
          <h3 className="gradient-text">Tulis Balasan Surat Cinta</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginTop: '0.3rem' }}>
            Tuliskan perasaan hatimu, pesan ini akan tersimpan abadi di semesta kita ✦
          </p>

          <textarea
            className="sw-textarea"
            placeholder="Tuliskan pesan manismu di sini..."
            rows={4}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            style={{ marginTop: '1rem' }}
          />

          <div className="sw-modal-actions" style={{ marginTop: '1.25rem' }}>
            <button className="sw-btn-cancel" onClick={() => setShowReplyModal(false)}>
              Batal
            </button>
            <button className="sw-btn-save" onClick={handleSaveReply} disabled={!replyText.trim()}>
              <span className="material-symbols-outlined filled" style={{ fontSize: '0.95rem' }}>send</span>
              <span>Simpan Pesan Cinta</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
