/**
 * 3D Utilities for Three.js and visualization
 */

/**
 * Calculate targeting circle color based on delta Z velocity
 *
 * Maps delta Z (-100 to 100) to color:
 * - Negative Z: Red shift
 * - Zero (stationary): White
 * - Positive Z: Blue shift
 *
 * @param deltaZ - Change in Z position (-100 to 100)
 * @returns RGB color string (e.g., "rgb(255, 200, 200)")
 */
export function getTargetingColor(deltaZ: number): string {
  // Clamp deltaZ to -100 to 100 range
  const clampedDelta = Math.max(-100, Math.min(100, deltaZ));

  // Normalize to -1 to 1 range
  const normalized = clampedDelta / 100;

  if (normalized < 0) {
    // Negative Z: Shift from white (255,255,255) to red (255,100,0)
    const intensity = Math.abs(normalized);
    const r = 255; // Full red
    const g = Math.round(255 * (1 - intensity * 0.6)); // Slight reduction in green
    const b = Math.round(255 * (1 - intensity)); // Reduce blue
    return `rgb(${r}, ${g}, ${b})`;
  } else if (normalized > 0) {
    // Positive Z: Shift from white (255,255,255) to blue (0,100,255)
    const intensity = normalized;
    const r = Math.round(255 * (1 - intensity));
    const g = Math.round(255 * (1 - intensity * 0.6)); // Slight reduction in green
    const b = 255; // Full blue
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Stationary: White
    return 'rgb(255, 255, 255)';
  }
}

/**
 * Calculate horizontal azimuth (φ - phi)
 *
 * Angle in the XZ plane measured from the positive Z-axis
 * Returns 0-360° range (0° = forward, 90° = right, 180° = back, 270° = left)
 *
 * @param x - X position
 * @param z - Z position
 * @returns Azimuth angle in degrees (0 to 360)
 */
export function calculateAzimuth(x: number, z: number): number {
  // atan2(x, z) gives angle from Z-axis in radians
  // Convert to degrees
  const radians = Math.atan2(x, z);
  let degrees = radians * (180 / Math.PI);

  // Convert from -180/180 range to 0-360 range
  if (degrees < 0) {
    degrees += 360;
  }

  return Math.floor(degrees);
}

/**
 * Calculate vertical elevation (θ - theta)
 *
 * Angle from horizontal XZ plane (camera level)
 * Returns -90 to 90° range:
 * - 0° = horizontal at camera level
 * - 90° = straight up (+Y)
 * - -90° = straight down (-Y)
 *
 * @param x - X position
 * @param y - Y position
 * @param z - Z position
 * @returns Elevation angle in degrees (-90 to 90)
 */
export function calculateElevation(x: number, y: number, z: number): number {
  // Calculate distance in the horizontal XZ plane
  const horizontalDistance = Math.sqrt(x * x + z * z);

  // Calculate angle from horizontal plane
  // atan2(-y, horizontalDistance) gives elevation angle
  // Negative y because positive y is up in 3D space
  const radians = Math.atan2(-y, horizontalDistance);
  const degrees = radians * (180 / Math.PI);

  // Use floor for all values
  return Math.floor(degrees);
}

/**
 * Tick mark coordinate data
 */
export interface TickMarkData {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/**
 * Generate tick marks for arc displays
 *
 * Creates evenly distributed tick marks along an arc segment
 * Used for azimuth and elevation angle displays
 *
 * @param centerX - Center X coordinate
 * @param centerY - Center Y coordinate
 * @param radius - Arc radius
 * @param numTicks - Number of tick marks to generate
 * @param tickLength - Length of each tick mark
 * @param arcSpan - Arc span in degrees (e.g., 90 or 180)
 * @param rotationOffset - Rotation offset in degrees (default 0)
 * @param direction - Direction of ticks: 'outward' or 'inward' (default 'outward')
 * @returns Array of tick mark coordinates
 */
export function generateArcTickMarks(
  centerX: number,
  centerY: number,
  radius: number,
  numTicks: number,
  tickLength: number,
  arcSpan: number,
  rotationOffset: number = 0,
  direction: 'inward' | 'outward' = 'outward'
): TickMarkData[] {
  const tickMarks: TickMarkData[] = [];
  const toRadians = (deg: number) => (deg * Math.PI) / 180;

  for (let i = 0; i < numTicks; i++) {
    // Distribute along the arc
    const tickAngle = (i / (numTicks - 1)) * arcSpan;
    const rotatedAngle = tickAngle + rotationOffset;
    const tickRad = toRadians(rotatedAngle);

    // Calculate base position on the arc
    const arcX = centerX + radius * Math.cos(tickRad);
    const arcY = centerY + radius * Math.sin(tickRad);

    // Calculate tick end position based on direction
    const tickEndRadius = direction === 'outward' ? radius + tickLength : radius - tickLength;
    const tickEndX = centerX + tickEndRadius * Math.cos(tickRad);
    const tickEndY = centerY + tickEndRadius * Math.sin(tickRad);

    tickMarks.push({
      x1: arcX,
      y1: arcY,
      x2: tickEndX,
      y2: tickEndY,
    });
  }

  return tickMarks;
}
