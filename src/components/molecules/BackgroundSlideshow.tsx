import { useState, useEffect } from "react";

interface BackgroundImage {
  filename: string;
  title?: string;
  text?: string;
}

interface BackgroundSlideshowProps {
  images: BackgroundImage[];
  transitionTime?: number;
  className?: string;
  pauseOnHover?: boolean;
  fadeDuration?: number;
  maxSpeedPxPerSec?: number;
}

const BackgroundSlideshow = ({
  images,
  transitionTime = 18000,
  className = "",
  pauseOnHover = true,
  fadeDuration = 1400,
  maxSpeedPxPerSec = 15,
}: BackgroundSlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeOpacity, setFadeOpacity] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const [effectiveDuration, setEffectiveDuration] = useState(transitionTime);

  // Detect actual image aspect ratio and calculate effective duration with speed limit
  useEffect(() => {
    if (!images[currentIndex]) {
      setImageAspectRatio(null);
      setEffectiveDuration(transitionTime);
      return;
    }

    const img = new Image();
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      setImageAspectRatio(ratio);

      // Calculate effective duration based on speed limit
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const viewportRatio = viewportWidth / viewportHeight;

      let panDistancePixels = 0;

      // Calculate actual pan distance based on which direction we'll pan
      if (Math.abs(ratio - viewportRatio) < 0.01) {
        // No panning needed - aspect ratios match
        panDistancePixels = 0;
      } else if (ratio > viewportRatio) {
        // Horizontal pan - image is wider
        // Image will be sized to viewport height, so width = height * ratio
        const imageWidth = viewportHeight * ratio;
        panDistancePixels = imageWidth - viewportWidth;
      } else {
        // Vertical pan - image is taller
        // Image will be sized to viewport width, so height = width / ratio
        const imageHeight = viewportWidth / ratio;
        panDistancePixels = imageHeight - viewportHeight;
      }

      // Calculate duration needed to stay under speed limit
      if (maxSpeedPxPerSec && panDistancePixels > 0) {
        const speedLimitDuration = (panDistancePixels / maxSpeedPxPerSec) * 1000;
        setEffectiveDuration(Math.max(speedLimitDuration, transitionTime));
      } else {
        setEffectiveDuration(transitionTime);
      }
    };
    img.onerror = () => {
      console.error(`Failed to load image: ${images[currentIndex].filename}`);
      // Fallback to 16:9 on error
      setImageAspectRatio(1600 / 900);
      setEffectiveDuration(transitionTime);
    };
    img.src = `/assets/${images[currentIndex].filename}`;
  }, [currentIndex, images, transitionTime, maxSpeedPxPerSec]);

  // Slide animation - simple progress from 0 to 100
  useEffect(() => {
    if (isPaused || images.length <= 1) {
      return;
    }

    // Reset slide progress when image changes
    setSlideProgress(0);

    // Animate slide progress over effective duration (may be longer than base transitionTime)
    const slideInterval = setInterval(() => {
      setSlideProgress((prev) => {
        const increment = 100 / (effectiveDuration / 50); // Update every 50ms
        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => clearInterval(slideInterval);
  }, [currentIndex, effectiveDuration, isPaused, images.length]);

  // Auto-cycle through images with fade
  useEffect(() => {
    if (images.length <= 1 || isPaused) {
      return;
    }

    // Start fade BEFORE pan completes, using effective duration
    const fadeOutDuration = fadeDuration * 0.4;
    const fadeStartDelay = effectiveDuration - fadeOutDuration;

    const timeout = setTimeout(() => {
      // Fade out
      let opacity = 0;
      const fadeOutInterval = setInterval(() => {
        opacity += 0.02; // 2% per frame (50fps)
        setFadeOpacity(opacity);

        if (opacity >= 1) {
          clearInterval(fadeOutInterval);

          // Change image at peak of fade
          const nextIndex = (currentIndex + 1) % images.length;
          setCurrentIndex(nextIndex);

          // Fade in
          const fadeInInterval = setInterval(() => {
            opacity -= 0.02;
            setFadeOpacity(Math.max(0, opacity));

            if (opacity <= 0) {
              clearInterval(fadeInInterval);
              setFadeOpacity(0);
            }
          }, 20);
        }
      }, 20);
    }, fadeStartDelay);

    return () => clearTimeout(timeout);
  }, [currentIndex, effectiveDuration, isPaused, images.length, fadeDuration]);

  // Preload next images
  useEffect(() => {
    if (images.length <= 1) return;

    const preloadImages: HTMLImageElement[] = [];
    const preloadCount = Math.min(3, images.length - 1);

    for (let i = 1; i <= preloadCount; i++) {
      const img = new Image();
      const indexToPreload = (currentIndex + i) % images.length;
      img.src = `/assets/${images[indexToPreload].filename}`;
      preloadImages.push(img);
    }

    return () => {
      preloadImages.forEach((img) => {
        img.src = "";
      });
    };
  }, [currentIndex, images]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  if (!images.length) {
    return (
      <div
        className={`fixed inset-0 bg-black ${className}`}
        style={{ zIndex: -10 }}
      />
    );
  }

  const currentImage = images[currentIndex];
  const backgroundImageUrl = `/assets/${currentImage.filename}`;

  // Get background styles based on aspect ratio comparison
  const getBackgroundStyles = () => {
    const baseStyles = {
      backgroundImage: `url('${backgroundImageUrl}')`,
      backgroundRepeat: "no-repeat",
      width: "100vw",
      height: "100vh",
    };

    // Wait for aspect ratio detection
    if (imageAspectRatio === null) {
      return {
        ...baseStyles,
        backgroundPosition: "center center",
        backgroundSize: "cover",
      };
    }

    const viewportAspectRatio = window.innerWidth / window.innerHeight;
    const aspectRatioDifference = imageAspectRatio - viewportAspectRatio;
    const threshold = 0.01;

    // Image and viewport are approximately same aspect ratio
    if (Math.abs(aspectRatioDifference) < threshold) {
      return {
        ...baseStyles,
        backgroundPosition: "center center",
        backgroundSize: "cover",
      };
    }

    // Image is wider than viewport - horizontal pan
    if (imageAspectRatio > viewportAspectRatio) {
      return {
        ...baseStyles,
        backgroundPosition: `${slideProgress}% center`,
        backgroundSize: "auto 100%", // Height-based sizing
      };
    }

    // Image is taller than viewport - vertical pan
    return {
      ...baseStyles,
      backgroundPosition: `center ${slideProgress}%`,
      backgroundSize: "100% auto", // Width-based sizing
    };
  };

  return (
    <div
      className={`fixed inset-0 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        zIndex: -10,
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0" style={getBackgroundStyles()} />

      {/* Vignette overlay for content readability */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0.9) 100%)`,
          zIndex: 1,
        }}
      />

      {/* Fade transition overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{
          opacity: fadeOpacity,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default BackgroundSlideshow;
