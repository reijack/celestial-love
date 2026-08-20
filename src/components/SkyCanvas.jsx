import { useEffect, useRef } from 'react'

// Smooth noise generator for organic movement
function smoothNoise(x) {
  const ix = Math.floor(x)
  const fx = x - ix
  const t = fx * fx * (3 - 2 * fx)
  const a = Math.sin(ix * 127.1 + ix * 311.7) * 43758.5453
  const b = Math.sin((ix + 1) * 127.1 + (ix + 1) * 311.7) * 43758.5453
  return (a - Math.floor(a)) * (1 - t) + (b - Math.floor(b)) * t
}

export default function SkyCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    let raf
    let stars = []
    let meteors = []
    let ripples = []
    let heartStars = []
    let nebulaClouds = []
    let floatingHeartParticles = []
    
    // Constellation lines configuration
    const MAX_CONSTELLATION_DIST = 95

    // Smooth mouse lerp
    let mouseX = 0, mouseY = 0
    let targetMouseX = 0, targetMouseY = 0
    let mouseRawX = -1000, mouseRawY = -1000
    let targetRawX = -1000, targetRawY = -1000

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
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
      const w = window.innerWidth
      const N = w < 768 ? 160 : 280
      const starColors = [
        '255,255,255',
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
          r: Math.random() * 1.8 + 0.3,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          depth: 0.15 + Math.random() * 0.85,
          twinkleSpeed: 0.008 + Math.random() * 0.024,
          twinklePhase: Math.random() * Math.PI * 2,
          sp: 0.005 + Math.random() * 0.02,
          noiseSeed: Math.random() * 1000,
          isHero: Math.random() < 0.15, // 15% are bright 4-point stars
        })
      }
    }

    function buildHeartStars() {
      heartStars = []
      const count = window.innerWidth < 760 ? 6 : 12
      for (let i = 0; i < count; i++) {
        heartStars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight * 0.85 + window.innerHeight * 0.05,
          scale: 4.5 + Math.random() * 7,
          phase: Math.random() * Math.PI * 2,
          speed: 0.2 + Math.random() * 0.45,
          driftX: (Math.random() - 0.5) * 0.02,
          driftY: (Math.random() - 0.5) * 0.01,
          color: i % 2 === 0 ? '227,184,234' : '255,184,205',
        })
      }
    }

    function buildNebulaClouds() {
      nebulaClouds = []
      const count = window.innerWidth < 760 ? 5 : 8
      const colors = [
        [227, 184, 234], // Soft Orchid
        [194, 194, 242], // Periwinkle
        [184, 195, 255], // Celestial Blue
        [255, 184, 205], // Cosmic Rose
        [184, 230, 255], // Starlight Cyan
        [235, 175, 255], // Violet
        [255, 210, 180], // Warm Sunset Glow
      ]
      for (let i = 0; i < count; i++) {
        nebulaClouds.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight * 0.8,
          r: 180 + Math.random() * 260,
          color: colors[i % colors.length],
          phase: Math.random() * Math.PI * 2,
          speed: 0.08 + Math.random() * 0.18,
          driftX: (Math.random() - 0.5) * 0.04,
          driftY: (Math.random() - 0.5) * 0.02,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.00015 + Math.random() * 0.00025,
        })
      }
    }

    function drawSparkleCross(cx, cy, r, alpha, color) {
      ctx.save()
      ctx.translate(cx, cy)
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 3)
      grad.addColorStop(0, `rgba(${color},${alpha})`)
      grad.addColorStop(0.3, `rgba(${color},${alpha * 0.6})`)
      grad.addColorStop(1, `rgba(${color},0)`)

      // Core glow
      ctx.beginPath()
      ctx.arc(0, 0, r * 1.6, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${color},${alpha * 0.8})`
      ctx.fill()

      // Horizontal ray
      ctx.beginPath()
      ctx.moveTo(-r * 4.5, 0)
      ctx.quadraticCurveTo(0, -r * 0.35, r * 4.5, 0)
      ctx.quadraticCurveTo(0, r * 0.35, -r * 4.5, 0)
      ctx.fillStyle = grad
      ctx.fill()

      // Vertical ray
      ctx.beginPath()
      ctx.moveTo(0, -r * 4.5)
      ctx.quadraticCurveTo(-r * 0.35, 0, 0, r * 4.5)
      ctx.quadraticCurveTo(r * 0.35, 0, 0, -r * 4.5)
      ctx.fillStyle = grad
      ctx.fill()

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
      
      // Heart fill with soft glow
      ctx.fillStyle = `rgba(${color},${alpha * 0.65})`
      ctx.shadowColor = `rgba(${color},${alpha * 0.85})`
      ctx.shadowBlur = 14 * (scale / 10)
      ctx.fill()

      // Inner highlight
      ctx.fillStyle = `rgba(255,255,255,${alpha * 0.3})`
      ctx.fill()
      ctx.restore()
    }

    function spawnMeteor() {
      const fromTop = Math.random() < 0.65
      const startX = fromTop ? Math.random() * window.innerWidth * 0.9 : Math.random() * window.innerWidth * 0.25
      const startY = fromTop ? -40 : Math.random() * window.innerHeight * 0.25
      const angle = (32 + Math.random() * 18) * (Math.PI / 180)
      const speed = 10 + Math.random() * 14
      const isGolden = Math.random() < 0.25
      const isViolet = Math.random() < 0.35

      const headColor = isGolden ? '255,235,170' : isViolet ? '230,185,255' : '185,225,255'
      const tailColor = isGolden ? '255,190,120' : isViolet ? '220,140,250' : '160,195,255'

      meteors.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: 150 + Math.random() * 180,
        life: 1,
        decay: 0.007 + Math.random() * 0.006,
        trailWidth: 1.8 + Math.random() * 1.5,
        headColor,
        tailColor,
        sparks: [],
      })
    }

    function spawnMeteorBurst() {
      const count = 2 + Math.floor(Math.random() * 3)
      for (let i = 0; i < count; i++) {
        setTimeout(() => spawnMeteor(), i * 180)
      }
    }

    let meteorTimeout
    function scheduleMeteor() {
      meteorTimeout = setTimeout(() => {
        if (Math.random() < 0.22) {
          spawnMeteorBurst()
        } else {
          spawnMeteor()
        }
        scheduleMeteor()
      }, 2400 + Math.random() * 4500)
    }
    scheduleMeteor()

    function drawMeteors() {
      const W = window.innerWidth, H = window.innerHeight
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i]

        // Add trailing stardust sparkles
        if (m.life > 0.2 && Math.random() < 0.6) {
          m.sparks.push({
            x: m.x + (Math.random() - 0.5) * 6,
            y: m.y + (Math.random() - 0.5) * 6,
            alpha: m.life * 0.6,
            r: 0.8 + Math.random() * 1.4,
            decay: 0.03 + Math.random() * 0.02,
          })
        }

        m.x += m.vx
        m.y += m.vy
        m.life -= m.decay

        if (m.life <= 0 || m.x > W + 250 || m.y > H + 250) {
          meteors.splice(i, 1)
          continue
        }

        // Draw Sparks
        for (let j = m.sparks.length - 1; j >= 0; j--) {
          const sp = m.sparks[j]
          sp.alpha -= sp.decay
          if (sp.alpha <= 0) {
            m.sparks.splice(j, 1)
            continue
          }
          ctx.beginPath()
          ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${m.tailColor},${sp.alpha})`
          ctx.fill()
        }

        const hyp = Math.hypot(m.vx, m.vy)
        const tailX = m.x - m.vx * (m.len / hyp)
        const tailY = m.y - m.vy * (m.len / hyp)

        // Gradient Trail with multi-stop glowing taper
        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY)
        grad.addColorStop(0, `rgba(255,255,255,${0.98 * m.life})`)
        grad.addColorStop(0.1, `rgba(${m.headColor},${0.9 * m.life})`)
        grad.addColorStop(0.35, `rgba(${m.tailColor},${0.65 * m.life})`)
        grad.addColorStop(0.7, `rgba(184,195,255,${0.25 * m.life})`)
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
        ctx.shadowColor = `rgba(${m.headColor},${m.life * 0.9})`
        ctx.shadowBlur = 14
        ctx.arc(m.x, m.y, 2.6 * m.life, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }
    }

    // Interactive Cosmic Ripple & Sparkles
    function handleCanvasClick(e) {
      // Create multi-ring ripple
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        r: 4,
        maxR: 110 + Math.random() * 50,
        alpha: 0.85,
        color: '227,184,234',
        width: 1.8,
      })
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        r: 2,
        maxR: 70 + Math.random() * 30,
        alpha: 0.6,
        color: '184,220,255',
        width: 1.2,
      })

      // Spawn drifting heart particle burst
      const burstCount = 5 + Math.floor(Math.random() * 4)
      for (let i = 0; i < burstCount; i++) {
        const ang = Math.random() * Math.PI * 2
        const spd = 1.2 + Math.random() * 2.8
        floatingHeartParticles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 0.8,
          scale: 4 + Math.random() * 5,
          alpha: 0.9,
          decay: 0.015 + Math.random() * 0.01,
          rot: (Math.random() - 0.5) * 0.05,
          color: i % 2 === 0 ? '227,184,234' : '255,184,210',
        })
      }
    }
    window.addEventListener('click', handleCanvasClick)

    function handleMouseMove(e) {
      targetRawX = e.clientX
      targetRawY = e.clientY
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouseMove)

    function drawRipples() {
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i]
        rp.r += 2.2
        rp.alpha *= 0.94
        if (rp.r > rp.maxR || rp.alpha < 0.015) {
          ripples.splice(i, 1)
          continue
        }
        ctx.save()
        ctx.beginPath()
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${rp.color},${rp.alpha * 0.5})`
        ctx.lineWidth = rp.width
        ctx.shadowColor = `rgba(${rp.color},${rp.alpha * 0.8})`
        ctx.shadowBlur = 10
        ctx.stroke()
        ctx.restore()
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

    function drawNebulaClouds(now) {
      const t = now * 0.001
      nebulaClouds.forEach((cloud) => {
        const x =
          cloud.x +
          Math.sin(t * cloud.speed * 0.3 + cloud.phase) * 45 +
          Math.sin(t * cloud.speed * 0.65 + cloud.phase * 1.5) * 20
        const y =
          cloud.y +
          Math.cos(t * cloud.speed * 0.25 + cloud.phase) * 30 +
          Math.cos(t * cloud.speed * 0.55 + cloud.phase * 2.2) * 15

        const breathe = 0.88 + 0.12 * Math.sin(now * cloud.pulseSpeed + cloud.pulsePhase)
        const px = x + mouseX * 12
        const py = y + mouseY * 8
        const r = cloud.r * breathe

        // Outer smooth aura
        const grad = ctx.createRadialGradient(px, py, 0, px, py, r)
        grad.addColorStop(0, `rgba(${cloud.color.join(',')},0.048)`)
        grad.addColorStop(0.35, `rgba(${cloud.color.join(',')},0.03)`)
        grad.addColorStop(0.7, `rgba(${cloud.color.join(',')},0.01)`)
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
      while (catStarPoints.length < 65 && tries < 6000) {
        tries++
        const px = Math.random() * catLocalW, py = Math.random() * catLocalH * 0.96 + 2
        if (ctx.isPointInPath(catPath, px, py)) {
          catStarPoints.push({
            x: px,
            y: py,
            r: 0.9 + Math.random() * 1.5,
            phase: Math.random() * Math.PI * 2,
            speed: 0.6 + Math.random() * 1.1,
            sparkle: false,
          })
        }
      }
      const sparkleIdx = []
      while (sparkleIdx.length < 8 && catStarPoints.length > 0) {
        const ri = Math.floor(Math.random() * catStarPoints.length)
        if (!sparkleIdx.includes(ri)) sparkleIdx.push(ri)
      }
      sparkleIdx.forEach((i) => {
        catStarPoints[i].sparkle = true
        catStarPoints[i].r = 2.2 + Math.random() * 1.4
      })
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
        scale: window.innerWidth / 900,
        dir,
      }
    }

    function scheduleCat() {
      catTimeout = setTimeout(() => {
        spawnCat()
        scheduleCat()
      }, 22000 + Math.random() * 16000)
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
      const bob = Math.sin(t * Math.PI * 3) * 5 * catWalk.scale

      let alpha
      if (t < 0.1) {
        const ft = t / 0.1
        alpha = ft * ft * (3 - 2 * ft)
      } else if (t > 0.88) {
        const ft = (1 - t) / 0.12
        alpha = ft * ft * (3 - 2 * ft)
      } else {
        alpha = 1
      }
      alpha *= 0.94

      ctx.save()
      ctx.translate(px, catWalk.y + bob)
      ctx.scale(catWalk.dir === 1 ? catWalk.scale : -catWalk.scale, catWalk.scale)

      ctx.save()
      ctx.shadowColor = `rgba(184,195,255,${alpha * 0.45})`
      ctx.shadowBlur = 24
      ctx.fillStyle = `rgba(12,11,18,${alpha * 0.94})`
      ctx.fill(catPath, 'nonzero')
      ctx.restore()

      catStarPoints.forEach((p) => {
        const tw = 0.5 + 0.5 * Math.sin((now / 1000) * p.speed + p.phase)
        const pr = p.r * (0.7 + 0.5 * tw)
        if (p.sparkle) {
          ctx.shadowColor = `rgba(255,255,255,${alpha * 0.8})`
          ctx.shadowBlur = 10
          drawSparkleCross(p.x, p.y, pr * 1.5, alpha * (0.6 + 0.4 * tw), '255,255,255')
          ctx.shadowBlur = 0
        } else {
          ctx.beginPath()
          ctx.fillStyle = `rgba(255,255,255,${alpha * (0.35 + 0.5 * tw)})`
          ctx.arc(p.x, p.y, pr, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // Cat glowing eye
      ctx.shadowColor = `rgba(184,255,240,${alpha * 0.9})`
      ctx.shadowBlur = 8
      ctx.beginPath()
      ctx.fillStyle = `rgba(214,255,247,${alpha})`
      ctx.arc(46, 44, 2.6, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.restore()
    }

    function loop(now) {
      const W = window.innerWidth, H = window.innerHeight

      // Smooth mouse lerping
      mouseX += (targetMouseX - mouseX) * 0.045
      mouseY += (targetMouseY - mouseY) * 0.045
      mouseRawX += (targetRawX - mouseRawX) * 0.06
      mouseRawY += (targetRawY - mouseRawY) * 0.06

      ctx.clearRect(0, 0, W, H)

      // 1. Mouse Cosmic Aura Spotlight
      if (mouseRawX > -100) {
        const mouseAura = ctx.createRadialGradient(mouseRawX, mouseRawY, 0, mouseRawX, mouseRawY, 220)
        mouseAura.addColorStop(0, 'rgba(227,184,234,0.06)')
        mouseAura.addColorStop(0.5, 'rgba(194,194,242,0.025)')
        mouseAura.addColorStop(1, 'rgba(194,194,242,0)')
        ctx.fillStyle = mouseAura
        ctx.beginPath()
        ctx.arc(mouseRawX, mouseRawY, 220, 0, Math.PI * 2)
        ctx.fill()
      }

      // 2. Draw Nebula Clouds
      drawNebulaClouds(now || 0)

      // 3. Compute star screen positions for parallax & constellation connections
      const t = (now || 0) * 0.001
      const starScreenPos = []

      for (let i = 0; i < stars.length; i++) {
        const p = stars[i]
        const twBase = 0.5 + 0.5 * Math.sin(t * p.twinkleSpeed * 60 + p.twinklePhase)
        const twNoise = smoothNoise(t * p.twinkleSpeed * 30 + p.noiseSeed)
        const twinkle = 0.18 + 0.52 * twBase + 0.3 * twNoise

        const yRaw = (p.y * H - (now || 0) * p.sp * 0.015) % H
        const y = yRaw < 0 ? yRaw + H : yRaw

        const px = p.x * W + mouseX * p.depth * -12
        const py = y + mouseY * p.depth * -8

        starScreenPos.push({ px, py, r: p.r, color: p.color, twinkle, isHero: p.isHero, depth: p.depth })
      }

      // 4. Draw Constellation Connections between nearby stars
      ctx.lineWidth = 0.6
      for (let i = 0; i < starScreenPos.length; i += 2) {
        const s1 = starScreenPos[i]
        if (s1.depth < 0.4) continue // only foreground / mid stars connect

        for (let j = i + 1; j < Math.min(i + 12, starScreenPos.length); j++) {
          const s2 = starScreenPos[j]
          const dx = s1.px - s2.px
          const dy = s1.py - s2.py
          const dist = Math.hypot(dx, dy)

          if (dist < MAX_CONSTELLATION_DIST) {
            const lineAlpha = (1 - dist / MAX_CONSTELLATION_DIST) * 0.12 * Math.min(s1.twinkle, s2.twinkle)
            ctx.strokeStyle = `rgba(227,184,234,${lineAlpha})`
            ctx.beginPath()
            ctx.moveTo(s1.px, s1.py)
            ctx.lineTo(s2.px, s2.py)
            ctx.stroke()
          }
        }
      }

      // 5. Draw Stars
      for (let i = 0; i < starScreenPos.length; i++) {
        const s = starScreenPos[i]

        if (s.isHero && s.r > 1.2) {
          drawSparkleCross(s.px, s.py, s.r * 1.3, s.twinkle * 0.75, s.color)
        } else {
          ctx.beginPath()
          ctx.arc(s.px, s.py, s.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${s.color},${s.twinkle * 0.7})`
          ctx.fill()

          if (s.r > 1.1) {
            ctx.beginPath()
            ctx.arc(s.px, s.py, s.r * 2.8, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${s.color},${s.twinkle * 0.08})`
            ctx.fill()
          }
        }
      }

      // 6. Draw Meteors & Ripples
      drawMeteors()
      drawRipples()

      // 7. Draw Floating Heart Constellations
      heartStars.forEach((hs) => {
        const tw = 0.5 + 0.5 * Math.sin(t * hs.speed + hs.phase)
        const tw2 = smoothNoise(t * hs.speed * 0.5 + hs.phase)
        const combined = 0.6 * tw + 0.4 * tw2
        drawHeart(
          hs.x + Math.sin(t * 0.12 + hs.phase) * 4,
          hs.y + Math.cos(t * 0.09 + hs.phase) * 3,
          hs.scale * (0.85 + 0.25 * combined),
          combined,
          hs.color
        )
      })

      // 8. Draw Celestial Cat
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
      window.removeEventListener('click', handleCanvasClick)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return <canvas id="starsCanvas" ref={canvasRef} className="bg-canvas-layer" />
}
