import { useState, useEffect } from 'react'
import { spawnHearts } from '../hooks'
import { playWishSavedSound, playHeartPop, playStarChime } from '../sound'

const DEFAULT_COUPONS = [
  {
    id: 'coupon-1',
    icon: 'spa',
    title: 'Pijat Bahu & Usap Kepala',
    desc: 'Berlaku untuk 30 menit pijat bahu relaksasi atau usapan lembut di kepala hingga kamu tertidur lelap.',
    tag: 'Relaksasi ✦',
    badgeColor: 'rgba(227, 184, 234, 0.25)',
    accentColor: 'var(--secondary)',
  },
  {
    id: 'coupon-2',
    icon: 'favorite',
    title: 'Pelukan Hangat Tanpa Batas',
    desc: 'Kapan pun kamu merasa lelah atau butuh sandaran, tukarkan tiket ini untuk pelukan erat tanpa batas waktu.',
    tag: 'Kehangatan ✦',
    badgeColor: 'rgba(255, 184, 205, 0.25)',
    accentColor: 'var(--accent-warm)',
  },
  {
    id: 'coupon-3',
    icon: 'icecream',
    title: 'Traktir Makanan / Es Krim Favorit',
    desc: 'Bebas pilih makanan, dessert, minuman manis, atau es krim apa pun yang lagi kamu idam-idamkan!',
    tag: 'Wisata Kuliner ✦',
    badgeColor: 'rgba(255, 216, 158, 0.25)',
    accentColor: 'var(--accent-gold)',
  },
  {
    id: 'coupon-4',
    icon: 'movie',
    title: 'Movie Night Maraton',
    desc: 'Nonton film pilihanmu dari awal sampai akhir tanpa interupsi, lengkap dengan camilan kesukaanmu.',
    tag: 'Quality Time ✦',
    badgeColor: 'rgba(184, 195, 255, 0.25)',
    accentColor: 'var(--tertiary)',
  },
  {
    id: 'coupon-5',
    icon: 'sentiment_satisfied',
    title: 'Bebas Ngambek Seharian',
    desc: 'Tiket sakti penyelamat! Aku akan selalu mengalah, mendengarkan, dan memanjakanmu seharian penuh tanpa protes.',
    tag: 'Paling Spesial ✦',
    badgeColor: 'rgba(194, 194, 242, 0.25)',
    accentColor: 'var(--primary)',
  },
  {
    id: 'coupon-6',
    icon: 'nights_stay',
    title: 'Deep Talk Tengah Malam',
    desc: 'Sesi obrolan dari hati ke hati di heningnya malam, membicarakan mimpi, masa depan, dan hal-hal random kita.',
    tag: 'Bicara Hati ✦',
    badgeColor: 'rgba(227, 184, 234, 0.25)',
    accentColor: 'var(--secondary)',
  },
  {
    id: 'coupon-7',
    icon: 'auto_awesome',
    title: 'Wildcard: 1 Permintaan Bebas',
    desc: 'Maha Kupon! Minta apa saja yang kamu inginkan di dunia ini, dan aku berjanji akan berusaha mewujudkannya.',
    tag: 'Maha Kupon ✦',
    badgeColor: 'rgba(255, 215, 0, 0.3)',
    accentColor: '#ffd700',
  },
]

export default function LoveCoupons() {
  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem('celestial_love_coupons')
      if (saved) return JSON.parse(saved)
    } catch (_) {}
    return DEFAULT_COUPONS
  })

  const [claimedIds, setClaimedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('celestial_claimed_coupons')
      if (saved) return JSON.parse(saved)
    } catch (_) {}
    return {}
  })

  const [showAddModal, setShowAddModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newTag, setNewTag] = useState('')
  const [toastMessage, setToastMessage] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem('celestial_love_coupons', JSON.stringify(coupons))
    } catch (_) {}
  }, [coupons])

  useEffect(() => {
    try {
      localStorage.setItem('celestial_claimed_coupons', JSON.stringify(claimedIds))
    } catch (_) {}
  }, [claimedIds])

  function handleClaimCoupon(id, title, e) {
    if (claimedIds[id]) return

    const nowStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    setClaimedIds((prev) => ({
      ...prev,
      [id]: { claimedAt: nowStr },
    }))

    playWishSavedSound()
    spawnHearts(e.clientX, e.clientY)
    setToastMessage(`Kupon "${title}" berhasil diklaim! 🎟️✨`)
    setTimeout(() => setToastMessage(null), 3000)
  }

  function handleUnclaim(id, e) {
    e.stopPropagation()
    setClaimedIds((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    playHeartPop()
  }

  function handleAddCustomCoupon(e) {
    e.preventDefault()
    if (!newTitle.trim()) return

    const newCoupon = {
      id: `custom-${Date.now()}`,
      icon: 'stars',
      title: newTitle.trim(),
      desc: newDesc.trim() || 'Kupon cinta spesial yang dibuat khusus untuk semesta kita berdua.',
      tag: newTag.trim() ? `${newTag.trim()} ✦` : 'Permintaan Khusus ✦',
      badgeColor: 'rgba(227, 184, 234, 0.25)',
      accentColor: 'var(--secondary)',
    }

    setCoupons((prev) => [...prev, newCoupon])
    setNewTitle('')
    setNewDesc('')
    setNewTag('')
    setShowAddModal(false)
    playStarChime()
    spawnHearts(window.innerWidth / 2, window.innerHeight / 2)
    setToastMessage('Kupon cinta baru berhasil ditambahkan! ✦')
    setTimeout(() => setToastMessage(null), 3000)
  }

  const claimedCount = Object.keys(claimedIds).length
  const totalCount = coupons.length

  return (
    <section id="coupons" style={{ maxWidth: '1200px' }}>
      <div className="section-header">
        <div className="section-eyebrow reveal">
          <span className="material-symbols-outlined filled" style={{ fontSize: '0.875rem' }}>
            confirmation_number
          </span>
          <span>Tiket Janji Manis &amp; Kasih Sayang</span>
        </div>
        <h2 className="text-headline gradient-text-shimmer reveal reveal-delay-1">Love Coupons</h2>
        <p
          className="text-body-lg reveal reveal-delay-2"
          style={{ color: 'var(--on-surface-variant)', maxWidth: '38rem', margin: '0.75rem auto 0' }}
        >
          Kumpulan tiket cinta eksklusif yang bisa kamu klaim kapan pun saat kamu butuh kehangatan, perhatian, atau momen manis bersama.
        </p>

        {/* Counter & Action Bar */}
        <div
          className="reveal reveal-delay-2"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--outline)',
              padding: '0.5rem 1.1rem',
              borderRadius: '999px',
              fontSize: '0.84rem',
              color: 'var(--on-surface)',
            }}
          >
            <span className="material-symbols-outlined filled" style={{ fontSize: '1rem', color: 'var(--secondary)' }}>
              stars
            </span>
            <span>
              <strong>{claimedCount}</strong> dari <strong>{totalCount}</strong> kupon telah diklaim
            </span>
          </div>

          <button
            onClick={() => {
              setShowAddModal(true)
              playStarChime()
            }}
            className="btn-celestial-secondary"
            style={{ padding: '0.5rem 1.1rem', fontSize: '0.84rem' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
              add_circle
            </span>
            <span>Buat Kupon Baru</span>
          </button>
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="coupons-grid">
        {coupons.map((coupon, idx) => {
          const isClaimed = !!claimedIds[coupon.id]
          const delayClass = idx % 3 === 0 ? '' : idx % 3 === 1 ? 'reveal-delay-1' : 'reveal-delay-2'

          return (
            <div
              key={coupon.id}
              className={`coupon-card glass-panel reveal ${delayClass} ${isClaimed ? 'claimed' : ''}`}
              style={{ '--coupon-accent': coupon.accentColor }}
            >
              {/* Perforated Notch Circles */}
              <div className="coupon-notch coupon-notch-left" />
              <div className="coupon-notch coupon-notch-right" />

              {/* Holographic Shimmer Background */}
              <div className="coupon-holo-shimmer" />

              {/* Coupon Header */}
              <div className="coupon-header">
                <div className="coupon-tag-badge" style={{ background: coupon.badgeColor, color: coupon.accentColor }}>
                  <span>{coupon.tag}</span>
                </div>
                <div className="coupon-icon-box" style={{ color: coupon.accentColor }}>
                  <span className="material-symbols-outlined filled" style={{ fontSize: '1.25rem' }}>
                    {coupon.icon}
                  </span>
                </div>
              </div>

              {/* Coupon Body */}
              <div className="coupon-body">
                <h3 className="coupon-title">{coupon.title}</h3>
                <p className="coupon-desc">{coupon.desc}</p>
              </div>

              {/* Perforated Dashed Line Divider */}
              <div className="coupon-dashed-line" />

              {/* Coupon Footer & Claim Action */}
              <div className="coupon-footer">
                <div className="coupon-code">
                  <span>CELESTIAL-{coupon.id.toUpperCase().slice(-6)}</span>
                </div>

                {!isClaimed ? (
                  <button
                    className="coupon-claim-btn"
                    onClick={(e) => handleClaimCoupon(coupon.id, coupon.title, e)}
                    title="Klik untuk klaim kupon cinta ini"
                  >
                    <span className="material-symbols-outlined filled" style={{ fontSize: '0.95rem' }}>
                      confirmation_number
                    </span>
                    <span>Klaim Tiket</span>
                  </button>
                ) : (
                  <div className="coupon-claimed-info">
                    <span className="coupon-claimed-badge">
                      <span className="material-symbols-outlined filled" style={{ fontSize: '0.85rem' }}>
                        check_circle
                      </span>
                      <span>CLAIMED</span>
                    </span>
                    <button
                      className="coupon-unclaim-btn"
                      onClick={(e) => handleUnclaim(coupon.id, e)}
                      title="Batalkan klaim kupon"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>

              {/* Golden Stamp Overlay when Claimed */}
              {isClaimed && (
                <div className="coupon-stamp-seal">
                  <div className="coupon-stamp-circle">
                    <span className="stamp-star">✦</span>
                    <span className="stamp-text">CLAIMED</span>
                    <span className="stamp-date">{claimedIds[coupon.id]?.claimedAt || 'DIKLAIM'}</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add Custom Coupon Modal */}
      <div
        className={`sw-modal-backdrop ${showAddModal ? 'open' : ''}`}
        onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}
      >
        <div className="sw-modal" style={{ maxWidth: '30rem' }}>
          <button className="sw-modal-close" onClick={() => setShowAddModal(false)}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>
              close
            </span>
          </button>
          <div className="sw-modal-star">
            <span className="material-symbols-outlined filled heartbeat" style={{ fontSize: '2.2rem', color: 'var(--secondary)' }}>
              confirmation_number
            </span>
          </div>
          <h3 className="gradient-text">Buat Kupon Cinta Kustom</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginTop: '0.3rem' }}>
            Tuliskan janji atau hadiah manis yang ingin kamu berikan kepadanya ✦
          </p>

          <form onSubmit={handleAddCustomCoupon} style={{ marginTop: '1rem', textAlign: 'left' }}>
            <div style={{ marginBottom: '0.9rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--on-surface-variant)', marginBottom: '0.3rem', fontWeight: 600 }}>
                Judul Kupon
              </label>
              <input
                type="text"
                className="custom-coupon-input"
                placeholder="Contoh: Kencan Masak Bareng di Rumah"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                maxLength={45}
              />
            </div>

            <div style={{ marginBottom: '0.9rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--on-surface-variant)', marginBottom: '0.3rem', fontWeight: 600 }}>
                Kategori / Tag
              </label>
              <input
                type="text"
                className="custom-coupon-input"
                placeholder="Contoh: Romantis, Hadiah Manis, Petualangan"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                maxLength={20}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--on-surface-variant)', marginBottom: '0.3rem', fontWeight: 600 }}>
                Deskripsi / Ketentuan Kupon
              </label>
              <textarea
                className="sw-textarea"
                rows={3}
                placeholder="Jelaskan detail manis dari kupon ini..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                maxLength={140}
              />
            </div>

            <div className="sw-modal-actions">
              <button type="button" className="sw-btn-cancel" onClick={() => setShowAddModal(false)}>
                Batal
              </button>
              <button type="submit" className="sw-btn-save" disabled={!newTitle.trim()}>
                <span className="material-symbols-outlined filled" style={{ fontSize: '0.95rem' }}>
                  add
                </span>
                <span>Terbitkan Kupon</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Floating Toast */}
      {toastMessage && (
        <div className="sw-toast show" style={{ zIndex: 9999 }}>
          {toastMessage}
        </div>
      )}
    </section>
  )
}
