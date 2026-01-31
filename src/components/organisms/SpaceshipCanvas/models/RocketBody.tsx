/**
 * RocketBody Component
 * Main capsule/body of the rocket - bright blue with metallic finish
 */

interface RocketBodyProps {
  color?: string;
  wireframe?: boolean;
}

export function RocketBody({
  color = "#4299e1",
  wireframe = false,
}: RocketBodyProps) {
  return (
    <group>
      {/* Main cylindrical body */}
      <mesh position={[10, 10, 0]}>
        <cylinderGeometry args={[1, 1, 3, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={0.2}
          wireframe={wireframe}
        />
      </mesh>

      {/* Top cap - rounded dome */}
      <mesh position={[0, 1.75, 0]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={0.2}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}
