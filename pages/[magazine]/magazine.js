import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import ArticleCard from '../../components/cards/ArticleCard'
import AdCard from '../../components/cards/AdCard'
import VideoCard from '../../components/cards/VideoCard'
import EventCard from '../../components/cards/EventCard'
import SeenCard from '../../components/cards/SeenCard'

function buildFeed(articles, ads, events, seen) {
  const all = [
    ...articles.map(a => ({ ...a, _type: a.hero_type === 'video' ? 'video' : 'article' })),
    ...ads.map(a => ({ ...a, _type: 'ad' })),
    ...events.filter(e => e.reader_order != null).map(e => ({ ...e, _type: 'event' })),
    ...seen.map(s => ({ ...s, _type: 'seen' })),
  ]
  all.sort((a, b) => (a.reader_order ?? 9999) - (b.reader_order ?? 9999))
  return all
}

const CARD_COMPONENTS = {
  article: ArticleCard,
  video: VideoCard,
  ad: AdCard,
  event: EventCard,
  seen: SeenCard,
}

export default function ReaderPage() {
  const router = useRouter()
  const { magazine: slug } = router.query
  const [mag, setMag] = useState(null)
  const [feed, setFeed] = useState([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/magazine/${slug}`).then(r => r.json()).then(setMag)
    Promise.all([
      fetch(`/api/articles/${slug}`).then(r => r.json()),
      fetch(`/api/ads/${slug}`).then(r => r.json()),
      fetch(`/api/events/${slug}`).then(r => r.json()),
      fetch(`/api/seen/${slug}`).then(r => r.json()),
    ]).then(([articles, ads, events, seen]) => {
      setFeed(buildFeed(articles, ads, events, seen))
    })
  }, [slug])

  const prev = useCallback(() => setIndex(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIndex(i => Math.min(feed.length - 1, i + 1)), [feed.length])

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  if (!mag) return <div className="loading">Loading…</div>

  const current = feed[index]
  const CardComponent = current ? CARD_COMPONENTS[current._type] : null

  return (
    <Layout mag={mag} active="magazine">
      <div className="reader">
        {feed.length === 0 && <p className="reader-empty">No content yet.</p>}
        {current && <CardComponent card={current} mag={mag} />}
        <button className="reader-arrow reader-arrow--left" onClick={prev} disabled={index === 0}>‹</button>
        <button className="reader-arrow reader-arrow--right" onClick={next} disabled={index === feed.length - 1}>›</button>
        <div className="reader-dots">
          {feed.map((_, i) => (
            <span key={i} className={`dot ${i === index ? 'dot--active' : ''}`} onClick={() => setIndex(i)} />
          ))}
        </div>
      </div>
    </Layout>
  )
}
