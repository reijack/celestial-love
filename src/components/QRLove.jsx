import { useEffect, useRef, useState, useCallback } from 'react'
import QRCode from 'qrcode'
import { spawnHearts } from '../hooks'
import { playStarChime, playHeartPop } from '../sound'

export default function QRLove() {
  const [open, setOpen] = useState(false)
  const canvasRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''

  const draw = useCallback(async () => {
    if (!canvasRef.current) return
    setReady(false)

    // High-DPI 640x640 canvas for razor-sharp rendering on Retina screens & HD downloads
    const W = 640
    const H = 640
    const canvas = canvasRef.current
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, W, H)

    const cx = W / 2
    const cy = H / 2

    // 1. Draw Outer Card Background with Silk Cosmic Gradient
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

    // 2. Subtle Background Constellation Lines & Stars
    ctx.save()
    drawSparkleStar(ctx, 60, 60, 10, 'rgba(227,184,234,0.7)')
    drawSparkleStar(ctx, W - 60, 60, 10, 'rgba(194,194,242,0.7)')
    drawSparkleStar(ctx, 60, H - 60, 8, 'rgba(184,220,255,0.7)')
    drawSparkleStar(ctx, W - 60, H - 60, 8, 'rgba(227,184,234,0.7)')

    // Faint constellation dust
    const bgDots = [
      [110, 80], [W - 110, 90], [80, 200], [W - 80, 220],
      [90, H - 120], [W - 90, H - 130], [cx - 140, 50], [cx + 140, 50]
    ]
    bgDots.forEach(([x, y]) => {
      ctx.beginPath()
      ctx.arc(x, y, 1.8, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
      ctx.fill()
    })
    ctx.restore()

    // 3. Card Title Header
    ctx.save()
    ctx.textAlign = 'center'
    ctx.font = 'bold 20px "Playfair Display", Georgia, serif'
    ctx.fillStyle = '#f3dcf6'
    ctx.fillText('✦ CELESTIAL LOVE ✦', cx, 68)

    ctx.font = '12px "Plus Jakarta Sans", sans-serif'
    ctx.fillStyle = 'rgba(241, 238, 247, 0.65)'
    ctx.fillText('SCAN WITH YOUR PHONE CAMERA', cx, 92)
    ctx.restore()

    // 4. Inner Cream QR Platter (Shaped with soft luxury heart badge contour)
    const platterW = 400
    const platterH = 400
    const platterX = cx - platterW / 2
    const platterY = cy - platterH / 2 + 10

    ctx.save()
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)'
    ctx.shadowBlur = 30
    ctx.shadowOffsetY = 12
    roundRect(ctx, platterX, platterY, platterW, platterH, 32)
    ctx.fillStyle = '#f8f5fe'
    ctx.fill()

    // Inner platter subtle border
    ctx.lineWidth = 2
    ctx.strokeStyle = 'rgba(227, 184, 234, 0.4)'
    ctx.stroke()
    ctx.restore()

    // 5. Generate QR Code Matrix
    const targetUrl = url || 'https://example.com'
    const qr = QRCode.create(targetUrl, { errorCorrectionLevel: 'H' })
    const modCount = qr.modules.size

    const qrInnerSize = 320
    const cellSize = qrInnerSize / modCount
    const qrLeft = cx - qrInnerSize / 2
    const qrTop = platterY + (platterH - qrInnerSize) / 2

    const darkPrimary = '#201533'
    const darkSecondary = '#3d2258'

    // Helper to check if a cell is part of the 3 finder patterns
    function isFinderModule(r, c) {
      return (
        (r < 7 && c < 7) ||
        (r < 7 && c >= modCount - 7) ||
        (r >= modCount - 7 && c < 7)
      )
    }

    // Helper to check if a cell is in the 3x3 center pupil of a finder pattern
    function isFinderCenter(r, c) {
      return (
        (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
        (r >= 2 && r <= 4 && c >= modCount - 5 && c <= modCount - 3) ||
        (r >= modCount - 5 && r <= modCount - 3 && c >= 2 && c <= 4)
      )
    }

    // Draw regular QR modules as smooth rounded drops
    for (let r = 0; r < modCount; r++) {
      for (let c = 0; c < modCount; c++) {
        if (isFinderModule(r, c)) continue // Finder patterns drawn custom below

        // Reserve center area for glowing heart badge
        const centerOffset = Math.hypot(
          (c - modCount / 2 + 0.5) * cellSize,
          (r - modCount / 2 + 0.5) * cellSize
        )
        if (centerOffset < 34) continue

        if (qr.modules.get(r, c)) {
          const x = qrLeft + c * cellSize
          const y = qrTop + r * cellSize

          ctx.save()
          ctx.fillStyle = (r + c) % 2 === 0 ? darkPrimary : darkSecondary
          ctx.beginPath()
          ctx.arc(
            x + cellSize / 2,
            y + cellSize / 2,
            cellSize * 0.44,
            0,
            Math.PI * 2
          )
          ctx.fill()
          ctx.restore()
        }
      }
    }

    // 6. Draw Beautiful Custom Finder Patterns with Heart Center Pupils
    const finders = [
      { r: 0, c: 0 },
      { r: 0, c: modCount - 7 },
      { r: modCount - 7, c: 0 }
    ]

    finders.forEach(({ r, c }) => {
      const fx = qrLeft + c * cellSize
      const fy = qrTop + r * cellSize
      const fw = 7 * cellSize

      // Outer finder rounded box
      ctx.save()
      ctx.fillStyle = darkPrimary
      roundRect(ctx, fx + 1, fy + 1, fw - 2, fw - 2, cellSize * 1.8)
      ctx.fill()

      // Inner white cut
      ctx.fillStyle = '#f8f5fe'
      roundRect(ctx, fx + cellSize + 1, fy + cellSize + 1, fw - 2 * cellSize - 2, fw - 2 * cellSize - 2, cellSize * 1.2)
      ctx.fill()

      // Center Heart-Shaped Pupil
      const pupilCenter = fx + fw / 2
      const pupilCenterY = fy + fw / 2
      const pupilSize = 3 * cellSize * 0.82
      drawHeartShape(ctx, pupilCenter, pupilCenterY + 1, pupilSize, pupilSize)
      const pupilGrad = ctx.createLinearGradient(pupilCenter - 15, pupilCenterY - 15, pupilCenter + 15, pupilCenterY + 15)
      pupilGrad.addColorStop(0, '#b8446c')
      pupilGrad.addColorStop(1, '#682548')
      ctx.fillStyle = pupilGrad
      ctx.fill()
      ctx.restore()
    })

    // 7. Center Floating Heart Badge
    const badgeSize = 58
    const badgeY = qrTop + qrInnerSize / 2
    ctx.save()
    ctx.shadowColor = 'rgba(227, 184, 234, 0.7)'
    ctx.shadowBlur = 16
    drawHeartShape(ctx, cx, badgeY, badgeSize, badgeSize)
    ctx.fillStyle = '#f8f5fe'
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = '#e3b8ea'
    ctx.stroke()
    ctx.restore()

    // Inner heart gradient
    ctx.save()
    drawHeartShape(ctx, cx, badgeY, badgeSize - 12, badgeSize - 12)
    const badgeGrad = ctx.createLinearGradient(cx - 20, badgeY - 20, cx + 20, badgeY + 20)
    badgeGrad.addColorStop(0, '#e3b8ea')
    badgeGrad.addColorStop(0.5, '#c2c2f2')
    badgeGrad.addColorStop(1, '#b8c3ff')
    ctx.fillStyle = badgeGrad
    ctx.fill()

    // Gold Star inside center heart
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 15px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('✦', cx, badgeY + 2)
    ctx.restore()

    // 8. Bottom Keepsake Footer
    ctx.save()
    ctx.textAlign = 'center'
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif'
    ctx.fillStyle = '#f3dcf6'
    ctx.fillText('Our Love Story ✦ 26 Agustus 2025', cx, H - 76)

    ctx.font = '11px "Plus Jakarta Sans", sans-serif'
    ctx.fillStyle = 'rgba(241, 238, 247, 0.55)'
    ctx.fillText('Libra ♎ & Aquarius ♒ • Written in the Stars', cx, H - 56)
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
  const topY = cy - height * 0.45
  const bottomY = cy + height * 0.48
  const leftX = cx - width * 0.5
  const rightX = cx + width * 0.5
  const midTopY = cy - height * 0.16

  ctx.moveTo(cx, midTopY)
  // Left lobe
  ctx.bezierCurveTo(cx - width * 0.08, topY, leftX, topY, leftX, cy - height * 0.05)
  ctx.bezierCurveTo(leftX, cy + height * 0.22, cx - width * 0.18, cy + height * 0.35, cx, bottomY)
  // Right lobe
  ctx.bezierCurveTo(cx + width * 0.18, cy + height * 0.35, rightX, cy + height * 0.22, rightX, cy - height * 0.05)
  ctx.bezierCurveTo(rightX, topY, cx + width * 0.08, topY, cx, midTopY)
  ctx.closePath()
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

function drawSparkleStar(ctx, x, y, size, fill) {
  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = fill
  ctx.shadowColor = 'rgba(255, 255, 255, 0.85)'
  ctx.shadowBlur = 6
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
