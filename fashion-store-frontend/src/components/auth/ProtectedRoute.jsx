import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  // Admin and role-based access check
  const isAdmin = user?.role === 'Admin' || user?.role_id === 1

  if (adminOnly && !isAdmin) {
     toast.error('🚫 Truy cập bị từ chối. Bạn cần quyền Quản trị viên.')
     return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
