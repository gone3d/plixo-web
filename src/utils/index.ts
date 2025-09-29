// Utils Index - Centralized utility exports
// Phase 2: Utility functions for UI/UX enhancement

// Fade transition utilities
export * from './fadeTransitions'
export {
  FadeTransition,
  SimpleFade,
  NumberTransition,
  EASING_FUNCTIONS,
  DEFAULT_FADE_CONFIG
} from './fadeTransitions'

// Image panning utilities
export * from './imagePanning'
export {
  PanningController,
  calculatePanDirection,
  getBackgroundStyles,
  getKenBurnsStyles,
  getViewportDimensions,
  getImageDimensions,
  calculateCoverSize,
  DEFAULT_PAN_CONFIG
} from './imagePanning'

// Existing utilities
export * from './cn'
export * from './utils'