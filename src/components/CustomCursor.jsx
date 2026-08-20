import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const glowRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    document.documentElement.classList.add('custom-cursor-active')

    const dot = dotRef.current
    const glow = glowRef.current
    const canvas = canvasRef.current
    if (!canvas || !dot || !glow) return

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

    // Stardust particle system
    const particles = []
    const MAX_PARTICLES = 35

    function spawnStardust(x, y, count = 1, isBurst = false) {
      for (let i = 0; i < count; i++) {
        if (particles.length >= MAX_PARTICLES && !isBurst) {
          particles.shift()
        }
        const angle = Math.random() * Math.PI * 2
        const speed = isBurst ? (1.5 + Math.random() * 3.5) : (0.2 + Math.random() * 0.8)
        const size = isBurst ? (2 + Math.random() * 3.5) : (1.2 + Math.random() * 2.2)
        const life = isBurst ? (25 + Math.random() * 20) : (20 + Math.random() * 15)

        // Palette: Soft celestial gold, lilac, and starlight blue
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
          vx: Math.cos(angle) * speed + (isBurst ? 0 : (gx - mx) * 0.05),
          vy: Math.sin(angle) * speed + (isBurst ? 0 : (gy - my) * 0.05) - (isBurst ? 0.3 : 0.2),
          size,
          initialSize: size,
          life,
          maxLife: life,
          colorBase,
          rot: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.1,
          isStar: Math.random() > 0.4 || isBurst,
        })
      }
    }

    function drawSparkle(ctx, x, y, size, alpha, rot, colorBase) {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rot)
      ctx.fillStyle = colorBase + alpha + ')'
      ctx.shadowColor = colorBase + (alpha * 0.9) + ')'
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

    let lastSpawn = 0
    function onMove(e) {
      mx = e.clientX
      my = e.clientY
      dot.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`
      if (!visible) {
        visible = true
        dot.style.opacity = '1'
        glow.style.opacity = '1'
        canvas.style.opacity = '1'
      }

      const now = performance.now()
      if (now - lastSpawn > 24) {
        spawnStardust(mx, my, 1, false)
        lastSpawn = now
      }
    }

    function onLeave() {
      dot.style.opacity = '0'
      glow.style.opacity = '0'
      canvas.style.opacity = '0'
      visible = false
    }

    function onEnter() {
      dot.style.opacity = '1'
      glow.style.opacity = '1'
      canvas.style.opacity = '1'
      visible = true
    }

    function onDown(e) {
      isMouseDown = true
      spawnStardust(e.clientX, e.clientY, 8, true)
    }

    function onUp() {
      isMouseDown = false
    }

    const interactiveSelector = 'a, button, [data-target], .sw-star, input, textarea, .glass-card, .timeline-card, .letter-card, .bento-grid > div'

    function onOver(e) {
      if (e.target.closest && e.target.closest(interactiveSelector)) {
        isHovering = true
        dot.classList.add('cc-hover')
        glow.classList.add('cc-hover')
      }
    }

    function onOut(e) {
      if (e.target.closest && e.target.closest(interactiveSelector)) {
        isHovering = false
        dot.classList.remove('cc-hover')
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
      // Smooth follow for outer celestial ring
      gx += (mx - gx) * 0.18
      gy += (my - gy) * 0.18

      const rot = (now || 0) / 45
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
          ctx.shadowColor = colorBase + (alpha * 0.5) + ')'
          ctx.shadowBlur = 4
          ctx.fill()
        }
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
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
          transition: 'opacity 0.3s ease',
        }}
      />
      <div ref={glowRef} className="cc-glow">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="rgba(227,184,234,0.4)"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
          <polygon
            points="20,4 23,16 35,20 23,24 20,36 17,24 5,20 17,16"
            fill="rgba(194,194,242,0.85)"
          />
        </svg>
      </div>
      <div ref={dotRef} className="cc-dot" />
    </>
  )
}
