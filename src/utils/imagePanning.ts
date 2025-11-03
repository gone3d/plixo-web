// Image Panning Utilities - Smooth background movement
// Phase 2: UI/UX Enhancement utilities

/**
 * Viewport and image dimensions
 */
export interface Dimensions {
  width: number
  height: number
}

/**
 * Panning configuration
 */
export interface PanConfig {
  duration: number // Total pan duration in ms
  direction: 'horizontal' | 'vertical' | 'auto'
  easing?: (t: number) => number
  startPosition?: number // 0-100 percentage
  endPosition?: number // 0-100 percentage
  maxSpeedPxPerSec?: number // Maximum pan speed in pixels per second
}

/**
 * Background position result
 */
export interface BackgroundPosition {
  backgroundPosition: string
  backgroundSize: string
}

/**
 * Default panning configuration
 */
export const DEFAULT_PAN_CONFIG: PanConfig = {
  duration: 12000,
  direction: 'auto',
  easing: (t: number) => t, // Linear for smooth continuous movement
  startPosition: 0,
  endPosition: 100,
  maxSpeedPxPerSec: undefined // No speed limit by default
}

/**
 * Calculate pan distance in pixels based on direction and viewport
 */
export function calculatePanDistancePixels(
  viewportDimensions: Dimensions,
  imageDimensions: Dimensions,
  direction: 'horizontal' | 'vertical' | 'none',
  startPosition: number = 0, // 0-100
  endPosition: number = 100 // 0-100
): number {
  if (direction === 'none') return 0

  const imageRatio = imageDimensions.width / imageDimensions.height

  if (direction === 'horizontal') {
    // Image is full height, calculate actual image width in pixels
    const imageWidthPx = viewportDimensions.height * imageRatio
    const overflowPx = imageWidthPx - viewportDimensions.width
    // Pan range is the percentage of overflow
    const panRange = (endPosition - startPosition) / 100
    return overflowPx * panRange
  } else {
    // direction === 'vertical'
    // Image is full width, calculate actual image height in pixels
    const imageHeightPx = viewportDimensions.width / imageRatio
    const overflowPx = imageHeightPx - viewportDimensions.height
    // Pan range is the percentage of overflow
    const panRange = (endPosition - startPosition) / 100
    return overflowPx * panRange
  }
}

/**
 * Calculate duration needed to stay under speed limit
 */
export function calculateSpeedLimitDuration(
  panDistancePixels: number,
  maxSpeedPxPerSec: number
): number {
  if (panDistancePixels === 0 || maxSpeedPxPerSec <= 0) {
    return DEFAULT_PAN_CONFIG.duration
  }
  // duration (ms) = distance (px) / speed (px/sec) * 1000
  return (panDistancePixels / maxSpeedPxPerSec) * 1000
}

/**
 * Calculate optimal panning direction based on aspect ratios
 */
export function calculatePanDirection(
  viewportDimensions: Dimensions,
  imageDimensions: Dimensions
): 'horizontal' | 'vertical' | 'none' {
  const viewportRatio = viewportDimensions.width / viewportDimensions.height
  const imageRatio = imageDimensions.width / imageDimensions.height

  // Allow for small tolerance to avoid unnecessary panning on near-equal ratios
  const tolerance = 0.05
  const ratioDifference = viewportRatio - imageRatio

  // Check if ratios are approximately equal first
  if (Math.abs(ratioDifference) < tolerance) {
    return 'none'
  }

  switch (true) {
    case ratioDifference < 0:
      // Window is narrower than image - fit image vertically, scroll horizontally
      return 'horizontal'

    case ratioDifference > 0:
      // Window is wider than image - fit image horizontally, scroll vertically
      return 'vertical'

    default:
      // This should never be reached since we handle equality above
      return 'none'
  }
}

/**
 * Get background styles for current pan position
 */
export function getBackgroundStyles(
  progress: number, // 0-1
  direction: 'horizontal' | 'vertical' | 'none'
): BackgroundPosition {
  const position = progress * 100 // Convert to percentage

  switch (direction) {
    case 'vertical':
      // Window is wider than image - make image full width, auto height to maintain aspect ratio
      // Use position directly so we start at top (0%) and move to bottom (100%) - image moves up
      return {
        backgroundPosition: `center ${position}%`,
        backgroundSize: '100% auto'
      }

    case 'horizontal':
      // Window is narrower than image - make image full height, scroll left to right
      return {
        backgroundPosition: `${position}% center`,
        backgroundSize: 'auto 100%'
      }

    default:
      // No scrolling - center the image
      return {
        backgroundPosition: 'center center',
        backgroundSize: 'cover'
      }
  }
}

/**
 * Advanced background positioning with Ken Burns effect
 */
export function getKenBurnsStyles(
  progress: number, // 0-1
  direction: 'horizontal' | 'vertical' | 'none',
  zoom: { start: number; end: number } = { start: 1, end: 1.1 }
): BackgroundPosition {
  const position = progress * 100
  const currentZoom = zoom.start + (zoom.end - zoom.start) * progress
  const zoomPercentage = currentZoom * 100

  switch (direction) {
    case 'vertical':
      // Window is wider than image - make image full width, auto height to maintain aspect ratio
      return {
        backgroundPosition: `center ${position}%`,
        backgroundSize: `100% auto`
      }

    case 'horizontal':
      // Window is narrower than image - fit vertically, scroll horizontally (left to right)
      return {
        backgroundPosition: `${position}% center`,
        backgroundSize: `auto ${zoomPercentage}%`
      }

    default:
      // No scrolling - just zoom from center
      return {
        backgroundPosition: 'center center',
        backgroundSize: `${zoomPercentage}% ${zoomPercentage}%`
      }
  }
}

/**
 * Smooth panning animation controller
 */
export class PanningController {
  private animationId: number | null = null
  private startTime: number = 0
  private isRunning: boolean = false
  private currentProgress: number = 0
  private updatePosition: (progress: number) => void
  private config: PanConfig
  private panDistancePixels: number = 0
  private lastUpdateTime: number = 0
  private currentSpeedPxPerSec: number = 0
  private onSpeedUpdate?: (speed: number) => void

  constructor(
    updatePosition: (progress: number) => void,
    config: PanConfig = DEFAULT_PAN_CONFIG,
    onSpeedUpdate?: (speed: number) => void
  ) {
    this.updatePosition = updatePosition
    this.config = config
    this.onSpeedUpdate = onSpeedUpdate
  }

  /**
   * Set the pan distance in pixels (for speed calculation)
   */
  setPanDistance(pixels: number): void {
    this.panDistancePixels = pixels
  }

  /**
   * Get current speed in pixels per second
   */
  get speedPxPerSec(): number {
    return this.currentSpeedPxPerSec
  }

  /**
   * Start panning animation
   */
  start(): Promise<void> {
    return new Promise((resolve) => {
      if (this.isRunning) {
        this.stop()
      }

      this.isRunning = true
      this.startTime = performance.now()
      this.lastUpdateTime = this.startTime
      this.currentProgress = this.config.startPosition || 0

      const animate = (currentTime: number) => {
        const elapsed = currentTime - this.startTime
        const progress = Math.min(elapsed / this.config.duration, 1)

        const startPos = (this.config.startPosition || 0) / 100
        const endPos = (this.config.endPosition || 100) / 100
        const easing = this.config.easing || ((t: number) => t)

        const previousProgress = this.currentProgress
        this.currentProgress = startPos + (endPos - startPos) * easing(progress)
        this.updatePosition(this.currentProgress)

        // Calculate current speed in pixels per second
        if (this.panDistancePixels > 0) {
          const deltaTime = (currentTime - this.lastUpdateTime) / 1000 // Convert to seconds
          const deltaProgress = this.currentProgress - previousProgress
          const deltaPixels = deltaProgress * this.panDistancePixels
          this.currentSpeedPxPerSec = deltaTime > 0 ? deltaPixels / deltaTime : 0
          this.lastUpdateTime = currentTime

          // Notify speed update callback immediately
          if (this.onSpeedUpdate) {
            this.onSpeedUpdate(this.currentSpeedPxPerSec)
          }
        }

        if (progress >= 1) {
          this.isRunning = false
          this.currentSpeedPxPerSec = 0
          resolve()
          return
        }

        if (this.isRunning) {
          this.animationId = requestAnimationFrame(animate)
        }
      }

      this.animationId = requestAnimationFrame(animate)
    })
  }

  /**
   * Pause the animation
   */
  pause(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this.isRunning = false
  }

  /**
   * Resume the animation from current position
   */
  resume(): void {
    if (!this.isRunning) {
      // Adjust start time to account for current progress
      const elapsedProgress = this.currentProgress / ((this.config.endPosition || 100) / 100)
      this.startTime = performance.now() - (elapsedProgress * this.config.duration)
      this.start()
    }
  }

  /**
   * Stop and reset the animation
   */
  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this.isRunning = false
    this.currentProgress = this.config.startPosition || 0
    this.updatePosition(this.currentProgress)
  }

  /**
   * Set new position instantly
   */
  setPosition(progress: number): void {
    this.currentProgress = Math.max(0, Math.min(1, progress))
    this.updatePosition(this.currentProgress)
  }

  /**
   * Get current progress (0-1)
   */
  get progress(): number {
    return this.currentProgress
  }

  /**
   * Check if animation is running
   */
  get running(): boolean {
    return this.isRunning
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<PanConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }
}

/**
 * Get viewport dimensions
 */
export function getViewportDimensions(): Dimensions {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

/**
 * Load image and get its dimensions
 */
export function getImageDimensions(src: string): Promise<Dimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
    }
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`))
    }
    img.src = src
  })
}

/**
 * Calculate optimal background size for cover mode
 */
export function calculateCoverSize(
  viewportDimensions: Dimensions,
  imageDimensions: Dimensions
): BackgroundPosition {
  const viewportRatio = viewportDimensions.width / viewportDimensions.height
  const imageRatio = imageDimensions.width / imageDimensions.height

  if (imageRatio > viewportRatio) {
    // Image is wider - fit to height
    return {
      backgroundPosition: 'center center',
      backgroundSize: 'auto 100%'
    }
  } else {
    // Image is taller - fit to width
    return {
      backgroundPosition: 'center center',
      backgroundSize: '100% auto'
    }
  }
}