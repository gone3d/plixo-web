/**
 * SpaceshipModal Component
 * Modal that displays the spaceship in 3D with interactive controls
 */

import { useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { SpaceshipModel } from "./models";
import { X, Grid3x3 } from "lucide-react";
import { Color } from "three";

interface SpaceshipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Component to handle scene background color
function SceneBackground({ color }: { color: string }) {
  const { scene } = useThree();

  useEffect(() => {
    scene.background = new Color(color);
  }, [scene, color]);

  return null;
}

export function SpaceshipModal({ isOpen, onClose }: SpaceshipModalProps) {
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  // Rotation cycle: 15 seconds rotating, 10 seconds paused
  useEffect(() => {
    if (!isOpen) return;

    const rotationDuration = 15000; // 15 seconds
    const pauseDuration = 10000; // 10 seconds

    // Start with rotation
    setAutoRotate(true);

    const runCycle = () => {
      // Rotate for 15 seconds
      setAutoRotate(true);

      // Then pause for 10 seconds
      setTimeout(() => {
        setAutoRotate(false);

        // Start next cycle after pause
        setTimeout(runCycle, pauseDuration);
      }, rotationDuration);
    };

    runCycle();

    // Cleanup on unmount
    return () => {
      setAutoRotate(false);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-[90vw] h-[90vh] max-w-6xl max-h-[800px] rounded-lg border border-slate-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: wireframe ? "#ffffff" : "rgb(15 23 42 / 0.9)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors border border-slate-600"
          aria-label="Close modal"
        >
          <X size={24} className="text-white" />
        </button>

        {/* Wireframe toggle button */}
        <button
          onClick={() => setWireframe(!wireframe)}
          className={`absolute top-4 right-20 z-10 p-2 rounded-lg transition-colors border ${
            wireframe
              ? "bg-blue-600/80 hover:bg-blue-500 border-blue-500"
              : "bg-slate-800/80 hover:bg-slate-700 border-slate-600"
          }`}
          aria-label="Toggle wireframe"
          title="Toggle wireframe view"
        >
          <Grid3x3 size={24} className="text-white" />
        </button>

        {/* Title */}
        <div className="absolute top-4 left-4 z-10">
          <h2 className="text-2xl font-bold text-white">Retro Rocket</h2>
          <p className="text-sm text-slate-400 mt-1">
            Click and drag to rotate • Scroll to zoom
          </p>
        </div>

        {/* Three.js Canvas */}
        <Canvas
          camera={{
            position: [5, 3, 8],
            fov: 50,
          }}
          gl={{
            antialias: true,
            alpha: false,
          }}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "0.5rem",
          }}
        >
          {/* Scene background color */}
          <SceneBackground color={wireframe ? "#ffffff" : "#000000"} />

          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} />
          <pointLight position={[0, 5, 5]} intensity={0.8} color="#60a5fa" />

          {/* Spaceship model */}
          <SpaceshipModel wireframe={wireframe} />

          {/* Interactive controls */}
          <OrbitControls
            enablePan={false}
            minDistance={4}
            maxDistance={20}
            autoRotate={autoRotate}
            autoRotateSpeed={0.4}
          />
        </Canvas>
      </div>
    </div>
  );
}
