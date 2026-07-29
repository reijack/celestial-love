import { TIMELINE } from '../content'

export default function Timeline() {
  return (
    <section id="timeline">
      <div className="section-header">
        <div className="section-eyebrow reveal">
          <span className="material-symbols-outlined filled" style={{ fontSize: '0.875rem' }}>star</span>Our Journey Together
        </div>
        <h2 className="text-headline gradient-text reveal reveal-delay-1">Our Story</h2>
        <p className="text-body-lg reveal reveal-delay-2" style={{ color: 'var(--on-surface-variant)', maxWidth: '38rem', margin: '1rem auto 0' }}>
          Every moment spent with you feels like a beautiful constellation slowly revealing itself across the night sky.
        </p>
      </div>
      <div className="timeline-wrap">
        <div className="timeline-line" />
        {TIMELINE.map((item, i) => {
          const onLeft = i % 2 === 0
          const card = (
            <div className={`timeline-card glass ${item.isToday ? 'today' : ''}`}>
              <span className={`timeline-date ${item.isToday ? 'today' : ''}`}>{item.date}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          )
          const dot = (
            <div className={`timeline-dot ${item.isToday ? 'today' : ''}`}>
              <span className="material-symbols-outlined filled" style={{ fontSize: item.isToday ? '1.5rem' : '1.125rem', color: item.isToday ? 'var(--on-primary)' : undefined }}>favorite</span>
            </div>
          )
          const delayClass = i % 3 === 0 ? 'reveal' : i % 3 === 1 ? 'reveal reveal-delay-1' : 'reveal reveal-delay-2'
          return (
            <div className={`timeline-item ${delayClass}`} key={item.date + item.title}>
              {onLeft ? card : <div className="timeline-spacer" />}
              {dot}
              {onLeft ? <div className="timeline-spacer" /> : card}
            </div>
          )
        })}
      </div>
    </section>
  )
}
