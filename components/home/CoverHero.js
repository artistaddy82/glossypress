export default function CoverHero({ mag }) {
  return (
    <section className="cover-hero">
      <div className="cover-image-wrap">
        {mag.cover_image
          ? <img src={mag.cover_image} alt={mag.issue_label || mag.brand_name} className="cover-image" />
          : <div className="cover-placeholder" />
        }
        <div className="cover-label">{mag.issue_label || 'Current Issue'}</div>
      </div>
    </section>
  )
}
