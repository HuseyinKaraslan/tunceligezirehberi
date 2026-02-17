import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

// Email/Password ile kayıt
export const registerWithEmail = async (name, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Firestore'da kullanıcı bilgilerini kaydet
    const isAdmin = false
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      isAdmin,
      createdAt: new Date().toISOString()
    })

    return {
      success: true,
      user: {
        id: user.uid,
        name,
        email,
        isAdmin
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Email/Password ile giriş
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Firestore'dan kullanıcı bilgilerini al
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    
    if (userDoc.exists()) {
      const userData = userDoc.data()
      return {
        success: true,
        user: {
          id: user.uid,
          email: user.email,
          ...userData
        }
      }
    } else {
      // Eğer Firestore'da yoksa, oluştur
      const isAdmin = false
      
      await setDoc(doc(db, 'users', user.uid), {
        name: user.email.split('@')[0],
        email: user.email,
        isAdmin,
        createdAt: new Date().toISOString()
      })

      return {
        success: true,
        user: {
          id: user.uid,
          email: user.email,
          name: user.email.split('@')[0],
          isAdmin
        }
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Google ile giriş
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    const user = userCredential.user

    // Firestore'da kullanıcı var mı kontrol et
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    
    if (!userDoc.exists()) {
      // Yeni kullanıcı, Firestore'a kaydet
      const isAdmin = false
      
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        isAdmin,
        createdAt: new Date().toISOString()
      })

      return {
        success: true,
        user: {
          id: user.uid,
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          isAdmin
        }
      }
    } else {
      // Mevcut kullanıcı
      const userData = userDoc.data()
      return {
        success: true,
        user: {
          id: user.uid,
          email: user.email,
          ...userData
        }
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Çıkış yap
export const logoutUser = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Auth state listener
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // Firestore'dan kullanıcı bilgilerini al
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        callback({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          ...userData
        })
      } else {
        callback(null)
      }
    } else {
      callback(null)
    }
  })
}

