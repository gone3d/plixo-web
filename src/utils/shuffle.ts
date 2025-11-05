/**
 * Fisher-Yates shuffle algorithm for randomizing image display sequence
 * Based on tenebrae-web implementation
 */

/**
 * Shuffles an array of numbers using Fisher-Yates algorithm
 * Creates a randomized sequence from 0 to n-1
 * @param length - Number of items in sequence
 * @returns Array of shuffled integers from 0 to length-1
 */
export function createShuffledSequence(length: number): number[] {
  // Create array [0, 1, 2, ..., length-1]
  const sequence = Array.from({ length }, (_, i) => i);

  // Fisher-Yates shuffle
  for (let i = sequence.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
  }

  return sequence;
}

/**
 * Creates a linear sequence [0, 1, 2, ..., n-1]
 * Used for initial load before first shuffle
 * @param length - Number of items in sequence
 * @returns Array of integers from 0 to length-1 in order
 */
export function createLinearSequence(length: number): number[] {
  return Array.from({ length }, (_, i) => i);
}
