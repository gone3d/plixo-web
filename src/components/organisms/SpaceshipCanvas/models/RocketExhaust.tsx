/**
 * RocketExhaust Component
 * Chrome truncated cone pointing UP into the base, flaring OUT at bottom
 * Bottom width is 50% of hull width
 */

interface RocketExhaustProps {
  wireframe?: boolean;
}

export function RocketExhaust({ wireframe = false }: RocketExhaustProps) {
  const hullRadius = 0.5; // Match the body cylinder radius
  const exhaustBottomRadius = hullRadius * 0.5; // 50% of hull width
  const exhaustTopRadius = 0.15; // Narrow top pointing into rocket

  return (
    <mesh position={[0, -1.5, 0]}>
      {/* Frustum (truncated cone):
       * radiusTop: narrow end pointing up into rocket base
       * radiusBottom: wide end flaring out at bottom (50% hull width)
       * height: 0.8
       */}
      <cylinderGeometry
        args={[exhaustTopRadius, exhaustBottomRadius, 0.3, 32]}
      />
      <meshStandardMaterial
        color="#c0c0c0"
        metalness={1.0}
        roughness={0.1}
        envMapIntensity={1.5}
        wireframe={wireframe}
      />
    </mesh>
  );
}
