import { useState, useEffect } from 'react';
import { Icon } from '../atoms';
import { maintenanceService, type MaintenanceMode } from '../../services/maintenance';

/**
 * Format uptime duration as human-readable string
 */
function formatUptime(seconds: number): string {
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

interface MaintenanceBannerProps {
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * MaintenanceBanner Component
 *
 * Displays a maintenance mode banner with:
 * - Maintenance status message
 * - Live uptime/downtime timer
 * - Optional estimated completion time
 *
 * The timer updates every second to show accurate duration.
 */
export const MaintenanceBanner = ({ className = '' }: MaintenanceBannerProps) => {
  const [maintenanceStatus, setMaintenanceStatus] = useState<MaintenanceMode | null>(null);
  const [uptime, setUptime] = useState<string>('');
  const [timerLabel, setTimerLabel] = useState<string>('');

  // Fetch maintenance status from API on mount
  useEffect(() => {
    const fetchStatus = async () => {
      const status = await maintenanceService.getStatus();
      setMaintenanceStatus(status);
    };

    fetchStatus();
  }, []);

  // Update uptime every second
  useEffect(() => {
    if (!maintenanceStatus) return;

    const calculateUptime = () => {
      const startTime = maintenanceStatus.startedAt
        ? new Date(maintenanceStatus.startedAt)
        : new Date();
      const now = new Date();
      const seconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);

      setUptime(formatUptime(seconds));
      setTimerLabel(maintenanceStatus.enabled ? 'Downtime' : 'Uptime');
    };

    calculateUptime();
    const interval = setInterval(calculateUptime, 1000);

    return () => clearInterval(interval);
  }, [maintenanceStatus]);

  // Don't render until we have status
  if (!maintenanceStatus) {
    return null;
  }

  const isMaintenanceMode = maintenanceStatus.enabled;

  return (
    <div
      className={`
        bg-slate-800/40 backdrop-blur-sm
        border rounded-xl p-8
        shadow-lg
        ${isMaintenanceMode
          ? 'border-orange-500/50 hover:border-orange-400/70 shadow-orange-500/10'
          : 'border-green-500/50 hover:border-green-400/70 shadow-green-500/10'
        }
        transition-all duration-300
        ${className}
      `}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Title with Icons on Both Sides */}
        <div className="flex items-center gap-4">
          <Icon
            name={isMaintenanceMode ? 'construction' : 'activity'}
            size="xl"
            className={`${isMaintenanceMode ? 'text-orange-400' : 'text-green-400'} flex-shrink-0`}
          />
          <h3
            className={`
              text-3xl font-bold tracking-tight
              ${isMaintenanceMode ? 'text-orange-300' : 'text-green-300'}
            `}
          >
            {isMaintenanceMode ? 'Under Active Maintenance' : 'System Online'}
          </h3>
          <Icon
            name={isMaintenanceMode ? 'construction' : 'activity'}
            size="xl"
            className={`${isMaintenanceMode ? 'text-orange-400' : 'text-green-400'} flex-shrink-0`}
          />
        </div>

        {/* Timer - Large time, then label below (vertically centered) */}
        <div className="flex flex-col items-center gap-1">
          <span
            className={`
              text-4xl font-mono font-bold tracking-wider
              ${isMaintenanceMode ? 'text-orange-300' : 'text-green-300'}
            `}
          >
            {uptime}
          </span>
          <span className="text-sm font-medium text-white/60 uppercase tracking-wide">
            {timerLabel}
          </span>
        </div>

        {/* Message */}
        {maintenanceStatus.message && (
          <p className="text-white/70 text-base text-center max-w-md">
            {maintenanceStatus.message}
          </p>
        )}

        {/* Call to Action */}
        {isMaintenanceMode && (
          <p className="text-white/50 text-sm text-center">
            Please Come Back Soon
          </p>
        )}
      </div>
    </div>
  );
};
