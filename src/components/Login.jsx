import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Login.css'

function Login({ onSwitchToRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, loginGoogle } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun')
      return
    }

    const result = await login(email, password)
    if (!result.success) {
      setError(result.error)
    }
  }

  const handleGoogleLogin = async (e) => {
    e.preventDefault()
    setError('')
    
    const result = await loginGoogle()
    if (!result.success) {
      setError(result.error)
    }
  }

  return (
    <div className="auth-card" onClick={(e) => e.stopPropagation()}>
      <h2 className="auth-title">Giriş Yap</h2>
      <p className="auth-subtitle">Hesabınıza giriş yapın</p>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@email.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Şifre</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <div className='login-buttons'>
          <button type="submit" className="auth-submit-button">
            Giriş Yap
          </button>
          <button type="button" onClick={handleGoogleLogin} className="googleLogin-submit-button">
            Google ile giriş yap
          </button>
        </div>
      </form>

      <div className="auth-switch">
        <p>Hesabınız yok mu? <button onClick={onSwitchToRegister} className="auth-link-button">Kayıt Ol</button></p>
      </div>
    </div>
  )
}

export default Login

