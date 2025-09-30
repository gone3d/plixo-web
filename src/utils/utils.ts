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