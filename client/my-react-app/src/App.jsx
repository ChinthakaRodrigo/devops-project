import { useState } from 'react'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import { clearCurrentUser, getCurrentUser, saveCurrentUser } from './services/authService'

function App() {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser())

  const handleLogin = (user, remember = true) => {
    saveCurrentUser(user, remember)
    setCurrentUser(user)
  }

  const handleLogout = () => {
    clearCurrentUser()
    setCurrentUser(null)
  }

  return (
    <AppRoutes
      currentUser={currentUser}
      onLogin={handleLogin}
      onLogout={handleLogout}
    />
  )
}

export default App
