import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import FeaturedEventBanner from '../../components/calendar/FeaturedEventBanner'
import FilterBar from '../../components/calendar/FilterBar'
import EventRow from '../../components/calendar/EventRow'

const PAGE_SIZE = 20

export default function CalendarPage() {
  const router = useRouter()
  const { magazine: slug } = router.query
  const [mag, setMag] = useState(null)
  const [events, setEvents] = useState([])
  const [filters, setFilters] = useState({ tag: '', sort: 'date', time_of_day: '' })
  const [visible, setVisible] = useState(PAGE_SIZE)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/magazine/${slug}`).then(r => r.json()).then(setMag)
  }, [slug])

  useEffect(() => {
    if (!slug) return
    const params = new URLSearchParams(
      Object.entries(filters).filter(([, v]) => v)
    )
    fetch(`/api/events/${slug}?${params}`).then(r => r.json()).then(events => {
      setEvents(events)
      setVisible(PAGE_SIZE)
    })
  }, [slug, filters])

  if (!mag) return <div className="loading">Loading…</div>

  const featured = events.find(e => e.is_featured)
  const listed = events.slice(0, visible)

  return (
    <Layout mag={mag} active="calendar">
      {featured && <FeaturedEventBanner event={featured} />}
      <FilterBar tags={mag.tags} filters={filters} onChange={setFilters} />
      <div className="event-list">
        {listed.map(e => <EventRow key={e.id} event={e} />)}
        {visible < events.length && (
          <button className="load-more" onClick={() => setVisible(v => v + PAGE_SIZE)}>
            Load More
          </button>
        )}
      </div>
    </Layout>
  )
}
