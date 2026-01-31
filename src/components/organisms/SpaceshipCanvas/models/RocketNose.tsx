/**
 * RocketNose Component
 * Chrome pointed cone at the top of the rocket
 */

interface RocketNoseProps {
  wireframe?: boolean;
}

export function RocketNose({ wireframe = false }: RocketNoseProps) {
  return (
    <mesh position={[0, 2.75, 0]}>
      {/* Cone: radius at base = 1, height = 1.5, segments = 32 */}
      <coneGeometry args={[1, 1.5, 32]} />
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
