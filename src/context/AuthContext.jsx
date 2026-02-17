import { createContext, useContext, useState, useEffect } from 'react'
import { 
  registerWithEmail, 
  loginWithEmail, 
  loginWithGoogle, 
  logoutUser, 
  onAuthStateChange 
} from '../services/firebaseAuth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Firebase auth state listener
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    const result = await loginWithEmail(email, password)
    if (result.success) {
      setUser(result.user)
    }
    return result
  }

  const loginGoogle = async () => {
    const result = await loginWithGoogle()
    if (result.success) {
      setUser(result.user)
    }
    return result
  }

  const register = async (name, email, password) => {
    const result = await registerWithEmail(name, email, password)
    if (result.success) {
      setUser(result.user)
    }
    return result
  }

  const logout = async () => {
    const result = await logoutUser()
    if (result.success) {
      setUser(null)
    }
    return result
  }

  const isAdmin = user?.isAdmin || false

  const value = {
    user,
    isAdmin,
    login,
    loginGoogle,
    register,
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

