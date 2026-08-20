import { useState } from 'react'
import { spawnHearts } from '../hooks'
import { playStarChime, playHeartPop, playLetterUnfold } from '../sound'

const ORACLE_CARDS = [
  {
    id: 1,
    title: 'The Eternal Constellation',
    name: 'Bintang Abadi (The Constellation)',
    zodiac: 'Libra ♎ & Aquarius ♒',
    element: 'Udara & Angkasa Kosmik',
    symbol: 'stars',
    quote: 'Seperti bintang yang bersinar di tempat yang sama setiap malam, cintaku padamu tak pernah goyah oleh waktu.',
    blessing: 'Hari ini semesta mengirimkan kedamaian mendalam. Pelukan hangat akan meluruhkan seluruh rasa lelahmu.',
    harmonyScore: '100%',
    color: 'linear-gradient(135deg, #e3b8ea 0%, #c2c2f2 50%, #b8c3ff 100%)',
  },
  {
    id: 2,
    title: 'The Starlight Beacon',
    name: 'Mercusuar Bintang (The Beacon)',
    zodiac: 'Harmoni Jiwa',
    element: 'Cahaya Murni',
    symbol: 'wb_twilight',
    quote: 'Dalam kegelapan malam paling pekat sekalipun, senyummu adalah satu-satunya kompas yang menuntun hatiku pulang.',
    blessing: 'Sebuah kabar baik atau momen tawa manis yang tak terduga akan menghiasi obrolan kalian hari ini.',
    harmonyScore: '99.8%',
    color: 'linear-gradient(135deg, #ffd89e 0%, #ffb8c6 50%, #e3b8ea 100%)',
  },
  {
    id: 3,
    title: 'The Celestial Harmony',
    name: 'Harmoni Semesta (The Harmony)',
    zodiac: 'Dua Jiwa Satu Irama',
    element: 'Resonansi Emosional',
    symbol: 'auto_awesome',
    quote: 'Dua elemen udara yang saling memahami tanpa kata. Cukup lewat tatapan, semesta kita sudah saling bercerita.',
    blessing: 'Telepati emosional kalian sedang berada di puncaknya. Apapun yang kamu rasakan, hatinya ikut merasakan.',
    harmonyScore: '100%',
    color: 'linear-gradient(135deg, #b8c3ff 0%, #c2c2f2 50%, #e3b8ea 100%)',
  },
  {
    id: 4,
    title: 'The Cosmic Serenade',
    name: 'Senandung Bintang (The Serenade)',
    zodiac: 'Melodi Kasih',
    element: 'Gelombang Kasih',
    symbol: 'music_note',
    quote: 'Setiap detak jantung adalah nada, dan kebersamaan kita adalah melodi terindah yang pernah diciptakan alam semesta.',
    blessing: 'Dengarkan lagu favorit kalian bersama hari ini. Kenangan manis akan kembali menghangatkan ruang rindu.',
    harmonyScore: '99.5%',
    color: 'linear-gradient(135deg, #ffb8c6 0%, #e3b8ea 50%, #c2c2f2 100%)',
  },
  {
    id: 5,
    title: 'The Infinite Promise',
    name: 'Janji Tak Terhingga (The Promise)',
    zodiac: 'Takdir Indah',
    element: 'Gravitasi Hati',
    symbol: 'all_inclusive',
    quote: 'Bukan tentang seberapa cepat kita melangkah, tapi tentang kepastian bahwa genggaman tangan ini takkan pernah terlepas.',
    blessing: 'Komitmen dan rasa percaya kalian semakin kuat menembus segala rintangan dan jarak.',
    harmonyScore: '100%',
    color: 'linear-gradient(135deg, #c2c2f2 0%, #b8c3ff 50%, #ffd89e 100%)',
  },
]

const HARMONY_METRICS = [
  { name: 'Koneksi Emosional & Telepati', value: 100, icon: 'psychology', desc: 'Saling paham isi hati tanpa perlu banyak bicara' },
  { name: 'Kepercayaan & Rasa Aman', value: 99, icon: 'verified_user', desc: 'Menjadi tempat paling tenang saat dunia luar terasa riuh' },
  { name: 'Romantisme & Sentuhan Manis', value: 98, icon: 'favorite', desc: 'Perhatian kecil dan kejutan hangat yang selalu bermakna' },
  { name: 'Petualangan & Pertumbuhan', value: 100, icon: 'rocket_launch', desc: 'Tumbuh bersama menjadi versi terbaik bagi satu sama lain' },
]

export default function CosmicOracle() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isFlipped, setIsFlipped] = useState(true)
  const [isShuffling, setIsShuffling] = useState(false)
  const [copied, setCopied] = useState(false)

  const card = ORACLE_CARDS[currentIdx]

  function drawNextCard(e) {
    if (isShuffling) return
    setIsShuffling(true)
    setIsFlipped(false)
    playStarChime()
    spawnHearts(e.clientX, e.clientY)

    setTimeout(() => {
      let next = currentIdx
      while (next === currentIdx && ORACLE_CARDS.length > 1) {
        next = Math.floor(Math.random() * ORACLE_CARDS.length)
      }
      setCurrentIdx(next)
      setTimeout(() => {
        setIsFlipped(true)
        setIsShuffling(false)
        playLetterUnfold()
      }, 350)
    }, 450)
  }

  function handleFlipCard(e) {
    if (isShuffling) return
    setIsFlipped((f) => !f)
    playHeartPop()
    spawnHearts(e.clientX, e.clientY)
  }

  function copyBlessing(e) {
    const text = `✦ Cosmic Love Oracle ✦\n"${card.name}"\n\n"${card.quote}"\n\n💫 Pesan Semesta Hari Ini: ${card.blessing}\nLibra ♎ & Aquarius ♒ • Harmoni ${card.harmonyScore}`
    navigator.clipboard?.writeText(text)
    setCopied(true)
    playHeartPop()
    spawnHearts(e.clientX, e.clientY)
    setTimeout(() => setCopied(false), 2400)
  }

  return (
    <section id="oracle" style={{ maxWidth: '1200px' }}>
      <div className="section-header">
        <div className="section-eyebrow reveal">
          <span className="material-symbols-outlined filled" style={{ fontSize: '0.875rem' }}>
            auto_awesome
          </span>
          <span>Bimbingan Semesta &amp; Harmoni Jiwa</span>
        </div>
        <h2 className="text-headline gradient-text-shimmer reveal reveal-delay-1">Cosmic Love Oracle</h2>
        <p
          className="text-body-lg reveal reveal-delay-2"
          style={{ color: 'var(--on-surface-variant)', maxWidth: '38rem', margin: '0.75rem auto 0' }}
        >
          Tarik kartu bintang harian untuk membaca pesan cinta semesta dan menyelami resonansi harmoni zodiak kita.
        </p>
      </div>

      <div className="oracle-layout">
        {/* Left: 3D Interactive Oracle Card Deck */}
        <div className="oracle-deck-col reveal">
          <div className="oracle-card-container">
            <div
              className={`oracle-3d-card ${isFlipped ? 'flipped' : ''} ${isShuffling ? 'shuffling' : ''}`}
              onClick={handleFlipCard}
              title="Klik kartu untuk membalik ✦"
            >
              {/* Back of Card (Starry Pattern) */}
              <div className="oracle-card-face oracle-card-back glass-panel">
                <div className="oracle-card-back-inner">
                  <div className="oracle-back-symbol">
                    <span className="material-symbols-outlined filled twinkle" style={{ fontSize: '3rem', color: 'var(--secondary)' }}>
                      stars
                    </span>
                  </div>
                  <div className="oracle-back-title">CELESTIAL ORACLE</div>
                  <div className="oracle-back-sub">✦ LIBRA &amp; AQUARIUS ✦</div>
                  <div className="oracle-back-hint">Klik untuk membuka pesan ✦</div>
                </div>
              </div>

              {/* Front of Card (The Revealed Prophecy) */}
              <div className="oracle-card-face oracle-card-front glass-panel">
                <div className="oracle-front-glow" style={{ background: card.color }} />
                
                <div className="oracle-card-front-content">
                  <div className="oracle-front-header">
                    <span className="oracle-card-number">NO. 0{card.id}</span>
                    <span className="oracle-card-harmony-badge">
                      <span className="material-symbols-outlined filled" style={{ fontSize: '0.85rem' }}>
                        favorite
                      </span>
                      <span>{card.harmonyScore} Match</span>
                    </span>
                  </div>

                  <div className="oracle-icon-wrapper floating-element">
                    <div className="oracle-icon-circle" style={{ background: card.color }}>
                      <span className="material-symbols-outlined filled" style={{ fontSize: '2.5rem', color: '#120d1c' }}>
                        {card.symbol}
                      </span>
                    </div>
                  </div>

                  <h3 className="oracle-card-name gradient-text">{card.name}</h3>
                  <div className="oracle-card-meta">{card.element} • {card.zodiac}</div>

                  <div className="oracle-quote-box">
                    <p className="oracle-quote-text">“{card.quote}”</p>
                  </div>

                  <div className="oracle-blessing-box">
                    <div className="oracle-blessing-title">
                      <span className="material-symbols-outlined filled" style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>
                        light_mode
                      </span>
                      <span>Energi &amp; Berkah Semesta Hari Ini:</span>
                    </div>
                    <p className="oracle-blessing-text">{card.blessing}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Oracle Card Actions */}
          <div className="oracle-actions">
            <button
              className="btn-celestial"
              onClick={drawNextCard}
              disabled={isShuffling}
              style={{ flex: 1 }}
            >
              <span className="material-symbols-outlined filled" style={{ fontSize: '1rem' }}>
                refresh
              </span>
              <span>Tarik Kartu Lain</span>
            </button>
            <button
              className="btn-celestial-secondary"
              onClick={copyBlessing}
              title="Salin pesan ramalan bintang hari ini"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Tersalin ✦' : 'Salin Pesan'}</span>
            </button>
          </div>
        </div>

        {/* Right: Zodiac Harmony Resonator */}
        <div className="oracle-metrics-col reveal reveal-delay-1">
          <div className="glass-panel harmony-panel">
            <div className="harmony-header">
              <div className="harmony-icon-pair">
                <div className="zodiac-avatar-badge libra">
                  <span>♎</span>
                  <span className="zodiac-avatar-label">Libra</span>
                </div>
                <span className="harmony-link-symbol">✦</span>
                <div className="zodiac-avatar-badge aquarius">
                  <span>♒</span>
                  <span className="zodiac-avatar-label">Aquarius</span>
                </div>
              </div>

              <div>
                <h3 className="harmony-title gradient-text">Harmoni Dua Rasi Bintang</h3>
                <p className="harmony-sub">
                  Kombinasi elemen udara yang menghasilkan koneksi intelektual, rasa nyaman tanpa batas, dan ikatan jiwa yang tak tergantikan.
                </p>
              </div>
            </div>

            <div className="harmony-metrics-list">
              {HARMONY_METRICS.map((metric, i) => (
                <div className="harmony-metric-item" key={metric.name}>
                  <div className="harmony-metric-top">
                    <div className="harmony-metric-name">
                      <span className="material-symbols-outlined filled" style={{ fontSize: '1rem', color: 'var(--secondary)' }}>
                        {metric.icon}
                      </span>
                      <span>{metric.name}</span>
                    </div>
                    <span className="harmony-metric-val">{metric.value}%</span>
                  </div>

                  <div className="harmony-progress-track">
                    <div
                      className="harmony-progress-fill"
                      style={{
                        width: `${metric.value}%`,
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  </div>

                  <div className="harmony-metric-desc">{metric.desc}</div>
                </div>
              ))}
            </div>

            <div className="harmony-oracle-verdict">
              <span className="material-symbols-outlined filled heartbeat" style={{ fontSize: '1.25rem', color: 'var(--error)' }}>
                favorite
              </span>
              <span>
                <strong>Ramalan Kosmik:</strong> Semesta menakdirkan hubungan kalian untuk terus mekar, saling melengkapi di saat senang maupun badai.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
