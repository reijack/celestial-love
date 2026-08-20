import { useEffect, useRef } from 'react'

const RIBBONS = [
  { color: '110,255,200', amp: 30, freq: 0.0035, speed: 0.00014, yBase: 0.28, width: 60, opacity: 0.45 },
  { color: '160,140,255', amp: 40, freq: 0.0025, speed: 0.00010, yBase: 0.42, width: 75, opacity: 0.40 },
  { color: '120,225,255', amp: 24, freq: 0.0045, speed: 0.00018, yBase: 0.18, width: 45, opacity: 0.35 },
  { color: '235,180,245', amp: 34, freq: 0.0030, speed: 0.00012, yBase: 0.50, width: 65, opacity: 0.32 },
]

const AURORA_BANDS = [
  { start: 0, intensity: 0.88 },
  { start: 4, intensity: 0.55 },
  { start: 6, intensity: 0.22 },
  { start: 9, intensity: 0.08 },
  { start: 16, intensity: 0.15 },
  { start: 18, intensity: 0.40 },
  { start: 20, intensity: 0.75 },
  { start: 22, intensity: 0.90 },
]

function getAuroraIntensity() {
  const hour = new Date().getHours() + new Date().getMinutes() / 60
  let chosen = AURORA_BANDS[0]
  for (const b of AURORA_BANDS) if (hour >= b.start) chosen = b
  return chosen.intensity
}

export default function AuroraCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    let raf

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = window.innerWidth
      const h = Math.max(300, window.innerHeight * 0.52)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    window.addEventListener('resize', resize)
    resize()

    let currentIntensity = getAuroraIntensity()
    let targetIntensity = currentIntensity

    function drawAuroraRibbon(r, t, intensity) {
      const w = window.innerWidth
      const h = Math.max(300, window.innerHeight * 0.52)
      const baseY = h * r.yBase

      const step = 14
      const points = []
      for (let xp = 0; xp <= w + step; xp += step) {
        const y =
          baseY +
          Math.sin(xp * r.freq + t * r.speed) * r.amp +
          Math.sin(xp * r.freq * 2.2 + t * r.speed * 1.5 + 0.8) * r.amp * 0.35
        points.push({ x: xp, y })
      }

      if (points.length < 2) return

      const alpha = r.opacity * intensity

      // 1. Soft glowing curtain fill downwards
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }
      ctx.lineTo(w, baseY + r.amp * 2.2)
      ctx.lineTo(0, baseY + r.amp * 2.2)
      ctx.closePath()

      const curtainGrad = ctx.createLinearGradient(0, baseY - r.amp, 0, baseY + r.amp * 2.2)
      curtainGrad.addColorStop(0, `rgba(${r.color},0)`)
      curtainGrad.addColorStop(0.3, `rgba(${r.color},${alpha * 0.22})`)
      curtainGrad.addColorStop(0.7, `rgba(${r.color},${alpha * 0.06})`)
      curtainGrad.addColorStop(1, `rgba(${r.color},0)`)
      ctx.fillStyle = curtainGrad
      ctx.fill()

      // 2. Outer soft glow stroke
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }
      ctx.strokeStyle = `rgba(${r.color},${alpha * 0.4})`
      ctx.lineWidth = r.width * 1.6
      ctx.lineCap = 'round'
      ctx.stroke()

      // 3. Core sharp ribbon
      ctx.strokeStyle = `rgba(${r.color},${alpha * 0.9})`
      ctx.lineWidth = r.width * 0.7
      ctx.stroke()
    }

    function loop(now) {
      const w = window.innerWidth
      const h = Math.max(300, window.innerHeight * 0.52)
      const t = now || performance.now()
      ctx.clearRect(0, 0, w, h)

      targetIntensity = getAuroraIntensity()
      currentIntensity += (targetIntensity - currentIntensity) * 0.003

      if (currentIntensity > 0.02) {
        ctx.globalCompositeOperation = 'lighter'
        const breathe = 0.9 + Math.sin(t * 0.0003) * 0.1

        for (let i = 0; i < RIBBONS.length; i++) {
          drawAuroraRibbon(RIBBONS[i], t, currentIntensity * breathe)
        }
        ctx.globalCompositeOperation = 'source-over'
      }
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas id="auroraCanvas" ref={ref} />
}
