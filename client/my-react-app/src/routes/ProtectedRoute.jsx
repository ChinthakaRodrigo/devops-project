import { Navigate } from 'react-router-dom'

function ProtectedRoute({ user, allowedRole, children }) {
  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />
  }

  return children
}

export default ProtectedRoute
