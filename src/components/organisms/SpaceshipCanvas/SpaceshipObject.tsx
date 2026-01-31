/**
 * SpaceshipObject Component
 *
 * Visual representation of a spaceship that can be attached to a PathFollower.
 * Renders the ship model, spinning exhaust triangles, and particle trails.
 */

import { useRef, useState, useMemo } from "react";
import { Vector3, BufferGeometry, Float32BufferAttribute, Points } from "three";
import { useFrame } from "@react-three/fiber";
import { SpaceshipModel } from "./models";
import { TriangleTrail } from "./TriangleTrail";
import { WarpFlash } from "./WarpFlash";
import type { PathFollowerState } from "./PathFollower";

interface SpaceshipObjectProps {
  state: PathFollowerState;
}

export function SpaceshipObject({ state }: SpaceshipObjectProps) {
  const { groupRef, opacity, isVisible, warpFlashIntensity, flashPosition } = state;

  // Triangle world positions for trail tracking
  const [triangleWorldPositions, setTriangleWorldPositions] = useState<Vector3[]>([
    new Vector3(),
    new Vector3(),
    new Vector3(),
  ]);

  const [triangleColors] = useState([
    new Vector3(0.1, 0.4, 0.8), // Blue
    new Vector3(0.1, 0.7, 0.6), // Greenish blue (cyan)
    new Vector3(0.5, 0.2, 0.8), // Purplish blue
  ]);

  // Triangle rotation for spinning effect
  const triangleRotation = useRef(0);

  // Create triangle geometry for exhaust trail (smaller triangle) - will be updated each frame
  const triangleGeometry = useMemo(() => {
    const geo = new BufferGeometry();
    const positions = new Float32Array(9); // 3 points * 3 coords
    const colors = new Float32Array([
      0.1, 0.4, 0.8, // Blue
      0.1, 0.7, 0.6, // Greenish blue
      0.4, 0.2, 0.8, // Purplish blue
    ]);
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geo.setAttribute("color", new Float32BufferAttribute(colors, 3));
    return geo;
  }, []);

  const trianglePointsRef = useRef<Points>(null);

  useFrame((_state, delta) => {
    if (!groupRef.current || !isVisible) return;

    // Update triangle rotation (spin around center)
    triangleRotation.current += delta * 3; // 3 radians per second

    // Calculate world positions of the 3 triangle points at the nozzle with rotation
    const nozzlePosition = new Vector3(0, -2, 0); // Triangle is at nozzle
    const triangleRadius = 0.25; // Smaller triangle

    // Create triangle points in a circle, rotating over time
    const angle1 = triangleRotation.current;
    const angle2 = triangleRotation.current + (Math.PI * 2) / 3;
    const angle3 = triangleRotation.current + (Math.PI * 4) / 3;

    const triangleLocalPositions = [
      new Vector3(
        Math.cos(angle1) * triangleRadius,
        Math.sin(angle1) * triangleRadius,
        0
      ),
      new Vector3(
        Math.cos(angle2) * triangleRadius,
        Math.sin(angle2) * triangleRadius,
        0
      ),
      new Vector3(
        Math.cos(angle3) * triangleRadius,
        Math.sin(angle3) * triangleRadius,
        0
      ),
    ];

    const worldPositions = triangleLocalPositions.map((localPos) => {
      // First apply nozzle offset, then apply ship rotation, then add ship position
      const pos = localPos.clone().add(nozzlePosition);
      pos.applyQuaternion(groupRef.current!.quaternion);
      pos.add(groupRef.current!.position);
      return pos;
    });

    setTriangleWorldPositions(worldPositions);

    // Update visible triangle points geometry to spin
    if (trianglePointsRef.current) {
      const posAttr = triangleGeometry.attributes.position;
      const positions = posAttr.array as Float32Array;

      positions[0] = Math.cos(angle1) * triangleRadius;
      positions[1] = Math.sin(angle1) * triangleRadius;
      positions[2] = 0;

      positions[3] = Math.cos(angle2) * triangleRadius;
      positions[4] = Math.sin(angle2) * triangleRadius;
      positions[5] = 0;

      positions[6] = Math.cos(angle3) * triangleRadius;
      positions[7] = Math.sin(angle3) * triangleRadius;
      positions[8] = 0;

      posAttr.needsUpdate = true;
    }
  });

  return (
    <>
      <group ref={groupRef}>
        {/* Retro rocket model with opacity control */}
        <group scale={[opacity, opacity, opacity]}>
          <SpaceshipModel />
        </group>

        {/* Triangle at nozzle for exhaust trail */}
        <points
          ref={trianglePointsRef}
          position={[0, -3, 0]}
          geometry={triangleGeometry}
        >
          <pointsMaterial size={0.3} vertexColors={true} />
        </points>
      </group>

      {/* Warp flash effect - separate component with grow/fade animation */}
      <WarpFlash position={flashPosition} intensity={warpFlashIntensity} />

      {/* Trail effect for triangle points */}
      <TriangleTrail
        trianglePositions={triangleWorldPositions}
        triangleColors={triangleColors}
        isActive={isVisible}
      />
    </>
  );
}
