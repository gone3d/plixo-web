/**
 * TargetingCircle Component
 *
 * 2D HUD overlay showing spaceship position and velocity
 * - Circle on left side of screen
 * - Line extending to the right with coordinates
 * - x•y•z format for position
 * - Delta Z (velocity) displayed as integer
 */

import { useRef, useEffect, useState } from 'react';
import { getTargetingColor, calculateAzimuth, calculateElevation } from '../../../utils/threeD';

interface TargetingCircleProps {
  position?: { x: number; y: number; z: number; screenX: number; screenY: number };
  isVisible?: boolean;
}

export function TargetingCircle({
  position = { x: 0, y: 0, z: 0, screenX: 0, screenY: 0 },
  isVisible = true,
}: TargetingCircleProps) {
  const [deltaZ, setDeltaZ] = useState(0);
  const previousZ = useRef(position.z);

  useEffect(() => {
    // Calculate delta Z (change in Z position)
    const delta = position.z - previousZ.current;
    previousZ.current = position.z;

    // Update delta Z (multiply by 100 and convert to integer)
    setDeltaZ(Math.round(delta * 100));
  }, [position.z]);

  // Calculate color based on delta Z
  const circleColor = getTargetingColor(deltaZ);

  // Round position values for display
  const roundedX = Math.round(position.x);
  const roundedY = Math.round(position.y);
  const roundedZ = Math.round(position.z);

  // Calculate azimuth (φ) and elevation (ε)
  const azimuth = calculateAzimuth(position.x, position.z);
  const elevation = calculateElevation(position.x, position.y, position.z);

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.screenX - 100}px`,
        top: `${position.screenY - 100}px`,
        pointerEvents: 'none',
        zIndex: 1,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* Circle */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke={circleColor}
          strokeWidth="1"
          opacity="0.7"
        />

        {/* Line extending to the right */}
        <line
          x1="180"
          y1="100"
          x2="220"
          y2="100"
          stroke={circleColor}
          strokeWidth="1"
          opacity="0.7"
        />
      </svg>

      {/* Text positioned to the right of the line */}
      <div
        style={{
          position: 'absolute',
          left: '220px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'rgba(255, 255, 255, 0.6)',
          fontFamily: 'monospace',
          fontSize: '14px',
          whiteSpace: 'nowrap',
        }}
      >
        <div>{roundedX}•{roundedY}•{roundedZ}</div>
        <div style={{ marginTop: '2px', fontSize: '12px' }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>φ</span>{azimuth} <span style={{ fontSize: '16px', fontWeight: 'bold' }}>ε</span>{elevation}
        </div>
      </div>
    </div>
  );
}
