import { tokenStorage } from './tokenStorage'

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8788'

// Request configuration interface
interface RequestConfig {
  headers?: Record<string, string>
  timeout?: number
  signal?: AbortSignal
}

// API Response interface matching axios structure
export interface ApiResponse<T> {
  data: T
  status: number
  statusText: string
  headers: Headers
  config?: RequestConfig
}

// API Error interface matching axios structure
export interface ApiError extends Error {
  response?: {
    status: number
    statusText: string
    data: any
  }
  request?: any
  config?: RequestConfig
}

/**
 * ApiClient class - Native fetch-based HTTP client
 * Drop-in replacement for axios with the same API surface
 */
class ApiClient {
  private baseURL: string
  private defaultTimeout: number
  private defaultHeaders: Record<string, string>

  constructor(baseURL: string, timeout: number = 10000) {
    this.baseURL = baseURL
    this.defaultTimeout = timeout
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  /**
   * Request interceptor - adds authentication token if available
   */
  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...customHeaders }

    // Get auth token from tokenStorage (memory only)
    const token = tokenStorage.getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return headers
  }

  /**
   * Response error handler - replicates axios error handling
   */
  private handleResponseError(response: Response, url: string): ApiError {
    const error = new Error(`Request failed with status ${response.status}`) as ApiError

    error.response = {
      status: response.status,
      statusText: response.statusText,
      data: null, // Will be populated by the calling function
    }
    error.config = { headers: {} }

    // Global error handling by status code
    switch (response.status) {
      case 401:
        // Unauthorized - clear token
        tokenStorage.removeToken()
        console.error('Unauthorized - token cleared')
        break
      case 403:
        console.error('Forbidden - insufficient permissions')
        break
      case 404:
        console.error('Not found:', url)
        break
      case 500:
        console.error('Server error: Internal server error')
        break
      default:
        console.error(`API Error (${response.status}):`, response.statusText)
    }

    return error
  }

  /**
   * Core request method with timeout support
   */
  private async request<T>(
    method: string,
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`
    const timeout = config?.timeout || this.defaultTimeout

    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const headers = this.getHeaders(config?.headers)

      const options: RequestInit = {
        method,
        headers,
        signal: config?.signal || controller.signal,
      }

      // Add body for POST, PUT, PATCH requests
      if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
        options.body = JSON.stringify(data)
      }

      const response = await fetch(fullUrl, options)

      clearTimeout(timeoutId)

      // Parse response data
      let responseData: any
      const contentType = response.headers.get('content-type')

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json()
      } else {
        responseData = await response.text()
      }

      // Handle error responses
      if (!response.ok) {
        const error = this.handleResponseError(response, fullUrl)
        error.response!.data = responseData

        // Log additional error details if available
        if (responseData?.error?.message) {
          console.error(`API Error (${response.status}):`, responseData.error.message)
        }

        throw error
      }

      // Return successful response in axios format
      return {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config,
      }
    } catch (error: any) {
      clearTimeout(timeoutId)

      // Handle abort/timeout errors
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout') as ApiError
        timeoutError.request = { url: fullUrl }
        console.error('No response from server: Request timeout')
        throw timeoutError
      }

      // Handle network errors
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        const networkError = new Error('Network error') as ApiError
        networkError.request = { url: fullUrl }
        console.error('No response from server:', error.message)
        throw networkError
      }

      // Re-throw API errors
      if (error.response) {
        throw error
      }

      // Handle other errors
      console.error('Request setup error:', error.message)
      throw error
    }
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, config)
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, config)
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, config)
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, config)
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, data, config)
  }
}

// Create API client instance with default configuration
export const apiClient = new ApiClient(API_URL, 10000)

// Helper function to get current API URL
export const getApiUrl = () => API_URL
