/**
 * RocketFins Component
 * Three white trapezoidal fins positioned at 0°, 120°, 240° around the hull
 * Fins have their base ON the ship's centerline and rotate from there
 */

import { Shape, ExtrudeGeometry } from "three";
import { useMemo } from "react";

interface RocketFinsProps {
  wireframe?: boolean;
}

export function RocketFins({ wireframe = false }: RocketFinsProps) {
  // Create trapezoidal fin shape based on diagram
  // Coordinates: (X=radial outward, Y=vertical along ship)
  const finGeometry = useMemo(() => {
    const shape = new Shape();

    // Draw trapezoid as shown in diagram:
    // Base on centerline (X=0): from (0,1) to (0,3) - height of 2
    // Outer edge (X=3): from (3,0) to (3,1) - height of 1
    shape.moveTo(0, 1); // Start: base bottom (on centerline)
    shape.lineTo(0, 3); // Base top (on centerline)
    shape.lineTo(3, 1); // Outer top
    shape.lineTo(3, 0); // Outer bottom
    shape.lineTo(0, 1); // Close back to start

    // Extrude to give thickness (Z-axis)
    const extrudeSettings = {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
    };

    return new ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  return (
    <group position={[0, -2.25, 0]}>
      {/* Fin 1 - at 0° (pointing toward +X when viewed from above) */}
      <mesh
        geometry={finGeometry}
        rotation={[0, 0, 0]} // Base orientation
      >
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.3}
          roughness={0.4}
          wireframe={wireframe}
        />
      </mesh>

      {/* Fin 2 - at 120° around Y-axis */}
      <mesh
        geometry={finGeometry}
        rotation={[0, (2 * Math.PI) / 3, 0]} // Rotate 120° around Y-axis
      >
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.3}
          roughness={0.4}
          wireframe={wireframe}
        />
      </mesh>

      {/* Fin 3 - at 240° around Y-axis */}
      <mesh
        geometry={finGeometry}
        rotation={[0, (4 * Math.PI) / 3, 0]} // Rotate 240° around Y-axis
      >
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.3}
          roughness={0.4}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}
