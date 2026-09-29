export const loginUser = async (credentials) => {
  await new Promise((resolve) => setTimeout(resolve, 700))

  if (!credentials.email || !credentials.password) {
    throw new Error('Email and password are required.')
  }

  return {
    success: true,
    message: 'Login successful. Welcome back!',
  }
}

export const signupUser = async (userData) => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (!userData.name || !userData.email || !userData.password) {
    throw new Error('Please complete all fields to sign up.')
  }

  return {
    success: true,
    message: 'Account created successfully. Please check your email.',
  }
}
