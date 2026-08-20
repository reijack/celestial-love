import { useEffect, useRef } from 'react'

const RIBBONS = [
  { color: '110,255,190', amp: 34, freq: 0.0055, speed: 0.00022, yBase: 0.30, width: 70, opacity: 0.55 },
  { color: '150,140,255', amp: 46, freq: 0.0038, speed: 0.00016, yBase: 0.44, width: 95, opacity: 0.50 },
  { color: '120,220,255', amp: 28, freq: 0.0075, speed: 0.00028, yBase: 0.16, width: 55, opacity: 0.45 },
  // New ribbons for more cosmic atmosphere
  { color: '227,184,234', amp: 38, freq: 0.0045, speed: 0.00020, yBase: 0.55, width: 80, opacity: 0.35 },
  { color: '255,200,160', amp: 22, freq: 0.0065, speed: 0.00032, yBase: 0.22, width: 45, opacity: 0.30 },
  { color: '184,195,255', amp: 50, freq: 0.0030, speed: 0.00014, yBase: 0.38, width: 100, opacity: 0.28 },
]

const AURORA_BANDS = [
  { start: 0, intensity: 0.85 }, { start: 4, intensity: 0.5 }, { start: 6, intensity: 0.18 },
  { start: 9, intensity: 0.04 }, { start: 16, intensity: 0.10 }, { start: 18, intensity: 0.35 },
  { start: 20, intensity: 0.7 }, { start: 22, intensity: 0.85 },
]

function getAuroraIntensity() {
  const hour = new Date().getHours() + new Date().getMinutes() / 60
  let chosen = AURORA_BANDS[0]
  for (const b of AURORA_BANDS) if (hour >= b.start) chosen = b
  return chosen.intensity
}

// Simple noise-like function for organic movement
function noise(x) {
  const s = Math.sin(x * 127.1) * 43758.5453123
  return s - Math.floor(s)
}

export default function AuroraCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let raf

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = Math.max(320, window.innerHeight * 0.55)
    }
    window.addEventListener('resize', resize)
    resize()

    function drawRibbon(r, t, intensity) {
      const w = canvas.width
      const baseY = canvas.height * r.yBase

      // Color shifting over time
      const hueShift = Math.sin(t * 0.00003) * 20

      ctx.beginPath()
      for (let xp = 0; xp <= w; xp += 6) {
        // More organic movement with layered sine waves
        const y =
          baseY +
          Math.sin(xp * r.freq + t * r.speed) * r.amp +
          Math.sin(xp * r.freq * 2.4 + t * r.speed * 1.6) * r.amp * 0.35 +
          Math.sin(xp * r.freq * 0.5 + t * r.speed * 0.7) * r.amp * 0.5 +
          noise(xp * 0.01 + t * 0.0001) * r.amp * 0.15
        xp === 0 ? ctx.moveTo(xp, y) : ctx.lineTo(xp, y)
      }

      const alpha = r.opacity * intensity
      ctx.strokeStyle = `rgba(${r.color},${alpha})`
      ctx.lineWidth = r.width
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.shadowColor = `rgba(${r.color},${Math.min(1, alpha * 1.8)})`
      ctx.shadowBlur = 50 + Math.sin(t * 0.0005) * 15
      ctx.stroke()
    }

    function loop(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const intensity = getAuroraIntensity()
      if (intensity > 0.015) {
        ctx.globalCompositeOperation = 'lighter'

        // Breathing brightness pulse
        const breathe = 0.85 + Math.sin(t * 0.0004) * 0.15

        RIBBONS.forEach((r) => drawRibbon(r, t || 0, intensity * breathe))
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
