import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import CoverHero from '../../components/home/CoverHero'
import TopStoriesGrid from '../../components/home/TopStoriesGrid'
import FeaturedEventsStrip from '../../components/home/FeaturedEventsStrip'
import SeenStrip from '../../components/home/SeenStrip'

export default function CoverPage() {
  const router = useRouter()
  const { magazine: slug } = router.query
  const [mag, setMag] = useState(null)
  const [topStories, setTopStories] = useState([])
  const [events, setEvents] = useState([])
  const [seen, setSeen] = useState([])

  useEffect(() => {
    if (!slug) return
    fetch(`/api/magazine/${slug}`).then(r => r.json()).then(setMag)
    fetch(`/api/articles/${slug}?top_stories=1`).then(r => r.json()).then(setTopStories)
    fetch(`/api/events/${slug}`).then(r => r.json()).then(setEvents)
    fetch(`/api/seen/${slug}`).then(r => r.json()).then(setSeen)
  }, [slug])

  if (!mag) return <div className="loading">Loading…</div>

  return (
    <Layout mag={mag} active="home">
      <CoverHero mag={mag} />
      <TopStoriesGrid articles={topStories} />
      <FeaturedEventsStrip events={events.filter(e => e.is_featured)} />
      <SeenStrip posts={seen} />
    </Layout>
  )
}
