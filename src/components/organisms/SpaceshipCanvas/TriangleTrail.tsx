/**
 * TriangleTrail Component
 *
 * Tracks the 3 triangle points at the nozzle and renders their trail
 * Only these specific points leave trails, not the entire scene
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TriangleTrailProps {
  trianglePositions: THREE.Vector3[]; // World positions of the 3 triangle points
  triangleColors: THREE.Vector3[]; // RGB colors for each triangle point
  isActive: boolean;
}

const MAX_TRAIL_LENGTH = 120; // Number of historical positions to keep per point (2 seconds at 60fps)
const POINT_SIZE = 0.8; // Much larger particles

interface TrailPoint {
  position: THREE.Vector3;
  age: number; // 0 (newest) to MAX_TRAIL_LENGTH (oldest)
}

export function TriangleTrail({ trianglePositions, triangleColors, isActive }: TriangleTrailProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Store trail history for each of the 3 triangle points
  const trailHistory = useRef<TrailPoint[][]>([[], [], []]);

  // Create geometry and material
  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const maxPoints = MAX_TRAIL_LENGTH * 3; // 3 triangle points

    const positions = new Float32Array(maxPoints * 3);
    const colors = new Float32Array(maxPoints * 4); // RGBA (4 components for alpha support)

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 4)); // 4 components for RGBA

    // Create circular gradient texture for soft particles
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    // Draw radial gradient from white center to transparent edges
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);

    const mat = new THREE.PointsMaterial({
      size: POINT_SIZE,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      alphaMap: texture, // Use texture for particle shape (alpha channel)
    });

    return { geometry: geo, material: mat };
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;

    // Add current triangle positions to trail history (only when active)
    if (isActive) {
      for (let i = 0; i < 3; i++) {
        if (trianglePositions[i]) {
          // Add new position at the front
          trailHistory.current[i].unshift({
            position: trianglePositions[i].clone(),
            age: 0,
          });

          // Remove old positions
          if (trailHistory.current[i].length > MAX_TRAIL_LENGTH) {
            trailHistory.current[i].pop();
          }
        }
      }
    }

    // Always increment age of all points (even when not emitting)
    for (let i = 0; i < 3; i++) {
      trailHistory.current[i].forEach((point) => {
        point.age++;
      });
    }

    // Update buffer geometry with all trail points
    const positions = geometry.attributes.position.array as Float32Array;
    const colors = geometry.attributes.color.array as Float32Array;

    let pointIndex = 0;

    for (let trianglePoint = 0; trianglePoint < 3; trianglePoint++) {
      const trail = trailHistory.current[trianglePoint];
      const pointColor = triangleColors[trianglePoint];

      for (let i = 0; i < trail.length; i++) {
        const point = trail[i];
        const ageRatio = point.age / MAX_TRAIL_LENGTH;
        const opacity = 1 - ageRatio; // Linear fade out as it gets older

        // Position
        positions[pointIndex * 3] = point.position.x;
        positions[pointIndex * 3 + 1] = point.position.y;
        positions[pointIndex * 3 + 2] = point.position.z;

        // Use the specific color for this triangle point with constant RGB and fading alpha
        colors[pointIndex * 4] = pointColor.x;     // R (constant)
        colors[pointIndex * 4 + 1] = pointColor.y; // G (constant)
        colors[pointIndex * 4 + 2] = pointColor.z; // B (constant)
        colors[pointIndex * 4 + 3] = opacity;      // A (linear fade)

        pointIndex++;
      }
    }

    // Update draw range
    geometry.setDrawRange(0, pointIndex);
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
