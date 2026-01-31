/**
 * RocketHullLathe Component
 * Creates a hull by rotating a 2D curve profile 360° around the Y-axis
 * using Three.js LatheGeometry
 */

import { Vector2, LatheGeometry } from "three";
import { useMemo } from "react";

interface RocketHullLatheProps {
  color?: string;
  wireframe?: boolean;
}

export function RocketHullLathe({
  color = "#4299e1",
  wireframe = false,
}: RocketHullLatheProps) {
  const latheGeometry = useMemo(() => {
    // Hull profile points extracted from hull3.svg (straight line version)
    // SVG shows side profile with centerline at X=0, Y=0 at bottom
    // - SVG X distance from centerline = radius in Three.js
    // - SVG Y coordinate = position along rocket (Y=0 is bottom, Y=657 is top)
    // Format: Vector2(radius from center, height along Y-axis)
    // Generated from hull3.svg with total height scaled to 6 units
    const points: Vector2[] = [
      new Vector2(0.321, -3.0), // Bottom (base)
      new Vector2(0.536, -2.421),
      new Vector2(0.743, -1.585),
      new Vector2(0.86, -0.9),
      new Vector2(0.884, -0.529),
      new Vector2(0.86, -0.191),
      new Vector2(0.837, 0.039),
      new Vector2(0.734, 0.49),
      new Vector2(0.579, 0.903),
      new Vector2(0.419, 1.222),
      new Vector2(0.255, 1.476),
      new Vector2(0.105, 1.635),
      new Vector2(0.0, 1.682), // Top (nose)
    ];

    // Create lathe geometry
    // segments: number of divisions around the Y-axis (more = smoother)
    // phiStart: starting angle (0 = start at +X axis)
    // phiLength: how many radians to rotate (2*PI = full 360°)
    return new LatheGeometry(points, 32, 0, Math.PI * 2);
  }, []);

  return (
    <mesh position={[0, 1.5, 0]}>
      <primitive object={latheGeometry} attach="geometry" />
      <meshStandardMaterial
        color={color}
        metalness={0.7}
        roughness={0.3}
        emissive={color}
        emissiveIntensity={0.2}
        wireframe={wireframe}
      />
    </mesh>
  );
}
