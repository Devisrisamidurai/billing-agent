import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../components/PasswordInput'
import { useAuth } from '../context/AuthContext'
import './auth.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [form, setForm] = useState({
    name: '',
    accessKey: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required.'
    if (!form.accessKey.trim()) next.accessKey = 'Access key is required.'
    else if (!/^[A-Za-z0-9]+$/.test(form.accessKey.trim()))
      next.accessKey = 'Use letters and numbers only (e.g. ACME2026).'
    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!EMAIL_RE.test(form.email)) next.email = 'Enter a valid email address.'
    if (!form.password) next.password = 'Password is required.'
    else if (form.password.length < 8)
      next.password = 'Password must be at least 8 characters.'
    if (!form.confirmPassword)
      next.confirmPassword = 'Please retype your password.'
    else if (form.confirmPassword !== form.password)
      next.confirmPassword = 'Passwords do not match.'
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return
    setSubmitting(true)
    try {
      await signup({
        name: form.name.trim(),
        accessKey: form.accessKey.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      })
      navigate('/login')
    } catch (err) {
      const data = err.response?.data
      if (data?.fieldErrors) {
        setErrors((prev) => ({ ...prev, ...data.fieldErrors }))
      } else {
        setErrors({
          form:
            data?.message ||
            'Unable to create your account. Please try again.',
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">
          Set up a profile to run self-service billing simulations.
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {errors.form && <div className="auth-alert">{errors.form}</div>}
          <div className="auth-field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? 'has-error' : ''}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="accessKey">Access key</label>
            <input
              id="accessKey"
              name="accessKey"
              type="text"
              placeholder="e.g. ACME2026"
              value={form.accessKey}
              onChange={handleChange}
              className={errors.accessKey ? 'has-error' : ''}
            />
            {errors.accessKey && (
              <span className="field-error">{errors.accessKey}</span>
            )}
          </div>

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
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={handleChange}
              hasError={Boolean(errors.password)}
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="confirmPassword">Retype password</label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange}
              hasError={Boolean(errors.confirmPassword)}
            />
            {errors.confirmPassword && (
              <span className="field-error">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have a profile? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
