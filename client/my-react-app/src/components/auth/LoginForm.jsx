function LoginForm({ onSubmit, isLoading }) {
  const handleSubmit = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const payload = {
      email: formData.get('email')?.toString() ?? '',
      password: formData.get('password')?.toString() ?? '',
      remember: formData.get('remember') === 'on',
    }

    onSubmit(payload)
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>
        <span>Email address</span>
        <input type="email" name="email" placeholder="you@example.com" required />
      </label>

      <label>
        <span>Password</span>
        <input type="password" name="password" placeholder="Enter your password" required />
      </label>

      <div className="form-row">
        <label className="checkbox-row">
          <input type="checkbox" name="remember" defaultChecked />
          <span>Remember me</span>
        </label>
        <button type="button" className="text-button">
          Forgot password?
        </button>
      </div>

      <button type="submit" className="primary-button" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}

export default LoginForm
