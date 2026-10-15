export default function SeenCard({ card }) {
  return (
    <div className="card card--seen">
      <img src={card.photo} alt={card.caption || 'Seen'} className="seen-card-photo" />
      {card.caption && <p className="seen-card-caption">{card.caption}</p>}
      {card.author && <p className="seen-card-author">— {card.author}</p>}
    </div>
  )
}
