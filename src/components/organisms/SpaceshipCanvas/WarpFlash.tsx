/**
 * WarpFlash Component
 *
 * Animated expanding sphere that appears when an object warps away.
 * Grows quickly at first, then slows down while fading over 4 seconds.
 */

import { Vector3 } from "three";

interface WarpFlashProps {
  position: Vector3;
  intensity: number; // 0 to 1, controls both size and opacity
}

export function WarpFlash({ position, intensity }: WarpFlashProps) {
  // Ease-out curve: fast growth initially, slows down
  // Using cubic ease-out: 1 - (1-t)^3
  const progress = 1 - intensity; // Convert from intensity (1->0) to progress (0->1)
  const easeOut = 1 - Math.pow(1 - progress, 3);

  // Outer sphere: grows from 1 to 40 units continuously
  const outerMinSize = 1;
  const outerMaxSize = 40;
  const outerSize = outerMinSize + (outerMaxSize - outerMinSize) * easeOut;

  // Inner sphere: grows until 1/2 progress, then shrinks to nothing quickly
  const innerShrinkPoint = 0.5;
  let innerSize: number;

  if (progress < innerShrinkPoint) {
    // Growing phase: 0.5 to 20 units - faster growth with quadratic ease-out
    const growthProgress = progress / innerShrinkPoint;
    const growthEaseOut = 1 - Math.pow(1 - growthProgress, 2); // Quadratic for faster growth
    innerSize = 0.5 + (20 - 0.5) * growthEaseOut;
  } else {
    // Shrinking phase: from max size down to 0 - faster with quadratic decay
    const shrinkProgress = (progress - innerShrinkPoint) / (1 - innerShrinkPoint);
    const maxSize = 0.5 + (20 - 0.5) * (1 - Math.pow(1 - 1, 2)); // Max size = 20
    innerSize = maxSize * Math.pow(1 - shrinkProgress, 2); // Quadratic shrink for faster collapse
  }

  // Opacity fades linearly from 1 to 0
  const innerOpacity = intensity * 0.9;
  const outerOpacity = intensity * 0.4;

  if (intensity <= 0) return null;

  return (
    <>
      {/* Inner bright sphere */}
      <mesh position={position}>
        <sphereGeometry args={[innerSize, 32, 32]} />
        <meshBasicMaterial
          color="#4080ff"
          transparent
          opacity={innerOpacity}
        />
      </mesh>

      {/* Outer glow */}
      <mesh position={position}>
        <sphereGeometry args={[outerSize, 32, 32]} />
        <meshBasicMaterial
          color="#2060ff"
          transparent
          opacity={outerOpacity}
        />
      </mesh>

      {/* Light source */}
      <pointLight
        position={position}
        intensity={intensity * 8000}
        distance={1000}
        color="#4080ff"
        decay={0.5}
      />
    </>
  );
}
