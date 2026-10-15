import Link from 'next/link'
import { useRouter } from 'next/router'

export default function TopStoriesGrid({ articles }) {
  const { query } = useRouter()
  if (!articles.length) return null

  return (
    <section className="section">
      <h2 className="section-title">Top Stories</h2>
      <div className="stories-grid">
        {articles.map(a => (
          <Link key={a.id} href={`/${query.magazine}/magazine`} className="story-tile">
            {a.hero_image && <img src={a.hero_image} alt={a.title} className="tile-img" />}
            {!a.hero_image && <div className="tile-img tile-img--placeholder" />}
            {a.category && <span className="category-pill">{a.category}</span>}
            <p className="tile-title">{a.title}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
