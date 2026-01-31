// Types Index - Centralized type exports
// Phase 2: Complete type system for portfolio application

// Portfolio data types
export * from './portfolio'

// Analytics and tracking types
export * from './analytics'

// Three.js canvas and 3D animation types
export * from './threeCanvas'

// Re-export commonly used types for convenience
export type {
  // Core portfolio entities
  Project,
  Experience,
  Skill,
  PortfolioOverview,
  AppConfig,
  BackgroundImage,

  // Technology and categorization
  Technology,
  TechnologyCategory,
  ExperienceCategory,

  // Status
  ProjectStatus,

  // Contact and social
  ContactMethod,
  SocialLink,

  // Configuration
  ThemeConfig,
  PerformanceConfig
} from './portfolio'

export type {
  // Analytics core types
  VisitorSession,
  PageView,
  InteractionEvent,
  DeviceInfo,

  // Dashboard and reporting
  AnalyticsDashboard,
  OverviewMetrics,
  GeographicData,

  // GitHub integration
  GitHubData,
  GitHubProfile,
  GitHubRepository,
  GitHubActivity,

  // Enums and supporting types
  DeviceType,
  BrowserType,
  InteractionType,
  ReferrerType,

  // Performance and quality
  DataQualityScore,
  PagePerformanceMetrics,
  CurrentPerformanceMetrics
} from './analytics'

// Type utilities for development
export type DataSource = 'config' | 'api'
export type Environment = 'development' | 'production' | 'staging'
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// Common utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Keys>>
  }[Keys]

// API response wrapper types
export interface APIResponse<T> {
  data: T
  success: boolean
  message?: string
  timestamp: string
}

export interface APIError {
  error: string
  code: number
  details?: Record<string, unknown>
  timestamp: string
}

// Pagination types for future API
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Search and filtering types
export interface SearchParams {
  query?: string
  category?: string
  tags?: string[]
  dateRange?: {
    start: string
    end: string
  }
}

// Form validation types
export type ValidationRule = {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export type FieldValidation = Record<string, ValidationRule[]>

// Feature flag types
export interface FeatureFlags {
  backgroundSlideshow: boolean
  realTimeAnalytics: boolean
  githubIntegration: boolean
  contactForm: boolean
  downloadResume: boolean
  socialLinks: boolean
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system'
export type ColorScheme = 'blue' | 'purple' | 'green' | 'orange'

// Development configuration
export interface DevelopmentConfig {
  dataSource: DataSource
  debugMode: boolean
  mockAPI: boolean
  logLevel: 'error' | 'warn' | 'info' | 'debug'
}