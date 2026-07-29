import { HERO_IMG, CARD_CAT_IMG_1, CARD_CAT_IMG_2, CARD_CAT_IMG_3 } from '../content'
import { spawnHearts } from '../hooks'

export default function Reasons() {
  return (
    <section id="reasons">
      <div className="reasons-layout">
        <aside className="reasons-sidebar reveal">
          <div className="reasons-sidebar-header">
            <div className="reasons-sidebar-avatar">
              <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', color: 'var(--on-secondary-container)' }}>pets</span>
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.125rem', color: 'var(--secondary)', fontWeight: 500 }}>Our Story</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)', letterSpacing: '0.04em', fontWeight: 600 }}>Written in the stars</div>
            </div>
          </div>
          <button
            style={{ marginTop: '1.5rem', width: '100%', background: 'var(--surface-highest)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--on-surface)', padding: '0.75rem', borderRadius: '0.875rem', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            onClick={(e) => spawnHearts(e.clientX, e.clientY)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>send</span>Send Love
          </button>
        </aside>
        <main className="reasons-main">
          <header className="reveal" style={{ marginBottom: '3rem' }}>
            <div className="section-eyebrow" style={{ display: 'inline-flex' }}>
              <span className="material-symbols-outlined twinkle" style={{ fontSize: '0.875rem' }}>star</span>Endless Reasons
            </div>
            <h1 className="text-display" style={{ marginTop: '1rem', color: 'var(--on-surface)' }}>My Favorite Things About Us</h1>
            <p className="text-body-lg" style={{ color: 'var(--on-surface-variant)', marginTop: '0.75rem', maxWidth: '42rem' }}>
              Every little detail that makes our universe complete.
            </p>
          </header>

          <div className="bento-grid">
            <div className="glass-card constellation-bg reveal bento-span-2" style={{ borderRadius: '1.5rem', padding: '2rem', position: 'relative', overflow: 'visible' }}>
              <img className="card-cat-peek" alt="Cat" src={CARD_CAT_IMG_1} style={{ top: '-2rem', right: '-1rem', width: '5rem', height: '5rem', borderWidth: '3px' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom right,rgba(227,184,234,0.08),rgba(194,194,242,0.03))', borderRadius: '1.5rem', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="reason-icon reason-icon-secondary" style={{ width: '3rem', height: '3rem', marginBottom: 0 }}><span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>air</span></div>
                  <div className="reason-icon reason-icon-primary" style={{ width: '3rem', height: '3rem', marginBottom: 0 }}><span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>water_drop</span></div>
                </div>
                <div>
                  <h3 className="reason-card-title" style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Our Zodiac Connection <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>stars</span>
                  </h3>
                  <p className="reason-card-text">Libra and Aquarius — air signs meant to be. The way we balance each other and float through life together is pure magic.</p>
                </div>
              </div>
            </div>

            <div className="glass-card constellation-bg reveal reveal-delay-1" style={{ borderRadius: '1.5rem', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '16rem', height: '16rem', background: 'rgba(194,194,242,0.1)', borderRadius: '9999px', filter: 'blur(3rem)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div className="reason-icon reason-icon-primary"><span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>dark_mode</span></div>
                <div><h3 className="reason-card-title">Late Night Conversations</h3><p className="reason-card-text">The way the world quietens down and it's just our voices whispering secrets to the stars.</p></div>
              </div>
            </div>

            <div className="glass-card constellation-bg reveal reveal-delay-2" style={{ borderRadius: '1.5rem', padding: '2rem', position: 'relative', overflow: 'visible' }}>
              <img className="card-cat-peek" alt="Cat" src={CARD_CAT_IMG_2} style={{ top: '-1.5rem', left: '-1rem', width: '3.5rem', height: '3.5rem', borderWidth: '2px', transform: 'rotate(-10deg)' }} />
              <div style={{ position: 'relative', zIndex: 10 }}>
                <div className="reason-icon reason-icon-secondary" style={{ width: '2.5rem', height: '2.5rem', marginBottom: '1rem' }}><span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>coffee</span></div>
                <h3 className="reason-card-title-sm">Morning Rituals</h3><p className="reason-card-text-sm">How you always know exactly how I like my tea before I even ask.</p>
              </div>
            </div>

            <div className="glass-card constellation-bg reveal reveal-delay-3" style={{ borderRadius: '1.5rem', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'relative', zIndex: 10 }}>
                <div className="reason-icon reason-icon-tertiary" style={{ width: '2.5rem', height: '2.5rem', marginBottom: '1rem' }}><span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>music_note</span></div>
                <h3 className="reason-card-title-sm">Our Shared Playlist</h3><p className="reason-card-text-sm">The eclectic mix of songs that somehow perfectly maps our entire history together.</p>
              </div>
            </div>

            <div className="glass-card constellation-bg reveal reveal-delay-1" style={{ borderRadius: '1.5rem', padding: '2rem', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom right,transparent,rgba(194,194,242,0.04))', borderRadius: '1.5rem', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '4rem', height: '4rem', borderRadius: '9999px', background: 'var(--surface-high)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }} className="floating-element">
                  <span className="material-symbols-outlined filled heartbeat" style={{ fontSize: '1.75rem', color: 'var(--error)' }}>favorite</span>
                </div>
                <h3 className="reason-card-title">Your Laugh</h3><p className="reason-card-text" style={{ textAlign: 'center' }}>It's my absolute favorite sound in the universe. It brightens even the darkest of days.</p>
              </div>
            </div>

            <div className="glass-card constellation-bg reveal reveal-delay-2 bento-span-2" style={{ borderRadius: '1.5rem', padding: '2rem', position: 'relative', overflow: 'visible' }}>
              <img className="card-cat-peek" alt="Cat" src={CARD_CAT_IMG_3} style={{ bottom: '-1.5rem', right: '2rem', width: '4.5rem', height: '4.5rem', borderWidth: '3px' }} />
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(to right,var(--secondary),var(--primary),transparent)', opacity: 0.4, borderRadius: '1.5rem 1.5rem 0 0' }} />
              <div style={{ position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="reason-icon reason-icon-bright" style={{ width: '2.5rem', height: '2.5rem', marginBottom: 0 }}><span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>flight_takeoff</span></div>
                  <h3 className="reason-card-title-sm" style={{ marginBottom: 0 }}>Spontaneous Adventures</h3>
                </div>
                <p className="reason-card-text">Whether it's a road trip to nowhere or building a living room fort, every mundane day turns into an adventure with you.</p>
              </div>
            </div>
          </div>

          <div className="reasons-cat-section reveal">
            <div className="reasons-cat-wrap floating-element">
              <div className="reasons-cat-glow" /><img className="reasons-cat-img" alt="Cat" src={HERO_IMG} />
            </div>
            <h3 className="reason-card-title" style={{ marginTop: '2rem' }}>And so many more...</h3>
            <p className="reason-card-text-sm" style={{ marginTop: '0.5rem' }}>To the moon, the stars, and back.</p>
          </div>
        </main>
      </div>
    </section>
  )
}
