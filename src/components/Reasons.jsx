import { useState } from 'react'
import { HERO_IMG, CARD_CAT_IMG_1, CARD_CAT_IMG_2, CARD_CAT_IMG_3 } from '../content'
import { spawnHearts } from '../hooks'
import { playStarChime, playHeartPop, playLetterUnfold } from '../sound'

const RANDOM_LOVE_NOTES = [
  'Kamu adalah orang pertama yang kupikirkan saat membuka mata dan yang terakhir sebelum terlelap.',
  'Caramu tersenyum selalu sanggup meluruhkan semua rasa lelah dalam sekejap.',
  'Di antara miliaran galaksi di alam semesta, aku bersyukur ditarik gravitasi menuju hatimu.',
  'Setiap obrolan random tengah malam bersamamu adalah momen paling berharga dalam hariku.',
  'Terima kasih telah menjadi rumah tempat hatiku selalu ingin pulang.',
  'Suara tawamu adalah melodi terindah yang tak pernah bosan kudengar berulang-ulang.',
  'Bersamamu, hari-hari biasa selalu terasa seperti petualangan magis penuh keajaiban.',
  'Aku jatuh cinta pada caramu melihat dunia dengan penuh kehangatan dan kebaikan.',
  'Di matamu, aku menemukan tempat terdamai yang tak pernah kutemukan di mana pun.',
  'Genggaman tanganmu adalah pengingat bahwa aku tidak pernah sendirian mengarungi badai apa pun.',
  'Bahkan di hari paling mendung sekalipun, bayangan tawamu sanggup menyalakan pelangi di hatiku.',
  'Terima kasih sudah memilihku setiap hari, sebagaimana aku selalu memilihmu tanpa ragu.',
]

const SECRET_WHISPERS = {
  1: 'Rahasia kecil: Aku selalu tersenyum sendiri tiap ingat betapa lucunya awal mula kita saling confess lewat Google Form.',
  2: 'Rahasia kecil: Obrolan tengah malam kita selalu jadi alasan aku tidur dengan hati yang tenang dan mimpi indah.',
  3: 'Rahasia kecil: Tiap kali kamu ngusap kepalaku, rasanya duniaku langsung berhenti berputar sejenak.',
  4: 'Rahasia kecil: Lagu-lagu di playlist kita selalu kuputar saat aku lagi kangen berat sama kamu.',
  5: 'Rahasia kecil: Tawamu itu candu terbaikku. Bikin hari seberat apa pun jadi ringan seketika.',
  6: 'Rahasia kecil: Di mana pun kita berada, selama ada kamu, tempat itu selalu terasa seperti rumah.',
}

export default function Reasons() {
  const [noteModal, setNoteModal] = useState(false)
  const [currentNote, setCurrentNote] = useState('')
  const [copiedNote, setCopiedNote] = useState(false)
  const [revealedSecrets, setRevealedSecrets] = useState({})
  const [cardLikes, setCardLikes] = useState({ 1: 28, 2: 22, 3: 19, 4: 25, 5: 36, 6: 31 })

  function handleRandomNote(e) {
    const random = RANDOM_LOVE_NOTES[Math.floor(Math.random() * RANDOM_LOVE_NOTES.length)]
    setCurrentNote(random)
    setNoteModal(true)
    playStarChime()
    spawnHearts(e.clientX, e.clientY)
  }

  function nextRandomNote(e) {
    let next = currentNote
    while (next === currentNote && RANDOM_LOVE_NOTES.length > 1) {
      next = RANDOM_LOVE_NOTES[Math.floor(Math.random() * RANDOM_LOVE_NOTES.length)]
    }
    setCurrentNote(next)
    playStarChime()
    spawnHearts(e.clientX, e.clientY)
  }

  function copyNote() {
    navigator.clipboard?.writeText(currentNote)
    setCopiedNote(true)
    playHeartPop()
    setTimeout(() => setCopiedNote(false), 2000)
  }

  function likeBento(id, e) {
    e.stopPropagation()
    setCardLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
    playHeartPop()
    spawnHearts(e.clientX, e.clientY)
  }

  function toggleSecret(id, e) {
    e.stopPropagation()
    setRevealedSecrets((prev) => ({ ...prev, [id]: !prev[id] }))
    playLetterUnfold()
    spawnHearts(e.clientX, e.clientY)
  }

  return (
    <section id="reasons">
      <div className="reasons-layout">
        <aside className="reasons-sidebar reveal">
          <div className="reasons-sidebar-header">
            <div className="reasons-sidebar-avatar">
              <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', color: 'var(--on-secondary-container)' }}>
                pets
              </span>
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.125rem', color: 'var(--secondary)', fontWeight: 600 }}>
                Our Story
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--on-surface-variant)', letterSpacing: '0.04em', fontWeight: 600 }}>
                Written in the stars ✦
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', lineHeight: 1.6, margin: '0 0 1rem' }}>
            Setiap detail kecil dan hangat yang membuat semesta cinta kita begitu sempurna.
          </p>

          <button className="reasons-note-btn" onClick={handleRandomNote}>
            <span className="material-symbols-outlined filled" style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>
              auto_awesome
            </span>
            <span>Bisikan Bintang Hari Ini</span>
          </button>

          <button
            style={{
              marginTop: '0.75rem',
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--on-surface)',
              padding: '0.75rem',
              borderRadius: '0.875rem',
              fontFamily: 'inherit',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.25s ease',
            }}
            onClick={(e) => {
              playHeartPop()
              spawnHearts(e.clientX, e.clientY)
            }}
          >
            <span className="material-symbols-outlined filled" style={{ fontSize: '1rem', color: 'var(--error)' }}>
              favorite
            </span>
            <span>Kirim Cinta Kosmik ✦</span>
          </button>
        </aside>

        <main className="reasons-main">
          <header className="reveal" style={{ marginBottom: '2.5rem' }}>
            <div className="section-eyebrow" style={{ display: 'inline-flex' }}>
              <span className="material-symbols-outlined twinkle" style={{ fontSize: '0.875rem' }}>
                star
              </span>
              <span>Endless Reasons</span>
            </div>
            <h1 className="text-display gradient-text" style={{ marginTop: '0.75rem' }}>
              Hal-Hal yang Kucintai Dari Kita
            </h1>
            <p className="text-body-lg" style={{ color: 'var(--on-surface-variant)', marginTop: '0.5rem', maxWidth: '42rem' }}>
              Klik pada kartu kenangan mana pun untuk mengungkap rahasia kecil di baliknya ✦
            </p>
          </header>

          <div className="bento-grid">
            {/* Bento 1: Zodiac Connection */}
            <div
              className="glass-card constellation-bg reveal bento-span-2"
              style={{ borderRadius: '1.5rem', padding: '2.25rem', position: 'relative', overflow: 'visible', cursor: 'pointer' }}
              onClick={(e) => toggleSecret(1, e)}
            >
              <img
                className="card-cat-peek"
                alt="Cat"
                src={CARD_CAT_IMG_1}
                style={{ top: '-2rem', right: '-1rem', width: '5.25rem', height: '5.25rem', borderWidth: '3px' }}
              />
              <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div className="reason-icon reason-icon-secondary" style={{ width: '3rem', height: '3rem', marginBottom: 0 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>air</span>
                    </div>
                    <div className="reason-icon reason-icon-primary" style={{ width: '3rem', height: '3rem', marginBottom: 0 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>water_drop</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span className="bento-like-badge" onClick={(e) => likeBento(1, e)} title="Beri cinta">
                      <span className="material-symbols-outlined filled" style={{ fontSize: '0.85rem', color: 'var(--error)' }}>favorite</span>
                      <span>{cardLikes[1]}</span>
                    </span>
                    <span className="bento-like-badge" style={{ color: 'var(--secondary)' }}>
                      {revealedSecrets[1] ? '✦ Rahasia Terbuka' : '🔍 Klik untuk Rahasia'}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="reason-card-title" style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Harmoni Rasi Bintang Kita <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>stars</span>
                  </h3>
                  <p className="reason-card-text">
                    Libra (26 Agustus) dan Aquarius (14 Februari) — dua rasi elemen udara yang ditakdirkan saling melengkapi. Cara kita menyeimbangkan rasa dan berjalan beriringan adalah keajaiban nyata.
                  </p>
                  {revealedSecrets[1] && (
                    <div style={{ marginTop: '0.9rem', padding: '0.75rem 1rem', background: 'rgba(227,184,234,0.12)', borderRadius: '0.85rem', border: '1px solid rgba(227,184,234,0.3)', fontSize: '0.88rem', color: 'var(--on-surface)', animation: 'page-enter 0.4s ease' }}>
                      💌 {SECRET_WHISPERS[1]}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bento 2: Late Night Talks */}
            <div
              className="glass-card constellation-bg reveal reveal-delay-1"
              style={{ borderRadius: '1.5rem', padding: '2rem', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
              onClick={(e) => toggleSecret(2, e)}
            >
              <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div className="reason-icon reason-icon-primary" style={{ marginBottom: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>dark_mode</span>
                  </div>
                  <span className="bento-like-badge" onClick={(e) => likeBento(2, e)}>
                    <span className="material-symbols-outlined filled" style={{ fontSize: '0.85rem', color: 'var(--error)' }}>favorite</span>
                    <span>{cardLikes[2]}</span>
                  </span>
                </div>
                <div>
                  <h3 className="reason-card-title">Obrolan Tengah Malam</h3>
                  <p className="reason-card-text">
                    Saat seisi dunia telah terlelap dan hanya suara kita yang saling berbagi cerita rahasia pada taburan bintang.
                  </p>
                  {revealedSecrets[2] && (
                    <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', background: 'rgba(194,194,242,0.12)', borderRadius: '0.85rem', border: '1px solid rgba(194,194,242,0.3)', fontSize: '0.85rem', color: 'var(--on-surface)', animation: 'page-enter 0.4s ease' }}>
                      💌 {SECRET_WHISPERS[2]}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bento 3: Morning Rituals */}
            <div
              className="glass-card constellation-bg reveal reveal-delay-2"
              style={{ borderRadius: '1.5rem', padding: '2rem', position: 'relative', overflow: 'visible', cursor: 'pointer' }}
              onClick={(e) => toggleSecret(3, e)}
            >
              <img
                className="card-cat-peek"
                alt="Cat"
                src={CARD_CAT_IMG_2}
                style={{ top: '-1.5rem', left: '-1rem', width: '3.75rem', height: '3.75rem', borderWidth: '2px', transform: 'rotate(-10deg)' }}
              />
              <div style={{ position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div className="reason-icon reason-icon-secondary" style={{ width: '2.5rem', height: '2.5rem', marginBottom: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>coffee</span>
                  </div>
                  <span className="bento-like-badge" onClick={(e) => likeBento(3, e)}>
                    <span className="material-symbols-outlined filled" style={{ fontSize: '0.85rem', color: 'var(--error)' }}>favorite</span>
                    <span>{cardLikes[3]}</span>
                  </span>
                </div>
                <h3 className="reason-card-title-sm">Perhatian Kecil Sehari-Hari</h3>
                <p className="reason-card-text-sm">
                  Bagaimana kamu selalu paham hal-hal kecil yang kubutuhkan bahkan sebelum aku sempat mengucapkannya.
                </p>
                {revealedSecrets[3] && (
                  <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', background: 'rgba(227,184,234,0.12)', borderRadius: '0.85rem', border: '1px solid rgba(227,184,234,0.3)', fontSize: '0.85rem', color: 'var(--on-surface)', animation: 'page-enter 0.4s ease' }}>
                    💌 {SECRET_WHISPERS[3]}
                  </div>
                )}
              </div>
            </div>

            {/* Bento 4: Shared Playlist */}
            <div
              className="glass-card constellation-bg reveal reveal-delay-3"
              style={{ borderRadius: '1.5rem', padding: '2rem', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
              onClick={(e) => toggleSecret(4, e)}
            >
              <div style={{ position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div className="reason-icon reason-icon-tertiary" style={{ width: '2.5rem', height: '2.5rem', marginBottom: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>music_note</span>
                  </div>
                  <span className="bento-like-badge" onClick={(e) => likeBento(4, e)}>
                    <span className="material-symbols-outlined filled" style={{ fontSize: '0.85rem', color: 'var(--error)' }}>favorite</span>
                    <span>{cardLikes[4]}</span>
                  </span>
                </div>
                <h3 className="reason-card-title-sm">Lagu &amp; Melodi Kita</h3>
                <p className="reason-card-text-sm">
                  Setiap alunan nada di playlist kita menyimpan kenangan manis yang merajut perjalanan cinta kita.
                </p>
                {revealedSecrets[4] && (
                  <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', background: 'rgba(184,195,255,0.12)', borderRadius: '0.85rem', border: '1px solid rgba(184,195,255,0.3)', fontSize: '0.85rem', color: 'var(--on-surface)', animation: 'page-enter 0.4s ease' }}>
                    💌 {SECRET_WHISPERS[4]}
                  </div>
                )}
              </div>
            </div>

            {/* Bento 5: Your Laugh */}
            <div
              className="glass-card constellation-bg reveal reveal-delay-1"
              style={{ borderRadius: '1.5rem', padding: '2rem', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer' }}
              onClick={(e) => toggleSecret(5, e)}
            >
              <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '4rem',
                    height: '4rem',
                    borderRadius: '9999px',
                    background: 'var(--surface-high)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                  className="floating-element"
                >
                  <span className="material-symbols-outlined filled heartbeat" style={{ fontSize: '1.75rem', color: 'var(--error)' }}>
                    favorite
                  </span>
                </div>
                <h3 className="reason-card-title">Tawa Manismu</h3>
                <p className="reason-card-text" style={{ textAlign: 'center' }}>
                  Suara tawa yang selalu berhasil menerangi hari-hari tergelapku dan menghangatkan jiwa.
                </p>
                {revealedSecrets[5] && (
                  <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', background: 'rgba(255,184,215,0.12)', borderRadius: '0.85rem', border: '1px solid rgba(255,184,215,0.3)', fontSize: '0.85rem', color: 'var(--on-surface)', animation: 'page-enter 0.4s ease' }}>
                    💌 {SECRET_WHISPERS[5]}
                  </div>
                )}
              </div>
            </div>

            {/* Bento 6: Spontaneous Adventures */}
            <div
              className="glass-card constellation-bg reveal reveal-delay-2 bento-span-2"
              style={{ borderRadius: '1.5rem', padding: '2rem', position: 'relative', overflow: 'visible', cursor: 'pointer' }}
              onClick={(e) => toggleSecret(6, e)}
            >
              <img
                className="card-cat-peek"
                alt="Cat"
                src={CARD_CAT_IMG_3}
                style={{ bottom: '-1.5rem', right: '2rem', width: '4.5rem', height: '4.5rem', borderWidth: '3px' }}
              />
              <div style={{ position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="reason-icon reason-icon-bright" style={{ width: '2.5rem', height: '2.5rem', marginBottom: 0 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>flight_takeoff</span>
                    </div>
                    <h3 className="reason-card-title-sm" style={{ marginBottom: 0 }}>Petualangan Tak Terduga</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span className="bento-like-badge" onClick={(e) => likeBento(6, e)}>
                      <span className="material-symbols-outlined filled" style={{ fontSize: '0.85rem', color: 'var(--error)' }}>favorite</span>
                      <span>{cardLikes[6]}</span>
                    </span>
                    <span className="bento-like-badge" style={{ color: 'var(--secondary)' }}>
                      {revealedSecrets[6] ? '✦ Rahasia Terbuka' : '🔍 Klik untuk Rahasia'}
                    </span>
                  </div>
                </div>
                <p className="reason-card-text">
                  Entah itu obrolan spontan, perjalanan singkat, atau sekadar menikmati sore berdua, setiap detik bersamamu selalu terasa seperti petualangan indah.
                </p>
                {revealedSecrets[6] && (
                  <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', background: 'rgba(227,184,234,0.12)', borderRadius: '0.85rem', border: '1px solid rgba(227,184,234,0.3)', fontSize: '0.85rem', color: 'var(--on-surface)', animation: 'page-enter 0.4s ease' }}>
                    💌 {SECRET_WHISPERS[6]}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="reasons-cat-section reveal">
            <div
              className="reasons-cat-wrap floating-element"
              onClick={(e) => {
                playHeartPop()
                spawnHearts(e.clientX, e.clientY)
              }}
              style={{ cursor: 'pointer' }}
              title="Kirim cinta ✦"
            >
              <div className="reasons-cat-glow" />
              <img className="reasons-cat-img" alt="Cat" src={HERO_IMG} />
            </div>
            <h3 className="reason-card-title" style={{ marginTop: '1.5rem' }}>Dan Masih Banyak Alasan Lainnya...</h3>
            <p className="reason-card-text-sm" style={{ marginTop: '0.5rem' }}>
              Sampai ke bulan, bintang-bintang, dan kembali lagi ke pelukanmu ✦
            </p>
          </div>
        </main>
      </div>

      {/* Bisikan Bintang / Love Note Modal */}
      <div
        className={`sw-modal-backdrop ${noteModal ? 'open' : ''}`}
        onClick={(e) => e.target === e.currentTarget && setNoteModal(false)}
      >
        <div className="sw-modal love-note-modal">
          <button className="sw-modal-close" onClick={() => setNoteModal(false)}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>close</span>
          </button>
          <div className="sw-modal-star">
            <span className="material-symbols-outlined filled twinkle" style={{ fontSize: '2.2rem', color: 'var(--secondary)' }}>
              auto_awesome
            </span>
          </div>
          <h3 className="gradient-text">Bisikan Bintang</h3>
          <div className="love-note-quote-box">
            <span className="love-note-quote-mark">“</span>
            <p className="love-note-text">{currentNote}</p>
            <span className="love-note-quote-mark" style={{ textAlign: 'right' }}>”</span>
          </div>
          <div className="sw-modal-actions" style={{ marginTop: '1.5rem', flexWrap: 'wrap', gap: '0.6rem' }}>
            <button className="sw-btn-cancel" onClick={copyNote}>
              <span className="material-symbols-outlined" style={{ fontSize: '0.95rem' }}>{copiedNote ? 'check' : 'content_copy'}</span>
              <span>{copiedNote ? 'Tersalin ✦' : 'Salin Pesan'}</span>
            </button>
            <button className="sw-btn-save" onClick={nextRandomNote}>
              <span className="material-symbols-outlined filled" style={{ fontSize: '0.95rem' }}>refresh</span>
              <span>Bisikan Lainnya</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
