import { useEffect } from 'react'

export function spawnHearts(clientX, clientY) {
  for (let i = 0; i < 6; i++) {
    const h = document.createElement('span')
    h.className = 'heart-particle material-symbols-outlined filled'
    h.textContent = 'favorite'
    h.style.left = (clientX + (Math.random()-0.5)*60) + 'px'
    h.style.top = (clientY + (Math.random()-0.5)*30) + 'px'
    h.style.fontSize = (0.8 + Math.random()*1) + 'rem'
    h.style.animationDuration = (0.8 + Math.random()*0.6) + 's'
    document.body.appendChild(h)
    h.addEventListener('animationend', () => h.remove())
  }
}

// Observer tunggal dipakai ulang untuk semua elemen .reveal di halaman
export function useScrollReveal(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.visible)')
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) en.target.classList.add('visible') })
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
