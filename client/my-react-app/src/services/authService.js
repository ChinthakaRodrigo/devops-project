const USERS_KEY = 'communityIssueTrackerUsers'
const CURRENT_USER_KEY = 'communityIssueTrackerCurrentUser'
const defaultAccounts = [
  {
    id: 'default-citizen',
    name: 'Citizen User',
    email: 'citizen@example.com',
    password: 'Citizen123!',
    role: 'citizen',
  },
  {
    id: 'default-admin',
    name: 'Community Admin',
    email: 'admin@example.com',
    password: 'Admin123!',
    role: 'admin',
  },
]

const readStorage = (storage, key, fallbackValue) => {
  try {
    const rawValue = storage.getItem(key)
    return rawValue ? JSON.parse(rawValue) : fallbackValue
  } catch {
    return fallbackValue
  }
}

const writeStorage = (storage, key, value) => {
  storage.setItem(key, JSON.stringify(value))
}

export const getStoredUsers = () => {
  const localUsers = readStorage(window.localStorage, USERS_KEY, [])
  const users = Array.isArray(localUsers) ? localUsers : []
  const accounts = [...users]

  defaultAccounts.forEach((account) => {
    const matchingUser = accounts.find(
      (user) => user.email?.toLowerCase() === account.email,
    )

    if (!matchingUser) {
      accounts.push(account)
    } else if (!matchingUser.role) {
      matchingUser.role = 'citizen'
    }
  })

  if (accounts.length !== users.length || accounts.some((user, index) => user !== users[index])) {
    writeStorage(window.localStorage, USERS_KEY, accounts)
  }

  return accounts
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
  const localUser = readStorage(window.localStorage, CURRENT_USER_KEY, null)
  if (localUser) return { ...localUser, role: localUser.role || 'citizen' }

  const sessionUser = readStorage(window.sessionStorage, CURRENT_USER_KEY, null)
  return sessionUser ? { ...sessionUser, role: sessionUser.role || 'citizen' } : null
}

export const loginUser = async (credentials) => {
  await new Promise((resolve) => setTimeout(resolve, 700))

  if (!credentials.email || !credentials.password) {
    throw new Error('Email and password are required.')
  }

  const users = getStoredUsers()
  const user = users.find(
    (item) =>
      item.email.toLowerCase() === credentials.email.trim().toLowerCase() &&
      item.password === credentials.password,
  )

  if (!user) {
    throw new Error('Invalid email or password.')
  }

  return {
    success: true,
    message: 'Login successful. Welcome back!',
    user: { name: user.name, email: user.email, role: user.role || 'citizen' },
  }
}

export const signupUser = async (userData) => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (!userData.name || !userData.email || !userData.password) {
    throw new Error('Please complete all fields to sign up.')
  }

  const users = getStoredUsers()
  const normalizedEmail = userData.email.trim().toLowerCase()

  if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email already exists.')
  }

  const newUser = {
    id: Date.now(),
    name: userData.name.trim(),
    email: normalizedEmail,
    password: userData.password,
    role: 'citizen',
  }

  users.push(newUser)
  writeStorage(window.localStorage, USERS_KEY, users)

  return {
    success: true,
    message: 'Account created successfully. Please log in to continue.',
    user: { name: newUser.name, email: newUser.email, role: newUser.role },
  }
}
