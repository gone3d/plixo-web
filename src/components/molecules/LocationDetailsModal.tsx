import { useState, useEffect } from "react";
import Modal from "./Modal";
import { Icon, LoadingSpinner, Button } from "../atoms";
import { EventsChartComponent } from "./EventsChartComponent";
import { CitiesList } from "./CitiesList";
import { useAuth } from "../../contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8788';

export interface LocationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationName: string;
  locationCode: string;
  locationType: "country" | "state";
  visitCount: number;
  totalVisitors: number;
  timeRange: '1' | '2' | '7' | '30';
}

interface LocationAnalytics {
  totalEvents: number;
  pageViews: number;
  eventsByType: Array<{ eventType: string; count: number }>;
  eventsByPage: Array<{ page: string; count: number }>;
  eventsByDevice: Array<{ deviceType: string; count: number }>;
  eventsByBrowser: Array<{ browserFamily: string; count: number }>;
  eventsTimeline: Array<{ date: string; eventType: string; count: number; page?: string; destination?: string }>;
}

export const LocationDetailsModal = ({
  isOpen,
  onClose,
  locationName,
  locationCode,
  locationType,
  visitCount,
  totalVisitors,
  timeRange,
}: LocationDetailsModalProps) => {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<LocationAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCities, setShowCities] = useState(false);
  const { hasRole } = useAuth();
  const isNotGuest = !hasRole('guest');

  const formatNumber = (num: number) => new Intl.NumberFormat().format(num);
  const percentage = totalVisitors > 0 ? ((visitCount / totalVisitors) * 100).toFixed(1) : "0";

  // Get time range label
  const getTimeRangeLabel = () => {
    return `Last ${timeRange} Day${timeRange === '1' ? '' : 's'}`;
  };

  // Fetch detailed analytics when modal opens
  useEffect(() => {
    if (isOpen && locationCode) {
      fetchLocationAnalytics();
    }
  }, [isOpen, locationCode, timeRange]);

  const fetchLocationAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build API URL with time range (all ranges are now day-based)
      let apiUrl = `${API_BASE_URL}/analytics/location/${locationCode}?type=${locationType}`;

      // Calculate date range for all time ranges (1, 2, 7, 30 days)
      const now = new Date();
      const daysAgo = new Date(now.getTime() - parseInt(timeRange) * 24 * 60 * 60 * 1000);

      const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      apiUrl += `&since=${formatDate(daysAgo)}&until=${formatDate(now)}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (response.ok && data.success) {
        setAnalytics(data.data);
      } else {
        setError(data.error || 'Failed to fetch location analytics');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${locationName} Details - ${getTimeRangeLabel()}`}
      size="lg"
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {/* Location Type Badge */}
        <div className="flex items-center gap-3">
          <Icon
            name="globe"
            size="lg"
            className="text-blue-400"
          />
          <div>
            <p className="text-sm text-slate-400">
              {locationType === "country" ? "Country" : "U.S. State"}
            </p>
            <h3 className="text-2xl font-semibold text-white">
              {locationName}
            </h3>
          </div>
        </div>

        {/* Visitor Count */}
        <div className="bg-slate-700/40 rounded-lg p-4 border border-slate-600/40">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Icon name="user" className="text-purple-400" size="md" />
              <span className="text-slate-300 text-base">Total Visitors</span>
            </div>
            <span className="text-2xl font-bold text-white">
              {formatNumber(visitCount)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-xs">
              {percentage}% of all traffic
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-900/20 border border-red-500/40 rounded-lg p-4">
            <p className="text-red-400 text-sm">
              Failed to load detailed analytics: {error}
            </p>
          </div>
        )}

        {/* Analytics Details */}
        {!loading && !error && analytics && (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/40">
                <p className="text-slate-400 text-xs mb-1">Total Events</p>
                <p className="text-white text-xl font-bold">
                  {formatNumber(analytics.totalEvents)}
                </p>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/40">
                <p className="text-slate-400 text-xs mb-1">Page Views</p>
                <p className="text-white text-xl font-bold">
                  {formatNumber(analytics.pageViews)}
                </p>
              </div>
            </div>

            {/* Events Chart (Total/Temporal toggle) */}
            <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/40">
              <EventsChartComponent
                eventsByType={analytics.eventsByType}
                eventsTimeline={analytics.eventsTimeline}
              />
            </div>

            {/* Top Pages */}
            {analytics.eventsByPage.length > 0 && (
              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/40">
                <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Icon name="home" size="sm" className="text-blue-400" />
                  Top Pages
                </h4>
                <div className="space-y-1">
                  {analytics.eventsByPage.map((page, idx) => (
                    <div key={idx} className="flex items-center justify-between p-1.5 bg-slate-900/40 rounded text-xs">
                      <span className="text-slate-300 truncate flex-1">{page.page}</span>
                      <span className="text-white font-semibold ml-2">{formatNumber(page.count)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Devices and Browsers */}
            <div className="grid grid-cols-2 gap-3">
              {/* Devices */}
              {analytics.eventsByDevice.length > 0 && (
                <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/40">
                  <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    <Icon name="gamepad" size="sm" className="text-green-400" />
                    Devices
                  </h4>
                  <div className="space-y-1">
                    {analytics.eventsByDevice.map((device, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">{device.deviceType}</span>
                        <span className="text-white font-semibold">{formatNumber(device.count)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Browsers */}
              {analytics.eventsByBrowser.length > 0 && (
                <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/40">
                  <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    <Icon name="globe" size="sm" className="text-orange-400" />
                    Browsers
                  </h4>
                  <div className="space-y-1">
                    {analytics.eventsByBrowser.map((browser, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">{browser.browserFamily}</span>
                        <span className="text-white font-semibold">{formatNumber(browser.count)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* City Breakdown - Authenticated Users Only, US States Only */}
            {isNotGuest && locationType === 'state' && (
              <div className="mt-6">
                <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/40">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Icon name="home" size="lg" className="text-red-400" />
                      <h3 className="text-lg font-semibold">City Breakdown</h3>
                      <span className="ml-2 text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                        Authenticated Users
                      </span>
                    </div>
                    <Button
                      onClick={() => setShowCities(!showCities)}
                      variant="secondary"
                      size="sm"
                    >
                      {showCities ? 'Hide Cities' : 'View Cities'}
                    </Button>
                  </div>

                  {showCities && (
                    <CitiesList
                      locationCode={locationCode}
                      timeRange={timeRange}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
