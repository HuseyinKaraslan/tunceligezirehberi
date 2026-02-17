import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore'
import { db } from '../firebase'

// Tüm mekanları getir
export const getPlaces = async () => {
  try {
    const placesRef = collection(db, 'places')
    const q = query(placesRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const places = []
    querySnapshot.forEach((doc) => {
      places.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return { success: true, places }
  } catch (error) {
    console.error('Error getting places:', error)
    return { success: false, error: error.message, places: [] }
  }
}

// Real-time listener (mekanlar değiştiğinde otomatik güncelleme)
export const subscribeToPlaces = (callback) => {
  const placesRef = collection(db, 'places')
  const q = query(placesRef, orderBy('createdAt', 'desc'))
  
  return onSnapshot(q, (querySnapshot) => {
    const places = []
    querySnapshot.forEach((doc) => {
      places.push({
        id: doc.id,
        ...doc.data()
      })
    })
    callback(places)
  }, (error) => {
    console.error('Error subscribing to places:', error)
    callback([])
  })
}

// Yeni mekan ekle
export const addPlace = async (placeData) => {
  try {
    const placesRef = collection(db, 'places')
    const newPlace = {
      ...placeData,
      rating: 0,
      commentCount: 0,
      createdAt: new Date().toISOString()
    }
    
    const docRef = await addDoc(placesRef, newPlace)
    return {
      success: true,
      id: docRef.id
    }
  } catch (error) {
    console.error('Error adding place:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Mekan güncelle
export const updatePlace = async (placeId, placeData) => {
  try {
    const placeRef = doc(db, 'places', placeId)
    await updateDoc(placeRef, {
      ...placeData,
      updatedAt: new Date().toISOString()
    })
    
    return { success: true }
  } catch (error) {
    console.error('Error updating place:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Mekan sil
export const deletePlace = async (placeId) => {
  try {
    const placeRef = doc(db, 'places', placeId)
    await deleteDoc(placeRef)
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting place:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

