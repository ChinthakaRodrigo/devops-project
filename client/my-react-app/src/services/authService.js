const API_URL = 'http://localhost:8080/api/auth'

const CURRENT_USER_KEY = 'communityIssueTrackerCurrentUser'

const writeStorage = (storage, key, value) => {
  storage.setItem(key, JSON.stringify(value))
}

const readStorage = (storage, key, fallbackValue) => {
  try {
    const rawValue = storage.getItem(key)
    return rawValue ? JSON.parse(rawValue) : fallbackValue
  } catch {
    return fallbackValue
  }
}

export const saveCurrentUser = (user, remember = true) => {
  const storage = remember ? window.localStorage : window.sessionStorage
  writeStorage(storage, CURRENT_USER_KEY, user)
}

export const clearCurrentUser = () => {
  window.localStorage.removeItem(CURRENT_USER_KEY)
  window.sessionStorage.removeItem(CURRENT_USER_KEY)
}

export const getCurrentUser = () => {
  const localUser = readStorage(
      window.localStorage,
      CURRENT_USER_KEY,
      null,
  )

  if (localUser) {
    return localUser
  }

  return readStorage(
      window.sessionStorage,
      CURRENT_USER_KEY,
      null,
  )
}

export const signupUser = async (userData) => {

  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    }),
  })

  if (!response.ok) {
    throw new Error('Signup failed.')
  }

  const message = await response.text()

  return {
    success: true,
    message,
  }
}

export const loginUser = async (credentials) => {

  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  })

  if (!response.ok) {
    throw new Error('Login failed.')
  }

  const data = await response.json()

  if (!data.success) {
    throw new Error(data.message)
  }

  return {
    success: true,

    message: data.message,

    user: {
      id: data.id,
      name: data.name,
      email: data.email,


      role: data.role.toLowerCase(),

      councilName: data.councilName,
    },
  }
}