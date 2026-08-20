import { useEffect, useRef, useState } from 'react'

function getMidnightProgress() {
  const n = new Date()
  const m = n.getHours()*60 + n.getMinutes() + n.getSeconds()/60
  let dist
  if (m >= 1380) dist = 1440 - m
  else if (m <= 60) dist = m
  else return 0
  if (dist >= 45) return 0.15 * (1 - (dist-45)/15)
  if (dist >= 30) return 0.15 + 0.30*(1-(dist-30)/15)
  if (dist >= 15) return 0.45 + 0.30*(1-(dist-15)/15)
  if (dist >= 5) return 0.75 + 0.20*(1-(dist-5)/10)
  return 0.95 + 0.05*(1-dist/5)
}

export default function MidnightSky() {
  const [progress, setProgress] = useState(0)
  const moonRef = useRef(null)
  const haloRef = useRef(null)
  const vignetteRef = useRef(null)

  useEffect(() => {
    function tick() {
      const p = Math.max(0, Math.min(1, getMidnightProgress()))
      setProgress(p)
      const r = Math.round(19 + (2-19)*p), g = Math.round(19 + (2-19)*p), b = Math.round(22 + (8-22)*p)
      document.body.style.backgroundColor = `rgb(${r},${g},${b})`
      if (vignetteRef.current) vignetteRef.current.style.opacity = (p*0.95).toFixed(3)
      if (haloRef.current) {
        const a = Math.min(0.35, p*0.35)
        haloRef.current.style.borderColor = `rgba(194,194,242,${a})`
        haloRef.current.style.boxShadow = `0 0 0 1px rgba(194,194,242,${a*0.4}),inset 0 0 0 1px rgba(194,194,242,${a*0.25}),0 0 50px rgba(194,194,242,${a}),0 0 100px rgba(194,194,242,${a*0.4})`
      }
    }
    tick()
    const iv = setInterval(tick, 1000)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    function positionHalo() {
      if (!moonRef.current || !haloRef.current) return
      const r = moonRef.current.getBoundingClientRect()
      haloRef.current.style.left = (r.left + r.width/2 - 110) + 'px'
      haloRef.current.style.top = (r.top + r.height/2 - 110) + 'px'
      haloRef.current.style.width = '220px'
      haloRef.current.style.height = '220px'
    }
    positionHalo()
    window.addEventListener('resize', positionHalo)
    return () => window.removeEventListener('resize', positionHalo)
  }, [])

  const glow = 0.35 + progress*0.3

  return (
    <>
      <div id="vignetteOverlay" ref={vignetteRef} />
      <div id="moonPhase" ref={moonRef}>
        <svg
          className="moon-svg"
          viewBox="0 0 100 100"
          style={{ filter: `drop-shadow(0 0 ${15+glow*35}px rgba(194,194,242,${glow})) drop-shadow(0 0 ${40+glow*50}px rgba(194,194,242,${glow*0.5}))` }}
        >
          <defs>
            <radialGradient id="mG" cx="40%" cy="40%">
              <stop offset="0%" stopColor="#fffde8" /><stop offset="60%" stopColor="#f0e9c8" /><stop offset="100%" stopColor="#d4cda6" />
            </radialGradient>
            <mask id="mM"><circle cx="50" cy="50" r="45" fill="white" /></mask>
          </defs>
          <circle cx="50" cy="50" r="45" fill="url(#mG)" mask="url(#mM)" />
          <circle cx="35" cy="32" r="4" fill="rgba(0,0,0,0.04)" />
          <circle cx="55" cy="45" r="6" fill="rgba(0,0,0,0.03)" />
          <circle cx="42" cy="62" r="3" fill="rgba(0,0,0,0.04)" />
          <circle cx="60" cy="30" r="2.5" fill="rgba(0,0,0,0.03)" />
        </svg>
      </div>
      <div
        ref={haloRef}
        style={{ position: 'fixed', zIndex: 2, pointerEvents: 'none', borderRadius: '50%', border: '2px solid transparent', transition: 'all 6s ease' }}
      />
    </>
  )
}
