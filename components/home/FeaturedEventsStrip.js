import Link from 'next/link'
import { useRouter } from 'next/router'

export default function FeaturedEventsStrip({ events }) {
  const { query } = useRouter()
  if (!events.length) return null

  return (
    <section className="section">
      <h2 className="section-title">Featured Events</h2>
      <div className="events-strip">
        {events.map(e => (
          <Link key={e.id} href={`/${query.magazine}/calendar`} className="event-strip-item">
            {e.image && <img src={e.image} alt={e.title} className="strip-img" />}
            <div className="strip-info">
              <p className="strip-title">{e.title}</p>
              {e.location && <p className="strip-loc">@ {e.location}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
