/**
 * PathFollower Component
 *
 * Manages trajectory calculations and animation timing for objects following a curved path.
 * Provides position, rotation, opacity, and other state to child render function.
 * Allows different objects (spaceship, UFO, astronaut, etc.) to follow the same path logic.
 */

import { useRef, useState, type ReactNode } from "react";
import { Vector3, Box3, Quaternion, Group } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import type { PathConfig } from "../../../types";

interface PathFollowerProps {
  duration?: number; // Animation cycle duration in seconds
  delayBetweenCycles?: number; // Delay in seconds between animation cycles
  onPositionUpdate?: (position: {
    x: number;
    y: number;
    z: number;
    screenX: number;
    screenY: number;
  }) => void;
  onVisibilityChange?: (isVisible: boolean) => void;
  children: (state: PathFollowerState) => ReactNode;
}

export interface PathFollowerState {
  groupRef: React.RefObject<Group | null>;
  position: Vector3;
  velocity: Vector3;
  quaternion: Quaternion;
  opacity: number;
  isVisible: boolean;
  progress: number; // 0 to 1 through the animation
  warpFlashIntensity: number;
  flashPosition: Vector3;
}

/**
 * Generate a random path configuration
 * Ships can enter from any direction (including behind camera)
 * and exit on the opposite side, always leaving into the distance
 */
function generateRandomPath(): PathConfig {
  // Choose random entry direction (8 possibilities + behind camera)
  // 0=left, 1=right, 2=top, 3=bottom, 4=top-left, 5=top-right, 6=bottom-left, 7=bottom-right, 8=behind
  const entryDirection = Math.floor(Math.random() * 9);

  let startX = 0;
  let startY = 0;
  let startZ = 0;

  // Entry positions based on direction
  switch (entryDirection) {
    case 0: // Left
      startX = -60 - Math.random() * 40;
      startY = -10 + Math.random() * 20;
      startZ = -30 - Math.random() * 30;
      break;
    case 1: // Right
      startX = 60 + Math.random() * 40;
      startY = -10 + Math.random() * 20;
      startZ = -30 - Math.random() * 30;
      break;
    case 2: // Top
      startX = -20 + Math.random() * 40;
      startY = 40 + Math.random() * 30;
      startZ = -30 - Math.random() * 30;
      break;
    case 3: // Bottom
      startX = -20 + Math.random() * 40;
      startY = -40 - Math.random() * 30;
      startZ = -30 - Math.random() * 30;
      break;
    case 4: // Top-left
      startX = -60 - Math.random() * 40;
      startY = 40 + Math.random() * 30;
      startZ = -30 - Math.random() * 30;
      break;
    case 5: // Top-right
      startX = 60 + Math.random() * 40;
      startY = 40 + Math.random() * 30;
      startZ = -30 - Math.random() * 30;
      break;
    case 6: // Bottom-left
      startX = -60 - Math.random() * 40;
      startY = -40 - Math.random() * 30;
      startZ = -30 - Math.random() * 30;
      break;
    case 7: // Bottom-right
      startX = 60 + Math.random() * 40;
      startY = -40 - Math.random() * 30;
      startZ = -30 - Math.random() * 30;
      break;
    case 8: // Behind camera (positive Z)
      startX = -30 + Math.random() * 60;
      startY = -20 + Math.random() * 40;
      startZ = 20 + Math.random() * 40; // Behind camera (positive Z)
      break;
  }

  // Apex: Near center, close to camera, slightly elevated
  const apexX = -20 + Math.random() * 40; // Near center with variance
  const apexY = 0 + Math.random() * 10; // Slightly elevated (0 to 10 units)
  const apexZ = -5 - Math.random() * 5; // Close to camera (-5 to -10)

  // Exit: Opposite side from entry, always far away (negative Z)
  let endX = 0;
  let endY = 0;

  switch (entryDirection) {
    case 0: // Entered left → exit right
      endX = 80 + Math.random() * 80;
      endY = -10 + Math.random() * 20;
      break;
    case 1: // Entered right → exit left
      endX = -80 - Math.random() * 80;
      endY = -10 + Math.random() * 20;
      break;
    case 2: // Entered top → exit bottom
      endX = -20 + Math.random() * 40;
      endY = -80 - Math.random() * 80;
      break;
    case 3: // Entered bottom → exit top
      endX = -20 + Math.random() * 40;
      endY = 80 + Math.random() * 80;
      break;
    case 4: // Entered top-left → exit bottom-right
      endX = 80 + Math.random() * 80;
      endY = -80 - Math.random() * 80;
      break;
    case 5: // Entered top-right → exit bottom-left
      endX = -80 - Math.random() * 80;
      endY = -80 - Math.random() * 80;
      break;
    case 6: // Entered bottom-left → exit top-right
      endX = 80 + Math.random() * 80;
      endY = 80 + Math.random() * 80;
      break;
    case 7: // Entered bottom-right → exit top-left
      endX = -80 - Math.random() * 80;
      endY = 80 + Math.random() * 80;
      break;
    case 8: // Entered from behind → exit forward into distance
      endX = -40 + Math.random() * 80;
      endY = -20 + Math.random() * 40;
      break;
  }

  // Always exit far away into the distance (negative Z)
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
 * Align quaternion to direction vector
 * Rotates so Y-axis (length) points along the direction
 */
function calculateQuaternion(direction: Vector3): Quaternion {
  const up = new Vector3(0, 1, 0);
  const quaternion = new Quaternion();
  quaternion.setFromUnitVectors(up, direction);
  return quaternion;
}

export function PathFollower({
  duration = 15,
  delayBetweenCycles = 10,
  onPositionUpdate,
  onVisibilityChange,
  children,
}: PathFollowerProps) {
  const groupRef = useRef<Group>(null);
  const time = useRef(0);
  const [, setOpacity] = useState(1);
  const { camera, size } = useThree();

  // Store current path config (generate new one each cycle)
  const pathConfig = useRef<PathConfig>(generateRandomPath());
  const lastCycleTime = useRef(0);
  const wasVisible = useRef(true);

  // Warp flash effect
  const [, setWarpFlashIntensity] = useState(0);
  const warpFlashTimer = useRef(10); // Start disabled (> 2.0)
  const [flashPosition, setFlashPosition] = useState(new Vector3());

  // Current state to pass to children
  const [currentState, setCurrentState] = useState<PathFollowerState>({
    groupRef,
    position: new Vector3(),
    velocity: new Vector3(0, 1, 0),
    quaternion: new Quaternion(),
    opacity: 1,
    isVisible: true,
    progress: 0,
    warpFlashIntensity: 0,
    flashPosition: new Vector3(),
  });

  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    // Increment time
    time.current += delta;

    // Total cycle time = animation duration + delay
    const totalCycleTime = duration + delayBetweenCycles;
    const timeInCycle = time.current % totalCycleTime;

    // Check if we've started a new cycle - generate new random path
    const currentCycle = Math.floor(time.current / totalCycleTime);
    if (currentCycle !== lastCycleTime.current) {
      pathConfig.current = generateRandomPath();
      lastCycleTime.current = currentCycle;
    }

    // Check if we're in the delay period
    const isVisible = timeInCycle < duration;

    // Notify parent of visibility change and trigger warp flash
    if (isVisible !== wasVisible.current) {
      wasVisible.current = isVisible;
      if (onVisibilityChange) {
        onVisibilityChange(isVisible);
      }

      if (!isVisible) {
        // Trigger warp flash when transitioning to invisible
        warpFlashTimer.current = 0;
        // Store position for warp flash effect at the moment of disappearing
        setFlashPosition(groupRef.current.position.clone());
      } else {
        // Reset flash timer when becoming visible again
        warpFlashTimer.current = 10; // Set to value > 2.0 to disable flash
      }
    }

    // Calculate current warp flash intensity (2 second duration)
    let currentFlashIntensity = 0;
    if (warpFlashTimer.current < 2.0) {
      warpFlashTimer.current += delta;
      const fadeProgress = Math.min(warpFlashTimer.current / 2.0, 1); // 2 second fade
      currentFlashIntensity = 1 - fadeProgress;
    }
    setWarpFlashIntensity(currentFlashIntensity);

    if (!isVisible) {
      // During delay: hide object and don't update position
      setOpacity(0);

      // Update state for children - continue to update flash intensity during fade
      setCurrentState({
        groupRef,
        position: groupRef.current.position.clone(),
        velocity: new Vector3(0, 1, 0),
        quaternion: groupRef.current.quaternion.clone(),
        opacity: 0,
        isVisible: false,
        progress: 1,
        warpFlashIntensity: currentFlashIntensity,
        flashPosition: flashPosition,
      });

      return;
    }

    // During animation: calculate progress (0 to 1)
    const progress = timeInCycle / duration;

    // Calculate position along path
    const position = calculatePathPosition(progress, pathConfig.current);
    groupRef.current.position.copy(position);

    // Calculate screen-space coordinates (normalized device coordinates to pixels)
    const screenPos = position.clone().project(camera);
    const screenX = Math.round(((screenPos.x + 1) * size.width) / 2);
    const screenY = Math.round(((-screenPos.y + 1) * size.height) / 2);

    // Report position to parent component
    if (onPositionUpdate) {
      onPositionUpdate({
        x: position.x,
        y: position.y,
        z: position.z,
        screenX,
        screenY,
      });
    }

    // Calculate velocity direction and quaternion
    const velocity = calculateVelocity(position, progress, pathConfig.current);
    const quaternion = calculateQuaternion(velocity);
    groupRef.current.quaternion.copy(quaternion);

    // Only apply distance-based fading after the object is fully visible
    // Skip at the very start of the cycle (first 2% of progress) to avoid bounding box issues with scale
    let currentOpacity = 1;
    if (progress > 0.02) {
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
        currentOpacity = Math.max(0, boundingBoxSize / 5); // Linear fade from 1 to 0
      }
    }

    setOpacity(currentOpacity);

    // Update state for children
    setCurrentState({
      groupRef,
      position: position.clone(),
      velocity: velocity.clone(),
      quaternion: quaternion.clone(),
      opacity: currentOpacity,
      isVisible: true,
      progress,
      warpFlashIntensity: currentFlashIntensity,
      flashPosition,
    });
  });

  return <>{children(currentState)}</>;
}
