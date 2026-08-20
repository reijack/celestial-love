import { useState, useEffect } from 'react'
import { spawnHearts } from '../hooks'
import { playWishSavedSound, playHeartPop, playStarChime } from '../sound'

export default function BucketList() {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('celestial_bucket_list')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          const isDummy = parsed.some((i) => i.id === 'bucket-1' && i.title === 'Stargazing Berdua di Puncak Bukit')
          if (isDummy) {
            localStorage.removeItem('celestial_bucket_list')
            return []
          }
          return parsed
        }
      }
    } catch (_) {}
    return []
  })

  const [showAddModal, setShowAddModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newCategory, setNewCategory] = useState('Petualangan')
  const [filterCat, setFilterCat] = useState('all')
  const [toastMessage, setToastMessage] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem('celestial_bucket_list', JSON.stringify(items))
    } catch (_) {}
  }, [items])

  function toggleComplete(id, title, e) {
    e.stopPropagation()
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.completed
          if (nextState) {
            playWishSavedSound()
            spawnHearts(e.clientX, e.clientY)
            setToastMessage(`Selamat! Impian "${title}" telah tercapai ✨`)
            setTimeout(() => setToastMessage(null), 3000)
          } else {
            playHeartPop()
          }
          return {
            ...item,
            completed: nextState,
            completedDate: nextState ? 'Tercapai ✦' : undefined,
          }
        }
        return item
      })
    )
  }

  function handleDeleteItem(id, title, e) {
    e.stopPropagation()
    setItems((prev) => prev.filter((item) => item.id !== id))
    playHeartPop()
    setToastMessage(`Impian "${title}" telah dihapus.`)
    setTimeout(() => setToastMessage(null), 2500)
  }

  function handleAddItem(e) {
    e.preventDefault()
    if (!newTitle.trim()) return

    const newItem = {
      id: `bucket-${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      desc: newDesc.trim() || 'Petualangan dan mimpi indah yang ingin kita wujudkan bersama di masa depan.',
      completed: false,
      icon:
        newCategory === 'Petualangan'
          ? 'explore'
          : newCategory === 'Kencan Manis'
          ? 'favorite'
          : newCategory === 'Perjalanan'
          ? 'flight'
          : newCategory === 'Hiburan'
          ? 'music_note'
          : 'auto_awesome',
    }

    setItems((prev) => [newItem, ...prev])
    setNewTitle('')
    setNewDesc('')
    setShowAddModal(false)
    playStarChime()
    spawnHearts(window.innerWidth / 2, window.innerHeight / 2)
    setToastMessage('Impian baru berhasil ditambahkan ke Bucket List! ✦')
    setTimeout(() => setToastMessage(null), 3000)
  }

  const completedCount = items.filter((i) => i.completed).length
  const totalCount = items.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const filteredItems = items.filter((item) => {
    if (filterCat === 'completed') return item.completed
    if (filterCat === 'pending') return !item.completed
    return true
  })

  return (
    <section id="bucketlist" style={{ maxWidth: '1200px' }}>
      <div className="section-header">
        <div className="section-eyebrow reveal">
          <span className="material-symbols-outlined filled" style={{ fontSize: '0.875rem' }}>
            checklist
          </span>
          <span>Daftar Impian &amp; Petualangan Masa Depan</span>
        </div>
        <h2 className="text-headline gradient-text-shimmer reveal reveal-delay-1">Our Celestial Bucket List</h2>
        <p
          className="text-body-lg reveal reveal-delay-2"
          style={{ color: 'var(--on-surface-variant)', maxWidth: '38rem', margin: '0.75rem auto 0' }}
        >
          Tuliskan setiap mimpi kecil dan petualangan besar yang ingin kita jelajahi berdua di bawah langit semesta yang sama.
        </p>

        {/* Progress Tracker Card (shown when items exist) */}
        {totalCount > 0 && (
          <div className="bucket-progress-card glass-panel reveal reveal-delay-2">
            <div className="bucket-progress-header">
              <div className="bucket-progress-info">
                <span className="material-symbols-outlined filled heartbeat" style={{ color: 'var(--error)', fontSize: '1.25rem' }}>
                  favorite
                </span>
                <div>
                  <div className="bucket-progress-title">Perjalanan Mimpi Bersama</div>
                  <div className="bucket-progress-sub">
                    <strong>{completedCount}</strong> dari <strong>{totalCount}</strong> impian telah terwujud ({progressPercent}%)
                  </div>
                </div>
              </div>

              <button
                className="btn-celestial"
                onClick={() => {
                  setShowAddModal(true)
                  playStarChime()
                }}
                style={{ padding: '0.5rem 1.1rem', fontSize: '0.84rem' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
                  add_task
                </span>
                <span>Tambah Impian</span>
              </button>
            </div>

            <div className="bucket-progress-bar-track">
              <div className="bucket-progress-bar-fill" style={{ width: `${progressPercent}%` }}>
                <div className="bucket-progress-bar-sparkle" />
              </div>
            </div>
          </div>
        )}

        {/* Filter Chips (shown when items exist) */}
        {totalCount > 0 && (
          <div className="bucket-filter-row reveal reveal-delay-3">
            <button
              className={`bucket-filter-btn ${filterCat === 'all' ? 'active' : ''}`}
              onClick={() => {
                setFilterCat('all')
                playHeartPop()
              }}
            >
              Semua ({items.length})
            </button>
            <button
              className={`bucket-filter-btn ${filterCat === 'completed' ? 'active' : ''}`}
              onClick={() => {
                setFilterCat('completed')
                playHeartPop()
              }}
            >
              ✨ Telah Terwujud ({completedCount})
            </button>
            <button
              className={`bucket-filter-btn ${filterCat === 'pending' ? 'active' : ''}`}
              onClick={() => {
                setFilterCat('pending')
                playHeartPop()
              }}
            >
              🌙 Menanti Dijelajahi ({totalCount - completedCount})
            </button>
          </div>
        )}
      </div>

      {/* Empty State Banner (Clean & Inviting) */}
      {totalCount === 0 ? (
        <div
          className="glass-panel reveal reveal-delay-2"
          style={{
            marginTop: '2.5rem',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            borderRadius: '1.75rem',
            border: '1px dashed rgba(227, 184, 234, 0.35)',
            maxWidth: '36rem',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <div
            style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              background: 'rgba(227, 184, 234, 0.12)',
              border: '1px solid rgba(227, 184, 234, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
            className="floating-element"
          >
            <span className="material-symbols-outlined filled twinkle" style={{ fontSize: '2rem', color: 'var(--secondary)' }}>
              auto_awesome
            </span>
          </div>

          <h3 className="gradient-text" style={{ fontSize: '1.35rem', margin: '0 0 0.5rem' }}>
            Bucket List Masih Kosong
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--on-surface-variant)', lineHeight: 1.6, margin: '0 0 1.75rem' }}>
            Belum ada impian yang dicatat. Mulai isi daftar petualangan, kencan manis, dan cita-cita yang ingin kita wujudkan bersama!
          </p>

          <button
            className="btn-celestial"
            onClick={() => {
              setShowAddModal(true)
              playStarChime()
            }}
            style={{ padding: '0.75rem 1.6rem', fontSize: '0.9rem' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>
              add_task
            </span>
            <span>Tambah Impian Pertama Kita ✦</span>
          </button>
        </div>
      ) : (
        /* Bucket List Items Grid */
        <div className="bucket-grid">
          {filteredItems.map((item, idx) => {
            const delayClass = idx % 3 === 0 ? '' : idx % 3 === 1 ? 'reveal-delay-1' : 'reveal-delay-2'

            return (
              <div
                key={item.id}
                className={`bucket-card glass-panel reveal ${delayClass} ${item.completed ? 'completed' : ''}`}
                onClick={(e) => toggleComplete(item.id, item.title, e)}
                title="Klik kartu untuk menandai impian ini selesai"
              >
                <div className="bucket-card-top">
                  <span className="bucket-category-tag">{item.category}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button
                      className="bucket-delete-btn"
                      onClick={(e) => handleDeleteItem(item.id, item.title, e)}
                      title="Hapus impian ini"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--on-surface-variant)',
                        cursor: 'pointer',
                        opacity: 0.6,
                        display: 'flex',
                        padding: '0.2rem',
                        transition: 'all 0.2s',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>
                        delete_outline
                      </span>
                    </button>

                    <button
                      className={`bucket-check-btn ${item.completed ? 'checked' : ''}`}
                      onClick={(e) => toggleComplete(item.id, item.title, e)}
                      aria-label="Tandai selesai"
                    >
                      <span className="material-symbols-outlined filled">
                        {item.completed ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="bucket-card-body">
                  <div className="bucket-icon-box">
                    <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                      {item.icon || 'auto_awesome'}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 className="bucket-card-title">{item.title}</h3>
                    <p className="bucket-card-desc">{item.desc}</p>
                  </div>
                </div>

                {item.completed && (
                  <div className="bucket-completed-badge">
                    <span className="material-symbols-outlined filled" style={{ fontSize: '0.85rem' }}>
                      stars
                    </span>
                    <span>Mimpi Terwujud ✦</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Add New Dream Modal */}
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
              add_task
            </span>
          </div>
          <h3 className="gradient-text">Tambah Impian Bersama</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginTop: '0.3rem' }}>
            Tuliskan petualangan atau cita-cita yang ingin kita wujudkan berdua ✦
          </p>

          <form onSubmit={handleAddItem} style={{ marginTop: '1rem', textAlign: 'left' }}>
            <div style={{ marginBottom: '0.9rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--on-surface-variant)', marginBottom: '0.3rem', fontWeight: 600 }}>
                Kategori Impian
              </label>
              <select
                className="custom-coupon-input"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                style={{ background: 'var(--surface-high)', color: 'var(--on-surface)' }}
              >
                <option value="Petualangan">Petualangan</option>
                <option value="Kencan Manis">Kencan Manis</option>
                <option value="Perjalanan">Perjalanan &amp; Roadtrip</option>
                <option value="Hiburan">Hiburan &amp; Konser</option>
                <option value="Masa Depan">Masa Depan Bersama</option>
              </select>
            </div>

            <div style={{ marginBottom: '0.9rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--on-surface-variant)', marginBottom: '0.3rem', fontWeight: 600 }}>
                Nama Impian
              </label>
              <input
                type="text"
                className="custom-coupon-input"
                placeholder="Contoh: Liburan ke Luar Kota Berdua"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                maxLength={50}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--on-surface-variant)', marginBottom: '0.3rem', fontWeight: 600 }}>
                Deskripsi / Harapan
              </label>
              <textarea
                className="sw-textarea"
                rows={3}
                placeholder="Ceritakan gambaran momen indah tersebut..."
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
                <span>Simpan ke Bucket List</span>
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
