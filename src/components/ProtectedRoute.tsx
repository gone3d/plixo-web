import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LoadingSpinner } from './atoms'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: Array<'guest' | 'user' | 'admin'>
  redirectTo?: string
}

export const ProtectedRoute = ({
  children,
  requiredRoles = ['guest', 'user', 'admin'], // By default, allow all authenticated users
  redirectTo = '/',
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, hasAnyRole } = useAuth()

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner variant="primary" size="lg" />
      </div>
    )
  }

  // Redirect to landing if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // Check role requirements if specified
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}
