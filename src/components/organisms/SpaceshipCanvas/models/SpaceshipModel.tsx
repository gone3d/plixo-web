/**
 * SpaceshipModel Component
 * Combines all rocket parts into a complete spaceship model
 */

import { RocketHullLathe } from "./RocketHullLathe";
import { RocketFins } from "./RocketFins";
import { RocketExhaust } from "./RocketExhaust";

interface SpaceshipModelProps {
  bodyColor?: string;
  wireframe?: boolean;
}

export function SpaceshipModel({ bodyColor = "#4299e1", wireframe = false }: SpaceshipModelProps) {
  return (
    <group>
      {/* Main hull - lathe geometry from SVG profile */}
      <RocketHullLathe color={bodyColor} wireframe={wireframe} />

      {/* Three white fins at base */}
      <RocketFins wireframe={wireframe} />

      {/* Chrome exhaust cone at bottom */}
      <RocketExhaust wireframe={wireframe} />
    </group>
  );
}
