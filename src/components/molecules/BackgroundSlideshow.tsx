import { useState, useEffect } from "react";
import { useBackground } from "../../contexts/GlobalContext";

interface BackgroundSlideshowProps {
  transitionTime?: number;
  className?: string;
  pauseOnHover?: boolean;
  fadeDuration?: number;
  maxSpeedPxPerSec?: number;
}

const BackgroundSlideshow = ({
  transitionTime = 18000,
  className = "",
  pauseOnHover = true,
  fadeDuration = 1400,
  maxSpeedPxPerSec = 15,
}: BackgroundSlideshowProps) => {
  // Get background state from GlobalContext
  const {
    currentImageIndex,
    imageDisplaySequence,
    backgroundImages,
    setBackgroundIndex,
    shuffleDisplaySequence,
  } = useBackground();

  const [fadeOpacity, setFadeOpacity] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(!document.hidden);
  const [slideProgress, setSlideProgress] = useState(0);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const [effectiveDuration, setEffectiveDuration] = useState(transitionTime);

  // Get actual image from display sequence
  const actualImageIndex = imageDisplaySequence[currentImageIndex] ?? currentImageIndex;
  const currentImage = backgroundImages[actualImageIndex];

  // Handle page visibility changes to prevent timer buildup when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Detect actual image aspect ratio and calculate effective duration with speed limit
  useEffect(() => {
    if (!currentImage) {
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
        const imageWidth = viewportHeight * ratio;
        panDistancePixels = imageWidth - viewportWidth;
      } else {
        // Vertical pan - image is taller
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
      console.error(`Failed to load image: ${currentImage.filename}`);
      setImageAspectRatio(1600 / 900);
      setEffectiveDuration(transitionTime);
    };
    img.src = `/assets/${currentImage.filename}`;
  }, [currentImageIndex, currentImage, transitionTime, maxSpeedPxPerSec]);

  // Slide animation - simple progress from 0 to 100
  useEffect(() => {
    if (isPaused || backgroundImages.length <= 1 || !isPageVisible) {
      return;
    }

    // Reset slide progress when image changes
    setSlideProgress(0);

    // Animate slide progress over effective duration
    const slideInterval = setInterval(() => {
      setSlideProgress((prev) => {
        const increment = 100 / (effectiveDuration / 50);
        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => clearInterval(slideInterval);
  }, [currentImageIndex, effectiveDuration, isPaused, backgroundImages.length, isPageVisible]);

  // Auto-cycle through images with fade - tenebrae-web style
  useEffect(() => {
    if (backgroundImages.length <= 1 || isPaused || !isPageVisible) {
      return;
    }

    // Start fade BEFORE pan completes
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

          // Change image when fully faded to black
          const nextIndex = (currentImageIndex + 1) % backgroundImages.length;

          // If we're at the last image in the sequence, shuffle for next cycle
          if (currentImageIndex === backgroundImages.length - 1) {
            shuffleDisplaySequence();
          } else {
            setBackgroundIndex(nextIndex);
          }

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
  }, [
    currentImageIndex,
    effectiveDuration,
    isPaused,
    backgroundImages.length,
    fadeDuration,
    isPageVisible,
    setBackgroundIndex,
    shuffleDisplaySequence,
  ]);

  // Preload next images
  useEffect(() => {
    if (backgroundImages.length <= 1) return;

    const preloadImages: HTMLImageElement[] = [];
    const preloadCount = Math.min(3, backgroundImages.length - 1);

    for (let i = 1; i <= preloadCount; i++) {
      const img = new Image();
      const nextSequenceIndex = (currentImageIndex + i) % backgroundImages.length;
      const nextImageIndex = imageDisplaySequence[nextSequenceIndex] ?? nextSequenceIndex;
      img.src = `/assets/${backgroundImages[nextImageIndex].filename}`;
      preloadImages.push(img);
    }

    return () => {
      preloadImages.forEach((img) => {
        img.src = "";
      });
    };
  }, [currentImageIndex, backgroundImages, imageDisplaySequence]);

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

  if (!backgroundImages.length || !currentImage) {
    return (
      <div
        className={`fixed inset-0 bg-black ${className}`}
        style={{ zIndex: -10 }}
      />
    );
  }

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
        backgroundSize: "auto 100%",
      };
    }

    // Image is taller than viewport - vertical pan
    return {
      ...baseStyles,
      backgroundPosition: `center ${slideProgress}%`,
      backgroundSize: "100% auto",
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
