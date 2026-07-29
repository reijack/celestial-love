import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    document.documentElement.classList.add('custom-cursor-active')
    const dot = dotRef.current, glow = glowRef.current
    let mx = window.innerWidth/2, my = window.innerHeight/2, gx = mx, gy = my
    let visible = false, scaleFactor = 1, raf

    function onMove(e) {
      mx = e.clientX; my = e.clientY
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`
      if (!visible) { visible = true; dot.style.opacity = '1'; glow.style.opacity = '1' }
    }
    function onLeave() { dot.style.opacity = '0'; glow.style.opacity = '0' }
    function onEnter() { dot.style.opacity = '1'; glow.style.opacity = '1' }
    function onDown() { scaleFactor = 0.72 }
    function onUp() { scaleFactor = 1 }
    const interactiveSelector = 'a, button, [data-target], .sw-star, input, textarea'
    function onOver(e) { if (e.target.closest && e.target.closest(interactiveSelector)) { dot.classList.add('cc-hover'); glow.classList.add('cc-hover') } }
    function onOut(e) { if (e.target.closest && e.target.closest(interactiveSelector)) { dot.classList.remove('cc-hover'); glow.classList.remove('cc-hover') } }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    function tick(now) {
      gx += (mx-gx)*0.15; gy += (my-gy)*0.15
      const rot = (now||0)/40
      glow.style.transform = `translate(${gx}px,${gy}px) translate(-50%,-50%) rotate(${rot}deg) scale(${scaleFactor})`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
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
      <div ref={glowRef} className="cc-glow">
        <svg width="34" height="34" viewBox="0 0 34 34">
          <polygon points="17,2 20,14 32,17 20,20 17,32 14,20 2,17 14,14" fill="rgba(194,194,242,0.85)" />
        </svg>
      </div>
      <div ref={dotRef} className="cc-dot" />
    </>
  )
}
