import { useEffect, useRef, useState, useCallback } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Timeline from './components/Timeline'
import Letter from './components/Letter'
import Reasons from './components/Reasons'
import StarWishes from './components/StarWishes'
import Footer from './components/Footer'
import MusicPlayer from './components/MusicPlayer'
import QRLove from './components/QRLove'
import SkyCanvas from './components/SkyCanvas'
import AuroraCanvas from './components/AuroraCanvas'
import AmbientParticles from './components/AmbientParticles'
import MidnightSky from './components/MidnightSky'
import CustomCursor from './components/CustomCursor'
import { useScrollReveal } from './hooks'

const SECTION_IDS = ['#hero', '#timeline', '#letter', '#reasons', '#starwishes']

// Waktu-hari background gradient bands
const BANDS = [
  { start: 0, colors: ['rgba(184,195,255,0.09)','rgba(194,194,242,0.08)','rgba(120,120,180,0.05)'] },
  { start: 5, colors: ['rgba(255,183,197,0.15)','rgba(255,214,170,0.11)','rgba(194,194,242,0.07)'] },
  { start: 7, colors: ['rgba(184,220,255,0.13)','rgba(227,184,234,0.08)','rgba(194,242,230,0.05)'] },
  { start: 11, colors: ['rgba(184,220,255,0.16)','rgba(255,240,200,0.07)','rgba(194,194,242,0.05)'] },
  { start: 16, colors: ['rgba(255,150,120,0.17)','rgba(255,190,140,0.11)','rgba(227,150,184,0.09)'] },
  { start: 19, colors: ['rgba(227,184,234,0.12)','rgba(194,194,242,0.10)','rgba(184,195,255,0.07)'] },
  { start: 22, colors: ['rgba(194,194,242,0.10)','rgba(227,184,234,0.09)','rgba(184,195,255,0.06)'] },
]
function pickBand(hour) { let c = BANDS[0]; for (const b of BANDS) if (hour >= b.start) c = b; return c }

export default function App() {
  const [active, setActive] = useState('#hero')
  const [swUnlocked, setSwUnlocked] = useState(false)
  const [lockToast, setLockToast] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const overlayRef = useRef(null)

  useScrollReveal([swUnlocked])

  useEffect(() => {
    function applyTimeOfDay() {
      const hour = new Date().getHours()
      const band = pickBand(hour)
      if (overlayRef.current) {
        overlayRef.current.style.background =
          `radial-gradient(ellipse 60% 50% at 15% 10%, ${band.colors[0]}, transparent 60%),` +
          `radial-gradient(ellipse 50% 45% at 85% 20%, ${band.colors[1]}, transparent 60%),` +
          `radial-gradient(ellipse 70% 60% at 50% 100%, ${band.colors[2]}, transparent 70%)`
      }
    }
    applyTimeOfDay()
    const iv = setInterval(applyTimeOfDay, 5 * 60 * 1000)
    return () => clearInterval(iv)
  }, [])

  const scrollToSection = useCallback((id) => {
    const el = document.querySelector(id)
    if (!el) return
    const navH = document.querySelector('nav')?.offsetHeight || 0
    window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - navH - 16, behavior: 'smooth' })
  }, [])

  const handleNavigate = useCallback((id) => {
    if (id === '#starwishes' && !swUnlocked) { setLockToast(true); setTimeout(() => setLockToast(false), 2200); return }
    scrollToSection(id)
  }, [swUnlocked, scrollToSection])

  const handleUnlockStarWishes = useCallback(() => {
    if (!swUnlocked) {
      setSwUnlocked(true)
      requestAnimationFrame(() => requestAnimationFrame(() => window.dispatchEvent(new Event('resize'))))
    }
  }, [swUnlocked])

  // Scroll progress tracking + active section
  useEffect(() => {
    let ticking = false
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Update scroll progress
          const docHeight = document.documentElement.scrollHeight - window.innerHeight
          const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0
          setScrollProgress(Math.min(100, Math.max(0, progress)))

          // Update active section
          const navH = (document.querySelector('nav')?.offsetHeight || 0) + 32
          let current = '#hero'
          for (const id of SECTION_IDS) {
            const el = document.querySelector(id)
            if (el && el.getBoundingClientRect().top <= navH) current = id
          }
          setActive(current)

          ticking = false
        })
        ticking = true
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Scroll Progress Bar */}
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="bg-overlay" ref={overlayRef} />
      <SkyCanvas />
      <AuroraCanvas />
      <AmbientParticles />
      <MidnightSky />
      <CustomCursor />

      <Nav active={active} swUnlocked={swUnlocked} onNavigate={handleNavigate} onUnlockStarWishes={handleUnlockStarWishes} />
      <MusicPlayer />
      <QRLove />

      <Hero onNavigate={handleNavigate} />
      <Timeline />
      <Letter />
      <Reasons />
      <StarWishes unlocked={swUnlocked} />

      <Footer swUnlocked={swUnlocked} onNavigate={handleNavigate} onLockedClick={() => { setLockToast(true); setTimeout(() => setLockToast(false), 2200) }} />

      {lockToast && (
        <div className="sw-toast show">Tekan tombol "Star Wishes" di pojok kanan atas terlebih dahulu ✦</div>
      )}
    </>
  )
}
