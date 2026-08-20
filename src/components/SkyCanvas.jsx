import { useEffect, useRef } from 'react'

export default function SkyCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    let raf

    let stars = []
    let constellationLinks = []
    let meteors = []
    let ripples = []
    let heartStars = []
    let nebulaClouds = []
    let floatingHeartParticles = []

    // Smooth mouse lerp
    let mouseX = 0, mouseY = 0
    let targetMouseX = 0, targetMouseY = 0
    let mouseRawX = -1000, mouseRawY = -1000
    let targetRawX = -1000, targetRawY = -1000

    function resize() {
      const isMobile = window.innerWidth < 768
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildStars()
      buildHeartStars()
      buildNebulaClouds()
    }

    function buildStars() {
      stars = []
      const isMobile = window.innerWidth < 768
      const N = isMobile ? 60 : 180
      const starColors = [
        '255,255,255',
        '255,250,240',
        '230,210,255',
        '210,225,255',
        '255,215,235',
        '190,230,255',
        '255,235,190',
      ]

      for (let i = 0; i < N; i++) {
        stars.push({
          x: Math.random(),
          y: Math.random(),
          r: Math.random() * 1.6 + 0.4,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          depth: 0.2 + Math.random() * 0.8,
          twinkleSpeed: 0.0015 + Math.random() * 0.003,
          twinklePhase: Math.random() * Math.PI * 2,
          sp: 0.004 + Math.random() * 0.012,
          isHero: Math.random() < 0.12,
        })
      }

      // Pre-calculate constellation pairs once to avoid O(N^2) calculations every frame
      constellationLinks = []
      const MAX_DIST_SQ = 0.08 * 0.08 // in normalized coords
      for (let i = 0; i < stars.length; i += 2) {
        if (stars[i].depth < 0.4) continue
        for (let j = i + 1; j < Math.min(i + (isMobile ? 4 : 8), stars.length); j++) {
          const dx = stars[i].x - stars[j].x
          const dy = stars[i].y - stars[j].y
          const distSq = dx * dx + dy * dy
          if (distSq < MAX_DIST_SQ) {
            constellationLinks.push({
              i1: i,
              i2: j,
              maxAlpha: (1 - Math.sqrt(distSq) / 0.08) * (isMobile ? 0.12 : 0.16),
            })
          }
        }
      }
    }

    function buildHeartStars() {
      heartStars = []
      const isMobile = window.innerWidth < 768
      const count = isMobile ? 3 : 9
      for (let i = 0; i < count; i++) {
        heartStars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.08,
          scale: 4.5 + Math.random() * 6,
          phase: Math.random() * Math.PI * 2,
          speed: 0.001 + Math.random() * 0.002,
          color: i % 2 === 0 ? '227,184,234' : '255,184,205',
        })
      }
    }

    function buildNebulaClouds() {
      nebulaClouds = []
      const count = window.innerWidth < 760 ? 3 : 5
      const colors = [
        [227, 184, 234], // Soft Orchid
        [194, 194, 242], // Periwinkle
        [184, 195, 255], // Celestial Blue
        [255, 184, 205], // Cosmic Rose
        [184, 230, 255], // Starlight Cyan
      ]
      for (let i = 0; i < count; i++) {
        nebulaClouds.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight * 0.75,
          r: 160 + Math.random() * 220,
          color: colors[i % colors.length],
          phase: Math.random() * Math.PI * 2,
          speed: 0.0003 + Math.random() * 0.0005,
        })
      }
    }

    function drawSparkleCross(cx, cy, r, alpha, color) {
      ctx.save()
      ctx.translate(cx, cy)

      // Core
      ctx.beginPath()
      ctx.arc(0, 0, r * 1.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${color},${alpha * 0.9})`
      ctx.fill()

      // Cross rays
      ctx.strokeStyle = `rgba(${color},${alpha * 0.5})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(-r * 3.5, 0)
      ctx.lineTo(r * 3.5, 0)
      ctx.moveTo(0, -r * 3.5)
      ctx.lineTo(0, r * 3.5)
      ctx.stroke()

      ctx.restore()
    }

    function drawHeart(cx, cy, scale, alpha, color = '227,184,234') {
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

      ctx.fillStyle = `rgba(${color},${alpha * 0.6})`
      ctx.fill()
      ctx.restore()
    }

    function spawnMeteor() {
      const fromTop = Math.random() < 0.7
      const startX = fromTop ? Math.random() * window.innerWidth * 0.9 : Math.random() * window.innerWidth * 0.25
      const startY = fromTop ? -30 : Math.random() * window.innerHeight * 0.25
      const angle = (32 + Math.random() * 18) * (Math.PI / 180)
      const speed = 10 + Math.random() * 12
      const isGolden = Math.random() < 0.3
      const isViolet = Math.random() < 0.4

      const headColor = isGolden ? '255,235,170' : isViolet ? '230,185,255' : '185,225,255'
      const tailColor = isGolden ? '255,190,120' : isViolet ? '220,140,250' : '160,195,255'

      meteors.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: 140 + Math.random() * 140,
        life: 1,
        decay: 0.009 + Math.random() * 0.006,
        trailWidth: 1.6 + Math.random() * 1.2,
        headColor,
        tailColor,
      })
    }

    let meteorTimeout
    function scheduleMeteor() {
      meteorTimeout = setTimeout(() => {
        spawnMeteor()
        if (Math.random() < 0.25) {
          setTimeout(spawnMeteor, 200)
        }
        scheduleMeteor()
      }, 2600 + Math.random() * 4000)
    }
    scheduleMeteor()

    function drawMeteors() {
      const W = window.innerWidth, H = window.innerHeight
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i]
        m.x += m.vx
        m.y += m.vy
        m.life -= m.decay

        if (m.life <= 0 || m.x > W + 200 || m.y > H + 200) {
          meteors.splice(i, 1)
          continue
        }

        const hyp = Math.hypot(m.vx, m.vy)
        const tailX = m.x - m.vx * (m.len / hyp)
        const tailY = m.y - m.vy * (m.len / hyp)

        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY)
        grad.addColorStop(0, `rgba(255,255,255,${0.95 * m.life})`)
        grad.addColorStop(0.15, `rgba(${m.headColor},${0.85 * m.life})`)
        grad.addColorStop(0.45, `rgba(${m.tailColor},${0.55 * m.life})`)
        grad.addColorStop(1, 'rgba(194,194,242,0)')

        ctx.strokeStyle = grad
        ctx.lineWidth = m.trailWidth * m.life
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(m.x, m.y)
        ctx.lineTo(tailX, tailY)
        ctx.stroke()

        // Glowing Star Head
        ctx.beginPath()
        ctx.fillStyle = `rgba(255,255,255,${m.life})`
        ctx.arc(m.x, m.y, 2.2 * m.life, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Interactive Cosmic Ripple & Sparkles
    function handleCanvasClick(e) {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        r: 3,
        maxR: 90 + Math.random() * 40,
        alpha: 0.8,
        color: '227,184,234',
        width: 1.5,
      })

      // Spawn 4 floating hearts
      for (let i = 0; i < 4; i++) {
        const ang = Math.random() * Math.PI * 2
        const spd = 1 + Math.random() * 2.2
        floatingHeartParticles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 0.6,
          scale: 3.5 + Math.random() * 4.5,
          alpha: 0.85,
          decay: 0.016 + Math.random() * 0.01,
          color: i % 2 === 0 ? '227,184,234' : '255,184,210',
        })
      }
    }
    window.addEventListener('click', handleCanvasClick)

    // Meteor Shower Trigger Event
    function handleMeteorShower() {
      for (let i = 0; i < 14; i++) {
        setTimeout(() => {
          spawnMeteor()
        }, i * 140 + Math.random() * 60)
      }
    }
    window.addEventListener('celestial:meteor_shower', handleMeteorShower)

    // Track mouse position for parallax + aura glow effects
    function handleMouseMove(e) {
      targetMouseX = e.clientX
      targetMouseY = e.clientY
      targetRawX = e.clientX
      targetRawY = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    function drawRipples() {
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i]
        rp.r += 2
        rp.alpha *= 0.94
        if (rp.r > rp.maxR || rp.alpha < 0.02) {
          ripples.splice(i, 1)
          continue
        }
        ctx.beginPath()
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${rp.color},${rp.alpha * 0.45})`
        ctx.lineWidth = rp.width
        ctx.stroke()
      }

      // Draw floating heart burst particles
      for (let i = floatingHeartParticles.length - 1; i >= 0; i--) {
        const p = floatingHeartParticles[i]
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.96
        p.vy *= 0.96
        p.alpha -= p.decay

        if (p.alpha <= 0) {
          floatingHeartParticles.splice(i, 1)
          continue
        }

        drawHeart(p.x, p.y, p.scale, p.alpha, p.color)
      }
    }

    function drawNebulaClouds(t) {
      nebulaClouds.forEach((cloud) => {
        const x = cloud.x + Math.sin(t * cloud.speed + cloud.phase) * 30
        const y = cloud.y + Math.cos(t * cloud.speed * 0.8 + cloud.phase) * 20
        const px = x + mouseX * 8
        const py = y + mouseY * 5
        const r = cloud.r

        const grad = ctx.createRadialGradient(px, py, 0, px, py, r)
        grad.addColorStop(0, `rgba(${cloud.color.join(',')},0.038)`)
        grad.addColorStop(0.5, `rgba(${cloud.color.join(',')},0.015)`)
        grad.addColorStop(1, `rgba(${cloud.color.join(',')},0)`)

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(px, py, r, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    // Walking Constellation Cat
    const catLocalW = 220, catLocalH = 230
    const CAT_BLOBS = [
      [62, 56, 34], [86, 92, 28], [108, 138, 46], [112, 180, 44],
      [78, 158, 15], [76, 190, 13], [74, 212, 15], [150, 214, 15],
      [158, 178, 15], [184, 162, 12], [196, 132, 9], [186, 104, 7], [166, 92, 5],
    ]
    const CAT_EARS = [
      [[34, 26], [47, -12], [64, 20]],
      [[60, 16], [81, -14], [97, 22]],
    ]
    let catPath = null, catStarPoints = []

    function buildCatPath() {
      const p = new Path2D()
      CAT_BLOBS.forEach((b) => {
        p.moveTo(b[0] + b[2], b[1])
        p.arc(b[0], b[1], b[2], 0, Math.PI * 2)
      })
      CAT_EARS.forEach((tri) => {
        p.moveTo(tri[0][0], tri[0][1])
        p.lineTo(tri[1][0], tri[1][1])
        p.lineTo(tri[2][0], tri[2][1])
        p.closePath()
      })
      return p
    }

    function buildCatStars() {
      catPath = buildCatPath()
      catStarPoints = []
      let tries = 0
      while (catStarPoints.length < 50 && tries < 4000) {
        tries++
        const px = Math.random() * catLocalW, py = Math.random() * catLocalH * 0.96 + 2
        if (ctx.isPointInPath(catPath, px, py)) {
          catStarPoints.push({
            x: px,
            y: py,
            r: 0.9 + Math.random() * 1.3,
            phase: Math.random() * Math.PI * 2,
            speed: 0.001 + Math.random() * 0.002,
          })
        }
      }
    }
    buildCatStars()

    let catWalk = null
    let catTimeout
    function spawnCat() {
      const dir = Math.random() < 0.5 ? 1 : -1
      catWalk = {
        start: performance.now(),
        duration: 24000 + Math.random() * 6000,
        y: window.innerHeight * (0.12 + Math.random() * 0.32),
        scale: window.innerWidth / 920,
        dir,
      }
    }

    function scheduleCat() {
      catTimeout = setTimeout(() => {
        spawnCat()
        scheduleCat()
      }, 24000 + Math.random() * 16000)
    }
    scheduleCat()
    const firstCatTimeout = setTimeout(spawnCat, 3500)

    function drawCat(now) {
      if (!catWalk) return
      const t = (now - catWalk.start) / catWalk.duration
      if (t >= 1) {
        catWalk = null
        return
      }
      const W = window.innerWidth
      const catW = catLocalW * catWalk.scale
      const travel = W + catW * 2
      const px = catWalk.dir === 1 ? -catW + t * travel : W + catW - t * travel
      const bob = Math.sin(t * Math.PI * 3) * 4 * catWalk.scale

      let alpha = t < 0.1 ? t / 0.1 : t > 0.88 ? (1 - t) / 0.12 : 1
      alpha *= 0.9

      ctx.save()
      ctx.translate(px, catWalk.y + bob)
      ctx.scale(catWalk.dir === 1 ? catWalk.scale : -catWalk.scale, catWalk.scale)

      ctx.fillStyle = `rgba(12,11,18,${alpha * 0.92})`
      ctx.fill(catPath, 'nonzero')

      catStarPoints.forEach((p) => {
        const tw = 0.5 + 0.5 * Math.sin(now * p.speed + p.phase)
        ctx.beginPath()
        ctx.fillStyle = `rgba(255,255,255,${alpha * (0.4 + 0.5 * tw)})`
        ctx.arc(p.x, p.y, p.r * (0.7 + 0.4 * tw), 0, Math.PI * 2)
        ctx.fill()
      })

      // Eye
      ctx.beginPath()
      ctx.fillStyle = `rgba(214,255,247,${alpha})`
      ctx.arc(46, 44, 2.4, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }

    function loop(now) {
      const W = window.innerWidth, H = window.innerHeight
      const t = now || performance.now()

      // Smooth mouse lerping (fast & low CPU)
      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05
      mouseRawX += (targetRawX - mouseRawX) * 0.08
      mouseRawY += (targetRawY - mouseRawY) * 0.08

      ctx.clearRect(0, 0, W, H)

      // 1. Mouse Cosmic Aura Spotlight
      if (mouseRawX > -100) {
        const mouseAura = ctx.createRadialGradient(mouseRawX, mouseRawY, 0, mouseRawX, mouseRawY, 180)
        mouseAura.addColorStop(0, 'rgba(227,184,234,0.045)')
        mouseAura.addColorStop(0.6, 'rgba(194,194,242,0.015)')
        mouseAura.addColorStop(1, 'rgba(194,194,242,0)')
        ctx.fillStyle = mouseAura
        ctx.beginPath()
        ctx.arc(mouseRawX, mouseRawY, 180, 0, Math.PI * 2)
        ctx.fill()
      }

      // 2. Draw Nebula Clouds
      drawNebulaClouds(t)

      // 3. Compute Star Screen Positions
      const starScreenPos = new Array(stars.length)
      for (let i = 0; i < stars.length; i++) {
        const p = stars[i]
        const twinkle = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * p.twinkleSpeed + p.twinklePhase))
        const yRaw = (p.y * H - t * p.sp) % H
        const y = yRaw < 0 ? yRaw + H : yRaw
        const px = p.x * W + mouseX * p.depth * -8
        const py = y + mouseY * p.depth * -5

        starScreenPos[i] = { px, py, r: p.r, color: p.color, twinkle, isHero: p.isHero }
      }

      // 4. Draw Pre-calculated Constellation Lines
      ctx.lineWidth = 0.5
      for (let k = 0; k < constellationLinks.length; k++) {
        const link = constellationLinks[k]
        const s1 = starScreenPos[link.i1]
        const s2 = starScreenPos[link.i2]
        if (!s1 || !s2) continue

        const alpha = link.maxAlpha * Math.min(s1.twinkle, s2.twinkle)
        ctx.strokeStyle = `rgba(227,184,234,${alpha})`
        ctx.beginPath()
        ctx.moveTo(s1.px, s1.py)
        ctx.lineTo(s2.px, s2.py)
        ctx.stroke()
      }

      // 5. Draw Stars (Optimized batch rendering)
      for (let i = 0; i < starScreenPos.length; i++) {
        const s = starScreenPos[i]

        if (s.isHero && s.r > 1.1) {
          drawSparkleCross(s.px, s.py, s.r * 1.2, s.twinkle * 0.7, s.color)
        } else {
          ctx.beginPath()
          ctx.arc(s.px, s.py, s.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${s.color},${s.twinkle * 0.65})`
          ctx.fill()
        }
      }

      // 6. Draw Meteors & Ripples
      drawMeteors()
      drawRipples()

      // 7. Draw Floating Heart Constellations
      heartStars.forEach((hs) => {
        const tw = 0.5 + 0.5 * Math.sin(t * hs.speed + hs.phase)
        drawHeart(
          hs.x + Math.sin(t * 0.0008 + hs.phase) * 3,
          hs.y + Math.cos(t * 0.0006 + hs.phase) * 2,
          hs.scale * (0.85 + 0.25 * tw),
          tw,
          hs.color
        )
      })

      // 8. Draw Celestial Cat
      drawCat(t)

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
      window.removeEventListener('click', handleCanvasClick)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('celestial:meteor_shower', handleMeteorShower)
    }
  }, [])

  return <canvas id="starsCanvas" ref={canvasRef} className="bg-canvas-layer" />
}
