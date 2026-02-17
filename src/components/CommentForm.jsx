import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import './CommentForm.css'

function CommentForm({ placeId, onSubmit }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    author: '',
    rating: 5,
    text: ''
  })

  useEffect(() => {
    // Kullanıcı giriş yapmışsa ismini otomatik doldur
    if (user) {
      setFormData(prev => ({ ...prev, author: user.name }))
    }
  }, [user])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.text.trim() && formData.author.trim()) {
      onSubmit(formData)
      setFormData({ author: user?.name || '', rating: 5, text: '' })
    }
  }

  if (!user) {
    return (
      <div className="comment-form-login-prompt">
        <p>Yorum yapmak için lütfen giriş yapın.</p>
      </div>
    )
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="author">İsim</label>
        <input
          type="text"
          id="author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          required
          placeholder="Adınız"
          disabled={!!user}
        />
      </div>

      <div className="form-group">
        <label htmlFor="rating">Puan</label>
        <div className="rating-input">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`star-btn ${star <= formData.rating ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, rating: star })}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="text">Yorumunuz</label>
        <textarea
          id="text"
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          required
          rows="4"
          placeholder="Deneyiminizi paylaşın..."
        />
      </div>

      <button type="submit" className="submit-button">
        Yorumu Gönder
      </button>
      <p className="comment-info-text">
        ℹ️ Yorumunuz admin onayından sonra yayınlanacaktır.
      </p>
    </form>
  )
}

export default CommentForm

