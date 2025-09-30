// Portfolio Data Types - Core TypeScript Interfaces
// Phase 2 Priority 1: Data Structure Design

/**
 * Project Data Structure
 * Comprehensive interface for portfolio projects with metrics, status, and technical details
 */
export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string

  // Technical Details
  technologies: Technology[]
  category: ProjectCategory
  status: ProjectStatus

  // Performance & Impact Metrics
  metrics?: ProjectMetrics

  // URLs and Links
  urls: ProjectUrls

  // Visual Assets
  images: ProjectImages

  // Project Metadata
  featured: boolean
  priority: number // For sorting featured projects
  dateCreated: string // ISO date string
  lastUpdated: string // ISO date string

  // Development Context
  teamSize?: number
  role: string // "Lead Developer", "Principal Engineer", etc.
  duration?: string // "6 months", "2 years", etc.

  // Business Context
  businessImpact?: string
  technicalChallenges?: string[]
  learningsAndGrowth?: string[]
}

export interface Technology {
  name: string
  category: TechnologyCategory
  proficiency: ProficiencyLevel
  primary: boolean // Whether this was a primary technology for the project
}

export interface ProjectMetrics {
  users?: string // "100K+ active users"
  performance?: string // "99.9% uptime"
  impact?: string // "50% reduction in load time"
  growth?: string // "300% user engagement increase"
  technical?: string // "Sub-100ms API response times"
}

export interface ProjectUrls {
  live?: string
  demo?: string
  github?: string
  caseStudy?: string
  documentation?: string
}

export interface ProjectImages {
  thumbnail: string
  hero?: string
  screenshots: string[]
  architecture?: string[] // Architecture diagrams
}

export type ProjectCategory =
  | 'enterprise'
  | 'fintech'
  | 'government'
  | 'consulting'
  | 'research'
  | 'open-source'
  | 'personal'

export type ProjectStatus =
  | 'Live'
  | 'Demo'
  | 'In Development'
  | 'Archived'
  | 'Prototype'

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
  technologies: Technology[]
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