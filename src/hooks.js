import { useEffect } from 'react'

export function spawnHearts(clientX, clientY) {
  const emojis = ['favorite', 'star', 'auto_awesome']
  for (let i = 0; i < 8; i++) {
    const h = document.createElement('span')
    const isHeart = i < 5
    h.className = `heart-particle material-symbols-outlined filled`
    h.textContent = isHeart ? 'favorite' : emojis[Math.floor(Math.random() * emojis.length)]
    h.style.left = (clientX + (Math.random() - 0.5) * 70) + 'px'
    h.style.top = (clientY + (Math.random() - 0.5) * 35) + 'px'
    h.style.fontSize = (0.7 + Math.random() * 1.1) + 'rem'
    h.style.animationDuration = (0.7 + Math.random() * 0.7) + 's'

    if (!isHeart) {
      h.style.color = Math.random() > 0.5 ? 'var(--secondary)' : 'var(--primary)'
    }

    document.body.appendChild(h)
    h.addEventListener('animationend', () => h.remove())
  }
}

// Observer tunggal memakai IntersectionObserver C++ native thread
export function useScrollReveal(deps = []) {
  useEffect(() => {
    const selectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale'
    const els = document.querySelectorAll(selectors)

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('visible')
          io.unobserve(en.target) // Stop observing once revealed
        }
      })
    }, { threshold: 0.05, rootMargin: '80px 0px 80px 0px' })

    els.forEach((el) => io.observe(el))

    // Fallback: ensure all elements become visible after delay
    const fallbackTimer = setTimeout(() => {
      document.querySelectorAll(selectors).forEach((el) => el.classList.add('visible'))
    }, 500)

    return () => {
      io.disconnect()
      clearTimeout(fallbackTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
