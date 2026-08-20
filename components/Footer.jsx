export default function Footer({ swUnlocked, onNavigate, onLockedClick }) {
  const links = [
    { id: '#hero', label: 'Home' },
    { id: '#timeline', label: 'Timeline' },
    { id: '#letter', label: 'Letters' },
    { id: '#reasons', label: 'Reasons' },
    { id: '#starwishes', label: 'Star Wishes' },
  ]
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand"><span className="material-symbols-outlined filled" style={{ fontSize: '1rem' }}>star</span>Celestial Love</div>
        <div className="footer-links">
          {links.map((l) => (
            <a key={l.id} className={l.id === '#starwishes' && !swUnlocked ? 'sw-locked-link' : ''}
              onClick={() => (l.id === '#starwishes' && !swUnlocked ? onLockedClick() : onNavigate(l.id))}>
              {l.label}
            </a>
          ))}
        </div>
        <p className="footer-copy">Made with infinite love under the stars ✦</p>
      </div>
    </footer>
  )
}
