import { useState } from 'react'

export default function ArticleCard({ card }) {
  const [shared, setShared] = useState(false)

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: card.title, text: card.title })
    } else {
      await navigator.clipboard.writeText(window.location.href)
    }
    setShared(true)
    setTimeout(() => setShared(false), 2000)
  }

  return (
    <article className="card card--article">
      <div className="card-hero">
        {card.hero_image && <img src={card.hero_image} alt={card.title} className="card-hero-img" />}
      </div>
      <div className="card-body">
        <h1 className="card-title">{card.title}</h1>
        <div className="card-meta">
          <button className="share-btn" onClick={share}>{shared ? 'Copied!' : 'Share'}</button>
          {card.category && <span className="category-pill">{card.category}</span>}
          {card.tags?.map(t => <span key={t} className="tag-pill">{t}</span>)}
        </div>
        {card.body && <div className="card-text">{card.body}</div>}
      </div>
    </article>
  )
}
