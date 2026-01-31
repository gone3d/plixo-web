/**
 * StarField Component
 *
 * Creates a particle cloud of stars in 3D space for background depth
 */

import { useMemo, useRef } from "react";
import { Points } from "three";
import { useFrame } from "@react-three/fiber";

interface StarFieldProps {
  count?: number;
}

export function StarField({ count = 2000 }: StarFieldProps) {
  const pointsRef = useRef<Points>(null);

  // Generate random star positions
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Distribute stars in a sphere around the scene
      const radius = 100 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    return positions;
  }, [count]);

  // Subtle rotation for depth effect
  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}
