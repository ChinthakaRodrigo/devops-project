function SignupForm({ onSubmit, isLoading }) {
  const handleSubmit = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const payload = {
      name: formData.get('name')?.toString() ?? '',
      email: formData.get('email')?.toString() ?? '',
      password: formData.get('password')?.toString() ?? '',
    }

    onSubmit(payload)
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>
        <span>Full name</span>
        <input type="text" name="name" placeholder="Alicia Green" required />
      </label>

      <label>
        <span>Email address</span>
        <input type="email" name="email" placeholder="you@example.com" required />
      </label>

      <label>
        <span>Password</span>
        <input type="password" name="password" placeholder="Create a password" required />
      </label>

      <button type="submit" className="primary-button" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  )
}

export default SignupForm
