// Configuration Index - Centralized config management
// Phase 2 Priority 1: Data Structure Design

export * from '../types/portfolio'
export * from '../types/analytics'
import { tempConfig } from './temp-data'

export { tempConfig }

// Environment-based configuration
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'

// API Endpoints (will be configurable via environment)
export const API_BASE_URL = process.env.VITE_API_URL ||
  (isProduction ? 'https://api.plixo.com' : 'http://localhost:3001')

// Feature flags (temporary, will move to API)
export const FEATURE_FLAGS = {
  USE_TEMP_CONFIG: true, // Phase 2: Use temp config before API
  ENABLE_ANALYTICS: false, // Phase 2 Priority 4
  ENABLE_GITHUB_INTEGRATION: false, // Phase 2 Priority 4
  ENABLE_REAL_TIME: false, // Phase 2 Priority 4
  DEBUG_MODE: isDevelopment
} as const

// Temp config access (will be replaced by API calls)
export const getPortfolioData = () => {
  if (FEATURE_FLAGS.USE_TEMP_CONFIG) {
    return Promise.resolve(tempConfig)
  }

  // Future API integration
  throw new Error('API integration not yet implemented - use temp config')
}

// Configuration validation
export const validateConfig = (config: any): boolean => {
  // Basic validation for required fields
  return !!(
    config.portfolioOverview &&
    config.projects &&
    config.experiences &&
    config.skills &&
    config.appConfig
  )
}