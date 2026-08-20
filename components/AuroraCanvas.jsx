import { useEffect, useRef } from 'react'

const RIBBONS = [
  { color: '110,255,200', amp: 34, freq: 0.0048, speed: 0.00016, yBase: 0.28, width: 75, opacity: 0.48, blur: 50 },
  { color: '160,140,255', amp: 44, freq: 0.0032, speed: 0.00012, yBase: 0.42, width: 95, opacity: 0.42, blur: 55 },
  { color: '120,225,255', amp: 26, freq: 0.0065, speed: 0.00022, yBase: 0.18, width: 55, opacity: 0.38, blur: 45 },
  { color: '235,180,245', amp: 38, freq: 0.0038, speed: 0.00015, yBase: 0.52, width: 85, opacity: 0.35, blur: 60 },
  { color: '255,195,170', amp: 22, freq: 0.0055, speed: 0.00025, yBase: 0.24, width: 48, opacity: 0.26, blur: 40 },
  { color: '184,195,255', amp: 50, freq: 0.0026, speed: 0.00010, yBase: 0.36, width: 110, opacity: 0.28, blur: 65 },
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

function noise(x) {
  const ix = Math.floor(x)
  const fx = x - ix
  const t = fx * fx * (3 - 2 * fx)
  const a = Math.sin(ix * 127.1) * 43758.5453123
  const b = Math.sin((ix + 1) * 127.1) * 43758.5453123
  return (a - Math.floor(a)) * (1 - t) + (b - Math.floor(b)) * t
}

export default function AuroraCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    let raf

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = Math.max(340, window.innerHeight * 0.58)
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
      const h = Math.max(340, window.innerHeight * 0.58)
      const baseY = h * r.yBase

      // Generate smooth curve points
      const step = 5
      const points = []
      for (let xp = 0; xp <= w + step; xp += step) {
        const y =
          baseY +
          Math.sin(xp * r.freq + t * r.speed) * r.amp +
          Math.sin(xp * r.freq * 2.1 + t * r.speed * 1.35 + 0.8) * r.amp * 0.32 +
          Math.sin(xp * r.freq * 0.45 + t * r.speed * 0.55 + 1.6) * r.amp * 0.42 +
          noise(xp * 0.007 + t * 0.00007) * r.amp * 0.15
        points.push({ x: xp, y })
      }

      if (points.length < 2) return

      const alpha = r.opacity * intensity

      // 1. Draw glowing vertical light curtain downwards
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }
      ctx.lineTo(w, baseY + r.amp * 2.2)
      ctx.lineTo(0, baseY + r.amp * 2.2)
      ctx.closePath()

      const curtainGrad = ctx.createLinearGradient(0, baseY - r.amp, 0, baseY + r.amp * 2.5)
      curtainGrad.addColorStop(0, `rgba(${r.color},0)`)
      curtainGrad.addColorStop(0.35, `rgba(${r.color},${alpha * 0.25})`)
      curtainGrad.addColorStop(0.7, `rgba(${r.color},${alpha * 0.08})`)
      curtainGrad.addColorStop(1, `rgba(${r.color},0)`)
      ctx.fillStyle = curtainGrad
      ctx.fill()

      // 2. Draw sharp ribbon spine
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }

      ctx.strokeStyle = `rgba(${r.color},${alpha})`
      ctx.lineWidth = r.width
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      const shadowPulse = 0.85 + 0.15 * Math.sin(t * 0.00028 + r.yBase * 8)
      ctx.shadowColor = `rgba(${r.color},${Math.min(1, alpha * 1.5 * shadowPulse)})`
      ctx.shadowBlur = r.blur + Math.sin(t * 0.00035) * 10
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    function loop(t) {
      const w = window.innerWidth
      const h = Math.max(340, window.innerHeight * 0.58)
      ctx.clearRect(0, 0, w, h)

      targetIntensity = getAuroraIntensity()
      currentIntensity += (targetIntensity - currentIntensity) * 0.003

      if (currentIntensity > 0.01) {
        ctx.globalCompositeOperation = 'lighter'

        const breathe1 = 0.88 + Math.sin(t * 0.00028) * 0.12
        const breathe2 = 0.92 + Math.sin(t * 0.00018 + 1.8) * 0.08

        RIBBONS.forEach((r, i) => {
          const breathe = i % 2 === 0 ? breathe1 : breathe2
          drawAuroraRibbon(r, t || 0, currentIntensity * breathe)
        })

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
