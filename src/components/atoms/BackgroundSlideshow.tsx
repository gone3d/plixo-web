import { useState, useEffect } from 'react'

interface BackgroundImage {
  filename: string
  title?: string
  text?: string
}

interface BackgroundSlideshowProps {
  images: BackgroundImage[]
  transitionTime?: number
  className?: string
  pauseOnHover?: boolean
  showOverlay?: boolean
  displayMode?: 'cover' | 'slide'
}

const BackgroundSlideshow = ({
  images,
  transitionTime = 12000,
  className = '',
  pauseOnHover = true,
  showOverlay = true,
  displayMode = 'slide'
}: BackgroundSlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fadeOpacity, setFadeOpacity] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [slideProgress, setSlideProgress] = useState(0)

  // Auto-cycle through images
  useEffect(() => {
    if (images.length <= 1 || isPaused) return

    const interval = setInterval(() => {
      if (displayMode === 'slide') {
        // For slide mode, just change image without fade
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
        setSlideProgress(0) // Reset slide progress
      } else {
        // Cover mode with fade
        let opacity = 0
        const fadeOutInterval = setInterval(() => {
          opacity += 0.025
          setFadeOpacity(opacity)

          if (opacity >= 1) {
            clearInterval(fadeOutInterval)
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)

            const fadeInInterval = setInterval(() => {
              opacity -= 0.025
              setFadeOpacity(Math.max(0, opacity))

              if (opacity <= 0) {
                clearInterval(fadeInInterval)
                setFadeOpacity(0)
              }
            }, 20)
          }
        }, 20)
      }
    }, transitionTime)

    return () => clearInterval(interval)
  }, [images.length, transitionTime, isPaused, displayMode])

  // Slide animation for slide mode
  useEffect(() => {
    if (displayMode !== 'slide' || isPaused || images.length <= 1) {
      return
    }

    setSlideProgress(0)

    const slideInterval = setInterval(() => {
      setSlideProgress((prev) => {
        const increment = 100 / (transitionTime / 50)
        return Math.min(prev + increment, 100)
      })
    }, 50)

    return () => clearInterval(slideInterval)
  }, [currentIndex, displayMode, transitionTime, isPaused, images.length])

  // Preload next images
  useEffect(() => {
    if (images.length <= 1) return

    const preloadImages: HTMLImageElement[] = []
    const nextIndex = (currentIndex + 1) % images.length
    const preloadCount = Math.min(2, images.length - 1)

    for (let i = 0; i < preloadCount; i++) {
      const img = new Image()
      img.src = `/assets/${images[(nextIndex + i) % images.length].filename}`
      preloadImages.push(img)
    }

    return () => {
      preloadImages.forEach((img) => {
        img.src = ''
      })
    }
  }, [currentIndex, images])

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true)
    }
  }

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false)
    }
  }

  if (!images.length) {
    return (
      <div
        className={`fixed inset-0 bg-black ${className}`}
        style={{ zIndex: -10 }}
      />
    )
  }

  const currentImage = images[currentIndex]
  const backgroundImageUrl = `/assets/${currentImage.filename}`

  // Dynamic styles based on display mode
  const getBackgroundStyles = () => {
    const baseStyles = {
      backgroundImage: `url('${backgroundImageUrl}')`,
      backgroundRepeat: 'no-repeat' as const,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'transparent'
    }

    if (displayMode === 'cover') {
      return {
        ...baseStyles,
        backgroundPosition: 'center center',
        backgroundSize: 'cover' as const
      }
    }

    // Slide mode: adaptive based on aspect ratio
    const viewportAspectRatio = window.innerWidth / window.innerHeight
    const imageAspectRatio = 1.78 // Assume 16:9 for astronomy images

    if (viewportAspectRatio > imageAspectRatio) {
      // Viewport is wider - use vertical panning
      const verticalPosition = `center ${slideProgress}%`
      return {
        ...baseStyles,
        backgroundPosition: verticalPosition,
        backgroundSize: '100% auto' as const
      }
    } else {
      // Viewport is taller - use horizontal panning
      const horizontalPosition = `${slideProgress}% center`
      return {
        ...baseStyles,
        backgroundPosition: horizontalPosition,
        backgroundSize: 'auto 100%' as const
      }
    }
  }

  return (
    <div
      className={`fixed inset-0 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        zIndex: -10,
        overflow: 'hidden'
      }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={getBackgroundStyles()}
      />

      {/* Subtle overlay for content readability */}
      {showOverlay && (
        <div className="absolute inset-0 bg-black/20" />
      )}

      {/* Fade transition overlay */}
      <div
        className="absolute inset-0 bg-black transition-none"
        style={{
          opacity: fadeOpacity,
          zIndex: 1
        }}
      />
    </div>
  )
}

export default BackgroundSlideshow