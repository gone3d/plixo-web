/**
 * SpaceshipCanvas Component
 *
 * Main Three.js canvas with transparent background
 * Layers between BackgroundSlideshow (-10) and content (10+)
 * Z-index: 0
 */

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PathFollower } from './PathFollower';
import { SpaceshipObject } from './SpaceshipObject';
import { StarField } from './StarField';
import { TargetingCircle } from './TargetingCircle';

interface SpaceshipCanvasProps {
  className?: string;
}

export function SpaceshipCanvas({ className = '' }: SpaceshipCanvasProps) {
  // Track spaceship position for HUD overlay
  const [spaceshipPosition, setSpaceshipPosition] = useState({ x: 0, y: 0, z: 0, screenX: 0, screenY: 0 });
  const [spaceshipVisible, setSpaceshipVisible] = useState(true);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return null; // Respect user's motion preferences
  }

  return (
    <>
      {/* 2D HUD Overlay */}
      <TargetingCircle position={spaceshipPosition} isVisible={spaceshipVisible} />

      {/* 3D Canvas */}
      <div
        className={`fixed inset-0 pointer-events-none ${className}`}
        style={{
          zIndex: 0, // Above background (-10), below content (10+)
        }}
      >
      <Canvas
        camera={{
          position: [0, 0, 20],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          alpha: true, // Enable transparent background
          antialias: false, // Disable for performance
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]} // Limit pixel ratio for performance
        style={{
          background: 'transparent', // Transparent canvas
        }}
      >
        <Suspense fallback={null}>
          {/* Ambient light for base visibility */}
          <ambientLight intensity={0.3} />

          {/* Directional light from top-right */}
          <directionalLight position={[10, 10, 5]} intensity={1} />

          {/* Point light following spaceship */}
          <pointLight position={[5, 5, 5]} intensity={0.5} color="#60a5fa" />

          {/* Star field background */}
          <StarField count={1500} />

          {/* PathFollower with Spaceship - 15s flight, 10s delay */}
          <PathFollower
            onPositionUpdate={setSpaceshipPosition}
            onVisibilityChange={setSpaceshipVisible}
          >
            {(state) => <SpaceshipObject state={state} />}
          </PathFollower>
        </Suspense>
      </Canvas>
      </div>
    </>
  );
}
