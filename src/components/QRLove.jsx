import { useEffect, useRef, useState, useCallback } from 'react'
import QRCode from 'qrcode'

export default function QRLove() {
  const [open, setOpen] = useState(false)
  const canvasRef = useRef(null)
  const [ready, setReady] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''

  const draw = useCallback(async () => {
    if (!canvasRef.current) return
    setReady(false)
    const size = 260
    const off = document.createElement('canvas')
    off.width = size
    off.height = size
    // QR module dengan warna ungu-pink lembut biar nyatu sama tema, background transparan-gelap
    await QRCode.toCanvas(off, url || 'https://example.com', {
      width: size,
      margin: 1,
      color: { dark: '#2a1f33', light: '#f1eef7' },
      errorCorrectionLevel: 'H',
    })

    const ctx = canvasRef.current.getContext('2d')
    const W = 320
    canvasRef.current.width = W
    canvasRef.current.height = W

    // Kartu bulat lembut di belakang
    ctx.clearRect(0, 0, W, W)
    const grad = ctx.createLinearGradient(0, 0, W, W)
    grad.addColorStop(0, '#e3b8ea')
    grad.addColorStop(1, '#c2c2f2')
    ctx.save()
    roundRect(ctx, 8, 8, W - 16, W - 16, 28)
    ctx.fillStyle = grad
    ctx.fill()
    ctx.restore()

    // Panel putih untuk QR
    const pad = 26
    ctx.save()
    roundRect(ctx, pad, pad, W - pad * 2, W - pad * 2, 20)
    ctx.fillStyle = '#f1eef7'
    ctx.fill()
    ctx.restore()

    // Gambar QR di tengah panel
    const qrSize = W - pad * 2 - 24
    ctx.drawImage(off, (W - qrSize) / 2, (W - qrSize) / 2, qrSize, qrSize)

    // Heart badge kecil di tengah QR (dengan finder-pattern aman karena errorCorrectionLevel H)
    const cx = W / 2, cy = W / 2, hs = 15
    ctx.save()
    ctx.beginPath()
    roundRect(ctx, cx - hs - 4, cy - hs - 4, hs * 2 + 8, hs * 2 + 8, 10)
    ctx.fillStyle = '#f1eef7'
    ctx.fill()
    drawHeart(ctx, cx, cy, hs, '#e3b8ea')
    ctx.restore()

    setReady(true)
  }, [url])

  useEffect(() => { if (open) draw() }, [open, draw])

  function download() {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = 'celestial-love-qr.png'
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  return (
    <>
      <button
        className="qr-love-btn"
        title="QR Code"
        onClick={() => setOpen(true)}
      >
        <span className="material-symbols-outlined">qr_code_2</span>
      </button>

      <div className={`sw-modal-backdrop ${open ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
        <div className="sw-modal qr-love-modal">
          <button className="sw-modal-close" onClick={() => setOpen(false)}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>close</span>
          </button>
          <div className="sw-modal-star">
            <span className="material-symbols-outlined filled" style={{ fontSize: '1.75rem', color: 'var(--secondary)' }}>favorite</span>
          </div>
          <h3>Scan With Love</h3>
          <p>Arahkan kamera ke kode ini untuk membuka kembali langit cerita kita, kapan saja.</p>
          <div className="qr-love-canvas-wrap">
            <canvas ref={canvasRef} style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.3s' }} />
          </div>
          <div className="sw-modal-actions">
            <button className="sw-btn-cancel" onClick={() => setOpen(false)}>Tutup</button>
            <button className="sw-btn-save" onClick={download} disabled={!ready}>
              <span className="material-symbols-outlined filled" style={{ fontSize: '0.9375rem' }}>download</span>
              Simpan Gambar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function drawHeart(ctx, cx, cy, size, color) {
  ctx.save()
  ctx.translate(cx, cy - size * 0.15)
  ctx.scale(size / 10, size / 10)
  ctx.beginPath()
  ctx.moveTo(0, 3)
  ctx.bezierCurveTo(0, 1, -2, -3, -6, -3)
  ctx.bezierCurveTo(-11, -3, -11, 3.5, -11, 3.5)
  ctx.bezierCurveTo(-11, 7, -7, 10.5, 0, 15)
  ctx.bezierCurveTo(7, 10.5, 11, 7, 11, 3.5)
  ctx.bezierCurveTo(11, 3.5, 11, -3, 6, -3)
  ctx.bezierCurveTo(2, -3, 0, 1, 0, 3)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
  ctx.restore()
}
