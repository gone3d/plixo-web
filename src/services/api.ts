import axios, { type AxiosError, type AxiosResponse } from 'axios'
import { tokenStorage } from './tokenStorage'

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8788'

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - adds authentication token if available
apiClient.interceptors.request.use(
  (config) => {
    // Get auth token from tokenStorage (memory only)
    const token = tokenStorage.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - handles errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return successful response
    return response
  },
  (error: AxiosError) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with error status
      const status = error.response.status
      const data = error.response.data as { error?: { message?: string } }

      switch (status) {
        case 401:
          // Unauthorized - clear token
          tokenStorage.removeToken()
          console.error('Unauthorized - token cleared')
          break
        case 403:
          console.error('Forbidden - insufficient permissions')
          break
        case 404:
          console.error('Not found:', error.config?.url)
          break
        case 500:
          console.error('Server error:', data?.error?.message || 'Internal server error')
          break
        default:
          console.error(`API Error (${status}):`, data?.error?.message || error.message)
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('No response from server:', error.message)
    } else {
      // Error setting up request
      console.error('Request setup error:', error.message)
    }

    return Promise.reject(error)
  }
)

// Helper function to get current API URL
export const getApiUrl = () => API_URL

// Export types for use in components
export type ApiError = AxiosError
export type ApiResponse<T> = AxiosResponse<T>
