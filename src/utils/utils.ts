// Utility Functions - General purpose helpers
// Phase 2: Core utility functions

/**
 * Creates a randomly shuffled array of integers from 0 to num-1
 * Uses Fisher-Yates shuffle algorithm for uniform distribution
 *
 * @param num - The length of the array and upper bound (exclusive)
 * @returns Array of integers from 0 to num-1 in random order
 *
 * @example
 * shuffleOrder(5) // might return [2, 0, 4, 1, 3]
 * shuffleOrder(3) // might return [1, 2, 0]
 */
export function shuffleOrder(num: number): number[] {
  if (num <= 0) {
    return []
  }

  if (num === 1) {
    return [0]
  }

  // Create array with sequential integers from 0 to num-1
  const array = Array.from({ length: num }, (_, index) => index)

  // Fisher-Yates shuffle algorithm
  // Start from the last element and swap with a random element before it
  for (let i = array.length - 1; i > 0; i--) {
    // Generate random index from 0 to i (inclusive)
    const randomIndex = Math.floor(Math.random() * (i + 1))

    // Swap elements at i and randomIndex
    const temp = array[i]
    array[i] = array[randomIndex]
    array[randomIndex] = temp
  }

  return array
}

/**
 * Calculate color based on percentage of maximum value
 * Used for choropleth map visualizations (geographic distribution)
 * Relative scale: top 20% gets highest color, etc.
 *
 * @param count - The count value for this region
 * @param max - The maximum count across all regions
 * @returns Hex color code for the choropleth visualization
 *
 * @example
 * getColorForCount(0, 100) // "#1e293b" (no data - slate-800)
 * getColorForCount(10, 100) // "#0ea5e9" (bottom 20% - sky-500)
 * getColorForCount(50, 100) // "#6366f1" (40-60% - indigo-500)
 * getColorForCount(90, 100) // "#9333ea" (top 20% - purple-600)
 */
export function getColorForCount(count: number, max: number): string {
  if (count === 0 || max === 0) return "#1e293b"; // slate-800 (no data)

  const percentOfMax = (count / max) * 100;

  switch (true) {
    case percentOfMax >= 80:
      return "#9333ea"; // purple-600 (top 20%)
    case percentOfMax >= 60:
      return "#8b5cf6"; // violet-500
    case percentOfMax >= 40:
      return "#6366f1"; // indigo-500
    case percentOfMax >= 20:
      return "#3b82f6"; // blue-500
    default:
      return "#0ea5e9"; // sky-500 (bottom 20%)
  }
}