import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole: 'guest' | 'user' | 'admin'
  fallbackPath?: string
}

/**
 * ProtectedRoute component with server-side role verification
 *
 * This component protects routes by verifying the user's role on the server,
 * preventing client-side authorization bypass attacks.
 *
 * @param children - The component to render if authorized
 * @param requiredRole - The role required to access this route
 * @param fallbackPath - Where to redirect if unauthorized (default: '/')
 */
export const ProtectedRoute = ({
  children,
  requiredRole,
  fallbackPath = '/'
}: ProtectedRouteProps) => {
  const { user, isLoading, verifyRole } = useAuth()
  const [isVerifying, setIsVerifying] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuthorization = async () => {
      // Wait for auth context to load
      if (isLoading) {
        return
      }

      // No user = not authorized
      if (!user) {
        setIsAuthorized(false)
        setIsVerifying(false)
        return
      }

      // Verify role on server (prevents client-side bypass)
      try {
        const hasRole = await verifyRole(requiredRole)
        setIsAuthorized(hasRole)
      } catch (error) {
        console.error('Authorization check failed:', error)
        setIsAuthorized(false)
      } finally {
        setIsVerifying(false)
      }
    }

    checkAuthorization()
  }, [user, isLoading, requiredRole, verifyRole])

  // Show loading state while checking
  if (isLoading || isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white/60">Verifying access...</div>
      </div>
    )
  }

  // Redirect if not authorized
  if (!isAuthorized) {
    return <Navigate to={fallbackPath} replace />
  }

  // Render protected content
  return <>{children}</>
}
