import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { addPlace, updatePlace, deletePlace } from '../services/firebasePlaces'
import { deleteComment, getAllComments, getPendingComments, approveComment, rejectComment } from '../services/firebaseComments'
import './AdminPanel.css'

function AdminPanel({ places, onUpdatePlaces, onBack }) {
  const { isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState('places') // 'places', 'comments' veya 'approvals'
  const [editingPlace, setEditingPlace] = useState(null)
  const [showPlaceForm, setShowPlaceForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: 'doğal',
    description: '',
    address: '',
    image: ''
  })

  const [allComments, setAllComments] = useState([])
  const [pendingComments, setPendingComments] = useState([])

  // Tüm yorumları Firebase'den yükle
  useEffect(() => {
    const loadAllComments = async () => {
      const result = await getAllComments()
      if (result.success) {
        // Her yorum için mekan adını bul
        const commentsWithPlaceNames = result.comments.map(comment => {
          const place = places.find(p => p.id === comment.placeId)
          return {
            ...comment,
            placeName: place?.name || 'Bilinmeyen Mekan'
          }
        })
        setAllComments(commentsWithPlaceNames)
      }
    }
    
    loadAllComments()
  }, [places])

  // Bekleyen yorumları yükle
  useEffect(() => {
    const loadPendingComments = async () => {
      const result = await getPendingComments()
      if (result.success) {
        // Her yorum için mekan adını bul
        const commentsWithPlaceNames = result.comments.map(comment => {
          const place = places.find(p => p.id === comment.placeId)
          return {
            ...comment,
            placeName: place?.name || 'Bilinmeyen Mekan'
          }
        })
        setPendingComments(commentsWithPlaceNames)
      }
    }
    
    loadPendingComments()
    
    // Her 5 saniyede bir yenile (real-time için)
    const interval = setInterval(loadPendingComments, 5000)
    return () => clearInterval(interval)
  }, [places])

  useEffect(() => {
    if (editingPlace) {
      setFormData({
        name: editingPlace.name,
        category: editingPlace.category,
        description: editingPlace.description,
        address: editingPlace.address,
        image: editingPlace.image
      })
      setShowPlaceForm(true)
    }
  }, [editingPlace])

  if (!isAdmin) {
    return (
      <div className="admin-panel">
        <div className="admin-error">
          <p>Bu sayfaya erişim yetkiniz yok.</p>
          <button onClick={onBack} className="back-button">Geri Dön</button>
        </div>
      </div>
    )
  }

  const handleAddPlace = async (e) => {
    e.preventDefault()
    
    if (editingPlace) {
      // Mekan güncelle
      await updatePlace(editingPlace.id, formData)
    } else {
      // Yeni mekan ekle
      await addPlace(formData)
    }
    
    setShowPlaceForm(false)
    setEditingPlace(null)
    setFormData({
      name: '',
      category: 'doğal',
      description: '',
      address: '',
      image: ''
    })
  }

  const handleDeletePlace = async (placeId) => {
    if (window.confirm('Bu mekanı silmek istediğinizden emin misiniz?')) {
      await deletePlace(placeId)
    }
  }

  const handleDeleteComment = async (placeId, commentId) => {
    if (window.confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      await deleteComment(commentId)
      // Yorumları yeniden yükle
      const result = await getAllComments()
      if (result.success) {
        const commentsWithPlaceNames = result.comments.map(comment => {
          const place = places.find(p => p.id === comment.placeId)
          return {
            ...comment,
            placeName: place?.name || 'Bilinmeyen Mekan'
          }
        })
        setAllComments(commentsWithPlaceNames)
      }
    }
  }

  const handleApproveComment = async (commentId, placeId) => {
    const result = await approveComment(commentId)
    if (result.success) {
      // Bekleyen yorumları yeniden yükle
      const pendingResult = await getPendingComments()
      if (pendingResult.success) {
        const commentsWithPlaceNames = pendingResult.comments.map(comment => {
          const place = places.find(p => p.id === comment.placeId)
          return {
            ...comment,
            placeName: place?.name || 'Bilinmeyen Mekan'
          }
        })
        setPendingComments(commentsWithPlaceNames)
      }
      // Tüm yorumları da yenile
      const allResult = await getAllComments()
      if (allResult.success) {
        const commentsWithPlaceNames = allResult.comments.map(comment => {
          const place = places.find(p => p.id === comment.placeId)
          return {
            ...comment,
            placeName: place?.name || 'Bilinmeyen Mekan'
          }
        })
        setAllComments(commentsWithPlaceNames)
      }
    }
  }

  const handleRejectComment = async (commentId, placeId) => {
    if (window.confirm('Bu yorumu reddetmek istediğinizden emin misiniz?')) {
      const result = await rejectComment(commentId)
      if (result.success) {
        // Bekleyen yorumları yeniden yükle
        const pendingResult = await getPendingComments()
        if (pendingResult.success) {
          const commentsWithPlaceNames = pendingResult.comments.map(comment => {
            const place = places.find(p => p.id === comment.placeId)
            return {
              ...comment,
              placeName: place?.name || 'Bilinmeyen Mekan'
            }
          })
          setPendingComments(commentsWithPlaceNames)
        }
      }
    }
  }

  const categoryNames = {
    tarihi: 'Tarihi Mekan',
    dini: 'Dini Mekan',
    doğal: 'Doğal Mekan',
    yemek: 'Yemek & İçecek',
    vakit: 'Vakit Geçirme'
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>🔐 Admin Paneli</h1>
        <button onClick={onBack} className="back-button">← Geri Dön</button>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'places' ? 'active' : ''}`}
          onClick={() => setActiveTab('places')}
        >
          📍 Mekanlar ({places.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'approvals' ? 'active' : ''}`}
          onClick={() => setActiveTab('approvals')}
        >
          ✅ Yorum Onay ({pendingComments.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          💬 Tüm Yorumlar ({allComments.length})
        </button>
      </div>

      {activeTab === 'places' && (
        <div className="admin-content">
          <div className="admin-actions">
            <button
              className="add-place-button"
              onClick={() => {
                setEditingPlace(null)
                setFormData({
                  name: '',
                  category: 'doğal',
                  description: '',
                  address: '',
                  image: ''
                })
                setShowPlaceForm(true)
              }}
            >
              + Yeni Mekan Ekle
            </button>
          </div>

          {showPlaceForm && (
            <div className="place-form-modal">
              <div className="place-form-card">
                <h2>{editingPlace ? 'Mekan Düzenle' : 'Yeni Mekan Ekle'}</h2>
                <form onSubmit={handleAddPlace} className="admin-form">
                  <div className="form-group">
                    <label>Mekan Adı</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Mekan adı"
                    />
                  </div>

                  <div className="form-group">
                    <label>Kategori</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      <option value="tarihi">Tarihi Mekan</option>
                      <option value="dini">Dini Mekan</option>
                      <option value="doğal">Doğal Mekan</option>
                      <option value="yemek">Yemek & İçecek</option>
                      <option value="vakit">Vakit Geçirme</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Adres</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      placeholder="Adres"
                    />
                  </div>

                  <div className="form-group">
                    <label>Açıklama</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows="4"
                      placeholder="Mekan açıklaması"
                    />
                  </div>

                  <div className="form-group">
                    <label>Görsel URL</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      required
                      placeholder="https://..."
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="save-button">
                      {editingPlace ? 'Güncelle' : 'Ekle'}
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => {
                        setShowPlaceForm(false)
                        setEditingPlace(null)
                      }}
                    >
                      İptal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="places-list">
            {places.map(place => (
              <div key={place.id} className="admin-place-card">
                <div className="place-info">
                  <img src={place.image} alt={place.name} className="place-thumb" />
                  <div className="place-details">
                    <h3>{place.name}</h3>
                    <p className="place-category">{categoryNames[place.category]}</p>
                    <p className="place-address">📍 {place.address}</p>
                    <p className="place-rating">⭐ {(place.rating || 0).toFixed(1)} ({place.commentCount || 0} yorum)</p>
                  </div>
                </div>
                <div className="place-actions">
                  <button
                    className="edit-button"
                    onClick={() => {
                      setEditingPlace(place)
                      setShowPlaceForm(true)
                    }}
                  >
                    ✏️ Düzenle
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeletePlace(place.id)}
                  >
                    🗑️ Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="admin-content">
          <div className="approvals-header">
            <h2>Bekleyen Yorumlar ({pendingComments.length})</h2>
            <p className="approvals-subtitle">Yorumları onaylayın veya reddedin</p>
          </div>
          <div className="comments-list">
            {pendingComments.length === 0 ? (
              <div className="no-comments">Bekleyen yorum yok. Tüm yorumlar onaylanmış.</div>
            ) : (
              pendingComments.map(comment => (
                <div key={`${comment.placeId}-${comment.id}`} className="admin-comment-card pending">
                  <div className="comment-header">
                    <div>
                      <h4>{comment.author}</h4>
                      <p className="comment-place">📍 {comment.placeName}</p>
                      <p className="comment-date">{comment.date}</p>
                      <span className="comment-status-badge pending-badge">⏳ Beklemede</span>
                    </div>
                    <div className="comment-rating">
                      {'★'.repeat(comment.rating)}{'☆'.repeat(5 - comment.rating)}
                    </div>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  <div className="comment-actions-approval">
                    <button
                      className="approve-button"
                      onClick={() => handleApproveComment(comment.id, comment.placeId)}
                    >
                      ✅ Onayla
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => handleRejectComment(comment.id, comment.placeId)}
                    >
                      ❌ Reddet
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'comments' && (
        <div className="admin-content">
          <div className="comments-list">
            {allComments.length === 0 ? (
              <div className="no-comments">Henüz yorum yok.</div>
            ) : (
              allComments.map(comment => (
                <div key={`${comment.placeId}-${comment.id}`} className="admin-comment-card">
                  <div className="comment-header">
                    <div>
                      <h4>{comment.author}</h4>
                      <p className="comment-place">📍 {comment.placeName}</p>
                      <p className="comment-date">{comment.date}</p>
                      {comment.status && (
                        <span className={`comment-status-badge ${comment.status === 'approved' ? 'approved-badge' : comment.status === 'rejected' ? 'rejected-badge' : 'pending-badge'}`}>
                          {comment.status === 'approved' ? '✅ Onaylandı' : comment.status === 'rejected' ? '❌ Reddedildi' : '⏳ Beklemede'}
                        </span>
                      )}
                    </div>
                    <div className="comment-rating">
                      {'★'.repeat(comment.rating)}{'☆'.repeat(5 - comment.rating)}
                    </div>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  <button
                    className="delete-comment-button"
                    onClick={() => handleDeleteComment(comment.placeId, comment.id)}
                  >
                    🗑️ Yorumu Sil
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel



