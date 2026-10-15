export default function EventRow({ event }) {
  const date = event.start_time ? new Date(event.start_time).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
  }) : null

  const statusIcon = event.is_editors_pick ? '⭐' : event.is_trending ? '🔥' : null

  return (
    <div className="event-row">
      <div className="event-row-left">
        {statusIcon && <span className="event-status-icon">{statusIcon}</span>}
      </div>
      <div className="event-row-body">
        <p className="event-row-title">{event.title}</p>
        {date && <p className="event-row-date">{date}</p>}
        {event.location && <p className="event-row-loc">@ {event.location}</p>}
      </div>
    </div>
  )
}
