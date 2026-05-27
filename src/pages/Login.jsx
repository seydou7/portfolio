import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, ArrowRight } from 'lucide-react'
import API_URL from '../config/api'
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (data.success) {
        localStorage.setItem('admin_token', data.token)
        navigate('/admin')
      } else {
        setError(data.message || 'Identifiants incorrects')
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card animate-fade-up">
        <div className="login-card__header">
          <span className="section-label">ACCÈS RESTREINT</span>
          <h2>Connexion Admin</h2>
          <p>Entrez vos identifiants pour gérer le portfolio.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                className="form-input" 
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>
      </div>
    </div>
  )
}
