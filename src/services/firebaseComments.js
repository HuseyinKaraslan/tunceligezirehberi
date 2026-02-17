import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  onSnapshot
} from 'firebase/firestore'
import { db } from '../firebase'

// Yorum ekle
export const addComment = async (placeId, commentData) => {
  try {
    const commentsRef = collection(db, 'comments')
    const newComment = {
      placeId,
      ...commentData,
      status: 'pending', // Yorumlar önce pending olarak eklenir
      date: new Date().toLocaleDateString('tr-TR'),
      createdAt: new Date().toISOString()
    }
    
    const docRef = await addDoc(commentsRef, newComment)
    
    // Pending yorumlar rating'e dahil edilmez, bu yüzden rating güncelleme yapmıyoruz
    
    return {
      success: true,
      id: docRef.id
    }
  } catch (error) {
    console.error('Error adding comment:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Yorum güncelle
export const updateComment = async (commentId, commentData) => {
  try {
    const commentRef = doc(db, 'comments', commentId)
    
    // Önce mevcut yorumu al
    const commentSnap = await getDoc(commentRef)
    const commentData_old = commentSnap.exists() ? commentSnap.data() : null
    const placeId = commentData_old?.placeId || null
    
    await updateDoc(commentRef, {
      ...commentData,
      updatedAt: new Date().toISOString()
    })
    
    // Place'in rating'ini güncelle (sadece approved yorumlar rating'e dahil)
    if (placeId) {
      await updatePlaceRating(placeId)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error updating comment:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Yorum onayla
export const approveComment = async (commentId) => {
  try {
    const commentRef = doc(db, 'comments', commentId)
    const commentSnap = await getDoc(commentRef)
    const placeId = commentSnap.exists() ? commentSnap.data().placeId : null
    
    await updateDoc(commentRef, {
      status: 'approved',
      approvedAt: new Date().toISOString()
    })
    
    // Place'in rating'ini güncelle
    if (placeId) {
      await updatePlaceRating(placeId)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error approving comment:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Yorum reddet
export const rejectComment = async (commentId) => {
  try {
    const commentRef = doc(db, 'comments', commentId)
    const commentSnap = await getDoc(commentRef)
    const placeId = commentSnap.exists() ? commentSnap.data().placeId : null
    
    await updateDoc(commentRef, {
      status: 'rejected',
      rejectedAt: new Date().toISOString()
    })
    
    // Place'in rating'ini güncelle (reddedilen yorum rating'den çıkarılır)
    if (placeId) {
      await updatePlaceRating(placeId)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error rejecting comment:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Bekleyen yorumları getir (Admin paneli için)
export const getPendingComments = async () => {
  try {
    const commentsRef = collection(db, 'comments')
    const q = query(
      commentsRef,
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const comments = []
    
    querySnapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return { success: true, comments }
  } catch (error) {
    console.error('Error getting pending comments:', error)
    // Index hatası ise, basit query ile dene
    if (error.code === 'failed-precondition') {
      try {
        const commentsRef = collection(db, 'comments')
        const simpleQ = query(commentsRef, where('status', '==', 'pending'))
        const querySnapshot = await getDocs(simpleQ)
        const comments = []
        querySnapshot.forEach((doc) => {
          comments.push({
            id: doc.id,
            ...doc.data()
          })
        })
        comments.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.date || 0)
          const dateB = new Date(b.createdAt || b.date || 0)
          return dateB - dateA
        })
        return { success: true, comments }
      } catch (fallbackError) {
        console.error('Error in fallback query:', fallbackError)
        return { success: false, error: fallbackError.message, comments: [] }
      }
    }
    return { success: false, error: error.message, comments: [] }
  }
}

// Yorum sil
export const deleteComment = async (commentId) => {
  try {
    const commentRef = doc(db, 'comments', commentId)
    
    // Place ID'yi al (silmeden önce)
    const commentSnap = await getDoc(commentRef)
    const placeId = commentSnap.exists() ? commentSnap.data().placeId : null
    
    await deleteDoc(commentRef)
    
    // Place'in rating'ini güncelle
    if (placeId) {
      await updatePlaceRating(placeId)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting comment:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Bir mekanın tüm yorumlarını getir (sadece onaylanmış yorumlar)
export const getCommentsByPlace = async (placeId) => {
  try {
    const commentsRef = collection(db, 'comments')
    let q
    try {
      // Index ile dene - sadece approved yorumları getir
      q = query(
        commentsRef,
        where('placeId', '==', placeId),
        where('status', '==', 'approved'),
        orderBy('createdAt', 'desc')
      )
    } catch (indexError) {
      // Index yoksa sadece where kullan
      console.warn('Index not available, using simple query')
      q = query(
        commentsRef,
        where('placeId', '==', placeId),
        where('status', '==', 'approved')
      )
    }
    
    const querySnapshot = await getDocs(q)
    const comments = []
    
    querySnapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    // Eğer orderBy yoksa, manuel sırala
    comments.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0)
      const dateB = new Date(b.createdAt || b.date || 0)
      return dateB - dateA
    })
    
    return { success: true, comments }
  } catch (error) {
    console.error('Error getting comments:', error)
    // Index hatası ise, basit query ile dene
    if (error.code === 'failed-precondition') {
      try {
        const commentsRef = collection(db, 'comments')
        const simpleQ = query(
          commentsRef,
          where('placeId', '==', placeId),
          where('status', '==', 'approved')
        )
        const querySnapshot = await getDocs(simpleQ)
        const comments = []
        querySnapshot.forEach((doc) => {
          comments.push({
            id: doc.id,
            ...doc.data()
          })
        })
        comments.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.date || 0)
          const dateB = new Date(b.createdAt || b.date || 0)
          return dateB - dateA
        })
        return { success: true, comments }
      } catch (fallbackError) {
        console.error('Error in fallback query:', fallbackError)
        return { success: false, error: fallbackError.message, comments: [] }
      }
    }
    return { success: false, error: error.message, comments: [] }
  }
}

// Tüm yorumları getir (Admin paneli için - tüm status'ler)
export const getAllComments = async () => {
  try {
    const commentsRef = collection(db, 'comments')
    let q
    try {
      q = query(commentsRef, orderBy('createdAt', 'desc'))
    } catch (error) {
      // Index yoksa basit query
      q = query(commentsRef)
    }
    
    const querySnapshot = await getDocs(q)
    const comments = []
    
    querySnapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    // Eğer orderBy yoksa, manuel sırala
    comments.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0)
      const dateB = new Date(b.createdAt || b.date || 0)
      return dateB - dateA
    })
    
    return { success: true, comments }
  } catch (error) {
    console.error('Error getting all comments:', error)
    return { success: false, error: error.message, comments: [] }
  }
}

// Real-time yorum dinleyicisi (bir mekan için) - sadece onaylanmış yorumlar
export const subscribeToComments = (placeId, callback) => {
  const commentsRef = collection(db, 'comments')
  
  // Önce index ile dene - sadece approved yorumları getir
  let q
  try {
    q = query(
      commentsRef,
      where('placeId', '==', placeId),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc')
    )
  } catch (error) {
    // Index yoksa sadece where kullan
    console.warn('Index not available, using simple query')
    q = query(
      commentsRef,
      where('placeId', '==', placeId),
      where('status', '==', 'approved')
    )
  }
  
  return onSnapshot(q, (querySnapshot) => {
    const comments = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      // Sadece approved yorumları ekle
      if (data.status === 'approved') {
        comments.push({
          id: doc.id,
          ...data
        })
      }
    })
    // Eğer orderBy yoksa, manuel sırala
    comments.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0)
      const dateB = new Date(b.createdAt || b.date || 0)
      return dateB - dateA
    })
    callback(comments)
  }, (error) => {
    console.error('Error subscribing to comments:', error)
    // Index hatası ise, alternatif yöntem dene
    if (error.code === 'failed-precondition') {
      console.warn('Index required. Using fallback query.')
      const simpleQ = query(
        commentsRef,
        where('placeId', '==', placeId),
        where('status', '==', 'approved')
      )
      return onSnapshot(simpleQ, (querySnapshot) => {
        const comments = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          if (data.status === 'approved') {
            comments.push({
              id: doc.id,
              ...data
            })
          }
        })
        comments.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.date || 0)
          const dateB = new Date(b.createdAt || b.date || 0)
          return dateB - dateA
        })
        callback(comments)
      }, (simpleError) => {
        console.error('Error in fallback query:', simpleError)
        callback([])
      })
    }
    callback([])
  })
}

// Place'in rating'ini güncelle (sadece onaylanmış yorumların ortalaması)
// Not: Bu fonksiyon sadece rating ve commentCount günceller
// Security rules'da authenticated kullanıcıların sadece bu field'ları güncelleyebilmesi gerekiyor
export const updatePlaceRating = async (placeId) => {
  try {
    // Index hatası olabilir, bu yüzden try-catch ile yorumları al
    let comments = []
    try {
      const result = await getCommentsByPlace(placeId)
      comments = result.comments || []
    } catch (indexError) {
      // Index yoksa, yorumları farklı şekilde al - sadece approved yorumları
      console.warn('Index error, trying alternative method:', indexError)
      const commentsRef = collection(db, 'comments')
      const q = query(
        commentsRef,
        where('placeId', '==', placeId),
        where('status', '==', 'approved')
      )
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        if (data.status === 'approved') {
          comments.push({
            id: doc.id,
            ...data
          })
        }
      })
      // Tarihe göre sırala
      comments.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date || 0)
        const dateB = new Date(b.createdAt || b.date || 0)
        return dateB - dateA
      })
    }
    
    // Sadece approved yorumları filtrele (ekstra güvenlik)
    const approvedComments = comments.filter(c => c.status === 'approved')
    
    const placeRef = doc(db, 'places', placeId)
    
    let updateData = {}
    
    if (approvedComments.length === 0) {
      // Yorum yoksa rating 0 ve commentCount 0
      updateData = {
        rating: 0,
        commentCount: 0
      }
    } else {
      const totalRating = approvedComments.reduce((sum, comment) => sum + (comment.rating || 0), 0)
      const averageRating = totalRating / approvedComments.length
      
      updateData = {
        rating: parseFloat(averageRating.toFixed(1)),
        commentCount: approvedComments.length
      }
    }
    
    // Rating'i güncelle
    await updateDoc(placeRef, updateData)
    
    console.log(`Rating updated for place ${placeId}:`, updateData)
  } catch (error) {
    console.error('Error updating place rating:', error)
    // Permission hatası olabilir, bu durumda sadece log'la
    if (error.code === 'permission-denied') {
      console.warn('Permission denied for updating rating. Check Firestore security rules.')
    }
  }
}

