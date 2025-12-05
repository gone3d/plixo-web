// Portfolio Data Types - Core TypeScript Interfaces
// Phase 2 Priority 1: Data Structure Design

/**
 * Project Data Structure
 * Extended interface for temp-data (legacy fields preserved)
 * API schema will use subset of these fields
 */
export interface Project {
  // Identity
  id: string

  // Content
  title: string
  description: string
  longDescription?: string // Extended description for detail views

  // Technical
  technologies: string[] // Array of tech names: ["React", "TypeScript", "Tailwind"]
  status: ProjectStatus
  category?: string // "personal", "enterprise", "government", "fintech"

  // Metrics (legacy)
  metrics?: {
    performance?: string
    technical?: string
    impact?: string
    growth?: string
    users?: string
  }

  // URLs (legacy structure)
  urls?: {
    live?: string
    github?: string
    demo?: string
  }

  // Images (legacy structure)
  images?: {
    thumbnail?: string
    screenshots?: string[]
  }

  // API-compatible links (newer structure)
  image?: string // Relative path to image (e.g., "/assets/projects/foo.jpg")
  live_url?: string | null
  github_url?: string | null
  demo_url?: string | null

  // Display
  featured: boolean
  priority: number // Display order (lower = higher priority)
  display_order?: number // API field (newer structure)

  // Timestamps (legacy)
  dateCreated: string
  lastUpdated: string

  // Timestamps (API - managed by API)
  created_at?: string // ISO 8601 timestamp
  updated_at?: string // ISO 8601 timestamp

  // Project Details (legacy)
  teamSize?: number
  role?: string
  duration?: string
  businessImpact?: string
  technicalChallenges?: string[]
  learningsAndGrowth?: string[]
}

export type ProjectStatus =
  | 'Live'
  | 'Demo'
  | 'In Development'
  | 'Archived'
  | 'Prototype'

/**
 * Input types for creating/updating projects
 */
export interface CreateProjectInput {
  title: string
  description: string
  technologies: string[]
  status: ProjectStatus
  image: string
  live_url?: string
  github_url?: string
  demo_url?: string
  featured?: boolean
  display_order?: number
}

export interface UpdateProjectInput {
  title?: string
  description?: string
  technologies?: string[]
  status?: ProjectStatus
  image?: string
  live_url?: string | null
  github_url?: string | null
  demo_url?: string | null
  featured?: boolean
  display_order?: number
}

// Legacy interfaces (kept for Experience/Skills, removed from Project)
export interface Technology {
  name: string
  category: TechnologyCategory
  proficiency: ProficiencyLevel
  primary: boolean
}

export type TechnologyCategory =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'cloud'
  | 'ai-ml'
  | 'devops'
  | 'mobile'
  | 'desktop'
  | 'specialized'
  | 'tools'

export type ProficiencyLevel = 1 | 2 | 3 | 4 | 5 // 1=Beginner, 5=Expert

/**
 * Experience & Career Data Structure
 * Professional experience with detailed context and achievements
 */
export interface Experience {
  id: string
  company: string
  role: string
  startDate: string // ISO date string
  endDate?: string // ISO date string, undefined for current position

  // Role Context
  description: string
  achievements: Achievement[]
  technologies: string[] // Array of tech names: ["React", "TypeScript", etc.]
  teamSize?: number
  reportsTo?: string
  directReports?: number

  // Security & Clearance
  clearanceLevel?: ClearanceLevel

  // Project Context
  keyProjects: string[] // Project IDs

  // Business Context
  industry: Industry
  companySize: CompanySize
  workType: WorkType

  // Location & Remote
  location: string
  remote: boolean

  // Experience Category
  category: ExperienceCategory

  // Impact Metrics
  impactMetrics?: string[]
}

export interface Achievement {
  description: string
  impact?: string
  technologies?: string[]
  timeframe?: string
}

export type ClearanceLevel =
  | 'Public Trust'
  | 'Secret'
  | 'Top Secret'
  | 'TS/SCI'

export type Industry =
  | 'fintech'
  | 'government'
  | 'defense'
  | 'enterprise'
  | 'consulting'
  | 'research'
  | 'education'
  | 'healthcare'
  | 'technology'

export type CompanySize =
  | 'startup' // <50 employees
  | 'small' // 50-200 employees
  | 'medium' // 200-1000 employees
  | 'large' // 1000-10000 employees
  | 'enterprise' // >10000 employees

export type WorkType =
  | 'full-time'
  | 'contract'
  | 'consulting'
  | 'part-time'
  | 'freelance'

export type ExperienceCategory =
  | 'professional'
  | 'consulting'
  | 'research'
  | 'volunteer'
  | 'education'

/**
 * Skills & Learning Data Structure
 * Technical skills with proficiency tracking and learning status
 */
export interface Skill {
  id: string
  name: string
  category: TechnologyCategory
  proficiency: ProficiencyLevel

  // Learning Status
  learning: boolean
  recentlyUsed: boolean // Used in last 6 months

  // Project Context
  projects: string[] // Project IDs where this skill was used
  yearsExperience: number

  // Certification & Validation
  certifications?: Certification[]

  // Context & Notes
  context?: string // "Primary expertise", "Learning for upcoming project"
  lastUsed?: string // ISO date string

  // Skill Relationships
  relatedSkills?: string[] // Related skill IDs
  prerequisites?: string[] // Prerequisite skill IDs
}

export interface Certification {
  name: string
  issuer: string
  dateEarned: string // ISO date string
  expirationDate?: string // ISO date string
  credentialId?: string
  verificationUrl?: string
}

/**
 * Background Images & Visual Assets
 * Metadata for background slideshow and visual elements
 */
export interface BackgroundImage {
  filename: string
  title?: string
  description?: string
  photographer?: string
  location?: string
  tags?: string[]
}

/**
 * Application Configuration Schema
 * Theme settings, feature flags, and app-wide configuration
 */
export interface AppConfig {
  // Theme Configuration
  theme: ThemeConfig

  // Feature Flags
  features: FeatureFlags

  // API Configuration
  api: ApiConfig

  // Analytics Configuration
  analytics: AnalyticsConfig

  // Performance Configuration
  performance: PerformanceConfig

  // Content Configuration
  content: ContentConfig
}

export interface ThemeConfig {
  defaultTheme: 'light' | 'dark' | 'system'
  allowThemeToggle: boolean
  customColors?: Record<string, string>
  animations: {
    enabled: boolean
    respectReducedMotion: boolean
    duration: 'fast' | 'normal' | 'slow'
  }
}

export interface FeatureFlags {
  backgroundSlideshow: boolean
  realTimeAnalytics: boolean
  githubIntegration: boolean
  contactForm: boolean
  downloadResume: boolean
  socialLinks: boolean
  projectFiltering: boolean
  skillsVisualization: boolean
  threeDElements: boolean
  performanceMetrics: boolean
}

export interface ApiConfig {
  baseUrl: string
  timeout: number
  retryAttempts: number
  rateLimiting: {
    enabled: boolean
    requestsPerMinute: number
  }
  caching: {
    enabled: boolean
    defaultTTL: number // seconds
  }
}

export interface AnalyticsConfig {
  enabled: boolean
  anonymizeIPs: boolean
  trackPageViews: boolean
  trackUserEvents: boolean
  retentionDays: number
  gdprCompliant: boolean
  cookieConsent: boolean
}

export interface PerformanceConfig {
  lazyLoading: boolean
  imageSizes: {
    thumbnail: number
    medium: number
    large: number
  }
  cacheStrategy: 'aggressive' | 'normal' | 'minimal'
  preloadCriticalAssets: boolean
}

export interface ContentConfig {
  contactEmail: string
  socialLinks: SocialLink[]
  resumeUrl?: string
  availabilityStatus: AvailabilityStatus
  timezone: string
  preferredContactMethods: ContactMethod[]
}

export interface SocialLink {
  platform: string
  url: string
  username: string
  display: boolean
  icon: string
}

export interface AvailabilityStatus {
  available: boolean
  status: 'available' | 'selective' | 'unavailable'
  message?: string
  nextAvailableDate?: string // ISO date string
}

export type ContactMethod =
  | 'email'
  | 'linkedin'
  | 'phone'
  | 'calendly'
  | 'github'

/**
 * Portfolio Overview Data Structure
 * High-level portfolio summary and key metrics
 */
export interface PortfolioOverview {
  // Personal Information
  name: string
  title: string
  tagline: string
  location: string

  // Professional Summary
  summary: string
  yearsExperience: number

  // Key Metrics
  metrics: PortfolioMetrics

  // Current Status
  currentRole?: string
  currentCompany?: string
  availability: AvailabilityStatus

  // Highlights
  featuredProjects: string[] // Project IDs
  coreSkills: string[] // Skill IDs
  recentAchievements: string[]

  // Metadata
  lastUpdated: string // ISO date string
  version: string
}

export interface PortfolioMetrics {
  totalProjects: number
  featuredProjects: number
  yearsExperience: number
  technologiesUsed: number
  companiesWorked: number
  teamsManagedCount?: number
  projectsLedCount?: number

  // Achievement Metrics
  performanceImprovements?: string
  userBaseGrowth?: string
  systemUptime?: string
  costSavings?: string
}