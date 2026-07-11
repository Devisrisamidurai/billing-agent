import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './auth.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!EMAIL_RE.test(form.email)) next.email = 'Enter a valid email address.'
    if (!form.password) next.password = 'Password is required.'
    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return
    // Frontend-only: no backend call yet. Continue to the app screen.
    navigate('/simulator')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">
          Sign in to explore how shipping changes affect your projected invoice.
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? 'has-error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? 'has-error' : ''}
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <div className="auth-link-row">
            <button type="button" className="auth-link">
              Forgot password?
            </button>
          </div>

          <button type="submit" className="auth-submit">
            Log In
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have a profile? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
