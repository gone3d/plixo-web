// Global Context Provider - Centralized state management
// Phase 2: Data tracking and state management

import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type {
  Project,
  Experience,
  Skill,
  BackgroundImage,
  AppConfig,
  PortfolioOverview
} from '../types/portfolio'
import { tempConfig } from '../config/temp-data'

/**
 * Global State Interface
 * Centralized state for all application data
 */
export interface GlobalState {
  // Data Loading States
  loading: {
    portfolio: boolean
    projects: boolean
    experiences: boolean
    skills: boolean
    config: boolean
  }

  // Error States
  errors: {
    portfolio?: string
    projects?: string
    experiences?: string
    skills?: string
    config?: string
  }

  // Core Data
  data: {
    portfolioOverview?: PortfolioOverview
    projects: Project[]
    experiences: Experience[]
    skills: Skill[]
    backgroundImages: BackgroundImage[]
    appConfig?: AppConfig
  }

  // UI State
  ui: {
    theme: 'light' | 'dark' | 'system'
    sidebarOpen: boolean
    currentPage: string
    searchQuery: string
    filters: {
      projectCategory?: string
      skillCategory?: string
      experienceCategory?: string
    }
  }

  // Analytics State (when enabled)
  analytics: {
    sessionId?: string
    pageViews: number
    startTime: number
    currentPage: string
    interactions: number
  }

  // Feature Flags
  features: {
    backgroundSlideshow: boolean
    realTimeAnalytics: boolean
    githubIntegration: boolean
    contactForm: boolean
    downloadResume: boolean
    socialLinks: boolean
  }

  // Development Configuration
  development: {
    dataSource: 'config' | 'api'
  }
}

/**
 * Global Actions
 * All possible state mutations
 */
export type GlobalAction =
  // Data Loading Actions
  | { type: 'LOAD_PORTFOLIO_START' }
  | { type: 'LOAD_PORTFOLIO_SUCCESS'; payload: PortfolioOverview }
  | { type: 'LOAD_PORTFOLIO_ERROR'; payload: string }

  | { type: 'LOAD_PROJECTS_START' }
  | { type: 'LOAD_PROJECTS_SUCCESS'; payload: Project[] }
  | { type: 'LOAD_PROJECTS_ERROR'; payload: string }

  | { type: 'LOAD_EXPERIENCES_START' }
  | { type: 'LOAD_EXPERIENCES_SUCCESS'; payload: Experience[] }
  | { type: 'LOAD_EXPERIENCES_ERROR'; payload: string }

  | { type: 'LOAD_SKILLS_START' }
  | { type: 'LOAD_SKILLS_SUCCESS'; payload: Skill[] }
  | { type: 'LOAD_SKILLS_ERROR'; payload: string }

  | { type: 'LOAD_CONFIG_START' }
  | { type: 'LOAD_CONFIG_SUCCESS'; payload: AppConfig }
  | { type: 'LOAD_CONFIG_ERROR'; payload: string }

  // UI Actions
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'system' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_CURRENT_PAGE'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<GlobalState['ui']['filters']> }

  // Analytics Actions
  | { type: 'ANALYTICS_SESSION_START'; payload: { sessionId: string; startTime: number } }
  | { type: 'ANALYTICS_PAGE_VIEW'; payload: { page: string } }
  | { type: 'ANALYTICS_INTERACTION'; payload: { type: string; element?: string } }

  // Feature Flag Actions
  | { type: 'UPDATE_FEATURES'; payload: Partial<GlobalState['features']> }

  // Development Actions
  | { type: 'SET_DATA_SOURCE'; payload: 'config' | 'api' }

  // Bulk Actions
  | { type: 'INITIALIZE_FROM_CONFIG'; payload: typeof tempConfig }
  | { type: 'RESET_STATE' }

/**
 * Initial State
 */
const initialState: GlobalState = {
  loading: {
    portfolio: false,
    projects: false,
    experiences: false,
    skills: false,
    config: false
  },

  errors: {},

  data: {
    projects: [],
    experiences: [],
    skills: [],
    backgroundImages: []
  },

  ui: {
    theme: 'dark', // Default to dark theme
    sidebarOpen: false,
    currentPage: '/',
    searchQuery: '',
    filters: {}
  },

  analytics: {
    pageViews: 0,
    startTime: Date.now(),
    currentPage: '/',
    interactions: 0
  },

  features: {
    backgroundSlideshow: true,
    realTimeAnalytics: false,
    githubIntegration: false,
    contactForm: true,
    downloadResume: true,
    socialLinks: true
  },

  development: {
    dataSource: 'config' // Default to config for development
  }
}

/**
 * Global Reducer
 * Handles all state mutations
 */
function globalReducer(state: GlobalState, action: GlobalAction): GlobalState {
  switch (action.type) {
    // Portfolio Overview Actions
    case 'LOAD_PORTFOLIO_START':
      return {
        ...state,
        loading: { ...state.loading, portfolio: true },
        errors: { ...state.errors, portfolio: undefined }
      }

    case 'LOAD_PORTFOLIO_SUCCESS':
      return {
        ...state,
        loading: { ...state.loading, portfolio: false },
        data: { ...state.data, portfolioOverview: action.payload },
        errors: { ...state.errors, portfolio: undefined }
      }

    case 'LOAD_PORTFOLIO_ERROR':
      return {
        ...state,
        loading: { ...state.loading, portfolio: false },
        errors: { ...state.errors, portfolio: action.payload }
      }

    // Projects Actions
    case 'LOAD_PROJECTS_START':
      return {
        ...state,
        loading: { ...state.loading, projects: true },
        errors: { ...state.errors, projects: undefined }
      }

    case 'LOAD_PROJECTS_SUCCESS':
      return {
        ...state,
        loading: { ...state.loading, projects: false },
        data: { ...state.data, projects: action.payload },
        errors: { ...state.errors, projects: undefined }
      }

    case 'LOAD_PROJECTS_ERROR':
      return {
        ...state,
        loading: { ...state.loading, projects: false },
        errors: { ...state.errors, projects: action.payload }
      }

    // Experiences Actions
    case 'LOAD_EXPERIENCES_START':
      return {
        ...state,
        loading: { ...state.loading, experiences: true },
        errors: { ...state.errors, experiences: undefined }
      }

    case 'LOAD_EXPERIENCES_SUCCESS':
      return {
        ...state,
        loading: { ...state.loading, experiences: false },
        data: { ...state.data, experiences: action.payload },
        errors: { ...state.errors, experiences: undefined }
      }

    case 'LOAD_EXPERIENCES_ERROR':
      return {
        ...state,
        loading: { ...state.loading, experiences: false },
        errors: { ...state.errors, experiences: action.payload }
      }

    // Skills Actions
    case 'LOAD_SKILLS_START':
      return {
        ...state,
        loading: { ...state.loading, skills: true },
        errors: { ...state.errors, skills: undefined }
      }

    case 'LOAD_SKILLS_SUCCESS':
      return {
        ...state,
        loading: { ...state.loading, skills: false },
        data: { ...state.data, skills: action.payload },
        errors: { ...state.errors, skills: undefined }
      }

    case 'LOAD_SKILLS_ERROR':
      return {
        ...state,
        loading: { ...state.loading, skills: false },
        errors: { ...state.errors, skills: action.payload }
      }

    // Config Actions
    case 'LOAD_CONFIG_START':
      return {
        ...state,
        loading: { ...state.loading, config: true },
        errors: { ...state.errors, config: undefined }
      }

    case 'LOAD_CONFIG_SUCCESS':
      return {
        ...state,
        loading: { ...state.loading, config: false },
        data: { ...state.data, appConfig: action.payload },
        features: {
          ...state.features,
          ...action.payload.features
        },
        errors: { ...state.errors, config: undefined }
      }

    case 'LOAD_CONFIG_ERROR':
      return {
        ...state,
        loading: { ...state.loading, config: false },
        errors: { ...state.errors, config: action.payload }
      }

    // UI Actions
    case 'SET_THEME':
      return {
        ...state,
        ui: { ...state.ui, theme: action.payload }
      }

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen }
      }

    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        ui: { ...state.ui, currentPage: action.payload },
        analytics: {
          ...state.analytics,
          currentPage: action.payload,
          pageViews: state.analytics.pageViews + 1
        }
      }

    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        ui: { ...state.ui, searchQuery: action.payload }
      }

    case 'SET_FILTERS':
      return {
        ...state,
        ui: {
          ...state.ui,
          filters: { ...state.ui.filters, ...action.payload }
        }
      }

    // Analytics Actions
    case 'ANALYTICS_SESSION_START':
      return {
        ...state,
        analytics: {
          ...state.analytics,
          sessionId: action.payload.sessionId,
          startTime: action.payload.startTime
        }
      }

    case 'ANALYTICS_PAGE_VIEW':
      return {
        ...state,
        analytics: {
          ...state.analytics,
          currentPage: action.payload.page,
          pageViews: state.analytics.pageViews + 1
        }
      }

    case 'ANALYTICS_INTERACTION':
      return {
        ...state,
        analytics: {
          ...state.analytics,
          interactions: state.analytics.interactions + 1
        }
      }

    // Feature Flag Actions
    case 'UPDATE_FEATURES':
      return {
        ...state,
        features: { ...state.features, ...action.payload }
      }

    // Development Actions
    case 'SET_DATA_SOURCE':
      return {
        ...state,
        development: { ...state.development, dataSource: action.payload }
      }

    // Bulk Actions
    case 'INITIALIZE_FROM_CONFIG':
      return {
        ...state,
        data: {
          portfolioOverview: action.payload.portfolioOverview,
          projects: action.payload.projects,
          experiences: action.payload.experiences,
          skills: action.payload.skills,
          backgroundImages: action.payload.backgroundImages,
          appConfig: action.payload.appConfig
        },
        features: {
          ...state.features,
          ...action.payload.appConfig.features
        },
        ui: {
          ...state.ui,
          theme: action.payload.appConfig.theme.defaultTheme
        }
      }

    case 'RESET_STATE':
      return initialState

    default:
      return state
  }
}

/**
 * Global Context
 */
export interface GlobalContextType {
  state: GlobalState
  dispatch: React.Dispatch<GlobalAction>

  // Convenience action creators
  actions: {
    loadPortfolio: () => void
    loadProjects: () => void
    loadExperiences: () => void
    loadSkills: () => void
    loadConfig: () => void
    setTheme: (theme: 'light' | 'dark' | 'system') => void
    setCurrentPage: (page: string) => void
    trackInteraction: (type: string, element?: string) => void
    setDataSource: (dataSource: 'config' | 'api') => void
    initializeFromTempConfig: () => void
  }

  // Computed selectors
  selectors: {
    getFeaturedProjects: () => Project[]
    getProjectsByCategory: (category: string) => Project[]
    getSkillsByCategory: (category: string) => Skill[]
    getCurrentExperience: () => Experience | undefined
    isLoading: () => boolean
    hasErrors: () => boolean
  }
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

/**
 * Global Provider Component
 */
interface GlobalProviderProps {
  children: ReactNode
}

export function GlobalProvider({ children }: GlobalProviderProps) {
  const [state, dispatch] = useReducer(globalReducer, initialState)

  // Action creators
  const actions = {
    loadPortfolio: () => {
      dispatch({ type: 'LOAD_PORTFOLIO_START' })
      try {
        // Use temp config for now
        dispatch({ type: 'LOAD_PORTFOLIO_SUCCESS', payload: tempConfig.portfolioOverview })
      } catch (error) {
        dispatch({ type: 'LOAD_PORTFOLIO_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
      }
    },

    loadProjects: () => {
      dispatch({ type: 'LOAD_PROJECTS_START' })
      try {
        dispatch({ type: 'LOAD_PROJECTS_SUCCESS', payload: tempConfig.projects })
      } catch (error) {
        dispatch({ type: 'LOAD_PROJECTS_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
      }
    },

    loadExperiences: () => {
      dispatch({ type: 'LOAD_EXPERIENCES_START' })
      try {
        dispatch({ type: 'LOAD_EXPERIENCES_SUCCESS', payload: tempConfig.experiences })
      } catch (error) {
        dispatch({ type: 'LOAD_EXPERIENCES_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
      }
    },

    loadSkills: () => {
      dispatch({ type: 'LOAD_SKILLS_START' })
      try {
        dispatch({ type: 'LOAD_SKILLS_SUCCESS', payload: tempConfig.skills })
      } catch (error) {
        dispatch({ type: 'LOAD_SKILLS_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
      }
    },

    loadConfig: () => {
      dispatch({ type: 'LOAD_CONFIG_START' })
      try {
        dispatch({ type: 'LOAD_CONFIG_SUCCESS', payload: tempConfig.appConfig })
      } catch (error) {
        dispatch({ type: 'LOAD_CONFIG_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
      }
    },

    setTheme: (theme: 'light' | 'dark' | 'system') => {
      dispatch({ type: 'SET_THEME', payload: theme })
    },

    setCurrentPage: (page: string) => {
      dispatch({ type: 'SET_CURRENT_PAGE', payload: page })
    },

    trackInteraction: (type: string, element?: string) => {
      dispatch({ type: 'ANALYTICS_INTERACTION', payload: { type, element } })
    },

    setDataSource: (dataSource: 'config' | 'api') => {
      dispatch({ type: 'SET_DATA_SOURCE', payload: dataSource })
    },

    initializeFromTempConfig: () => {
      dispatch({ type: 'INITIALIZE_FROM_CONFIG', payload: tempConfig })
    }
  }

  // Computed selectors
  const selectors = {
    getFeaturedProjects: () => {
      return state.data.projects.filter(project => project.featured)
        .sort((a, b) => a.priority - b.priority)
    },

    getProjectsByCategory: (category: string) => {
      return state.data.projects.filter(project => project.category === category)
    },

    getSkillsByCategory: (category: string) => {
      return state.data.skills.filter(skill => skill.category === category)
    },

    getCurrentExperience: () => {
      return state.data.experiences.find(exp => !exp.endDate)
    },

    isLoading: () => {
      return Object.values(state.loading).some(loading => loading)
    },

    hasErrors: () => {
      return Object.values(state.errors).some(error => error !== undefined)
    }
  }

  // Initialize from temp config on mount
  useEffect(() => {
    actions.initializeFromTempConfig()
  }, [])

  // Analytics session initialization
  useEffect(() => {
    if (state.features.realTimeAnalytics) {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      dispatch({
        type: 'ANALYTICS_SESSION_START',
        payload: { sessionId, startTime: Date.now() }
      })
    }
  }, [state.features.realTimeAnalytics])

  const contextValue: GlobalContextType = {
    state,
    dispatch,
    actions,
    selectors
  }

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  )
}

/**
 * Custom hook to use Global context
 */
export function useGlobal() {
  const context = useContext(GlobalContext)
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider')
  }
  return context
}

/**
 * Custom hooks for specific data slices
 */
export function useProjects() {
  const { state, selectors } = useGlobal()
  return {
    projects: state.data.projects,
    featuredProjects: selectors.getFeaturedProjects(),
    loading: state.loading.projects,
    error: state.errors.projects,
    getProjectsByCategory: selectors.getProjectsByCategory
  }
}

export function useExperiences() {
  const { state, selectors } = useGlobal()
  return {
    experiences: state.data.experiences,
    currentExperience: selectors.getCurrentExperience(),
    loading: state.loading.experiences,
    error: state.errors.experiences
  }
}

export function useSkills() {
  const { state, selectors } = useGlobal()
  return {
    skills: state.data.skills,
    loading: state.loading.skills,
    error: state.errors.skills,
    getSkillsByCategory: selectors.getSkillsByCategory
  }
}

export function useAnalytics() {
  const { state, actions } = useGlobal()
  return {
    analytics: state.analytics,
    trackInteraction: actions.trackInteraction,
    enabled: state.features.realTimeAnalytics
  }
}

export function useTheme() {
  const { state, actions } = useGlobal()
  return {
    theme: state.ui.theme,
    setTheme: actions.setTheme
  }
}

export function useDevelopment() {
  const { state, actions } = useGlobal()
  return {
    dataSource: state.development.dataSource,
    setDataSource: actions.setDataSource,
    isUsingConfig: state.development.dataSource === 'config',
    isUsingAPI: state.development.dataSource === 'api'
  }
}

export function useAppSettings() {
  const { state, dispatch, actions } = useGlobal()
  return {
    // App configuration
    appConfig: state.data.appConfig,

    // Feature flags
    features: state.features,
    updateFeatures: (features: Partial<typeof state.features>) => {
      dispatch({ type: 'UPDATE_FEATURES', payload: features })
    },

    // Theme settings
    theme: state.ui.theme,
    setTheme: actions.setTheme,

    // Development settings
    development: state.development,
    setDataSource: actions.setDataSource,

    // Background slideshow settings (from features)
    backgroundSlideshow: {
      enabled: state.features.backgroundSlideshow,
      toggle: () => {
        dispatch({
          type: 'UPDATE_FEATURES',
          payload: { backgroundSlideshow: !state.features.backgroundSlideshow }
        })
      }
    },

    // Analytics settings
    analytics: {
      enabled: state.features.realTimeAnalytics,
      toggle: () => {
        dispatch({
          type: 'UPDATE_FEATURES',
          payload: { realTimeAnalytics: !state.features.realTimeAnalytics }
        })
      }
    },

    // Other feature toggles
    contact: {
      enabled: state.features.contactForm,
      toggle: () => {
        dispatch({
          type: 'UPDATE_FEATURES',
          payload: { contactForm: !state.features.contactForm }
        })
      }
    },

    socialLinks: {
      enabled: state.features.socialLinks,
      toggle: () => {
        dispatch({
          type: 'UPDATE_FEATURES',
          payload: { socialLinks: !state.features.socialLinks }
        })
      }
    },

    downloadResume: {
      enabled: state.features.downloadResume,
      toggle: () => {
        dispatch({
          type: 'UPDATE_FEATURES',
          payload: { downloadResume: !state.features.downloadResume }
        })
      }
    }
  }
}