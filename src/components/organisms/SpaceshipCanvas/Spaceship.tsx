/**
 * Spaceship Component
 *
 * Simple cylinder that arcs from offscreen, toward camera, then back away
 * Fades out when bounding box reaches ~5x5 pixels
 */

import { useRef, useState } from "react";
import { Group, Vector3, Box3, Quaternion } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import type { PathConfig } from "../../../types";
import { SpaceshipModel } from "./models";

interface SpaceshipProps {
  duration?: number; // Animation cycle duration in seconds
}

/**
 * Generate a random path configuration
 * Ensures object enters from offscreen, comes close to camera, exits far away
 */
function generateRandomPath(): PathConfig {
  // Random side entry (left or right)
  const enterFromLeft = Math.random() > 0.5;

  // Start: Offscreen at medium distance
  const startX = enterFromLeft
    ? -60 - Math.random() * 40
    : 60 + Math.random() * 40;
  const startY = -5 + Math.random() * 10; // Vary vertical entry
  const startZ = -30 - Math.random() * 20; // Medium to far

  // Apex: Near center, close to camera, elevated
  const apexX = -20 + Math.random() * 40; // Near center with variance
  const apexY = 3 + Math.random() * 7; // Elevated (3 to 10 units)
  const apexZ = -3 - Math.random() * 5; // Close to camera (-3 to -8)

  // End: Exit opposite side or continue same direction, much farther
  // If entered left, usually exit right (but not always)
  const exitRight = enterFromLeft ? Math.random() > 0.2 : Math.random() > 0.8;
  const endX = exitRight ? 80 + Math.random() * 80 : -80 - Math.random() * 80;
  const endY = -5 + Math.random() * 10; // Vary vertical exit
  const endZ = -100 - Math.random() * 100; // Very far (-100 to -200)

  return {
    start: { x: startX, y: startY, z: startZ },
    apex: { x: apexX, y: apexY, z: apexZ },
    end: { x: endX, y: endY, z: endZ },
  };
}

/**
 * Quadratic Bezier interpolation through 3 waypoints
 * Creates smooth arc from start → apex → end
 *
 * Formula: B(t) = (1-t)²·P0 + 2(1-t)t·P1 + t²·P2
 * where t = progress (0 to 1)
 */
function calculatePathPosition(progress: number, config: PathConfig): Vector3 {
  const { start, apex, end } = config;
  const t = progress;
  const oneMinusT = 1 - t;

  // Quadratic Bezier formula for each axis
  const x =
    oneMinusT * oneMinusT * start.x +
    2 * oneMinusT * t * apex.x +
    t * t * end.x;

  const y =
    oneMinusT * oneMinusT * start.y +
    2 * oneMinusT * t * apex.y +
    t * t * end.y;

  const z =
    oneMinusT * oneMinusT * start.z +
    2 * oneMinusT * t * apex.z +
    t * t * end.z;

  return new Vector3(x, y, z);
}

/**
 * Calculate velocity direction from position change
 */
function calculateVelocity(
  currentPos: Vector3,
  progress: number,
  config: PathConfig,
  deltaProgress: number = 0.01,
): Vector3 {
  const prevProgress = Math.max(0, progress - deltaProgress);
  const prevPos = calculatePathPosition(prevProgress, config);

  const velocity = new Vector3(
    currentPos.x - prevPos.x,
    currentPos.y - prevPos.y,
    currentPos.z - prevPos.z,
  );

  return velocity.normalize();
}

/**
 * Align group to direction vector
 * Rotates group so its Y-axis (length) points along the direction
 */
function alignGroupToDirection(group: Group, direction: Vector3): void {
  const up = new Vector3(0, 1, 0);
  const quaternion = new Quaternion();
  quaternion.setFromUnitVectors(up, direction);
  group.quaternion.copy(quaternion);
}

export function Spaceship({ duration = 10 }: SpaceshipProps) {
  const groupRef = useRef<Group>(null);
  const time = useRef(0);
  const [opacity, setOpacity] = useState(1);
  const { camera, size } = useThree();

  // Store current path config (generate new one each cycle)
  const pathConfig = useRef<PathConfig>(generateRandomPath());
  const lastCycleTime = useRef(0);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    // Increment time and calculate progress (0 to 1)
    time.current += delta;
    const t = (time.current % duration) / duration;

    // Check if we've started a new cycle - generate new random path
    const currentCycle = Math.floor(time.current / duration);
    if (currentCycle !== lastCycleTime.current) {
      pathConfig.current = generateRandomPath();
      lastCycleTime.current = currentCycle;
    }

    const progress = t; // Linear progression - constant velocity (no acceleration)

    // Calculate position along path
    const position = calculatePathPosition(progress, pathConfig.current);
    groupRef.current.position.copy(position);

    // Calculate velocity direction and align group
    const velocity = calculateVelocity(position, progress, pathConfig.current);
    alignGroupToDirection(groupRef.current, velocity);

    // Calculate screen-space bounding box size
    const box = new Box3().setFromObject(groupRef.current);
    const boxMin = box.min.clone().project(camera);
    const boxMax = box.max.clone().project(camera);

    // Convert normalized device coordinates to pixels
    const widthPx = Math.abs(((boxMax.x - boxMin.x) * size.width) / 2);
    const heightPx = Math.abs(((boxMax.y - boxMin.y) * size.height) / 2);
    const boundingBoxSize = Math.max(widthPx, heightPx);

    // Fade out when bounding box is <= 5 pixels
    if (boundingBoxSize <= 5) {
      const newOpacity = boundingBoxSize / 5; // Linear fade from 1 to 0
      setOpacity(Math.max(0, newOpacity));
    } else {
      setOpacity(1);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Retro rocket model with opacity control */}
      <group scale={[opacity, opacity, opacity]}>
        <SpaceshipModel />
      </group>
    </group>
  );
}
