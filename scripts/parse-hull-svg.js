/**
 * Parse SVG path and extract points for LatheGeometry
 * Run with: node scripts/parse-hull-svg.js
 */

// SVG path from hull3.svg Layer_3 (straight line version)
const pathData = "M0,0v657s14.67-6.6,14.67-6.6l21.08-22.4,23.06-35.57,22.4-44.8,21.74-57.97,14.49-63.24,3.29-32.28,3.29-47.43-3.29-52.04-16.47-96.18-28.99-117.26L45,0S0,1.98,0,0Z";

// SVG dimensions from viewBox
const svgWidth = 595.28;
const svgHeight = 841.89;

// Desired rocket height in Three.js units
const desiredHeight = 6.0;

// Parse the path data to extract points
// The path starts at (0,0) which is the centerline at bottom
const centerlineX = 0;

// Extract points from path commands
const svgPoints = [];
let currentX = 0;
let currentY = 0;

// Simple path parser for M, L, l, v commands
const commands = pathData.match(/[MLlvsSZ][^MLlvsSZ]*/g);

commands.forEach(cmd => {
  const type = cmd[0];
  // Better regex to handle negative numbers without separators (e.g., "21.08-22.4")
  const coordStr = cmd.slice(1).trim();
  const coords = coordStr.match(/-?[\d.]+/g)?.map(parseFloat) || [];

  if (type === 'M') {
    // Move to absolute
    currentX = coords[0];
    currentY = coords[1];
    svgPoints.push({ x: currentX, y: currentY });
  } else if (type === 'L') {
    // Line to absolute
    currentX = coords[0];
    currentY = coords[1];
    svgPoints.push({ x: currentX, y: currentY });
  } else if (type === 'l') {
    // Line to relative
    for (let i = 0; i < coords.length; i += 2) {
      currentX += coords[i];
      currentY += coords[i + 1];
      svgPoints.push({ x: currentX, y: currentY });
    }
  } else if (type === 'v') {
    // Vertical line relative
    currentY += coords[0];
    svgPoints.push({ x: currentX, y: currentY });
  } else if (type === 's' || type === 'S') {
    // For bezier curves, just use the end point
    if (type === 's') {
      // Relative smooth cubic bezier - last two coords are end point
      currentX += coords[coords.length - 2];
      currentY += coords[coords.length - 1];
    } else {
      // Absolute
      currentX = coords[coords.length - 2];
      currentY = coords[coords.length - 1];
    }
    svgPoints.push({ x: currentX, y: currentY });
  }
});

console.log(`// Extracted ${svgPoints.length} points from SVG path`);
console.log("// Points (X, Y):");
svgPoints.forEach((p, i) => {
  console.log(`//   ${i}: (${p.x.toFixed(2)}, ${p.y.toFixed(2)})`);
});

// Convert SVG coordinates to Three.js LatheGeometry format
// SVG: centerline at X=0, Y increases downward from top
// Three.js: radius from center, Y-axis (height), centered at origin
const scale = desiredHeight / svgHeight;

console.log("\n// Three.js LatheGeometry points for hull");
console.log("// Generated from hull3.svg with centerline at X=0");
console.log("const points: Vector2[] = [");

// Filter to get only unique points and sort by Y
const uniquePoints = svgPoints.filter((p, i, arr) =>
  i === 0 || p.x !== arr[i-1].x || p.y !== arr[i-1].y
);

// Sort by Y coordinate (top to bottom in SVG = bottom to top for rocket)
const sortedPoints = [...uniquePoints].sort((a, b) => b.y - a.y);

sortedPoints.forEach((point, i) => {
  // Convert coordinates:
  // - radius: Distance from centerline (SVG X - centerlineX)
  // - height: SVG Y coordinate, inverted and centered
  const radius = Math.abs(point.x - centerlineX) * scale;
  const height = ((svgHeight - point.y) * scale) - (desiredHeight / 2);

  const comment = i === 0 ? " // Bottom (base)" :
                  i === sortedPoints.length - 1 ? " // Top (nose)" :
                  "";

  console.log(`  new Vector2(${radius.toFixed(3)}, ${height.toFixed(3)}),${comment}`);
});

console.log("];");

console.log("\n// Stats:");
console.log(`// Original SVG: ${svgWidth} x ${svgHeight}`);
console.log(`// Centerline at X: ${centerlineX}`);
console.log(`// Total points extracted: ${svgPoints.length}`);
console.log(`// Unique points: ${uniquePoints.length}`);
console.log(`// Max radius from centerline: ${(Math.max(...svgPoints.map(p => Math.abs(p.x))) - centerlineX).toFixed(2)}`);
console.log(`// Scale factor: ${scale.toFixed(4)}`);
console.log(`// Three.js height: ${desiredHeight}`);
