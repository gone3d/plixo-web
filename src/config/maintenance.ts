/**
 * Maintenance Mode Configuration
 *
 * Controls the maintenance mode display on the landing page.
 * When enabled, the app shows a maintenance banner instead of login options.
 */

export interface MaintenanceConfig {
  /**
   * Whether maintenance mode is currently active
   */
  enabled: boolean;

  /**
   * The timestamp when the current deployment went live (ISO 8601)
   * Used to calculate uptime/downtime duration
   *
   * Update this timestamp every time you deploy:
   * - New Date().toISOString() → "2025-12-02T15:30:00.000Z"
   * - Or use a specific time when you know deployment will happen
   */
  deploymentTime: string;

  /**
   * Optional: Custom message to display during maintenance
   */
  message?: string;

  /**
   * Optional: Estimated time when maintenance will complete
   */
  estimatedCompletion?: string;
}

/**
 * Maintenance configuration
 *
 * To enable maintenance mode:
 * 1. Set enabled: true
 * 2. Update deploymentTime to current timestamp
 * 3. Optionally set a custom message
 *
 * To disable maintenance mode:
 * 1. Set enabled: false
 * 2. Update deploymentTime to the time you brought the app back up
 */
export const maintenanceConfig: MaintenanceConfig = {
  // Toggle this to enable/disable maintenance mode
  // NOTE: This will be replaced by API-driven maintenance mode
  enabled: false,

  // Update this timestamp on every deployment
  // This is when the app was last deployed/started
  deploymentTime: '2025-12-02T17:30:00.000Z',

  // Optional: Custom message
  message: undefined,

  // Optional: Estimated completion time
  estimatedCompletion: undefined,
};

/**
 * Calculate uptime in seconds since deployment
 */
export function getUptimeSeconds(): number {
  const deploymentDate = new Date(maintenanceConfig.deploymentTime);
  const now = new Date();
  return Math.floor((now.getTime() - deploymentDate.getTime()) / 1000);
}

/**
 * Format uptime duration as human-readable string
 * Examples: "2m 34s", "1h 23m", "2d 5h"
 */
export function formatUptime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  const days = Math.floor(hours / 24);
  const hrs = hours % 24;
  return `${days}d ${hrs}h`;
}

/**
 * Get the display label for the timer
 * Returns "Uptime" when not in maintenance, "Downtime" when in maintenance
 */
export function getTimerLabel(): string {
  return maintenanceConfig.enabled ? 'Downtime' : 'Uptime';
}
