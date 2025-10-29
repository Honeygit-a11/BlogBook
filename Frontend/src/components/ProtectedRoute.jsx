import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/Authcontext'

const ProtectedRoute = ({ children, adminOnly = false, authorOnly = false }) => {
  const { isAuthenticated, user } = useContext(AuthContext)

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // If adminOnly is true, check if user is admin
  if (adminOnly) {
    if (!user || user.role !== 'admin') {
      return <Navigate to="/dashboard" replace />
    }
  }

  // If authorOnly is true, check if user is author or admin
  if (authorOnly) {
    if (!user || (user.role !== 'author' && user.role !== 'admin')) {
      return <Navigate to="/dashboard" replace />
    }
  }

  return children;
}

export default ProtectedRoute;
