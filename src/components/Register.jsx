import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Register.css'

function Register({ onSwitchToLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const { register } = useAuth()


  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password || !confirmPassword) {
      setError('Lütfen tüm alanları doldurun')
      return
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır')
      return
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return
    }

    const result = register(name, email, password)
    if (!result.success) {
      setError(result.error)
    } else {
      // Başarılı kayıt - modal kapanacak (parent component'te yönetilecek)
    }
  }

  return (
    <div className="auth-card" onClick={(e) => e.stopPropagation()}>
      <h2 className="auth-title">Kayıt Ol</h2>
      <p className="auth-subtitle">Yeni hesap oluşturun</p>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="name">İsim</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Adınız Soyadınız"
            required
          />
        </div>

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
            placeholder="En az 6 karakter"
            required
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Şifre Tekrar</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Şifrenizi tekrar girin"
            required
          />
        </div>

        <button onClick={register} type="submit" className="auth-submit-button">
          Kayıt Ol
        </button>
      </form>

      <div className="auth-switch">
        <p>Zaten hesabınız var mı? <button onClick={onSwitchToLogin} className="auth-link-button">Giriş Yap</button></p>
      </div>
    </div>
  )
}

export default Register

