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

class AuthService {
  /**
   * Login with username and password
   */
  async login(username: string, password: string): Promise<LoginData> {
    try {
      const { data } = await apiClient.post<LoginResponse>('/api/auth/login', {
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
   * Logout and clear token
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout')
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
      const { data } = await apiClient.get<AuthUserResponse>('/api/auth/me')

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
        '/api/auth/refresh'
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
   * Store token in localStorage
   */
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  }

  /**
   * Get token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  }

  /**
   * Remove token from localStorage
   */
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY)
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const authService = new AuthService()
