import { useState } from 'react'

export default function AdCard({ card }) {
  const [popupOpen, setPopupOpen] = useState(false)

  return (
    <div className="card card--ad">
      {card.photo && <img src={card.photo} alt="Ad" className="ad-photo" />}
      {card.cta_label && (
        <button className="ad-cta btn-primary" onClick={() => setPopupOpen(true)}>
          {card.cta_label}
        </button>
      )}

      {popupOpen && (
        <div className="overlay" onClick={() => setPopupOpen(false)}>
          <div className="popup" onClick={e => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setPopupOpen(false)}>✕</button>
            {card.phone && <a href={`tel:${card.phone}`} className="contact-btn">📞 {card.phone}</a>}
            {card.email && <a href={`mailto:${card.email}`} className="contact-btn">✉️ {card.email}</a>}
            {card.website && <a href={card.website} target="_blank" rel="noreferrer" className="contact-btn">🌐 Website</a>}
            {card.address && <p className="contact-addr">📍 {card.address}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
