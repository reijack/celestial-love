import { useEffect, useRef } from 'react'

// Satu canvas gabungan untuk semua efek bintang: starfield, meteor,
// pola hati, dan kucing rasi bintang berjalan. Digabung jadi satu
// rAF loop supaya jauh lebih ringan dibanding banyak canvas terpisah.
export default function SkyCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    let stars = []
    let meteors = []
    let heartStars = []
    const N = 150

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      buildHeartStars()
    }

    function buildHeartStars() {
      heartStars = []
      const count = window.innerWidth < 760 ? 7 : 12
      for (let i = 0; i < count; i++) {
        heartStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.85 + canvas.height * 0.05,
          scale: 6 + Math.random() * 7,
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 0.7,
        })
      }
    }

    for (let i = 0; i < N; i++) {
      stars.push({
        x: Math.random(), y: Math.random(), r: Math.random() * 1.5,
        o: Math.random(), sp: Math.random() * 0.05,
      })
    }

    function drawHeart(cx, cy, scale, alpha) {
      ctx.save()
      ctx.translate(cx, cy)
      ctx.scale(scale / 10, scale / 10)
      ctx.beginPath()
      ctx.moveTo(0, 3)
      ctx.bezierCurveTo(0, 1, -2, -3, -6, -3)
      ctx.bezierCurveTo(-11, -3, -11, 3.5, -11, 3.5)
      ctx.bezierCurveTo(-11, 7, -7, 10.5, 0, 15)
      ctx.bezierCurveTo(7, 10.5, 11, 7, 11, 3.5)
      ctx.bezierCurveTo(11, 3.5, 11, -3, 6, -3)
      ctx.bezierCurveTo(2, -3, 0, 1, 0, 3)
      ctx.closePath()
      ctx.fillStyle = `rgba(227,184,234,${alpha * 0.85})`
      ctx.shadowColor = 'rgba(227,184,234,0.9)'
      ctx.shadowBlur = 10 * (scale / 10)
      ctx.fill()
      ctx.restore()
    }

    function spawnMeteor() {
      const fromTop = Math.random() < 0.5
      const startX = fromTop ? Math.random() * canvas.width * 0.8 : Math.random() * canvas.width * 0.3
      const startY = fromTop ? -20 : Math.random() * canvas.height * 0.3
      const angle = (35 + Math.random() * 15) * Math.PI / 180
      const speed = 9 + Math.random() * 7
      meteors.push({
        x: startX, y: startY, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        len: 120 + Math.random() * 100, life: 1, decay: 0.012 + Math.random() * 0.01,
      })
    }
    let meteorTimeout
    function scheduleMeteor() {
      meteorTimeout = setTimeout(() => { spawnMeteor(); scheduleMeteor() }, 3500 + Math.random() * 5500)
    }
    scheduleMeteor()

    function drawMeteors() {
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i]
        m.x += m.vx; m.y += m.vy; m.life -= m.decay
        if (m.life <= 0 || m.x > canvas.width + 150 || m.y > canvas.height + 150) { meteors.splice(i, 1); continue }
        const hyp = Math.hypot(m.vx, m.vy)
        const tailX = m.x - m.vx * (m.len / hyp)
        const tailY = m.y - m.vy * (m.len / hyp)
        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY)
        grad.addColorStop(0, `rgba(255,255,255,${0.95 * m.life})`)
        grad.addColorStop(0.4, `rgba(194,194,242,${0.5 * m.life})`)
        grad.addColorStop(1, 'rgba(194,194,242,0)')
        ctx.strokeStyle = grad; ctx.lineWidth = 2; ctx.lineCap = 'round'
        ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(tailX, tailY); ctx.stroke()
        ctx.beginPath(); ctx.fillStyle = `rgba(255,255,255,${m.life})`
        ctx.arc(m.x, m.y, 1.6, 0, Math.PI * 2); ctx.fill()
      }
    }

    // ==== Kucing rasi bintang berjalan ====
    const catLocalW = 220, catLocalH = 230
    const CAT_BLOBS = [
      [62,56,34],[86,92,28],[108,138,46],[112,180,44],[78,158,15],
      [76,190,13],[74,212,15],[150,214,15],[158,178,15],[184,162,12],
      [196,132,9],[186,104,7],[166,92,5],
    ]
    const CAT_EARS = [[[34,26],[47,-12],[64,20]],[[60,16],[81,-14],[97,22]]]
    let catPath = null, catStarPoints = []

    function buildCatPath() {
      const p = new Path2D()
      CAT_BLOBS.forEach(b => { p.moveTo(b[0]+b[2], b[1]); p.arc(b[0], b[1], b[2], 0, Math.PI*2) })
      CAT_EARS.forEach(tri => {
        p.moveTo(tri[0][0], tri[0][1]); p.lineTo(tri[1][0], tri[1][1]); p.lineTo(tri[2][0], tri[2][1]); p.closePath()
      })
      return p
    }
    function buildCatStars() {
      catPath = buildCatPath()
      catStarPoints = []
      let tries = 0
      while (catStarPoints.length < 50 && tries < 5000) {
        tries++
        const px = Math.random() * catLocalW, py = Math.random() * catLocalH * 0.96 + 2
        if (ctx.isPointInPath(catPath, px, py)) {
          catStarPoints.push({ x: px, y: py, r: 0.9 + Math.random()*1.5, phase: Math.random()*Math.PI*2, speed: 0.6+Math.random()*1.1, sparkle: false })
        }
      }
      const sparkleIdx = []
      while (sparkleIdx.length < 6 && catStarPoints.length > 0) {
        const ri = Math.floor(Math.random() * catStarPoints.length)
        if (!sparkleIdx.includes(ri)) sparkleIdx.push(ri)
      }
      sparkleIdx.forEach(i => { catStarPoints[i].sparkle = true; catStarPoints[i].r = 2.2 + Math.random()*1.4 })
    }
    buildCatStars()

    let catWalk = null
    let catTimeout
    function spawnCat() {
      const dir = Math.random() < 0.5 ? 1 : -1
      catWalk = { start: performance.now(), duration: 24000 + Math.random()*6000, y: canvas.height*(0.14+Math.random()*0.3), scale: canvas.width/900, dir }
    }
    function scheduleCat() {
      catTimeout = setTimeout(() => { spawnCat(); scheduleCat() }, 24000 + Math.random()*18000)
    }
    scheduleCat()
    const firstCatTimeout = setTimeout(spawnCat, 4000)

    function drawSparkleStar(cx, cy, r, fill) {
      ctx.save(); ctx.translate(cx, cy)
      ctx.beginPath()
      for (let i = 0; i < 4; i++) {
        const ang = Math.PI/2*i
        ctx.moveTo(0,0)
        ctx.quadraticCurveTo(Math.cos(ang+0.4)*r*0.35, Math.sin(ang+0.4)*r*0.35, Math.cos(ang)*r, Math.sin(ang)*r)
        ctx.quadraticCurveTo(Math.cos(ang-0.4)*r*0.35, Math.sin(ang-0.4)*r*0.35, 0, 0)
      }
      ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.restore()
    }

    function drawCat(now) {
      if (!catWalk) return
      const t = (now - catWalk.start) / catWalk.duration
      if (t >= 1) { catWalk = null; return }
      const catW = catLocalW * catWalk.scale
      const travel = canvas.width + catW * 2
      const px = catWalk.dir === 1 ? (-catW + t*travel) : (canvas.width + catW - t*travel)
      const bob = Math.sin(t*Math.PI*3) * 5 * catWalk.scale
      let alpha = t < 0.1 ? t/0.1 : (t > 0.88 ? (1-t)/0.12 : 1)
      alpha *= 0.92

      ctx.save()
      ctx.translate(px, catWalk.y + bob)
      ctx.scale(catWalk.dir === 1 ? catWalk.scale : -catWalk.scale, catWalk.scale)

      ctx.save()
      ctx.shadowColor = `rgba(184,195,255,${alpha*0.5})`
      ctx.shadowBlur = 16
      ctx.fillStyle = `rgba(16,15,22,${alpha*0.94})`
      ctx.fill(catPath, 'nonzero')
      ctx.restore()

      catStarPoints.forEach(p => {
        const tw = 0.5 + 0.5*Math.sin(now/1000*p.speed + p.phase)
        const pr = p.r * (0.7 + 0.5*tw)
        if (p.sparkle) {
          ctx.shadowColor = `rgba(255,255,255,${alpha*0.9})`; ctx.shadowBlur = 6
          drawSparkleStar(p.x, p.y, pr*1.8, `rgba(255,255,255,${alpha*(0.55+0.45*tw)})`)
          ctx.shadowBlur = 0
        } else {
          ctx.beginPath()
          ctx.fillStyle = `rgba(255,255,255,${alpha*(0.35+0.5*tw)})`
          ctx.arc(p.x, p.y, pr, 0, Math.PI*2); ctx.fill()
        }
      })

      ctx.shadowColor = `rgba(184,255,240,${alpha*0.9})`; ctx.shadowBlur = 6
      ctx.beginPath(); ctx.fillStyle = `rgba(214,255,247,${alpha})`
      ctx.arc(46, 44, 2.6, 0, Math.PI*2); ctx.fill()
      ctx.shadowBlur = 0
      ctx.restore()
    }

    function loop(now) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < N; i++) {
        const p = stars[i]
        p.o += (Math.random()-0.5)*0.05
        if (p.o < 0) p.o = 0; if (p.o > 1) p.o = 1
        const y = (p.y * canvas.height - (now||0)*p.sp*0.02) % canvas.height
        ctx.beginPath()
        ctx.arc(p.x*canvas.width, y < 0 ? y+canvas.height : y, p.r, 0, Math.PI*2)
        ctx.fillStyle = `rgba(255,255,255,${p.o*0.5})`
        ctx.fill()
      }
      drawMeteors()
      heartStars.forEach(hs => {
        const tw = 0.55 + 0.45*Math.sin((now||0)/1000*hs.speed + hs.phase)
        drawHeart(hs.x, hs.y, hs.scale*(0.85+0.25*tw), tw)
      })
      drawCat(now || performance.now())
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('resize', resize)
    resize()
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(meteorTimeout)
      clearTimeout(catTimeout)
      clearTimeout(firstCatTimeout)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas id="starsCanvas" ref={canvasRef} className="bg-canvas-layer" />
}
