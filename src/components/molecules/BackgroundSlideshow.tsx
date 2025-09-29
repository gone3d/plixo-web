import { useState, useEffect, useRef, useCallback } from "react";
import {
  FadeTransition,
  PanningController,
  calculatePanDirection,
  getBackgroundStyles,
  getViewportDimensions,
  DEFAULT_FADE_CONFIG,
  DEFAULT_PAN_CONFIG,
} from "../../utils";

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
  displayMode?: "cover" | "slide";
  fadeTransition?: boolean;
  fadeDuration?: number;
}

const BackgroundSlideshow = ({
  images,
  transitionTime = 36000, // Tripled from 12 seconds to 36 seconds
  className = "",
  pauseOnHover = true,
  displayMode = "slide",
  fadeTransition = true,
  fadeDuration = 1400, // Increased from 800ms to 1400ms for longer fade
}: BackgroundSlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeOpacity, setFadeOpacity] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  const [panDirection, setPanDirection] = useState<"horizontal" | "vertical">(
    "horizontal"
  );

  // Refs for animation controllers
  const fadeTransitionRef = useRef<FadeTransition | null>(null);
  const panningControllerRef = useRef<PanningController | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize animation controllers
  useEffect(() => {
    // Initialize fade transition
    fadeTransitionRef.current = new FadeTransition(setFadeOpacity, {
      ...DEFAULT_FADE_CONFIG,
      duration: fadeDuration,
      fadeOutDuration: fadeDuration * 0.4, // 40% for fade out
      fadeInDuration: fadeDuration * 0.4, // 40% for fade in
      holdDuration: fadeDuration * 0.2, // 20% hold (includes the 0.25s delay)
      maxOpacity: 1,
    });

    // Initialize panning controller
    // Panning runs for full transition time, fade starts early to reach black when panning ends
    panningControllerRef.current = new PanningController(setSlideProgress, {
      ...DEFAULT_PAN_CONFIG,
      duration: transitionTime,
    });

    // Calculate pan direction based on viewport
    const updatePanDirection = () => {
      const viewport = getViewportDimensions();
      // Assume 16:9 aspect ratio for astronomy images
      const imageAspectRatio = 16 / 9;
      const direction = calculatePanDirection(viewport, {
        width: viewport.width * imageAspectRatio,
        height: viewport.height,
      });
      setPanDirection(direction);
    };

    updatePanDirection();
    window.addEventListener("resize", updatePanDirection);

    return () => {
      fadeTransitionRef.current?.stop();
      panningControllerRef.current?.stop();
      window.removeEventListener("resize", updatePanDirection);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fadeDuration, transitionTime]);

  // Handle image transition
  const transitionToNext = useCallback(async () => {
    if (images.length <= 1 || isPaused) return;

    const nextIndex = (currentIndex + 1) % images.length;

    if (fadeTransition && fadeTransitionRef.current) {
      // Use custom fade transition
      await fadeTransitionRef.current.start(() => {
        // This callback runs at the peak of the fade (black screen)
        setCurrentIndex(nextIndex);

        // Reset and start panning for new image
        if (displayMode === "slide" && panningControllerRef.current) {
          // Panning uses full transition time
          panningControllerRef.current.updateConfig({
            duration: transitionTime
          });
          panningControllerRef.current.stop();
          panningControllerRef.current.start();
        }
      });
    } else {
      // Immediate transition without fade
      setCurrentIndex(nextIndex);
      if (displayMode === "slide" && panningControllerRef.current) {
        // Update panning duration to use full transition time when no fade
        panningControllerRef.current.updateConfig({
          duration: transitionTime
        });
        panningControllerRef.current.stop();
        panningControllerRef.current.start();
      }
    }
  }, [currentIndex, images.length, isPaused, fadeTransition, displayMode]);

  // Auto-cycle through images
  useEffect(() => {
    if (images.length <= 1 || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Calculate when to start fade so it reaches black when panning ends
    const fadeOutDuration = fadeDuration * 0.4; // 40% of fade duration
    const fadeStartDelay = transitionTime - fadeOutDuration;

    // Set timeout to start fade at the right time
    const timeoutId = setTimeout(() => {
      transitionToNext();

      // Set up the next cycle
      intervalRef.current = setInterval(transitionToNext, transitionTime);
    }, fadeStartDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [transitionTime, isPaused, transitionToNext, images.length]);

  // Start panning when component mounts or image changes
  useEffect(() => {
    if (
      displayMode === "slide" &&
      !isPaused &&
      panningControllerRef.current &&
      images.length > 0
    ) {
      panningControllerRef.current.start();
    }
  }, [currentIndex, displayMode, isPaused, images.length]);

  // Handle pause/resume
  useEffect(() => {
    if (panningControllerRef.current) {
      if (isPaused) {
        panningControllerRef.current.pause();
      } else if (displayMode === "slide") {
        panningControllerRef.current.resume();
      }
    }
  }, [isPaused, displayMode]);

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

  // Get background styles based on display mode
  const getBackgroundStylesForMode = () => {
    const viewport = getViewportDimensions();

    if (displayMode === "cover") {
      return {
        backgroundImage: `url('${backgroundImageUrl}')`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        width: "100vw",
        height: "100vh",
      };
    }

    // Slide mode with panning
    const bgStyles = getBackgroundStyles(slideProgress, panDirection, viewport);

    return {
      backgroundImage: `url('${backgroundImageUrl}')`,
      backgroundRepeat: "no-repeat",
      ...bgStyles,
      width: "100vw",
      height: "100vh",
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
      <div className="absolute inset-0" style={getBackgroundStylesForMode()} />

      {/* Subtle overlay for content readability */}

      <div className="absolute inset-0 bg-black/25" style={{ zIndex: 1 }} />

      {/* Fade transition overlay */}
      {fadeTransition && (
        <div
          className="absolute inset-0 bg-black transition-none"
          style={{
            opacity: fadeOpacity,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

export default BackgroundSlideshow;
