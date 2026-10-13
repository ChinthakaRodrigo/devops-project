import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoginForm from '../../components/auth/LoginForm'
import SignupForm from '../../components/auth/SignupForm'
import { loginUser, signupUser } from '../../services/authService'
import './auth.css'

function AuthFeature({ onLogin, mode: initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode)
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  const changeMode = (nextMode) => {
    setMode(nextMode)
    navigate(nextMode === 'login' ? '/login' : '/signup')
  }

  const handleSubmit = async (payload) => {
    setIsLoading(true)
    setStatusMessage('')

    try {
      const response =
        mode === 'login'
          ? await loginUser(payload)
          : await signupUser(payload)

      if (mode === 'login' && response.user) {
        onLogin?.(response.user, payload.remember ?? true)
        return
      }

      setStatusMessage(response.message)

      if (mode === 'signup') {
        setTimeout(() => {
          setMode('login')
          navigate('/login')
        }, 600)
      }
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
              onClick={() => changeMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={mode === 'signup' ? 'tab active' : 'tab'}
              onClick={() => changeMode('signup')}
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
            <Link
              className="text-button inline"
              to={mode === 'login' ? '/signup' : '/login'}
              onClick={() => setStatusMessage('')}
            >
              {mode === 'login' ? 'Sign up' : 'Login'}
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}

export default AuthFeature
