import { useMemo } from 'react'

function rnd(min, max) { return Math.random() * (max - min) + min }

export default function AmbientParticles() {
  const isSmall = typeof window !== 'undefined' && window.innerWidth < 760

  const fireflies = useMemo(() => {
    const count = isSmall ? 7 : 12
    return Array.from({ length: count }, () => {
      const size = rnd(3, 7)
      return {
        size,
        left: rnd(0, 100), top: rnd(10, 95),
        fx1: rnd(-60,60), fy1: rnd(-60,60), fx2: rnd(-80,80), fy2: rnd(-40,40),
        fx3: rnd(-50,50), fy3: rnd(-70,70), fx4: rnd(-70,70), fy4: rnd(-30,30),
        driftDur: rnd(14,26), glowDur: rnd(2.5,5), d1: rnd(0,8), d2: rnd(0,4),
      }
    })
  }, [isSmall])

  const stardust = useMemo(() => {
    const count = isSmall ? 22 : 50
    return Array.from({ length: count }, () => ({
      size: rnd(0.5, 1.6), left: rnd(0,100), top: rnd(0,100),
      dx: rnd(-40,40), dy: rnd(-90,-20), floatDur: rnd(18,40), twinkleDur: rnd(3,7),
      d1: rnd(0,20), d2: rnd(0,5),
    }))
  }, [isSmall])

  return (
    <>
      <div className="fireflies-layer">
        {fireflies.map((f, i) => (
          <div key={i} className="firefly" style={{
            width: f.size, height: f.size, left: `${f.left}vw`, top: `${f.top}vh`,
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
            '--dx': `${d.dx}px`, '--dy': `${d.dy}px`,
            animationDuration: `${d.floatDur}s, ${d.twinkleDur}s`, animationDelay: `${d.d1}s, ${d.d2}s`,
          }} />
        ))}
      </div>
    </>
  )
}
