/**
 * TargetingCircle Component
 *
 * 2D HUD overlay showing spaceship position and velocity
 * - Circle on left side of screen
 * - Line extending to the right with coordinates
 * - x•y•z format for position
 * - Delta Z (velocity) displayed as integer
 */

import { useRef, useEffect, useState } from "react";
import {
  getTargetingColor,
  calculateAzimuth,
  calculateElevation,
} from "../../../utils/threeD";

interface TargetingCircleProps {
  position?: {
    x: number;
    y: number;
    z: number;
    screenX: number;
    screenY: number;
  };
  isVisible?: boolean;
}

export function TargetingCircle({
  position = { x: 0, y: 0, z: 0, screenX: 0, screenY: 0 },
  isVisible = true,
}: TargetingCircleProps) {
  const [deltaZ, setDeltaZ] = useState(0);
  const previousZ = useRef(position.z);

  useEffect(() => {
    // Calculate delta Z (change in Z position)
    const delta = position.z - previousZ.current;
    previousZ.current = position.z;

    // Update delta Z (multiply by 100 and convert to integer)
    setDeltaZ(Math.round(delta * 100));
  }, [position.z]);

  // Calculate color based on delta Z
  const circleColor = getTargetingColor(deltaZ);

  /* Round position values for display - legacy display, might use in the future
  const roundedX = Math.round(position.x);
  const roundedY = Math.round(position.y);
  const roundedZ = Math.round(position.z);

  // add in jsx below with theta and phi
    <div>
      {roundedX}•{roundedY}•{roundedZ}
    </div>
  */

  // Calculate azimuth (φ) and elevation (θ)
  const azimuth = calculateAzimuth(position.x, position.z);
  const elevation = calculateElevation(position.x, position.y, position.z);

  // Use angles directly for rotation (they're already numbers)
  const azimuthDegrees = azimuth;
  const elevationDegrees = elevation;

  // Helper function to create a quarter circle arc path
  const createArcPath = (centerX: number, centerY: number, radius: number, startAngle: number) => {
    // Convert to radians
    const start = (startAngle * Math.PI) / 180;
    const end = ((startAngle + 90) * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(start);
    const y1 = centerY + radius * Math.sin(start);
    const x2 = centerX + radius * Math.cos(end);
    const y2 = centerY + radius * Math.sin(end);

    return `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;
  };

  // Outer arc for azimuth (φ) - closer to main circle
  const outerRadius = 88;
  const azimuthArcPath = createArcPath(150, 150, outerRadius, azimuthDegrees);

  // Inner arc for elevation (θ) - closer to main circle
  const innerRadius = 70;
  const elevationArcPath = createArcPath(150, 150, innerRadius, elevationDegrees);

  // Helper function to calculate text position using clock-based positioning
  // The tab line acts as a clock hand pointing to the angle
  // Text is positioned radially from that point
  const calculateTextPosition = (
    angle: number,
    radius: number,
    centerX: number,
    centerY: number,
    label: string,
    isInnerArc: boolean = false
  ): {
    x: number;
    y: number;
    textAnchor: "start" | "end" | "middle";
    value: string;
    symbol: string;
  } => {
    // Normalize angle to 0-360 for position calculations
    const normalizedAngle = ((angle % 360) + 360) % 360;

    // Add 90 degrees to match the rotation transform (clock starts at top, angles start at right)
    const rotatedAngle = normalizedAngle + 90;
    const angleInRadians = (rotatedAngle * Math.PI) / 180;

    // Text offset distance from center
    // Inner arc: text goes INWARD (closer to center than the arc)
    // Outer arc: text goes OUTWARD (further from center than the arc)
    const textOffset = 14;
    const textRadius = isInnerArc ? radius - textOffset : radius + textOffset;

    // Calculate text position radially at the angle (like clock hand)
    const textX = centerX + textRadius * Math.cos(angleInRadians);
    const textY = centerY + textRadius * Math.sin(angleInRadians) + 4; // +4 for vertical centering

    return {
      x: textX,
      y: textY,
      textAnchor: "middle", // Always center the text on the radial line
      value: `${angle}`,
      symbol: label,
    };
  };

  // Calculate text positions for both angles
  const azimuthTextInfo = calculateTextPosition(azimuthDegrees, outerRadius, 150, 150, "φ", false); // outer arc
  const elevationTextInfo = calculateTextPosition(elevationDegrees, innerRadius, 150, 150, "θ", true); // inner arc

  return (
    <div
      style={{
        position: "fixed",
        left: `${position.screenX - 150}px`,
        top: `${position.screenY - 150}px`,
        pointerEvents: "none",
        zIndex: 1,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.5s ease-in-out",
      }}
    >
      <svg width="300" height="300" viewBox="0 0 300 300">
        {/* Main circle */}
        <circle
          cx="150"
          cy="150"
          r="80"
          fill="none"
          stroke={circleColor}
          strokeWidth="1"
          opacity="0.7"
        />

        {/* Outer arc for Azimuth (φ) */}
        <path
          d={azimuthArcPath}
          fill="none"
          stroke={circleColor}
          strokeWidth="2"
          opacity="0.9"
        />

        {/* Azimuth arc end tab */}
        <g transform={`rotate(${azimuthDegrees + 90} 150 150)`}>
          <line
            x1={150 + outerRadius}
            y1="150"
            x2={150 + outerRadius + 8}
            y2="150"
            stroke={circleColor}
            strokeWidth="2"
            opacity="0.9"
          />
        </g>

        {/* Azimuth label - rendered outside rotation */}
        <text
          x={azimuthTextInfo.x}
          y={azimuthTextInfo.y}
          fill={circleColor}
          fontSize="14"
          opacity="0.9"
          textAnchor={azimuthTextInfo.textAnchor}
        >
          <tspan>{azimuthTextInfo.value} </tspan>
          <tspan fill="#60a5fa" fontWeight="900" fontSize="18">{azimuthTextInfo.symbol}</tspan>
        </text>

        {/* Inner arc for Elevation (θ) */}
        <path
          d={elevationArcPath}
          fill="none"
          stroke={circleColor}
          strokeWidth="2"
          opacity="0.9"
        />

        {/* Elevation arc end tab */}
        <g transform={`rotate(${elevationDegrees + 90} 150 150)`}>
          <line
            x1={150 + innerRadius}
            y1="150"
            x2={150 + innerRadius - 8}
            y2="150"
            stroke={circleColor}
            strokeWidth="2"
            opacity="0.9"
          />
        </g>

        {/* Elevation label - rendered outside rotation */}
        <text
          x={elevationTextInfo.x}
          y={elevationTextInfo.y}
          fill={circleColor}
          fontSize="14"
          opacity="0.9"
          textAnchor={elevationTextInfo.textAnchor}
        >
          <tspan>{elevationTextInfo.value} </tspan>
          <tspan fill="#22c55e" fontWeight="900" fontSize="18">{elevationTextInfo.symbol}</tspan>
        </text>

      </svg>
    </div>
  );
}
