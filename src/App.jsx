import { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import { subscribeToPlaces, addPlace, updatePlace, deletePlace } from './services/firebasePlaces'
import { addComment, updateComment, deleteComment } from './services/firebaseComments'
import Header from './components/Header'
import Hero from './components/Hero'
import CategoryFilter from './components/CategoryFilter'
import PlaceCard from './components/PlaceCard'
import PlaceDetail from './components/PlaceDetail'
import AdminPanel from './components/AdminPanel'
import './App.css'



function App() {
  const { user } = useAuth()
  const [places, setPlaces] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('tümü')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [sortBy, setSortBy] = useState('rating')
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  useEffect(() => {
    // Firebase'den mekanları real-time dinle
    const unsubscribe = subscribeToPlaces((firebasePlaces) => {
      console.log('Places updated from Firebase:', firebasePlaces.length)
      // Yorumları burada yüklemeye gerek yok, PlaceDetail kendi yükleyecek
      const placesWithDefaults = firebasePlaces.map(place => ({
        ...place,
        rating: place.rating || 0,
        commentCount: place.commentCount || 0,
        comments: [] // Boş array, PlaceDetail kendi yükleyecek
      }))
      console.log('Setting places with ratings:', placesWithDefaults.map(p => ({ name: p.name, rating: p.rating, commentCount: p.commentCount })))
      setPlaces(placesWithDefaults)
    })

    return () => unsubscribe()
  }, [])

  const categories = [
    { id: 'tümü', name: 'Tümü', color: 'var(--accent-primary)' },
    { id: 'tarihi', name: 'Tarihi Mekanlar', color: 'var(--accent-warning)' },
    { id: 'dini', name: 'Dini Mekanlar', color: 'var(--accent-success)' },
    { id: 'doğal', name: 'Doğal Mekanlar', color: 'var(--accent-primary)' },
    { id: 'yemek', name: 'Yemek & İçecek', color: 'var(--accent-secondary)' },
    { id: 'vakit', name: 'Vakit Geçirme', color: '#9b59b6' }
  ]

  const filteredPlaces = places
    .filter(place => {
      const matchesCategory = selectedCategory === 'tümü' || place.category === selectedCategory
      const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'tr')
      return 0
    })

  const handleAddComment = async (placeId, comment) => {
    const result = await addComment(placeId, {
      ...comment,
      userId: user?.id || null
    })

    if (result.success) {
      // Yorumlar otomatik olarak real-time listener ile güncellenecek
      // Place'in rating'i de otomatik güncellenecek
    }
  }

  const handleUpdateComment = async (placeId, commentId, updatedComment) => {
    await updateComment(commentId, updatedComment)
    // Yorumlar otomatik olarak real-time listener ile güncellenecek
  }

  const handleDeleteComment = async (placeId, commentId) => {
    await deleteComment(commentId)
    // Yorumlar otomatik olarak real-time listener ile güncellenecek
  }

  const handleUpdatePlaces = async (updatedPlaces) => {
    // Bu fonksiyon artık kullanılmıyor
    // AdminPanel direkt Firebase fonksiyonlarını kullanıyor
    // Burada sadece placeholder olarak bırakıyoruz
  }

  if (showAdminPanel) {
    return (
      <AdminPanel
        places={places}
        onUpdatePlaces={handleUpdatePlaces}
        onBack={() => setShowAdminPanel(false)}
      />
    )
  }

  if (selectedPlace) {
    const place = places.find(p => p.id === selectedPlace)
    return (
      <PlaceDetail
        place={place}
        onBack={() => setSelectedPlace(null)}
        onAddComment={handleAddComment}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
      />
    )
  }

  return (
    <div className="app">
      <Header onShowAdminPanel={() => setShowAdminPanel(true)} />
      <Hero />
      <div className="container">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="search-sort-container">
          <input
            type="text"
            placeholder="🔍 Yer ara..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating">Puana Göre</option>
            <option value="name">İsme Göre</option>
          </select>
        </div>

        <div className="places-grid">
          {filteredPlaces.map(place => (
            <PlaceCard
              key={place.id}
              place={place}
              onClick={() => setSelectedPlace(place.id)}
            />
          ))}
        </div>

        {filteredPlaces.length === 0 && (
          <div className="no-results">
            <p>Sonuç bulunamadı. Farklı bir arama deneyin.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

