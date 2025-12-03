import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authService } from '../services/auth'

export interface User {
  id: string
  username: string
  email: string
  role: 'guest' | 'user' | 'admin'
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  guestLogin: (captchaToken: string) => Promise<void>
  logout: () => void
  hasRole: (role: 'guest' | 'user' | 'admin') => boolean
  hasAnyRole: (roles: Array<'guest' | 'user' | 'admin'>) => boolean
  verifyRole: (role: 'guest' | 'user' | 'admin') => Promise<boolean>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken()
        if (token) {
          // Verify token and get user info
          const userData = await authService.getCurrentUser()
          setUser(userData)
        }
      } catch (error) {
        console.error('Failed to restore authentication:', error)
        authService.removeToken()
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (username: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await authService.login(username, password)
      setUser(response.user)
    } catch (error) {
      setIsLoading(false)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const guestLogin = async (captchaToken: string) => {
    setIsLoading(true)
    try {
      const response = await authService.guestLogin(captchaToken)
      setUser(response.user)
    } catch (error) {
      setIsLoading(false)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const hasRole = (role: 'guest' | 'user' | 'admin'): boolean => {
    return user?.role === role
  }

  const hasAnyRole = (roles: Array<'guest' | 'user' | 'admin'>): boolean => {
    return user ? roles.includes(user.role) : false
  }

  const verifyRole = async (role: 'guest' | 'user' | 'admin'): Promise<boolean> => {
    try {
      const response = await authService.verifyRole(role)
      return response.hasRole
    } catch (error) {
      console.error('Role verification failed:', error)
      return false
    }
  }

  const refreshUser = async () => {
    try {
      const userData = await authService.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error('Failed to refresh user:', error)
      authService.removeToken()
      setUser(null)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    guestLogin,
    logout,
    hasRole,
    hasAnyRole,
    verifyRole,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
