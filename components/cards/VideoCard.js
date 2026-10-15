export default function VideoCard({ card }) {
  const embedUrl = card.hero_video_url?.replace('watch?v=', 'embed/')

  return (
    <div className="card card--video">
      {embedUrl
        ? <iframe
            className="video-player"
            src={embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        : card.hero_image && <img src={card.hero_image} alt={card.title} className="card-hero-img" />
      }
      <div className="card-body">
        <h1 className="card-title">{card.title}</h1>
        {card.body && <p className="card-text">{card.body}</p>}
      </div>
    </div>
  )
}
