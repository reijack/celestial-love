import { HERO_IMG } from '../content'

export default function Hero({ onNavigate }) {
  return (
    <section id="hero">
      <div className="hero-card glass reveal">
        <span className="material-symbols-outlined filled hero-deco-top twinkle" style={{ fontSize: '1.5rem' }}>stars</span>
        <span className="material-symbols-outlined hero-deco-bottom twinkle" style={{ fontSize: '1.25rem' }}>flare</span>
        <div className="hero-img-wrap">
          <div className="hero-img-glow" />
          <img className="hero-img" src={HERO_IMG} alt="Cute cat with heart balloon" />
        </div>
        <h1 className="hero-title reveal reveal-delay-1">Our Celestial Journey</h1>
        <p className="hero-sub reveal reveal-delay-2">
          Written in the stars, illuminated by every moment we share. A premium experience of our romantic tale.
        </p>
        <div className="reveal reveal-delay-3">
          <button className="btn-celestial" onClick={() => onNavigate('#timeline')}>
            Begin Our Story <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  )
}
