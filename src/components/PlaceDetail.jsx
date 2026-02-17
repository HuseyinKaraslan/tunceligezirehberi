import { useState, useEffect } from 'react'
import { subscribeToComments } from '../services/firebaseComments'
import CommentForm from './CommentForm'
import CommentList from './CommentList'
import './PlaceDetail.css'

function PlaceDetail({ place, onBack, onAddComment, onUpdateComment, onDeleteComment }) {
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [comments, setComments] = useState([])
  const [placeRating, setPlaceRating] = useState(place?.rating || 0)

  useEffect(() => {
    if (!place?.id) return

    // Real-time yorum dinleyicisi
    const unsubscribe = subscribeToComments(place.id, (updatedComments) => {
      setComments(updatedComments)
      
      // Rating'i güncelle
      if (updatedComments.length > 0) {
        const totalRating = updatedComments.reduce((sum, c) => sum + (c.rating || 0), 0)
        const averageRating = totalRating / updatedComments.length
        setPlaceRating(parseFloat(averageRating.toFixed(1)))
      } else {
        setPlaceRating(0)
      }
    })

    return () => unsubscribe()
  }, [place?.id])

  if (!place) return null

  const categoryColors = {
    tarihi: 'var(--accent-warning)',
    dini: 'var(--accent-success)',
    doğal: 'var(--accent-primary)',
    yemek: 'var(--accent-secondary)',
    vakit: '#9b59b6'
  }

  const categoryNames = {
    tarihi: 'Tarihi Mekan',
    dini: 'Dini Mekan',
    doğal: 'Doğal Mekan',
    yemek: 'Yemek & İçecek',
    vakit: 'Vakit Geçirme'
  }

  return (
    <div className="place-detail">
      <button className="back-button" onClick={onBack}>
        ← Geri Dön
      </button>

      <div className="detail-header">
        <div className="detail-image-container">
          <img src={place.image} alt={place.name} className="detail-image" />
        </div>
        <div className="detail-info">
          <span
            className="detail-category"
            style={{ backgroundColor: categoryColors[place.category] }}
          >
            {categoryNames[place.category]}
          </span>
          <h1 className="detail-name">{place.name}</h1>
          <div className="detail-rating">
            <span className="rating-stars-large">
              {'★'.repeat(Math.round(placeRating))}
              {'☆'.repeat(5 - Math.round(placeRating))}
            </span>
            <span className="rating-value-large">{placeRating.toFixed(1)}</span>
            <span className="rating-count">({comments.length} değerlendirme)</span>
          </div>
          <p className="detail-address">📍 {place.address}</p>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-section">
          <h2>Hakkında</h2>
          <p>{place.description}</p>
        </div>

        <div className="detail-section">
          <div className="section-header">
            <h2>Yorumlar ({comments.length})</h2>
            <button
              className="add-comment-button"
              onClick={() => setShowCommentForm(!showCommentForm)}
            >
              {showCommentForm ? '✕ İptal' : '+ Yorum Ekle'}
            </button>
          </div>

          {showCommentForm && (
            <CommentForm
              placeId={place.id}
              onSubmit={(comment) => {
                onAddComment(place.id, comment)
                setShowCommentForm(false)
              }}
            />
          )}

          <CommentList
            comments={comments}
            placeId={place.id}
            onUpdate={onUpdateComment}
            onDelete={onDeleteComment}
          />
        </div>
      </div>
    </div>
  )
}

export default PlaceDetail



