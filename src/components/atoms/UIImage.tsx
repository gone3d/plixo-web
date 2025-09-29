import { useState, useEffect, forwardRef, type CSSProperties } from 'react'

interface UIImageProps {
  src: string
  alt: string
  className?: string
  style?: CSSProperties
  loading?: 'lazy' | 'eager'
  fallbackSrc?: string
  onLoad?: () => void
  onError?: () => void
  fadeIn?: boolean
  fadeDuration?: number
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none'
  objectPosition?: string
  sizes?: string
  priority?: boolean
}

const UIImage = forwardRef<HTMLImageElement, UIImageProps>(({
  src,
  alt,
  className = '',
  style,
  loading = 'lazy',
  fallbackSrc,
  onLoad,
  onError,
  fadeIn = false,
  fadeDuration = 300,
  objectFit = 'cover',
  objectPosition = 'center',
  sizes,
  priority = false
}, ref) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [imageSrc, setImageSrc] = useState(src)

  useEffect(() => {
    setImageSrc(src)
    setIsLoaded(false)
    setHasError(false)
  }, [src])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc)
      setHasError(false)
    } else {
      onError?.()
    }
  }

  const imageClasses = [
    className,
    fadeIn && !isLoaded ? 'opacity-0' : 'opacity-100',
    fadeIn ? `transition-opacity duration-${fadeDuration}` : '',
    'block'
  ].filter(Boolean).join(' ')

  const imageStyles = {
    objectFit,
    objectPosition,
    transition: fadeIn ? `opacity ${fadeDuration}ms ease-in-out` : undefined,
    ...style
  }

  return (
    <img
      ref={ref}
      src={imageSrc}
      alt={alt}
      className={imageClasses}
      style={imageStyles}
      loading={priority ? 'eager' : loading}
      sizes={sizes}
      onLoad={handleLoad}
      onError={handleError}
      data-loaded={isLoaded}
      data-error={hasError}
    />
  )
})

UIImage.displayName = 'UIImage'

export default UIImage