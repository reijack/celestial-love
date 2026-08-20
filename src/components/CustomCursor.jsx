import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const glowRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    // Only enable on desktop with fine mouse pointer
    if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const glow = glowRef.current
    const canvas = canvasRef.current
    if (!canvas || !glow) return

    const ctx = canvas.getContext('2d')
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    function onResize() {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    let mx = width / 2, my = height / 2, gx = mx, gy = my
    let visible = false
    let isHovering = false
    let isMouseDown = false
    let raf

    // Stardust particle system - capped for 60fps performance
    const particles = []
    const MAX_PARTICLES = 24

    function spawnStardust(x, y, count = 1, isBurst = false) {
      for (let i = 0; i < count; i++) {
        if (particles.length >= MAX_PARTICLES && !isBurst) {
          particles.shift()
        }
        const angle = Math.random() * Math.PI * 2
        const speed = isBurst ? (1.5 + Math.random() * 3) : (0.3 + Math.random() * 0.7)
        const size = isBurst ? (2.5 + Math.random() * 3) : (1.2 + Math.random() * 2)
        const life = isBurst ? (24 + Math.random() * 16) : (16 + Math.random() * 12)

        const colors = [
          'rgba(227, 184, 234, ',
          'rgba(194, 194, 242, ',
          'rgba(255, 240, 190, ',
          'rgba(184, 220, 255, ',
        ]
        const colorBase = colors[Math.floor(Math.random() * colors.length)]

        particles.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (isBurst ? 0.3 : 0.15),
          size,
          initialSize: size,
          life,
          maxLife: life,
          colorBase,
          rot: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.08,
          isStar: Math.random() > 0.45 || isBurst,
        })
      }
    }

    function drawSparkle(ctx, x, y, size, alpha, rot, colorBase) {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rot)
      ctx.fillStyle = colorBase + alpha + ')'

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

    let lastSpawn = 0
    function onMove(e) {
      mx = e.clientX
      my = e.clientY

      if (!visible) {
        visible = true
        glow.style.opacity = '0.85'
        canvas.style.opacity = '1'
      }

      const now = performance.now()
      if (now - lastSpawn > 32) {
        spawnStardust(mx, my, 1, false)
        lastSpawn = now
      }
    }

    function onLeave() {
      glow.style.opacity = '0'
      canvas.style.opacity = '0'
      visible = false
    }

    function onEnter() {
      glow.style.opacity = '0.85'
      canvas.style.opacity = '1'
      visible = true
    }

    function onDown(e) {
      isMouseDown = true
      spawnStardust(e.clientX, e.clientY, 6, true)
    }

    function onUp() {
      isMouseDown = false
    }

    const interactiveSelector = 'a, button, [data-target], .sw-star, input, textarea, .glass-card, .timeline-card, .letter-card'

    function onOver(e) {
      if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
        isHovering = true
        glow.classList.add('cc-hover')
      }
    }

    function onOut(e) {
      if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
        isHovering = false
        glow.classList.remove('cc-hover')
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    function tick(now) {
      // Smooth lerp for outer celestial star ring
      gx += (mx - gx) * 0.22
      gy += (my - gy) * 0.22

      const rot = ((now || 0) / 50) % 360
      const scale = isMouseDown ? 0.75 : isHovering ? 1.35 : 1
      glow.style.transform = `translate3d(${gx}px,${gy}px,0) translate(-50%,-50%) rotate(${rot}deg) scale(${scale})`

      // Render stardust on canvas
      ctx.clearRect(0, 0, width, height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.rot += p.rotSpeed
        p.life -= 1

        const alpha = Math.max(0, p.life / p.maxLife)
        const currentSize = p.initialSize * (0.4 + 0.6 * alpha)

        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        if (p.isStar) {
          drawSparkle(ctx, p.x, p.y, currentSize * 2, alpha * 0.85, p.rot, p.colorBase)
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2)
          ctx.fillStyle = p.colorBase + (alpha * 0.7) + ')'
          ctx.fill()
        }
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="cc-canvas"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 598,
          opacity: 0,
          transition: 'opacity 0.25s ease',
        }}
      />
      <div ref={glowRef} className="cc-glow" />
    </>
  )
}
