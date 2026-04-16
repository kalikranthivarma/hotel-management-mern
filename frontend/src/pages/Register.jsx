import { useState } from 'react'

const API_BASE_URL = 'http://localhost:5000/api/auth'

const initialFormData = {
  role: 'user',
  email: '',
  fullName: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

function Register() {
  const [formData, setFormData] = useState(initialFormData)
  const [isVerified, setIsVerified] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => {
      const next = { ...current, [name]: value }

      if (name === 'email' || name === 'role') {
        return {
          ...next,
          fullName: name === 'role' ? current.fullName : next.fullName,
        }
      }

      return next
    })

    if (name === 'email' || name === 'role') {
      setIsVerified(false)
      setMessage('')
    }

    setError('')
  }

  const handleVerify = async () => {
    setError('')
    setMessage('')

    if (!formData.email.trim()) {
      setError('Enter your email before verification.')
      return
    }

    setIsVerifying(true)

    try {
      const response = await fetch(`${API_BASE_URL}/verify-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          role: formData.role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed')
      }

      setIsVerified(true)
      setMessage(data.message)
    } catch (verifyError) {
      setIsVerified(false)
      setError(verifyError.message)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!isVerified) {
      setError('Please verify your email and role first.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      localStorage.setItem('hotelUser', JSON.stringify(data))
      setMessage(`Registration completed for ${data.user.fullName}.`)
      setFormData(initialFormData)
      setIsVerified(false)
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="register-page">
      <div className="register-copy">
        <p className="eyebrow">Vivanta-inspired guest onboarding</p>
        <h1>Create your hotel account</h1>
        <p className="copy-text">
          Start with role and email verification. Once verified, the rest of the
          registration form unlocks for a cleaner and more premium flow.
        </p>
        <div className="copy-card">
          <span>Flow</span>
          <strong>Verify first, register second</strong>
          <p>User and admin accounts are both supported in the same schema.</p>
        </div>
      </div>

      <form className="register-card" onSubmit={handleSubmit}>
        <div className="field-grid field-grid-top">
          <label className="field">
            <span>Account type</span>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <label className="field field-wide">
            <span>Email address</span>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={handleVerify}
          disabled={isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Verify'}
        </button>

        {isVerified ? (
          <div className="verified-banner">Verified. Complete the remaining fields.</div>
        ) : null}

        <div className={`details-panel ${isVerified ? 'is-open' : ''}`}>
          <label className="field">
            <span>Full name</span>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              disabled={!isVerified}
            />
          </label>

          <label className="field">
            <span>Phone number</span>
            <input
              type="text"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isVerified}
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              disabled={!isVerified}
            />
          </label>

          <label className="field">
            <span>Confirm password</span>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={!isVerified}
            />
          </label>

          <button
            type="submit"
            className="secondary-button"
            disabled={!isVerified || isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Complete registration'}
          </button>
        </div>

        {message ? <p className="form-message success">{message}</p> : null}
        {error ? <p className="form-message error">{error}</p> : null}
      </form>
    </section>
  )
}

export default Register
