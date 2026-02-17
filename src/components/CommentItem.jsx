import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './CommentItem.css'

function CommentItem({ comment, placeId, onUpdate, onDelete }) {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    author: comment.author,
    rating: comment.rating,
    text: comment.text
  })

  // Kullanıcı yorum sahibi mi kontrol et (isim ve email ile)
  const isOwner = user && (comment.userId === user.id || comment.author === user.name)

  const handleUpdate = () => {
    onUpdate(placeId, comment.id, editData)
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (window.confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      onDelete(placeId, comment.id)
    }
  }

  if (isEditing) {
    return (
      <div className="comment-item editing">
        <div className="edit-form">
          <input
            type="text"
            value={editData.author}
            onChange={(e) => setEditData({ ...editData, author: e.target.value })}
            className="edit-input"
          />
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${star <= editData.rating ? 'active' : ''}`}
                onClick={() => setEditData({ ...editData, rating: star })}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={editData.text}
            onChange={(e) => setEditData({ ...editData, text: e.target.value })}
            className="edit-textarea"
            rows="3"
          />
          <div className="edit-actions">
            <button className="save-btn" onClick={handleUpdate}>
              Kaydet
            </button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>
              İptal
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="comment-item">
      <div className="comment-header">
        <div className="comment-author-info">
          <h4 className="comment-author">{comment.author}</h4>
          <span className="comment-date">{comment.date}</span>
        </div>
        <div className="comment-rating">
          <span className="comment-stars">
            {'★'.repeat(comment.rating)}
            {'☆'.repeat(5 - comment.rating)}
          </span>
        </div>
      </div>
      <p className="comment-text">{comment.text}</p>
      {isOwner && (
        <div className="comment-actions">
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            ✏️ Düzenle
          </button>
          <button className="delete-btn" onClick={handleDelete}>
            🗑️ Sil
          </button>
        </div>
      )}
    </div>
  )
}

export default CommentItem

