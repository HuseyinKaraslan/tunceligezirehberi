import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Login from './Login'
import Register from './Register'
import './Header.css'

function Header({ onShowAdminPanel }) {
  const { user, logout, isAdmin } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Kullanıcı giriş yaptığında modal'ları kapat
  useEffect(() => {
    if (user) {
      setShowLogin(false)
      setShowRegister(false)
    }
  }, [user])

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h1 className="logo">🏔️ Tunceli Gezi Rehberi</h1>
            <nav className="nav">
              <a href="#anasayfa" className="nav-link">Ana Sayfa</a>
              <a href="#yerler" className="nav-link">Yerler</a>
              <a href="#hakkimizda" className="nav-link">Hakkımızda</a>
              
              {user ? (
                <>
                  {isAdmin && (
                    <button 
                      className="admin-button"
                      onClick={onShowAdminPanel}
                    >
                      🔐 Admin Paneli
                    </button>
                  )}
                  <div className="user-menu-container">
                    <button 
                      className="user-button"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                      👤 {user.name}
                    </button>
                    {showUserMenu && (
                      <div className="user-menu">
                        <div className="user-info">
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                        <button className="logout-button" onClick={handleLogout}>
                          Çıkış Yap
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="auth-buttons">
                  <button 
                    className="login-button"
                    onClick={() => setShowLogin(true)}
                  >
                    Giriş Yap
                  </button>
                  <button 
                    className="register-button"
                    onClick={() => setShowRegister(true)}
                  >
                    Kayıt Ol
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {showLogin && (
        <div className="auth-modal-overlay" onClick={() => setShowLogin(false)}>
          <Login 
            onSwitchToRegister={() => {
              setShowLogin(false)
              setShowRegister(true)
            }}
          />
        </div>
      )}

      {showRegister && (
        <div className="auth-modal-overlay" onClick={() => setShowRegister(false)}>
          <Register 
            onSwitchToLogin={() => {
              setShowRegister(false)
              setShowLogin(true)
            }}
          />
        </div>
      )}
    </>
  )
}

export default Header

