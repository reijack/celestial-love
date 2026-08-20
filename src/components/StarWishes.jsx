import { useEffect, useRef, useState, useCallback } from 'react'
import { supabase } from '../supabase'
import { LIBRA_STARS, LIBRA_LINES, AQUARIUS_STARS, AQUARIUS_LINES } from '../content'
import { spawnHearts } from '../hooks'

const ALL_STARS = [
  ...LIBRA_STARS.map((s) => ({ x: s[0], y: s[1], size: s[2], name: s[3], mag: s[4], zodiac: 'libra' })),
  ...AQUARIUS_STARS.map((s) => ({ x: s[0], y: s[1], size: s[2], name: s[3], mag: s[4], zodiac: 'aquarius' })),
]
const LIBRA_COUNT = LIBRA_STARS.length

const WISH_PRESETS = [
  'Semoga cinta kita selalu mekar dan saling menguatkan di setiap musim hidup ✨',
  'Janji untuk selalu menjadi tempat paling aman dan nyaman untuk hatimu 🤍',
  'Semoga setiap impian dan cita-cita kita bisa kita capai bersama-sama ✦',
  'Terima kasih telah hadir dan menjadikan duniaku begitu istimewa 🌙',
  'Semoga kita terus bergandengan tangan menatap langit malam selamanya 💫',
]

function makeStarPoints(size) {
  const h = size / 2
  const pts = []
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2
    const r = i % 2 === 0 ? h : h * 0.4
    pts.push(`${(h + Math.cos(a) * r).toFixed(2)},${(h + Math.sin(a) * r).toFixed(2)}`)
  }
  return pts.join(' ')
}

function StarIcon({ size, fill, stroke, glowing }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        display: 'block',
        filter: glowing ? 'drop-shadow(0 0 8px rgba(194,194,242,0.9)) drop-shadow(0 0 14px rgba(227,184,234,0.6))' : 'none',
      }}
    >
      <polygon points={makeStarPoints(size)} fill={fill} stroke={stroke} strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

function ConstellationLines({ width, height }) {
  function renderLines(list, lines, color, offset = 0) {
    return lines.map(([a, b], i) => {
      const sa = list[a], sb = list[b]
      if (!sa || !sb) return null
      return (
        <line
          key={`${offset}-${i}`}
          x1={(sa[0] / 100) * width}
          y1={(sa[1] / 100) * height}
          x2={(sb[0] / 100) * width}
          y2={(sb[1] / 100) * height}
          stroke={color}
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.45"
        />
      )
    })
  }

  const crossLines = [[6, 7 + 8], [2, 7 + 8], [6, 7 + 0], [5, 7 + 7]]

  return (
    <svg
      width="100%"
      height="100%"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="swCrossGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(184,195,255,1)" />
          <stop offset="100%" stopColor="rgba(227,184,234,1)" />
        </linearGradient>
        <radialGradient id="libraNebula" cx="30%" cy="50%" r="40%">
          <stop offset="0%" stopColor="rgba(184,195,255,0.18)" />
          <stop offset="100%" stopColor="rgba(184,195,255,0)" />
        </radialGradient>
        <radialGradient id="aquariusNebula" cx="75%" cy="55%" r="45%">
          <stop offset="0%" stopColor="rgba(227,184,234,0.18)" />
          <stop offset="100%" stopColor="rgba(227,184,234,0)" />
        </radialGradient>
      </defs>

      {/* Ambient Nebula Clouds */}
      <rect x="0" y="0" width={width} height={height} fill="url(#libraNebula)" />
      <rect x="0" y="0" width={width} height={height} fill="url(#aquariusNebula)" />

      {renderLines(LIBRA_STARS, LIBRA_LINES, 'rgba(184,195,255,1)', 'l')}
      {renderLines(AQUARIUS_STARS, AQUARIUS_LINES, 'rgba(227,184,234,1)', 'a')}

      {crossLines.map(([a, b], i) => {
        const sa = ALL_STARS[a], sb = ALL_STARS[b]
        if (!sa || !sb) return null
        return (
          <line
            key={`c-${i}`}
            x1={(sa.x / 100) * width}
            y1={(sa.y / 100) * height}
            x2={(sb.x / 100) * width}
            y2={(sb.y / 100) * height}
            stroke="url(#swCrossGrad)"
            strokeWidth="1.2"
            strokeDasharray="2 4"
            opacity="0.6"
          />
        )
      })}

      <g>
        <rect
          x={width * 0.5 - 100}
          y={height * 0.08 - 14}
          width="200"
          height="26"
          rx="13"
          fill="rgba(19,19,22,0.8)"
          stroke="rgba(220,195,245,0.6)"
          strokeWidth="0.8"
        />
        <text
          x={width * 0.5}
          y={height * 0.08 + 4}
          textAnchor="middle"
          fontFamily="Playfair Display,serif"
          fontSize="11.5"
          letterSpacing="0.08em"
          fill="rgba(227,184,234,1)"
          fontWeight="600"
        >
          ✦ LIBRA &amp; AQUARIUS ✦
        </text>
      </g>
    </svg>
  )
}

function BgStars() {
  const [pts] = useState(() =>
    Array.from({ length: 40 }, () => ({
      r: 0.6 + Math.random() * 1.4,
      left: 2 + Math.random() * 96,
      top: 2 + Math.random() * 96,
      dur: 2 + Math.random() * 3.5,
      delay: Math.random() * 2.5,
      o: 0.1 + Math.random() * 0.25,
    }))
  )
  return pts.map((p, i) => (
    <div
      key={i}
      className="sw-bg-star twinkle"
      style={{
        width: p.r * 2,
        height: p.r * 2,
        left: `${p.left}%`,
        top: `${p.top}%`,
        background: `rgba(255,255,255,${p.o})`,
        animationDuration: `${p.dur}s`,
        animationDelay: `${p.delay}s`,
      }}
    />
  ))
}

export default function StarWishes({ unlocked }) {
  const skyRef = useRef(null)
  const [dims, setDims] = useState({ w: 900, h: 460 })
  const [wishes, setWishes] = useState({}) // { starIdx: { text, time } }
  const [hintHidden, setHintHidden] = useState(false)
  const [modalIdx, setModalIdx] = useState(null)
  const [draft, setDraft] = useState('')
  const [bursts, setBursts] = useState([])
  const [toast, setToast] = useState(null)
  const [filterZodiac, setFilterZodiac] = useState('all')

  useEffect(() => {
    function measure() {
      if (skyRef.current) setDims({ w: skyRef.current.offsetWidth || 900, h: skyRef.current.offsetHeight || 460 })
    }
    measure()
    window.addEventListener('resize', measure)
    const ro = new ResizeObserver(measure)
    if (skyRef.current) ro.observe(skyRef.current)
    return () => {
      window.removeEventListener('resize', measure)
      ro.disconnect()
    }
  }, [])

  // Real-time synchronization with Supabase
  useEffect(() => {
    let active = true

    function applyRows(rows) {
      const next = {}
      rows.forEach((row) => {
        next[row.star_index] = { text: row.text, time: row.created_at ? new Date(row.created_at) : new Date() }
      })
      if (active) setWishes(next)
    }

    supabase
      .from('star_wishes')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          console.error('Gagal memuat wishes:', error)
          return
        }
        applyRows(data || [])
      })

    const channel = supabase
      .channel('star_wishes_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'star_wishes' }, () => {
        supabase
          .from('star_wishes')
          .select('*')
          .then(({ data, error }) => {
            if (error) {
              console.error('Gagal sinkronisasi wishes:', error)
              return
            }
            applyRows(data || [])
          })
      })
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [])

  const openModal = useCallback(
    (idx) => {
      setDraft(wishes[idx]?.text || '')
      setModalIdx(idx)
      if (!hintHidden) setHintHidden(true)
    },
    [wishes, hintHidden]
  )

  function closeModal() {
    setModalIdx(null)
  }

  async function saveWish() {
    const text = draft.trim()
    if (!text || modalIdx === null) return

    const { error } = await supabase
      .from('star_wishes')
      .upsert({ star_index: modalIdx, text }, { onConflict: 'star_index' })

    if (error) console.error('Gagal menyimpan ke Supabase:', error)

    const star = ALL_STARS[modalIdx]
    const burstId = Date.now()
    setBursts((b) => [...b, { id: burstId, x: star.x, y: star.y }])
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== burstId)), 800)

    setToast('Harapanmu telah bersinar di langit bintang ✦')
    setTimeout(() => setToast(null), 2500)

    closeModal()
  }

  const count = Object.keys(wishes).length
  const wishList = Object.entries(wishes)
    .map(([idx, w]) => ({ idx: Number(idx), ...w, star: ALL_STARS[idx] }))
    .filter((w) => {
      if (filterZodiac === 'libra') return w.idx < LIBRA_COUNT
      if (filterZodiac === 'aquarius') return w.idx >= LIBRA_COUNT
      return true
    })
    .sort((a, b) => (b.time?.getTime?.() || 0) - (a.time?.getTime?.() || 0))

  return (
    <section id="starwishes" className="section-full">
      {!unlocked ? (
        <div className="sw-locked-screen">
          <div className="sw-locked-icon floating-element">
            <span className="material-symbols-outlined filled" style={{ fontSize: '2.25rem' }}>
              lock
            </span>
          </div>
          <h3 className="sw-locked-title">Langit Ini Masih Tertutup</h3>
          <p className="sw-locked-text">
            Tekan tombol <strong>"Star Wishes"</strong> di pojok kanan atas untuk membuka langit harapan kita.
          </p>
        </div>
      ) : (
        <div className="sw-wrap">
          <div className="sw-eyebrow reveal section-eyebrow">
            <span className="material-symbols-outlined filled" style={{ fontSize: '0.875rem' }}>
              auto_awesome
            </span>
            <span>Langit Harapan Kita</span>
          </div>
          <h2 className="sw-title reveal reveal-delay-1">Star Wishes</h2>
          <p className="sw-desc reveal reveal-delay-2">
            Klik bintang untuk menuliskan wish atau promise. Setiap harapan yang tersimpan akan bersinar abadi di antara rasi bintang cinta kita.
          </p>

          <div className="sw-sky reveal reveal-delay-2" ref={skyRef}>
            <BgStars />
            <ConstellationLines width={dims.w} height={dims.h} />

            {ALL_STARS.map((s, idx) => {
              const has = !!wishes[idx]
              const isLibra = idx < LIBRA_COUNT
              const dimColor = isLibra ? 'rgba(184,195,255,0.32)' : 'rgba(227,184,234,0.32)'
              const strokeColor = isLibra ? 'rgba(184,195,255,0.6)' : 'rgba(227,184,234,0.6)'
              const brightColor = 'rgba(255,250,220,0.95)'
              const brightStroke = 'rgba(227,184,234,1)'
              const nameColor = isLibra ? 'rgba(184,195,255,1)' : 'rgba(227,184,234,1)'

              return (
                <div
                  key={idx}
                  className={`sw-star ${has ? 'sw-star-active' : ''}`}
                  style={{ left: `${s.x}%`, top: `${s.y}%` }}
                  onClick={() => openModal(idx)}
                >
                  <StarIcon
                    size={has ? s.size + 6 : s.size}
                    fill={has ? brightColor : dimColor}
                    stroke={has ? brightStroke : strokeColor}
                    glowing={has}
                  />
                  <div className="sw-star-name" style={{ color: nameColor }}>
                    {s.name}
                  </div>
                  <div className="sw-star-label">
                    {has ? (
                      wishes[idx].text.length > 55 ? wishes[idx].text.slice(0, 52) + '...' : wishes[idx].text
                    ) : (
                      '✦ Klik untuk menulis wish'
                    )}
                  </div>
                </div>
              )
            })}

            {bursts.map((b) => (
              <div
                key={b.id}
                className="sw-burst"
                style={{
                  position: 'absolute',
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  transform: 'translate(-50%,-50%)',
                  pointerEvents: 'none',
                  zIndex: 4,
                  animation: 'burst-pop 0.8s ease-out forwards',
                }}
              >
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(227,184,234,0.9)" strokeWidth="1.5" />
                  <circle cx="40" cy="40" r="22" fill="rgba(194,194,242,0.3)" />
                </svg>
              </div>
            ))}

            <div className={`sw-sky-hint ${hintHidden ? 'hidden' : ''}`}>
              <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>
                touch_app
              </span>
              <span>Klik bintang mana saja untuk menyematkan wish ✦</span>
            </div>
          </div>

          <div className="sw-counter-row reveal reveal-delay-3">
            <div className="sw-counter">
              <span className="material-symbols-outlined filled" style={{ fontSize: '1rem', color: 'var(--secondary)' }}>
                star
              </span>
              <strong>{count}</strong> wishes tersimpan di langit kita
            </div>

            {/* Filter Tabs */}
            <div className="sw-filters">
              <button
                className={`sw-filter-btn ${filterZodiac === 'all' ? 'active' : ''}`}
                onClick={() => setFilterZodiac('all')}
              >
                Semua ({count})
              </button>
              <button
                className={`sw-filter-btn ${filterZodiac === 'libra' ? 'active' : ''}`}
                onClick={() => setFilterZodiac('libra')}
              >
                ♎ Libra
              </button>
              <button
                className={`sw-filter-btn ${filterZodiac === 'aquarius' ? 'active' : ''}`}
                onClick={() => setFilterZodiac('aquarius')}
              >
                ♒ Aquarius
              </button>
            </div>
          </div>

          {wishList.length === 0 ? (
            <div className="sw-empty-state">Belum ada wish di kategori ini. Klik bintang untuk menulis wish pertamamu ✨</div>
          ) : (
            <div className="sw-wishes-list">
              {wishList.map((w) => (
                <div
                  className="sw-wish-card"
                  key={w.idx}
                  onClick={() => openModal(w.idx)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="sw-wish-icon">
                    <svg width="16" height="16" viewBox="0 0 14 14">
                      <polygon
                        points="7,1 8.5,5.3 13,5.3 9.5,8 10.8,12.5 7,10 3.2,12.5 4.5,8 1,5.3 5.5,5.3"
                        fill="rgba(227,184,234,0.9)"
                      />
                    </svg>
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="sw-wish-star-title">
                      <span>{w.star?.name || `Bintang #${w.idx + 1}`}</span>
                      <span className="sw-wish-zodiac-tag">{w.idx < LIBRA_COUNT ? 'Libra ♎' : 'Aquarius ♒'}</span>
                    </div>
                    <div className="sw-wish-text">{w.text}</div>
                    <div className="sw-wish-time">
                      {w.time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })},{' '}
                      {w.time.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Write / Edit Wish Modal */}
      <div
        className={`sw-modal-backdrop ${modalIdx !== null ? 'open' : ''}`}
        onClick={(e) => e.target === e.currentTarget && closeModal()}
      >
        <div className="sw-modal">
          <button className="sw-modal-close" onClick={closeModal}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>
              close
            </span>
          </button>
          <div className="sw-modal-star">
            <svg width="48" height="48" viewBox="0 0 48 48">
              <polygon
                points="24,4 29,18 44,18 32,27 37,42 24,33 11,42 16,27 4,18 19,18"
                fill="none"
                stroke="#c2c2f2"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <polygon
                points="24,4 29,18 44,18 32,27 37,42 24,33 11,42 16,27 4,18 19,18"
                fill="rgba(194,194,242,0.15)"
              />
            </svg>
          </div>
          <h3>
            {modalIdx !== null && ALL_STARS[modalIdx]
              ? `Bintang ${ALL_STARS[modalIdx].name}`
              : 'Tuliskan Wish-mu'}
          </h3>
          <p>Sebuah harapan, janji, atau kata-kata dari hatimu. Bintang ini akan menyimpannya selamanya.</p>

          {/* Quick Presets */}
          <div className="sw-presets-row">
            <span className="sw-presets-label">Inspirasi Harapan:</span>
            <div className="sw-presets-chips">
              {WISH_PRESETS.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  className="sw-preset-chip"
                  onClick={() => setDraft(preset)}
                >
                  {preset.slice(0, 32)}...
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Tulis wish atau promise-mu di sini..."
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') saveWish()
            }}
          />
          <div className="sw-modal-actions">
            <button className="sw-btn-cancel" onClick={closeModal}>
              Batal
            </button>
            <button className="sw-btn-save" disabled={!draft.trim()} onClick={saveWish}>
              <span className="material-symbols-outlined filled" style={{ fontSize: '0.9375rem' }}>
                star
              </span>
              Simpan ke Bintang
            </button>
          </div>
        </div>
      </div>

      {toast && <div className="sw-toast show">{toast}</div>}
    </section>
  )
}
