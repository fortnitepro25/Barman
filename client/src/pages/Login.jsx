
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await api.post('/auth/login', { email, password })
      onLogin(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-panel" onSubmit={handleSubmit}>
        <div className="auth-brand">BARMAN<span>.</span></div>
        <div className="eyebrow">VENUE MANAGEMENT SYSTEM / 01</div>
        <h1>WELCOME BACK.</h1>
        <p>Sign in to access your venue workspace.</p>

        {error && <div className="auth-error">{error}</div>}

        <label>Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          required
        />

        <button className="auth-submit" disabled={loading}>
          {loading ? 'SIGNING IN...' : 'SIGN IN →'}
        </button>

        <div className="auth-switch">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>

        <div className="auth-footer">BARMAN SYSTEMS © 2026</div>
      </form>
    </div>
  )
}
