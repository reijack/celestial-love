import { useEffect, useRef } from 'react'

const RIBBONS = [
  { color: '110,255,190', amp: 34, freq: 0.0055, speed: 0.00022, yBase: 0.30, width: 70 },
  { color: '150,140,255', amp: 46, freq: 0.0038, speed: 0.00016, yBase: 0.44, width: 95 },
  { color: '120,220,255', amp: 28, freq: 0.0075, speed: 0.00028, yBase: 0.16, width: 55 },
]

const AURORA_BANDS = [
  { start: 0, intensity: 0.85 }, { start: 4, intensity: 0.5 }, { start: 6, intensity: 0.18 },
  { start: 9, intensity: 0.04 }, { start: 16, intensity: 0.10 }, { start: 18, intensity: 0.35 },
  { start: 20, intensity: 0.7 }, { start: 22, intensity: 0.85 },
]

function getAuroraIntensity() {
  const hour = new Date().getHours() + new Date().getMinutes()/60
  let chosen = AURORA_BANDS[0]
  for (const b of AURORA_BANDS) if (hour >= b.start) chosen = b
  return chosen.intensity
}

export default function AuroraCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let raf
    function resize() { canvas.width = window.innerWidth; canvas.height = Math.max(280, window.innerHeight*0.5) }
    window.addEventListener('resize', resize); resize()

    function drawRibbon(r, t, intensity) {
      const w = canvas.width, baseY = canvas.height * r.yBase
      ctx.beginPath()
      for (let xp = 0; xp <= w; xp += 10) {
        const y = baseY + Math.sin(xp*r.freq + t*r.speed)*r.amp + Math.sin(xp*r.freq*2.4 + t*r.speed*1.6)*r.amp*0.35
        xp === 0 ? ctx.moveTo(xp,y) : ctx.lineTo(xp,y)
      }
      ctx.strokeStyle = `rgba(${r.color},${0.55*intensity})`
      ctx.lineWidth = r.width; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
      ctx.shadowColor = `rgba(${r.color},${0.9*intensity})`; ctx.shadowBlur = 45
      ctx.stroke()
    }

    function loop(t) {
      ctx.clearRect(0,0,canvas.width,canvas.height)
      const intensity = getAuroraIntensity()
      if (intensity > 0.015) {
        ctx.globalCompositeOperation = 'lighter'
        RIBBONS.forEach(r => drawRibbon(r, t||0, intensity))
        ctx.globalCompositeOperation = 'source-over'
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas id="auroraCanvas" ref={ref} />
}
