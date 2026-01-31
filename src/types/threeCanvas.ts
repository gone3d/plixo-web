/**
 * Three.js Canvas Types
 * Type definitions for 3D animations and canvas components
 */

/**
 * Path Waypoint - A single point in 3D space
 */
export interface PathWaypoint {
  x: number;
  y: number;
  z: number;
}

/**
 * Path Configuration - Define path using three waypoints
 * The object follows a smooth curve through: start → apex → end
 */
export interface PathConfig {
  start: PathWaypoint; // Starting position
  apex: PathWaypoint; // Peak/midpoint of arc
  end: PathWaypoint; // Ending position
}
