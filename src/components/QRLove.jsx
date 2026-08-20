import { useEffect, useRef, useState, useCallback } from 'react'
import QRCode from 'qrcode'
import { spawnHearts } from '../hooks'
import { playStarChime, playHeartPop } from '../sound'

const DEFAULT_URL = 'https://celestial-love.vercel.app/'

export default function QRLove() {
  const [open, setOpen] = useState(false)
  const canvasRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [copied, setCopied] = useState(false)

  // Get active URL or default to the live site
  const getActiveUrl = () => {
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return window.location.href
    }
    return DEFAULT_URL
  }

  const url = getActiveUrl()

  const draw = useCallback(async () => {
    if (!canvasRef.current) return
    setReady(false)

    // High-DPI 640x640 canvas for razor-sharp scanning & HD downloads
    const W = 640
    const H = 640
    const canvas = canvasRef.current
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, W, H)

    const cx = W / 2
    const cy = H / 2

    // 1. Outer Card Background with Silk Cosmic Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, W, H)
    bgGrad.addColorStop(0, '#1c172a')
    bgGrad.addColorStop(0.5, '#291b3b')
    bgGrad.addColorStop(1, '#171424')
    roundRect(ctx, 16, 16, W - 32, H - 32, 40)
    ctx.fillStyle = bgGrad
    ctx.fill()

    // Outer card border
    ctx.lineWidth = 2
    const strokeGrad = ctx.createLinearGradient(0, 0, W, H)
    strokeGrad.addColorStop(0, 'rgba(227, 184, 234, 0.65)')
    strokeGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)')
    strokeGrad.addColorStop(1, 'rgba(194, 194, 242, 0.65)')
    ctx.strokeStyle = strokeGrad
    ctx.stroke()

    // 2. Decorative Celestial Stars
    ctx.save()
    drawSparkleStar(ctx, 60, 60, 10, 'rgba(227,184,234,0.75)')
    drawSparkleStar(ctx, W - 60, 60, 10, 'rgba(194,194,242,0.75)')
    drawSparkleStar(ctx, 60, H - 60, 8, 'rgba(184,220,255,0.75)')
    drawSparkleStar(ctx, W - 60, H - 60, 8, 'rgba(227,184,234,0.75)')
    ctx.restore()

    // 3. Card Title Header
    ctx.save()
    ctx.textAlign = 'center'
    ctx.font = 'bold 20px "Playfair Display", Georgia, serif'
    ctx.fillStyle = '#f3dcf6'
    ctx.fillText('✦ CELESTIAL LOVE ✦', cx, 66)

    ctx.font = '12px "Plus Jakarta Sans", sans-serif'
    ctx.fillStyle = 'rgba(241, 238, 247, 0.7)'
    ctx.fillText('SCAN WITH YOUR PHONE CAMERA', cx, 90)
    ctx.restore()

    // 4. White High-Contrast QR Platter (Essential for 100% optical readability)
    const platterW = 400
    const platterH = 400
    const platterX = cx - platterW / 2
    const platterY = cy - platterH / 2 + 10

    ctx.save()
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)'
    ctx.shadowBlur = 24
    ctx.shadowOffsetY = 10
    roundRect(ctx, platterX, platterY, platterW, platterH, 28)
    ctx.fillStyle = '#ffffff'
    ctx.fill()

    // Inner platter delicate border
    ctx.lineWidth = 2
    ctx.strokeStyle = 'rgba(227, 184, 234, 0.3)'
    ctx.stroke()
    ctx.restore()

    // 5. Generate QR Code Matrix with Error Correction Level H (30% redundancy)
    const targetUrl = url || DEFAULT_URL
    const qr = QRCode.create(targetUrl, {
      errorCorrectionLevel: 'H',
    })
    const modCount = qr.modules.size

    const qrInnerSize = 320
    const cellSize = qrInnerSize / modCount
    const qrLeft = cx - qrInnerSize / 2
    const qrTop = platterY + (platterH - qrInnerSize) / 2

    const darkColor = '#120d1c' // Ultra high-contrast deep celestial black

    // Check if cell is in standard Finder Pattern area
    function isFinderModule(r, c) {
      return (
        (r < 7 && c < 7) ||
        (r < 7 && c >= modCount - 7) ||
        (r >= modCount - 7 && c < 7)
      )
    }

    // Draw standard high-readability QR modules (connected sharp cells with micro rounded corners)
    ctx.fillStyle = darkColor
    for (let r = 0; r < modCount; r++) {
      for (let c = 0; c < modCount; c++) {
        if (isFinderModule(r, c)) continue // Draw finders accurately below

        // Reserve modest center area for heart logo badge
        const centerDistX = Math.abs(c - (modCount - 1) / 2)
        const centerDistY = Math.abs(r - (modCount - 1) / 2)
        if (centerDistX <= 2.2 && centerDistY <= 2.2) continue

        if (qr.modules.get(r, c)) {
          const x = qrLeft + c * cellSize
          const y = qrTop + r * cellSize
          // Draw solid cell with subtle rounding for aesthetic without breaking optical recognition
          roundRect(ctx, x, y, cellSize, cellSize, cellSize * 0.2)
          ctx.fill()
        }
      }
    }

    // 6. Draw 100% Standards-Compliant Optical Finder Patterns (3 Corners)
    const finders = [
      { r: 0, c: 0 },
      { r: 0, c: modCount - 7 },
      { r: modCount - 7, c: 0 }
    ]

    finders.forEach(({ r, c }) => {
      const fx = qrLeft + c * cellSize
      const fy = qrTop + r * cellSize
      const fw = 7 * cellSize

      // Outer 7x7 dark box
      ctx.save()
      ctx.fillStyle = darkColor
      roundRect(ctx, fx, fy, fw, fw, cellSize * 1.2)
      ctx.fill()

      // Inner 5x5 white space
      ctx.fillStyle = '#ffffff'
      roundRect(ctx, fx + cellSize, fy + cellSize, fw - 2 * cellSize, fw - 2 * cellSize, cellSize * 0.8)
      ctx.fill()

      // Center 3x3 solid dark pupil (Standard 1:1:3:1:1 ratio for instantaneous camera recognition)
      ctx.fillStyle = darkColor
      roundRect(ctx, fx + 2 * cellSize, fy + 2 * cellSize, 3 * cellSize, 3 * cellSize, cellSize * 0.6)
      ctx.fill()
      ctx.restore()
    })

    // 7. Center Romantic Heart Emblem Badge
    const badgeSize = 46
    const badgeY = qrTop + qrInnerSize / 2
    ctx.save()
    // Badge white boundary padding
    ctx.beginPath()
    ctx.arc(cx, badgeY, badgeSize / 2 + 3, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.fill()

    // Badge circle background with lilac gradient
    ctx.beginPath()
    ctx.arc(cx, badgeY, badgeSize / 2, 0, Math.PI * 2)
    const badgeGrad = ctx.createLinearGradient(cx - 20, badgeY - 20, cx + 20, badgeY + 20)
    badgeGrad.addColorStop(0, '#e3b8ea')
    badgeGrad.addColorStop(0.5, '#c2c2f2')
    badgeGrad.addColorStop(1, '#b8c3ff')
    ctx.fillStyle = badgeGrad
    ctx.fill()
    ctx.lineWidth = 1.5
    ctx.strokeStyle = '#ffffff'
    ctx.stroke()

    // Center cute heart icon
    drawHeartShape(ctx, cx, badgeY, 22, 22)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    ctx.restore()

    // 8. Bottom Keepsake Footer
    ctx.save()
    ctx.textAlign = 'center'
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif'
    ctx.fillStyle = '#f3dcf6'
    ctx.fillText('Our Love Story', cx, H - 74)

    ctx.font = '11px "Plus Jakarta Sans", sans-serif'
    ctx.fillStyle = 'rgba(241, 238, 247, 0.6)'
    ctx.fillText('Libra ♎ & Aquarius ♒ • celestial-love.vercel.app', cx, H - 54)
    ctx.restore()

    setReady(true)
  }, [url])

  useEffect(() => {
    if (open) {
      draw()
      playStarChime()
    }
  }, [open, draw])

  function download() {
    if (!canvasRef.current) return
    playHeartPop()
    const link = document.createElement('a')
    link.download = 'celestial-love-keepsake-qr.png'
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  function copyUrl(e) {
    if (url) {
      navigator.clipboard?.writeText(url)
      setCopied(true)
      playHeartPop()
      spawnHearts(e.clientX, e.clientY)
      setTimeout(() => setCopied(false), 2200)
    }
  }

  return (
    <>
      <button
        className="qr-love-btn floating-element"
        title="Buka QR Keepsake ✦"
        onClick={() => setOpen(true)}
      >
        <span className="material-symbols-outlined filled" style={{ color: 'var(--secondary)', fontSize: '1.6rem' }}>
          qr_code_2
        </span>
      </button>

      <div
        className={`sw-modal-backdrop ${open ? 'open' : ''}`}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
      >
        <div className="sw-modal qr-love-modal" style={{ maxWidth: '32rem' }}>
          <button className="sw-modal-close" onClick={() => setOpen(false)}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>
              close
            </span>
          </button>

          <div className="sw-modal-star">
            <span
              className="material-symbols-outlined filled heartbeat"
              style={{ fontSize: '2.2rem', color: 'var(--secondary)' }}
            >
              auto_awesome
            </span>
          </div>

          <h3 className="gradient-text">Celestial Keepsake QR</h3>
          <p>Scan kode QR romantis ini dengan kamera ponsel untuk membuka semesta kisah cinta kita kapan pun ✦</p>

          <div className="qr-love-canvas-wrap">
            <canvas
              ref={canvasRef}
              style={{
                opacity: ready ? 1 : 0,
                transition: 'opacity 0.3s',
                width: '300px',
                height: '300px',
                borderRadius: '1.5rem',
                boxShadow: '0 16px 40px -10px rgba(0,0,0,0.65)',
              }}
            />
          </div>

          <div style={{ textAlign: 'center', marginBottom: '1.2rem', fontSize: '0.82rem', color: 'var(--secondary)' }}>
            <span>🔗 {url}</span>
          </div>

          <div className="sw-modal-actions" style={{ flexWrap: 'wrap', gap: '0.65rem' }}>
            <button className="sw-btn-cancel" onClick={copyUrl}>
              <span className="material-symbols-outlined" style={{ fontSize: '0.95rem' }}>
                {copied ? 'check' : 'link'}
              </span>
              <span>{copied ? 'Link Tersalin ✦' : 'Salin Tautan'}</span>
            </button>
            <button className="sw-btn-save" onClick={download} disabled={!ready}>
              <span className="material-symbols-outlined filled" style={{ fontSize: '0.95rem' }}>
                download
              </span>
              <span>Unduh Keepsake HD (PNG)</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// Geometric Smooth Heart Shape
function drawHeartShape(ctx, cx, cy, width, height) {
  ctx.beginPath()
  const topY = cy - height * 0.42
  const bottomY = cy + height * 0.45
  const leftX = cx - width * 0.5
  const rightX = cx + width * 0.5
  const midTopY = cy - height * 0.14

  ctx.moveTo(cx, midTopY)
  // Left lobe
  ctx.bezierCurveTo(cx - width * 0.08, topY, leftX, topY, leftX, cy - height * 0.05)
  ctx.bezierCurveTo(leftX, cy + height * 0.2, cx - width * 0.18, cy + height * 0.32, cx, bottomY)
  // Right lobe
  ctx.bezierCurveTo(cx + width * 0.18, cy + height * 0.32, rightX, cy + height * 0.2, rightX, cy - height * 0.05)
  ctx.bezierCurveTo(rightX, topY, cx + width * 0.08, topY, cx, midTopY)
  ctx.closePath()
}

function roundRect(ctx, x, y, w, h, r = 0) {
  if (r <= 0) {
    ctx.rect(x, y, w, h)
    return
  }
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function drawSparkleStar(ctx, x, y, size, fill) {
  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = fill
  ctx.beginPath()
  for (let i = 0; i < 4; i++) {
    const ang = (Math.PI / 2) * i
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(
      Math.cos(ang + 0.45) * size * 0.35,
      Math.sin(ang + 0.45) * size * 0.35,
      Math.cos(ang) * size,
      Math.sin(ang) * size
    )
    ctx.quadraticCurveTo(
      Math.cos(ang - 0.45) * size * 0.35,
      Math.sin(ang - 0.45) * size * 0.35,
      0,
      0
    )
  }
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}
