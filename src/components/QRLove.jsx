import { useEffect, useRef, useState, useCallback } from 'react'
import QRCode from 'qrcode'
import { spawnHearts } from '../hooks'

export default function QRLove() {
  const [open, setOpen] = useState(false)
  const canvasRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''

  const draw = useCallback(async () => {
    if (!canvasRef.current) return
    setReady(false)

    const W = 360
    const H = 360
    const canvas = canvasRef.current
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, W, H)

    const cx = W / 2
    const cy = H / 2 - 4

    // 1. Draw Outer Heart Glow Card
    ctx.save()
    ctx.shadowColor = 'rgba(227, 184, 234, 0.45)'
    ctx.shadowBlur = 24
    drawSmoothHeart(ctx, cx, cy, 330, 310)
    const outerGrad = ctx.createLinearGradient(cx - 150, cy - 150, cx + 150, cy + 150)
    outerGrad.addColorStop(0, '#f9e2fb')
    outerGrad.addColorStop(0.5, '#e3b8ea')
    outerGrad.addColorStop(1, '#c2c2f2')
    ctx.fillStyle = outerGrad
    ctx.fill()
    ctx.restore()

    // 2. Draw Inner Cream Heart Base for QR
    ctx.save()
    drawSmoothHeart(ctx, cx, cy, 296, 276)
    ctx.fillStyle = '#f8f5fd'
    ctx.fill()
    ctx.lineWidth = 3
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.stroke()
    ctx.restore()

    // 3. Generate QR Code Matrix
    const targetUrl = url || 'https://example.com'
    const qr = QRCode.create(targetUrl, { errorCorrectionLevel: 'H' })
    const modCount = qr.modules.size

    const qrSize = 196
    const cellSize = qrSize / modCount
    const qrLeft = cx - qrSize / 2
    const qrTop = cy - qrSize / 2 + 10

    // Clip to heart area so the QR takes the shape of the heart
    ctx.save()
    drawSmoothHeart(ctx, cx, cy, 282, 262)
    ctx.clip()

    // Draw QR Modules as smooth rounded dots
    const darkColor = '#231834'
    const darkLighter = '#422858'

    for (let r = 0; r < modCount; r++) {
      for (let c = 0; c < modCount; c++) {
        if (qr.modules.get(r, c)) {
          const x = qrLeft + c * cellSize
          const y = qrTop + r * cellSize

          // Check if module is part of the 3 main finder patterns
          const isFinder =
            (r < 7 && c < 7) ||
            (r < 7 && c >= modCount - 7) ||
            (r >= modCount - 7 && c < 7)

          // Center heart badge area
          const centerDist = Math.hypot(
            (c - modCount / 2) * cellSize,
            (r - modCount / 2) * cellSize
          )
          if (centerDist < 20) continue // leave room for center heart badge

          ctx.fillStyle = isFinder ? darkColor : darkLighter

          if (isFinder) {
            // Rounded square for finder pattern modules
            roundRect(ctx, x + 0.3, y + 0.3, cellSize - 0.6, cellSize - 0.6, cellSize * 0.3)
            ctx.fill()
          } else {
            // Smooth circular dots for cute look
            ctx.beginPath()
            ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.46, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
    }
    ctx.restore()

    // 4. Center Glowing Heart Badge
    ctx.save()
    const badgeSize = 34
    const badgeY = cy + 10
    ctx.shadowColor = 'rgba(227, 184, 234, 0.8)'
    ctx.shadowBlur = 10
    drawSmoothHeart(ctx, cx, badgeY, badgeSize + 8, badgeSize + 8)
    ctx.fillStyle = '#f8f5fd'
    ctx.fill()
    ctx.lineWidth = 1.5
    ctx.strokeStyle = '#e3b8ea'
    ctx.stroke()
    ctx.restore()

    // Mini heart inside badge
    ctx.save()
    drawSmoothHeart(ctx, cx, badgeY, badgeSize - 6, badgeSize - 6)
    const badgeGrad = ctx.createLinearGradient(cx - 15, badgeY - 15, cx + 15, badgeY + 15)
    badgeGrad.addColorStop(0, '#e3b8ea')
    badgeGrad.addColorStop(1, '#c2c2f2')
    ctx.fillStyle = badgeGrad
    ctx.fill()

    // Star icon inside badge
    ctx.fillStyle = '#ffffff'
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('✦', cx, badgeY + 1)
    ctx.restore()

    // 5. Decorative Celestial Sparkles on the Heart Contour
    drawSparkleIcon(ctx, cx - 110, cy - 85, 9, '#ffffff')
    drawSparkleIcon(ctx, cx + 110, cy - 85, 9, '#ffffff')
    drawSparkleIcon(ctx, cx, cy - 132, 7, '#ffffff')
    drawSparkleIcon(ctx, cx, cy + 138, 6, '#ffffff')

    setReady(true)
  }, [url])

  useEffect(() => {
    if (open) draw()
  }, [open, draw])

  function download() {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = 'celestial-love-heart-qr.png'
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  function copyUrl(e) {
    if (url) {
      navigator.clipboard?.writeText(url)
      setCopied(true)
      spawnHearts(e.clientX, e.clientY)
      setTimeout(() => setCopied(false), 2200)
    }
  }

  return (
    <>
      <button
        className="qr-love-btn floating-element"
        title="Buka QR Love ✦"
        onClick={() => setOpen(true)}
      >
        <span className="material-symbols-outlined filled" style={{ color: 'var(--secondary)', fontSize: '1.6rem' }}>
          favorite
        </span>
      </button>

      <div
        className={`sw-modal-backdrop ${open ? 'open' : ''}`}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
      >
        <div className="sw-modal qr-love-modal">
          <button className="sw-modal-close" onClick={() => setOpen(false)}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>
              close
            </span>
          </button>

          <div className="sw-modal-star">
            <span
              className="material-symbols-outlined filled heartbeat"
              style={{ fontSize: '2.2rem', color: 'var(--error)' }}
            >
              favorite
            </span>
          </div>

          <h3 className="gradient-text">Heart-Shaped Love QR</h3>
          <p>Scan kode berbentuk hati ini dengan kamera ponsel untuk membuka semesta cinta kita kapan saja ✦</p>

          <div className="qr-love-canvas-wrap">
            <canvas
              ref={canvasRef}
              style={{
                opacity: ready ? 1 : 0,
                transition: 'opacity 0.3s',
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </div>

          <div className="sw-modal-actions" style={{ flexWrap: 'wrap', gap: '0.6rem' }}>
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
              <span>Unduh Heart QR</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// Smooth Parametric Bezier Heart Shape
function drawSmoothHeart(ctx, cx, cy, width, height) {
  ctx.beginPath()
  const topY = cy - height * 0.46
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

function drawSparkleIcon(ctx, x, y, size, fill) {
  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = fill
  ctx.shadowColor = 'rgba(255, 255, 255, 0.9)'
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
