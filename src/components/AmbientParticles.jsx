import { useMemo } from 'react'

function rnd(min, max) { return Math.random() * (max - min) + min }

export default function AmbientParticles() {
  const isSmall = typeof window !== 'undefined' && window.innerWidth < 760

  const fireflies = useMemo(() => {
    const count = isSmall ? 8 : 16
    return Array.from({ length: count }, () => {
      const size = rnd(2.5, 7)
      const colors = [
        'radial-gradient(circle, rgba(255,244,196,0.95) 0%, rgba(255,214,140,0.55) 45%, transparent 75%)',
        'radial-gradient(circle, rgba(227,184,234,0.85) 0%, rgba(194,194,242,0.45) 45%, transparent 75%)',
        'radial-gradient(circle, rgba(184,220,255,0.80) 0%, rgba(184,195,255,0.40) 45%, transparent 75%)',
        'radial-gradient(circle, rgba(255,200,180,0.85) 0%, rgba(255,170,150,0.40) 45%, transparent 75%)',
      ]
      return {
        size,
        left: rnd(0, 100), top: rnd(10, 95),
        fx1: rnd(-70,70), fy1: rnd(-70,70), fx2: rnd(-90,90), fy2: rnd(-50,50),
        fx3: rnd(-60,60), fy3: rnd(-80,80), fx4: rnd(-80,80), fy4: rnd(-40,40),
        driftDur: rnd(12,24), glowDur: rnd(2,4.5), d1: rnd(0,8), d2: rnd(0,4),
        bg: colors[Math.floor(Math.random() * colors.length)],
      }
    })
  }, [isSmall])

  const stardust = useMemo(() => {
    const count = isSmall ? 28 : 65
    return Array.from({ length: count }, () => {
      const colors = [
        'rgba(241,238,247,0.55)',
        'rgba(227,184,234,0.45)',
        'rgba(184,195,255,0.40)',
        'rgba(255,200,180,0.35)',
        'rgba(194,194,242,0.45)',
      ]
      return {
        size: rnd(0.4, 1.8), left: rnd(0,100), top: rnd(0,100),
        dx: rnd(-50,50), dy: rnd(-100,-15), floatDur: rnd(15,38), twinkleDur: rnd(2.5,6),
        d1: rnd(0,20), d2: rnd(0,5),
        bg: colors[Math.floor(Math.random() * colors.length)],
      }
    })
  }, [isSmall])

  // Crystal/diamond sparkle particles
  const crystals = useMemo(() => {
    const count = isSmall ? 4 : 8
    return Array.from({ length: count }, () => ({
      size: rnd(3, 6),
      left: rnd(5, 95), top: rnd(5, 90),
      rotateDur: rnd(8, 20),
      twinkleDur: rnd(3, 7),
      d1: rnd(0, 10),
      d2: rnd(0, 5),
    }))
  }, [isSmall])

  return (
    <>
      <div className="fireflies-layer">
        {fireflies.map((f, i) => (
          <div key={i} className="firefly" style={{
            width: f.size, height: f.size, left: `${f.left}vw`, top: `${f.top}vh`,
            background: f.bg,
            '--fx1': `${f.fx1}px`, '--fy1': `${f.fy1}px`, '--fx2': `${f.fx2}px`, '--fy2': `${f.fy2}px`,
            '--fx3': `${f.fx3}px`, '--fy3': `${f.fy3}px`, '--fx4': `${f.fx4}px`, '--fy4': `${f.fy4}px`,
            animationDuration: `${f.driftDur}s, ${f.glowDur}s`, animationDelay: `${f.d1}s, ${f.d2}s`,
          }} />
        ))}
      </div>
      <div className="stardust-layer">
        {stardust.map((d, i) => (
          <div key={i} className="stardust" style={{
            width: d.size, height: d.size, left: `${d.left}vw`, top: `${d.top}vh`,
            background: d.bg,
            '--dx': `${d.dx}px`, '--dy': `${d.dy}px`,
            animationDuration: `${d.floatDur}s, ${d.twinkleDur}s`, animationDelay: `${d.d1}s, ${d.d2}s`,
          }} />
        ))}
        {/* Crystal sparkle particles */}
        {crystals.map((c, i) => (
          <div key={`crystal-${i}`} style={{
            position: 'absolute',
            width: c.size,
            height: c.size,
            left: `${c.left}vw`,
            top: `${c.top}vh`,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.6), rgba(194,194,242,0.3))',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            animationName: 'crystal-spin, dust-twinkle',
            animationDuration: `${c.rotateDur}s, ${c.twinkleDur}s`,
            animationTimingFunction: 'linear, ease-in-out',
            animationIterationCount: 'infinite, infinite',
            animationDelay: `${c.d1}s, ${c.d2}s`,
            pointerEvents: 'none',
            willChange: 'transform, opacity',
            filter: 'drop-shadow(0 0 3px rgba(194,194,242,0.6))',
          }} />
        ))}
      </div>
      <style>{`
        @keyframes crystal-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
