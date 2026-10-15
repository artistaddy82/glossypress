export default function EventCard({ card }) {
  const date = card.start_time ? new Date(card.start_time).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
  }) : null

  return (
    <div className="card card--event">
      {card.image && <img src={card.image} alt={card.title} className="card-hero-img" />}
      <div className="card-body">
        <h1 className="card-title">{card.title}</h1>
        {date && <p className="event-date">{date}</p>}
        {card.location && <p className="event-loc">@ {card.location}</p>}
        {card.description && <p className="card-text">{card.description}</p>}
        <div className="event-actions">
          {card.ticket_url && <a href={card.ticket_url} target="_blank" rel="noreferrer" className="btn-primary">Get Tickets</a>}
          {card.address && (
            <a href={`https://maps.google.com/?q=${encodeURIComponent(card.address)}`} target="_blank" rel="noreferrer" className="btn-secondary">Directions</a>
          )}
        </div>
      </div>
    </div>
  )
}
