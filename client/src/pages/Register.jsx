
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

export default function Register({ onRegister }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    barName: '',
    setupCode: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function updateField(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await api.post('/auth/register', form)
      onRegister(data.user)
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
        <div className="eyebrow">VENUE MANAGEMENT SYSTEM / 02</div>
        <h1>CREATE YOUR SPACE.</h1>
        <p>Set up your owner account and register your venue.</p>

        {error && <div className="auth-error">{error}</div>}

        <label>Your name</label>
        <input
          name="name"
          value={form.name}
          onChange={updateField}
          placeholder="Full name"
          required
        />

        <label>Email address</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={updateField}
          placeholder="you@example.com"
          required
        />

        <label>Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={updateField}
          placeholder="At least 8 characters"
          minLength={8}
          required
        />

        <label>Venue name</label>
        <input
          name="barName"
          value={form.barName}
          onChange={updateField}
          placeholder="Your bar or restaurant"
          required
        />

        <label>Registration code</label>
        <input
          name="setupCode"
          value={form.setupCode}
          onChange={updateField}
          placeholder="Demo setup code"
          required
        />

        <button className="auth-submit" disabled={loading}>
          {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT →'}
        </button>

        <div className="auth-switch">
          Already registered? <Link to="/login">Sign in</Link>
        </div>

        <div className="auth-footer">BARMAN SYSTEMS © 2026</div>
      </form>
    </div>
  )
}
