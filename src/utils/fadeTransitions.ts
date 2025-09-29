// Fade Transition Utilities - Custom animation controls
// Phase 2: UI/UX Enhancement utilities

/**
 * Fade transition configuration
 */
export interface FadeConfig {
  duration: number // Total fade duration in ms
  fadeOutDuration?: number // Fade out duration (defaults to duration/2)
  fadeInDuration?: number // Fade in duration (defaults to duration/2)
  holdDuration?: number // Duration to hold at max opacity (defaults to 100ms)
  maxOpacity?: number // Maximum fade overlay opacity (0-1)
  easing?: (t: number) => number // Custom easing function
}

/**
 * Default fade configuration
 */
export const DEFAULT_FADE_CONFIG: FadeConfig = {
  duration: 800,
  fadeOutDuration: 400,
  fadeInDuration: 400,
  holdDuration: 100,
  maxOpacity: 1,
  easing: (t: number) => t // Linear easing
}

/**
 * Common easing functions
 */
export const EASING_FUNCTIONS = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
}

/**
 * Creates a fade to black transition with callback support
 */
export class FadeTransition {
  private animationId: number | null = null
  private startTime: number = 0
  private isRunning: boolean = false
  private setOpacity: (opacity: number) => void
  private config: FadeConfig

  constructor(
    setOpacity: (opacity: number) => void,
    config: FadeConfig = DEFAULT_FADE_CONFIG
  ) {
    this.setOpacity = setOpacity
    this.config = config
  }

  /**
   * Start fade transition with onComplete callback
   */
  start(onComplete?: () => void): Promise<void> {
    return new Promise((resolve) => {
      if (this.isRunning) {
        this.stop()
      }

      this.isRunning = true
      this.startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - this.startTime
        const totalDuration = this.config.duration
        const fadeOutDuration = this.config.fadeOutDuration || totalDuration / 2
        const fadeInDuration = this.config.fadeInDuration || totalDuration / 2
        const holdDuration = this.config.holdDuration || 250 // Default 250ms hold for smoother transitions
        const maxOpacity = this.config.maxOpacity || 1
        const easing = this.config.easing || EASING_FUNCTIONS.easeInOut

        let opacity = 0

        if (elapsed < fadeOutDuration) {
          // Fade out phase (increase opacity)
          const progress = elapsed / fadeOutDuration
          opacity = easing(progress) * maxOpacity
        } else if (elapsed < fadeOutDuration + holdDuration) {
          // Hold at max opacity for smoother transitions
          opacity = maxOpacity

          // Trigger callback at peak fade (halfway through hold)
          if (onComplete && elapsed >= fadeOutDuration + (holdDuration / 2)) {
            onComplete()
            onComplete = undefined // Prevent multiple calls
          }
        } else if (elapsed < totalDuration) {
          // Fade in phase (decrease opacity)
          const fadeInStart = fadeOutDuration + holdDuration
          const progress = (elapsed - fadeInStart) / fadeInDuration
          opacity = maxOpacity * (1 - easing(progress))
        } else {
          // Animation complete
          opacity = 0
          this.isRunning = false
          this.setOpacity(opacity)
          resolve()
          return
        }

        this.setOpacity(opacity)

        if (this.isRunning) {
          this.animationId = requestAnimationFrame(animate)
        }
      }

      this.animationId = requestAnimationFrame(animate)
    })
  }

  /**
   * Stop the current animation
   */
  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this.isRunning = false
    this.setOpacity(0)
  }

  /**
   * Check if animation is currently running
   */
  get running(): boolean {
    return this.isRunning
  }
}

/**
 * Creates a simple fade effect without black overlay
 */
export class SimpleFade {
  private animationId: number | null = null
  private startTime: number = 0
  private isRunning: boolean = false
  private setOpacity: (opacity: number) => void
  private duration: number

  constructor(
    setOpacity: (opacity: number) => void,
    duration: number = 300
  ) {
    this.setOpacity = setOpacity
    this.duration = duration
  }

  fadeOut(onComplete?: () => void): Promise<void> {
    return this.animate(1, 0, onComplete)
  }

  fadeIn(onComplete?: () => void): Promise<void> {
    return this.animate(0, 1, onComplete)
  }

  private animate(from: number, to: number, onComplete?: () => void): Promise<void> {
    return new Promise((resolve) => {
      if (this.isRunning) {
        this.stop()
      }

      this.isRunning = true
      this.startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - this.startTime
        const progress = Math.min(elapsed / this.duration, 1)

        const opacity = from + (to - from) * EASING_FUNCTIONS.easeInOut(progress)
        this.setOpacity(opacity)

        if (progress >= 1) {
          this.isRunning = false
          onComplete?.()
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

  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this.isRunning = false
  }

  get running(): boolean {
    return this.isRunning
  }
}

/**
 * Utility for smooth number transitions
 */
export class NumberTransition {
  private animationId: number | null = null
  private startTime: number = 0
  private isRunning: boolean = false
  private setValue: (value: number) => void
  private duration: number
  private easing: (t: number) => number

  constructor(
    setValue: (value: number) => void,
    duration: number = 1000,
    easing: (t: number) => number = EASING_FUNCTIONS.easeInOut
  ) {
    this.setValue = setValue
    this.duration = duration
    this.easing = easing
  }

  animate(from: number, to: number, onComplete?: () => void): Promise<void> {
    return new Promise((resolve) => {
      if (this.isRunning) {
        this.stop()
      }

      this.isRunning = true
      this.startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - this.startTime
        const progress = Math.min(elapsed / this.duration, 1)

        const value = from + (to - from) * this.easing(progress)
        this.setValue(value)

        if (progress >= 1) {
          this.isRunning = false
          onComplete?.()
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

  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this.isRunning = false
  }

  get running(): boolean {
    return this.isRunning
  }
}