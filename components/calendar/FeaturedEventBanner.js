export default function FeaturedEventBanner({ event }) {
  if (!event) return null
  const date = event.start_time ? new Date(event.start_time).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  }) : null

  return (
    <div className="featured-banner" style={event.image ? { backgroundImage: `url(${event.image})` } : {}}>
      <div className="featured-banner-overlay">
        <p className="featured-badge">Featured</p>
        <h2 className="featured-title">{event.title}</h2>
        {event.location && <p className="featured-loc">@ {event.location}</p>}
        {date && <p className="featured-date">{date}</p>}
      </div>
    </div>
  )
}
