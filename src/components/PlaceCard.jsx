import './PlaceCard.css'

function PlaceCard({ place, onClick }) {
  const categoryColors = {
    tarihi: 'var(--accent-warning)',
    dini: 'var(--accent-success)',
    doğal: 'var(--accent-primary)',
    yemek: 'var(--accent-secondary)',
    vakit: '#9b59b6'
  }

  const categoryNames = {
    tarihi: 'Tarihi',
    dini: 'Dini',
    doğal: 'Doğal',
    yemek: 'Yemek & İçecek',
    vakit: 'Vakit Geçirme'
  }

  return (
    <div className="place-card" onClick={onClick}>
      <div className="place-image-container">
        <img src={place.image} alt={place.name} className="place-image" />
        <span
          className="place-category-badge"
          style={{ backgroundColor: categoryColors[place.category] }}
        >
          {categoryNames[place.category]}
        </span>
      </div>
      <div className="place-content">
        <h3 className="place-name">{place.name}</h3>
        <p className="place-description">{place.description}</p>
        <div className="place-footer">
          <div className="place-rating">
            <span className="rating-stars">
              {'★'.repeat(Math.round(place.rating || 0))}
              {'☆'.repeat(5 - Math.round(place.rating || 0))}
            </span>
            <span className="rating-value">{(place.rating || 0).toFixed(1)}</span>
          </div>
          <span className="place-comments-count">
            💬 {place.commentCount || 0} yorum
          </span>
        </div>
      </div>
    </div>
  )
}

export default PlaceCard



