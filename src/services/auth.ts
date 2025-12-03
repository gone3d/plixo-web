import { apiClient } from './api'
import type { User } from '../contexts/AuthContext'

const TOKEN_KEY = 'auth_token'

interface LoginResponse {
  success: boolean
  data: {
    token: string
    expiresAt: string
    user: User
  }
}

interface LoginData {
  token: string
  expiresAt: string
  user: User
}

interface AuthUserResponse {
  success: boolean
  data: User
}

interface VerifyRoleResponse {
  success: boolean
  hasRole: boolean
  currentRole: string
}

class AuthService {
  /**
   * Login with username and password
   */
  async login(username: string, password: string): Promise<LoginData> {
    try {
      const { data } = await apiClient.post<LoginResponse>('/auth/login', {
        username,
        password,
      })

      if (data.success && data.data.token) {
        this.setToken(data.data.token)
        return data.data
      }

      throw new Error('Login failed: Invalid response from server')
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 401) {
        throw new Error('Invalid username or password')
      }
      if (error.response?.status === 429) {
        throw new Error('Too many login attempts. Please try again later.')
      }
      throw new Error(error.response?.data?.error || 'Login failed. Please try again.')
    }
  }

  /**
   * Guest login with Turnstile CAPTCHA token
   */
  async guestLogin(captchaToken: string): Promise<LoginData> {
    try {
      const { data } = await apiClient.post<LoginResponse>('/auth/guest-login', {
        captchaToken,
      })

      if (data.success && data.data.token) {
        this.setToken(data.data.token)
        return data.data
      }

      throw new Error('Guest login failed: Invalid response from server')
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 400) {
        throw new Error('CAPTCHA verification failed. Please try again.')
      }
      if (error.response?.status === 429) {
        throw new Error('Too many guest login attempts. Please try again in 24 hours.')
      }
      throw new Error(error.response?.data?.error || 'Guest login failed. Please try again.')
    }
  }

  /**
   * Logout and clear token
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Logout request failed:', error)
    } finally {
      this.removeToken()
    }
  }

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<User> {
    try {
      const { data } = await apiClient.get<AuthUserResponse>('/auth/me')

      if (data.success && data.data) {
        return data.data
      }

      throw new Error('Failed to get user info')
    } catch (error: any) {
      if (error.response?.status === 401) {
        this.removeToken()
        throw new Error('Session expired. Please login again.')
      }
      throw error
    }
  }

  /**
   * Refresh JWT token
   */
  async refreshToken(): Promise<string> {
    try {
      const { data } = await apiClient.post<{ success: boolean; data: { token: string; expiresAt: string } }>(
        '/auth/refresh'
      )

      if (data.success && data.data.token) {
        this.setToken(data.data.token)
        return data.data.token
      }

      throw new Error('Token refresh failed')
    } catch (error) {
      this.removeToken()
      throw error
    }
  }

  /**
   * Store token in sessionStorage (cleared when browser/tab closes)
   */
  setToken(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token)
  }

  /**
   * Get token from sessionStorage
   */
  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY)
  }

  /**
   * Remove token from sessionStorage
   */
  removeToken(): void {
    sessionStorage.removeItem(TOKEN_KEY)
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  /**
   * Verify user has specific role (server-side check)
   *
   * This method calls the API to verify the user's role from the database,
   * not from the cached JWT payload. This ensures fresh, server-verified data.
   *
   * @param role - The role to check for ('guest', 'user', or 'admin')
   * @returns Promise with hasRole boolean and currentRole string
   */
  async verifyRole(role: 'guest' | 'user' | 'admin'): Promise<VerifyRoleResponse> {
    try {
      const { data } = await apiClient.get<VerifyRoleResponse>(
        `/auth/verify-role?required=${role}`
      )

      return data
    } catch (error: any) {
      // If request fails (401, 403, etc.), user doesn't have the role
      console.error('Role verification failed:', error.response?.status, error.response?.data || error.message)
      return {
        success: false,
        hasRole: false,
        currentRole: error.response?.data?.currentRole || 'unknown'
      }
    }
  }
}

export const authService = new AuthService()
