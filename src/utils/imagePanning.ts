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
  endPosition: 100
}

/**
 * Calculate optimal panning direction based on aspect ratios
 */
export function calculatePanDirection(
  viewportDimensions: Dimensions,
  imageDimensions: Dimensions
): 'horizontal' | 'vertical' {
  const viewportRatio = viewportDimensions.width / viewportDimensions.height
  const imageRatio = imageDimensions.width / imageDimensions.height

  // If viewport is wider than image, pan vertically
  // If viewport is taller than image, pan horizontally
  return viewportRatio > imageRatio ? 'vertical' : 'horizontal'
}

/**
 * Get background styles for current pan position
 */
export function getBackgroundStyles(
  progress: number, // 0-1
  direction: 'horizontal' | 'vertical',
  _viewportDimensions: Dimensions,
  _imageDimensions?: Dimensions
): BackgroundPosition {
  const position = progress * 100 // Convert to percentage

  if (direction === 'vertical') {
    return {
      backgroundPosition: `center ${position}%`,
      backgroundSize: '100% auto'
    }
  } else {
    return {
      backgroundPosition: `${position}% center`,
      backgroundSize: 'auto 100%'
    }
  }
}

/**
 * Advanced background positioning with Ken Burns effect
 */
export function getKenBurnsStyles(
  progress: number, // 0-1
  direction: 'horizontal' | 'vertical',
  _viewportDimensions: Dimensions,
  zoom: { start: number; end: number } = { start: 1, end: 1.1 }
): BackgroundPosition {
  const position = progress * 100
  const currentZoom = zoom.start + (zoom.end - zoom.start) * progress

  const zoomPercentage = currentZoom * 100

  if (direction === 'vertical') {
    return {
      backgroundPosition: `center ${position}%`,
      backgroundSize: `${zoomPercentage}% auto`
    }
  } else {
    return {
      backgroundPosition: `${position}% center`,
      backgroundSize: `auto ${zoomPercentage}%`
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

  constructor(
    updatePosition: (progress: number) => void,
    config: PanConfig = DEFAULT_PAN_CONFIG
  ) {
    this.updatePosition = updatePosition
    this.config = config
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
      this.currentProgress = this.config.startPosition || 0

      const animate = (currentTime: number) => {
        const elapsed = currentTime - this.startTime
        const progress = Math.min(elapsed / this.config.duration, 1)

        const startPos = (this.config.startPosition || 0) / 100
        const endPos = (this.config.endPosition || 100) / 100
        const easing = this.config.easing || ((t: number) => t)

        this.currentProgress = startPos + (endPos - startPos) * easing(progress)
        this.updatePosition(this.currentProgress)

        if (progress >= 1) {
          this.isRunning = false
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