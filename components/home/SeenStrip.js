export default function SeenStrip({ posts }) {
  if (!posts.length) return null

  return (
    <section className="section">
      <h2 className="section-title">Seen</h2>
      <div className="seen-strip">
        {posts.map(p => (
          <div key={p.id} className="seen-tile">
            <img src={p.photo} alt={p.caption || 'Seen'} className="seen-img" />
            {p.caption && <p className="seen-caption">{p.caption}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
