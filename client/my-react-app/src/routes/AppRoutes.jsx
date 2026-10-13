import { Navigate, Route, Routes } from 'react-router-dom'
import AuthFeature from '../features/auth/AuthFeature'
import AdminDashboard from '../features/admin/AdminDashboard'
import CitizenHome from '../features/citizen/CitizenHome'
import ProtectedRoute from './ProtectedRoute'

function AppRoutes({ currentUser, onLogin, onLogout }) {
  const homePath = currentUser?.role === 'admin' ? '/admin' : '/'

  return (
    <Routes>
      <Route
        path="/login"
        element={currentUser ? <Navigate to={homePath} replace /> : <AuthFeature mode="login" onLogin={onLogin} />}
      />
      <Route
        path="/signup"
        element={currentUser ? <Navigate to={homePath} replace /> : <AuthFeature mode="signup" onLogin={onLogin} />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute user={currentUser} allowedRole="citizen">
            <CitizenHome user={currentUser} onLogout={onLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute user={currentUser} allowedRole="admin">
            <AdminDashboard user={currentUser} onLogout={onLogout} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={currentUser ? homePath : '/login'} replace />} />
    </Routes>
  )
}

export default AppRoutes
