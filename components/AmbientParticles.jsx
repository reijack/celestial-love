import { useMemo } from 'react'

function rnd(min, max) {
  return Math.random() * (max - min) + min
}

export default function AmbientParticles() {
  const isSmall = typeof window !== 'undefined' && window.innerWidth < 760

  // Glowing fireflies
  const fireflies = useMemo(() => {
    const count = isSmall ? 10 : 20
    return Array.from({ length: count }, () => {
      const size = rnd(3, 7.5)
      const colors = [
        'radial-gradient(circle, rgba(255,244,196,0.95) 0%, rgba(255,214,140,0.5) 45%, transparent 75%)',
        'radial-gradient(circle, rgba(227,184,234,0.9) 0%, rgba(194,194,242,0.45) 45%, transparent 75%)',
        'radial-gradient(circle, rgba(184,220,255,0.85) 0%, rgba(184,195,255,0.4) 45%, transparent 75%)',
        'radial-gradient(circle, rgba(255,200,215,0.9) 0%, rgba(255,170,190,0.45) 45%, transparent 75%)',
        'radial-gradient(circle, rgba(200,245,255,0.9) 0%, rgba(160,220,255,0.45) 45%, transparent 75%)',
      ]
      return {
        size,
        left: rnd(2, 98),
        top: rnd(8, 92),
        fx1: rnd(-80, 80),
        fy1: rnd(-70, 70),
        fx2: rnd(-95, 95),
        fy2: rnd(-60, 60),
        fx3: rnd(-70, 70),
        fy3: rnd(-85, 85),
        fx4: rnd(-85, 85),
        fy4: rnd(-45, 45),
        driftDur: rnd(14, 26),
        glowDur: rnd(2.2, 5),
        d1: rnd(0, 8),
        d2: rnd(0, 4),
        bg: colors[Math.floor(Math.random() * colors.length)],
      }
    })
  }, [isSmall])

  // Ambient Stardust
  const stardust = useMemo(() => {
    const count = isSmall ? 35 : 75
    return Array.from({ length: count }, () => {
      const colors = [
        'rgba(241,238,247,0.65)',
        'rgba(227,184,234,0.55)',
        'rgba(184,195,255,0.5)',
        'rgba(255,200,215,0.45)',
        'rgba(194,194,242,0.55)',
        'rgba(255,235,190,0.5)',
      ]
      return {
        size: rnd(0.5, 2.2),
        left: rnd(0, 100),
        top: rnd(0, 100),
        dx: rnd(-60, 60),
        dy: rnd(-110, -20),
        floatDur: rnd(16, 40),
        twinkleDur: rnd(2.5, 6),
        d1: rnd(0, 20),
        d2: rnd(0, 5),
        bg: colors[Math.floor(Math.random() * colors.length)],
      }
    })
  }, [isSmall])

  // Sparkling Diamond Crystals
  const crystals = useMemo(() => {
    const count = isSmall ? 6 : 12
    return Array.from({ length: count }, () => ({
      size: rnd(3.5, 7),
      left: rnd(4, 96),
      top: rnd(4, 92),
      rotateDur: rnd(8, 22),
      twinkleDur: rnd(3, 6.5),
      d1: rnd(0, 10),
      d2: rnd(0, 5),
    }))
  }, [isSmall])

  return (
    <>
      <div className="fireflies-layer">
        {fireflies.map((f, i) => (
          <div
            key={i}
            className="firefly"
            style={{
              width: f.size,
              height: f.size,
              left: `${f.left}vw`,
              top: `${f.top}vh`,
              background: f.bg,
              '--fx1': `${f.fx1}px`,
              '--fy1': `${f.fy1}px`,
              '--fx2': `${f.fx2}px`,
              '--fy2': `${f.fy2}px`,
              '--fx3': `${f.fx3}px`,
              '--fy3': `${f.fy3}px`,
              '--fx4': `${f.fx4}px`,
              '--fy4': `${f.fy4}px`,
              animationDuration: `${f.driftDur}s, ${f.glowDur}s`,
              animationDelay: `${f.d1}s, ${f.d2}s`,
            }}
          />
        ))}
      </div>

      <div className="stardust-layer">
        {stardust.map((d, i) => (
          <div
            key={i}
            className="stardust"
            style={{
              width: d.size,
              height: d.size,
              left: `${d.left}vw`,
              top: `${d.top}vh`,
              background: d.bg,
              '--dx': `${d.dx}px`,
              '--dy': `${d.dy}px`,
              animationDuration: `${d.floatDur}s, ${d.twinkleDur}s`,
              animationDelay: `${d.d1}s, ${d.d2}s`,
            }}
          />
        ))}

        {/* Diamond crystals */}
        {crystals.map((c, i) => (
          <div
            key={`crystal-${i}`}
            className="crystal-sparkle"
            style={{
              width: c.size,
              height: c.size,
              left: `${c.left}vw`,
              top: `${c.top}vh`,
              animationDuration: `${c.rotateDur}s, ${c.twinkleDur}s`,
              animationDelay: `${c.d1}s, ${c.d2}s`,
            }}
          />
        ))}
      </div>
    </>
  )
}
