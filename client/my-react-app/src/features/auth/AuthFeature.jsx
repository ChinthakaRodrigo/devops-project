import { useState } from 'react'
import LoginForm from '../../components/auth/LoginForm'
import SignupForm from '../../components/auth/SignupForm'
import { loginUser, signupUser } from '../../services/authService'
import './auth.css'

function AuthFeature() {
  const [mode, setMode] = useState('login')
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const handleSubmit = async (payload) => {
    setIsLoading(true)
    setStatusMessage('')

    try {
      const response =
        mode === 'login'
          ? await loginUser(payload)
          : await signupUser(payload)

      setStatusMessage(response.message)
    } catch (error) {
      setStatusMessage(error.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <section className="brand-panel">
          <div className="brand-badge">COMMUNITY ISSUE TRACKER</div>
          <br></br>
          <h1>{mode === 'login' ? 'Welcome back' : 'Build a better community'}</h1>
          <p className="brand-copy">
            {mode === 'login'
              ? 'Track issues, coordinate fixes, and keep your community moving forward.'
              : 'Create an account to report problems, assign tasks, and keep local projects transparent.'}
          </p>

          <div className="feature-list">
            <div>
              <span className="feature-icon">✓</span>
              <p>Unified issue tracking</p>
            </div>
            <div>
              <span className="feature-icon">✓</span>
              <p>Team collaboration made easy</p>
            </div>
            <div>
              <span className="feature-icon">✓</span>
              <p>Clear progress visibility</p>
            </div>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-toggle" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              className={mode === 'login' ? 'tab active' : 'tab'}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={mode === 'signup' ? 'tab active' : 'tab'}
              onClick={() => setMode('signup')}
            >
              Sign Up
            </button>
          </div>

          {mode === 'login' ? (
            <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
          ) : (
            <SignupForm onSubmit={handleSubmit} isLoading={isLoading} />
          )}

          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="social-buttons">
            <button type="button">Google</button>
            <button type="button">Facebook</button>
          </div>

          {statusMessage && <p className="status-message">{statusMessage}</p>}

          <p className="switch-copy">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <button
              type="button"
              className="text-button inline"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            >
              {mode === 'login' ? 'Sign up' : 'Login'}
            </button>
          </p>
        </section>
      </div>
    </main>
  )
}

export default AuthFeature
