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
  generateArcTickMarks,
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

  // Rotation state for HUD detail arcs (counter-clockwise)
  const [hudRotation, setHudRotation] = useState(0);

  // Animate HUD detail arcs rotation
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      // Rotate counter-clockwise at 10 degrees per second
      setHudRotation((prev) => (prev - deltaTime * 10) % 360);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Calculate azimuth (φ) and elevation (θ)
  const azimuth = calculateAzimuth(position.x, position.z);
  const elevation = calculateElevation(position.x, position.y, position.z);

  // Use angles directly for rotation (they're already numbers)
  const azimuthDegrees = azimuth;
  const elevationDegrees = elevation;

  // Helper function to create a quarter circle arc path
  const createArcPath = (
    centerX: number,
    centerY: number,
    radius: number,
    startAngle: number,
  ) => {
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
  const elevationArcPath = createArcPath(
    150,
    150,
    innerRadius,
    elevationDegrees,
  );

  // Helper function to calculate text position using clock-based positioning
  // The tab line acts as a clock hand pointing to the angle
  // Text is positioned radially from that point
  const calculateTextPosition = (
    angle: number,
    radius: number,
    centerX: number,
    centerY: number,
    label: string,
    isInnerArc: boolean = false,
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
  const azimuthTextInfo = calculateTextPosition(
    azimuthDegrees,
    outerRadius,
    150,
    150,
    "φ",
    false,
  ); // outer arc
  const elevationTextInfo = calculateTextPosition(
    elevationDegrees,
    innerRadius,
    150,
    150,
    "θ",
    true,
  ); // inner arc

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

        {/* HUD Detail Arcs - Three 60° segments at 0°, 120°, 240° */}
        {/* These are positioned outside the main circle and follow its curvature */}
        {[0, 120, 240].map((angle) => {
          // Calculate the arc path for a 60° segment outside the angle displays
          // Inner radius: 90px (just outside outer angle arc at 88px)
          // Outer radius: 103px
          const innerRadius = 100;
          const outerRadius = 113;
          const startAngle = -30; // Start 30° before the center position
          const endAngle = 30; // End 30° after (total 60°)

          const toRadians = (deg: number) => (deg * Math.PI) / 180;

          // Calculate arc endpoints
          const x1 = 150 + innerRadius * Math.cos(toRadians(startAngle));
          const y1 = 150 + innerRadius * Math.sin(toRadians(startAngle));
          const x2 = 150 + outerRadius * Math.cos(toRadians(startAngle));
          const y2 = 150 + outerRadius * Math.sin(toRadians(startAngle));
          const x3 = 150 + outerRadius * Math.cos(toRadians(endAngle));
          const y3 = 150 + outerRadius * Math.sin(toRadians(endAngle));
          const x4 = 150 + innerRadius * Math.cos(toRadians(endAngle));
          const y4 = 150 + innerRadius * Math.sin(toRadians(endAngle));

          // Create path: outer arc, line, inner arc (reversed), close
          const arcPath = `
            M ${x1},${y1}
            L ${x2},${y2}
            A ${outerRadius},${outerRadius} 0 0 1 ${x3},${y3}
            L ${x4},${y4}
            A ${innerRadius},${innerRadius} 0 0 0 ${x1},${y1}
            Z
          `;

          return (
            <g key={angle} transform={`rotate(${angle + hudRotation} 150 150)`}>
              <path
                d={arcPath}
                fill="none"
                stroke={circleColor}
                strokeWidth="0.5"
                opacity="0.7"
              />
            </g>
          );
        })}

        {/* Tick marks in the gaps between arcs - rotating with HUD */}
        {/* Gaps are 60° each, located at 30-90°, 150-210°, 270-330° */}
        {[60, 180, 300].map((gapCenter) => {
          const gapTickMarks = [];
          const numTicks = 15;
          const gapStart = -30; // Start 30° before center
          const gapEnd = 30; // End 30° after center (60° total)
          const tickLength = 6.5; // Half of arc band width (13px / 2)
          const tickOuterRadius = 113; // Same as arc outer radius
          const tickInnerRadius = tickOuterRadius - tickLength;

          const toRadians = (deg: number) => (deg * Math.PI) / 180;

          for (let i = 0; i < numTicks; i++) {
            const tickAngle =
              gapStart + (gapEnd - gapStart) * (i / (numTicks - 1));
            const tickRad = toRadians(tickAngle);

            // Tick goes from outside inward
            const tickOuterX = 150 + tickOuterRadius * Math.cos(tickRad);
            const tickOuterY = 150 + tickOuterRadius * Math.sin(tickRad);
            const tickInnerX = 150 + tickInnerRadius * Math.cos(tickRad);
            const tickInnerY = 150 + tickInnerRadius * Math.sin(tickRad);

            gapTickMarks.push(
              <line
                key={`gap-tick-${gapCenter}-${i}`}
                x1={tickOuterX}
                y1={tickOuterY}
                x2={tickInnerX}
                y2={tickInnerY}
                stroke={circleColor}
                strokeWidth="0.5"
                opacity="0.8"
              />,
            );
          }

          return (
            <g
              key={`gap-${gapCenter}`}
              transform={`rotate(${gapCenter + hudRotation} 150 150)`}
            >
              {gapTickMarks}
            </g>
          );
        })}

        {/* Outer arc for Azimuth (φ) */}
        <path
          d={azimuthArcPath}
          fill="none"
          stroke={circleColor}
          strokeWidth="2"
          opacity="0.9"
        />

        {/* Azimuth arc tick marks - going outward (opposite of tab) */}
        <g transform={`rotate(${azimuthDegrees} 150 150)`}>
          {generateArcTickMarks(
            150,
            150,
            outerRadius,
            20,
            8,
            120,
            90,
            "outward",
          ).map((tick, i) => (
            <line
              key={`azimuth-tick-${i}`}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke={circleColor}
              strokeWidth="0.75"
              opacity="0.8"
            />
          ))}
        </g>

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
          <tspan fill="#60a5fa" fontWeight="900" fontSize="18">
            {azimuthTextInfo.symbol}
          </tspan>
        </text>

        {/* Inner arc for Elevation (θ) */}
        <path
          d={elevationArcPath}
          fill="none"
          stroke={circleColor}
          strokeWidth="2"
          opacity="0.9"
        />

        {/* Elevation arc tick marks - inward */}
        <g transform={`rotate(${elevationDegrees} 150 150)`}>
          {generateArcTickMarks(
            150,
            150,
            innerRadius,
            20,
            8,
            120,
            90,
            "inward",
          ).map((tick, i) => (
            <line
              key={`elevation-tick-${i}`}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke={circleColor}
              strokeWidth="0.5"
              opacity="0.6"
            />
          ))}
        </g>

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
          <tspan fill="#22c55e" fontWeight="900" fontSize="18">
            {elevationTextInfo.symbol}
          </tspan>
        </text>
      </svg>
    </div>
  );
}
