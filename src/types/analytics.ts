// Analytics Data Types - Privacy-Compliant Visitor Tracking
// Phase 2 Priority 1: Data Structure Design - Analytics Schema

/**
 * Visitor Session Tracking (Anonymous & GDPR Compliant)
 * No personally identifiable information is stored
 */
export interface VisitorSession {
  // Anonymous Session Identification
  sessionId: string // SHA-256 hash of anonymous browser fingerprint
  sessionHash: string // Additional security hash

  // Session Metadata
  startTime: string // ISO timestamp
  endTime?: string // ISO timestamp, undefined for active sessions
  duration?: number // milliseconds

  // Page Navigation
  pages: PageView[]
  totalPageViews: number

  // Geographic Information (Country-level only for privacy)
  country?: string // ISO country code (US, CA, GB, etc.)
  region?: string // State/Province level (optional)
  timezone?: string // Browser timezone

  // Device Information (Anonymous)
  device: DeviceInfo

  // Referrer Information
  referrer?: ReferrerInfo

  // User Engagement Metrics
  engagement: EngagementMetrics

  // Privacy & Consent
  consent: ConsentStatus

  // Session Quality
  quality: SessionQuality
}

export interface PageView {
  // Page Information
  page: string // '/work', '/about', etc.
  title: string
  path: string

  // Timing Information
  timestamp: string // ISO timestamp
  timeOnPage?: number // milliseconds
  loadTime?: number // milliseconds

  // Engagement Metrics
  scrollDepth: number // percentage (0-100)
  interactions: InteractionEvent[]

  // Performance Metrics
  performance?: PagePerformanceMetrics

  // Exit Information
  exitPage: boolean
  exitType?: ExitType
}

export interface InteractionEvent {
  type: InteractionType
  element?: string // CSS selector or element description
  timestamp: string // ISO timestamp
  value?: string | number // Optional interaction value
  metadata?: Record<string, string | number | boolean>
}

export interface DeviceInfo {
  // Device Type
  type: DeviceType

  // Browser Information (No version tracking for privacy)
  browser: BrowserType

  // Screen Information
  screenResolution?: ScreenResolution
  viewportSize?: ViewportSize

  // Capabilities (For performance optimization)
  capabilities: DeviceCapabilities

  // Connection Information
  connection?: ConnectionInfo
}

export interface ReferrerInfo {
  type: ReferrerType
  domain?: string // Only domain, no full URL for privacy
  source?: string // 'google', 'linkedin', 'direct', etc.
  medium?: string // 'organic', 'social', 'email', etc.
  campaign?: string // UTM campaign (if applicable)
}

export interface EngagementMetrics {
  // Overall Engagement
  engagementScore: number // 0-100 calculated score

  // Page Interactions
  totalInteractions: number
  uniqueInteractionTypes: number

  // Content Consumption
  averageTimePerPage: number // milliseconds
  pagesPerSession: number

  // Bounce & Return
  bounced: boolean // Single page session with <30 seconds
  returning: boolean // Has previous sessions (based on anonymous hash)

  // Goal Completion
  goalsCompleted: GoalCompletion[]
}

export interface ConsentStatus {
  // Consent Tracking
  analyticsConsent: boolean
  functionalConsent: boolean
  consentTimestamp: string // ISO timestamp
  consentVersion: string

  // Privacy Settings
  doNotTrack: boolean
  optedOut: boolean

  // Legal Compliance
  gdprApplies: boolean
  ccpaApplies: boolean
}

export interface SessionQuality {
  // Data Quality Indicators
  complete: boolean // Session ended normally vs. interrupted
  dataQuality: DataQualityScore

  // Bot Detection
  botProbability: number // 0-1 probability of being a bot
  humanVerified: boolean

  // Error Tracking
  errors: ErrorEvent[]
  warningsCount: number
}

/**
 * Analytics Dashboard Data
 * Aggregated metrics for insights display
 */
export interface AnalyticsDashboard {
  // Time Range
  dateRange: DateRange
  lastUpdated: string // ISO timestamp

  // Overview Metrics
  overview: OverviewMetrics

  // Geographic Distribution
  geographic: GeographicData[]

  // Device & Browser Analytics
  devices: DeviceAnalytics

  // Page Performance
  pages: PageAnalytics[]

  // User Engagement
  engagement: EngagementAnalytics

  // Traffic Sources
  traffic: TrafficAnalytics

  // Real-time Data
  realTime: RealTimeMetrics
}

export interface OverviewMetrics {
  // Visitor Counts
  totalSessions: number
  uniqueVisitors: number // Based on anonymous hashing
  newVsReturning: {
    new: number
    returning: number
  }

  // Engagement
  averageSessionDuration: number // milliseconds
  averagePagesPerSession: number
  bounceRate: number // percentage

  // Growth Metrics
  periodComparison: PeriodComparison
}

export interface GeographicData {
  country: string // ISO country code
  countryName: string
  sessions: number
  percentage: number
  averageSessionDuration: number
  bounceRate: number
}

export interface DeviceAnalytics {
  deviceTypes: DeviceTypeBreakdown[]
  browsers: BrowserBreakdown[]
  screenResolutions: ScreenResolutionBreakdown[]
  operatingSystems: OSBreakdown[]
}

export interface PageAnalytics {
  page: string
  path: string

  // Traffic Metrics
  pageViews: number
  uniquePageViews: number

  // Engagement Metrics
  averageTimeOnPage: number // milliseconds
  averageScrollDepth: number // percentage

  // Performance Metrics
  averageLoadTime: number // milliseconds

  // Navigation Metrics
  entrances: number
  exits: number
  bounceRate: number

  // Popular Content
  popularContent?: ContentEngagement[]
}

export interface EngagementAnalytics {
  // Interaction Patterns
  topInteractionTypes: InteractionTypeBreakdown[]
  engagementFlow: EngagementFlowData[]

  // Content Performance
  contentEngagement: ContentEngagement[]

  // User Journey
  commonPaths: UserPath[]
  dropoffPoints: DropoffPoint[]
}

export interface TrafficAnalytics {
  // Source Breakdown
  sources: TrafficSource[]

  // Referrer Analysis
  topReferrers: ReferrerBreakdown[]

  // Search Terms (if available)
  searchTerms?: SearchTermBreakdown[]

  // Social Media Traffic
  socialMedia: SocialMediaBreakdown[]
}

export interface RealTimeMetrics {
  // Current Activity
  activeVisitors: number
  currentPageViews: number

  // Live Activity Feed
  recentActivity: RecentActivity[]

  // Performance Monitoring
  currentPerformance: CurrentPerformanceMetrics
}

/**
 * GitHub Integration Data
 * Live GitHub activity and repository statistics
 */
export interface GitHubData {
  // Profile Information
  profile: GitHubProfile

  // Repository Statistics
  repositories: GitHubRepository[]

  // Activity Data
  activity: GitHubActivity

  // Language Statistics
  languages: LanguageStats

  // Contribution Data
  contributions: ContributionData

  // Caching Information
  lastUpdated: string // ISO timestamp
  cacheExpiry: string // ISO timestamp
  dataFreshness: DataFreshness
}

export interface GitHubProfile {
  username: string
  name: string
  bio?: string
  location?: string
  company?: string
  publicRepos: number
  followers: number
  following: number
  createdAt: string // ISO timestamp
}

export interface GitHubRepository {
  id: number
  name: string
  fullName: string
  description?: string
  language?: string
  stargazersCount: number
  forksCount: number
  openIssues: number

  // Repository Metadata
  private: boolean
  fork: boolean
  archived: boolean

  // Activity
  pushedAt: string // ISO timestamp
  createdAt: string // ISO timestamp
  updatedAt: string // ISO timestamp

  // URLs
  htmlUrl: string
  cloneUrl: string

  // Topics/Tags
  topics: string[]
}

export interface GitHubActivity {
  // Recent Commits
  recentCommits: CommitActivity[]

  // Pull Requests
  pullRequests: PullRequestActivity[]

  // Issues
  issues: IssueActivity[]

  // Overall Activity Score
  activityScore: number // 0-100 calculated score
  contributionStreak: number // days
}

export interface LanguageStats {
  // Programming Languages
  languages: LanguageUsage[]

  // Trends
  trending: LanguageTrend[]

  // Diversity Metrics
  diversityScore: number // 0-100
  primaryLanguage: string
}

export interface ContributionData {
  // Contribution Graph Data
  contributionGraph: ContributionDay[]

  // Statistics
  totalContributions: number
  currentStreak: number
  longestStreak: number

  // Patterns
  contributionPatterns: ContributionPattern[]
}

// Supporting Type Definitions

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'smart-tv' | 'unknown'
export type BrowserType = 'chrome' | 'firefox' | 'safari' | 'edge' | 'other'
export type InteractionType = 'click' | 'scroll' | 'hover' | 'form_interaction' | 'download' | 'external_link' | 'contact_attempt'
export type ExitType = 'navigation' | 'tab_close' | 'timeout' | 'error'
export type ReferrerType = 'direct' | 'search' | 'social' | 'email' | 'referral' | 'unknown'
export type DataQualityScore = 'high' | 'medium' | 'low'

export interface ScreenResolution {
  width: number
  height: number
}

export interface ViewportSize {
  width: number
  height: number
}

export interface DeviceCapabilities {
  touchEnabled: boolean
  cookiesEnabled: boolean
  javascriptEnabled: boolean
  webglSupported: boolean
  localStorageEnabled: boolean
}

export interface ConnectionInfo {
  effectiveType: '2g' | '3g' | '4g' | '5g' | 'unknown'
  downlink?: number // Mbps
  rtt?: number // milliseconds
}

export interface GoalCompletion {
  goalId: string
  goalName: string
  completedAt: string // ISO timestamp
  value?: number
}

export interface ErrorEvent {
  type: 'javascript' | 'network' | 'resource' | 'security'
  message: string
  timestamp: string // ISO timestamp
  page: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export interface DateRange {
  startDate: string // ISO date
  endDate: string // ISO date
  period: 'today' | 'yesterday' | '7d' | '30d' | '90d' | 'custom'
}

export interface PeriodComparison {
  current: number
  previous: number
  change: number // percentage change
  trend: 'up' | 'down' | 'stable'
}

export interface PagePerformanceMetrics {
  // Core Web Vitals
  lcp?: number // Largest Contentful Paint (ms)
  fid?: number // First Input Delay (ms)
  cls?: number // Cumulative Layout Shift

  // Additional Metrics
  ttfb?: number // Time to First Byte (ms)
  fcp?: number // First Contentful Paint (ms)

  // Custom Metrics
  customMetrics?: Record<string, number>
}

export interface CurrentPerformanceMetrics {
  averageLoadTime: number // milliseconds
  errorRate: number // percentage
  uptime: number // percentage
  apiResponseTime: number // milliseconds
}

// Additional supporting interfaces for analytics dashboard
export interface DeviceTypeBreakdown {
  deviceType: DeviceType
  sessions: number
  percentage: number
}

export interface BrowserBreakdown {
  browser: BrowserType
  sessions: number
  percentage: number
}

export interface ScreenResolutionBreakdown {
  resolution: string // "1920x1080"
  sessions: number
  percentage: number
}

export interface OSBreakdown {
  os: string
  sessions: number
  percentage: number
}

export interface InteractionTypeBreakdown {
  type: InteractionType
  count: number
  percentage: number
}

export interface EngagementFlowData {
  step: number
  page: string
  completionRate: number
}

export interface ContentEngagement {
  content: string
  engagementScore: number
  interactionCount: number
}

export interface UserPath {
  path: string[]
  frequency: number
  averageDuration: number
}

export interface DropoffPoint {
  page: string
  dropoffRate: number
  previousPage?: string
}

export interface TrafficSource {
  source: string
  sessions: number
  percentage: number
  bounceRate: number
}

export interface ReferrerBreakdown {
  domain: string
  sessions: number
  percentage: number
}

export interface SearchTermBreakdown {
  term: string
  sessions: number
  percentage: number
}

export interface SocialMediaBreakdown {
  platform: string
  sessions: number
  percentage: number
}

export interface RecentActivity {
  type: 'page_view' | 'interaction' | 'goal_completion'
  page: string
  timestamp: string
  country?: string
}

export interface CommitActivity {
  sha: string
  message: string
  date: string // ISO timestamp
  repository: string
  url: string
}

export interface PullRequestActivity {
  id: number
  title: string
  state: 'open' | 'closed' | 'merged'
  createdAt: string // ISO timestamp
  repository: string
  url: string
}

export interface IssueActivity {
  id: number
  title: string
  state: 'open' | 'closed'
  createdAt: string // ISO timestamp
  repository: string
  url: string
}

export interface LanguageUsage {
  language: string
  percentage: number
  bytes: number
  repositories: number
}

export interface LanguageTrend {
  language: string
  trend: 'increasing' | 'decreasing' | 'stable'
  changePercentage: number
}

export interface ContributionDay {
  date: string // ISO date
  contributionCount: number
  level: 0 | 1 | 2 | 3 | 4 // GitHub contribution levels
}

export interface ContributionPattern {
  dayOfWeek: number // 0-6 (Sunday-Saturday)
  hour: number // 0-23
  averageContributions: number
}

export interface DataFreshness {
  profile: number // minutes since last update
  repositories: number
  activity: number
  languages: number
  contributions: number
}