/**
 * CityTemporalChart
 *
 * Temporal distribution chart showing city activity over time.
 * Y-axis: Cities, X-axis: Dates, Data points: Color-coded circles
 */

import { useState, useEffect } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ZAxis,
} from 'recharts';
import Modal from '../Modal';
import { LoadingSpinner, Icon } from '../../atoms';
import { authService } from '../../../services/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8788";

// Color scale: blue to purple based on visit count
const COLOR_SCALE = [
  { min: 1, max: 2, color: '#93c5fd' },     // blue-300
  { min: 3, max: 5, color: '#60a5fa' },     // blue-400
  { min: 6, max: 10, color: '#3b82f6' },    // blue-500
  { min: 11, max: 20, color: '#8b5cf6' },   // violet-500
  { min: 21, max: Infinity, color: '#7c3aed' }, // violet-600
];

const getColorForCount = (count: number): string => {
  const scale = COLOR_SCALE.find(s => count >= s.min && count <= s.max);
  return scale?.color || COLOR_SCALE[0].color;
};

type FilterMode = 'top8' | 'largestDays' | 'all';

interface TemporalData {
  city: string;
  country: string;
  region: string;
  hits: Array<{ timestamp: string }>;
}

interface CityTemporalChartProps {
  isOpen: boolean;
  onClose: () => void;
  locationCode: string;
  locationType: "country" | "state";
  locationName: string;
  timeRange: string;
}

// Format data for scatter chart
interface ChartDataPoint {
  city: string;
  cityIndex: number;
  date: string;
  count: number;
  dateIndex: number;
}

// Custom tooltip
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/40 rounded-lg px-4 py-2 shadow-xl">
        <p className="text-white font-semibold">{data.city}</p>
        <p className="text-slate-300 text-sm">{data.date}</p>
        <p className="text-blue-400 font-bold">{data.count} visits</p>
      </div>
    );
  }
  return null;
}

export const CityTemporalChart = ({
  isOpen,
  onClose,
  locationCode,
  locationType,
  locationName,
  timeRange,
}: CityTemporalChartProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allChartData, setAllChartData] = useState<ChartDataPoint[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [allCities, setAllCities] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<FilterMode>('top8');
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchTemporalData();
    }
  }, [isOpen, locationCode, locationType, timeRange]);

  const fetchTemporalData = async () => {
    setLoading(true);
    setError(null);

    try {
      const now = new Date();
      const daysAgo = new Date(
        now.getTime() - parseInt(timeRange) * 24 * 60 * 60 * 1000,
      );

      const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const since = formatDate(daysAgo);
      const until = formatDate(now);

      const token = authService.getToken();
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      // Build query params
      let queryParams = `mode=temporal&since=${since}&until=${until}`;
      if (locationType === "country") {
        queryParams += `&country=${locationCode}`;
      } else {
        queryParams += `&country=US&state=${locationCode}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/analytics/cities?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch temporal data");
      }

      if (data.success && data.data) {
        processTemporalData(data.data);
      } else {
        setError(data.error || "Failed to load temporal data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const processTemporalData = (rawData: TemporalData[]) => {
    // Get unique cities, sorted
    const uniqueCities = [...new Set(rawData.map((d) => d.city))].sort();

    // Generate full date range based on timeRange
    const now = new Date();
    const daysAgo = new Date(
      now.getTime() - parseInt(timeRange) * 24 * 60 * 60 * 1000,
    );
    const allDates: string[] = [];

    for (let d = new Date(daysAgo); d <= now; d.setDate(d.getDate() + 1)) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      allDates.push(`${year}-${month}-${day}`);
    }

    setAllCities(uniqueCities);
    setDates(allDates);

    // Process hits: group by city and date, count per day
    const processedData: ChartDataPoint[] = [];

    for (const cityData of rawData) {
      // Group hits by date (YYYY-MM-DD)
      const hitsByDate = new Map<string, number>();

      for (const hit of cityData.hits) {
        // Extract date from timestamp (e.g., "2026-01-27 12:34:56" -> "2026-01-27")
        const date = hit.timestamp.split(" ")[0];
        hitsByDate.set(date, (hitsByDate.get(date) || 0) + 1);
      }

      // Create chart data points for each day that has hits
      for (const [date, count] of hitsByDate.entries()) {
        const cityIndex = uniqueCities.indexOf(cityData.city);
        const dateIndex = allDates.indexOf(date);

        if (cityIndex !== -1 && dateIndex !== -1) {
          processedData.push({
            city: cityData.city,
            cityIndex,
            date,
            dateIndex,
            count,
          });
        }
      }
    }

    setAllChartData(processedData);
    setPage(0); // Reset to first page
    applyFilter(processedData, uniqueCities, filterMode, 0);
  };

  const applyFilter = (
    data: ChartDataPoint[],
    allCitiesList: string[],
    mode: FilterMode,
    pageNum: number
  ) => {
    let filteredCities: string[] = [];

    if (mode === 'top8') {
      // Get top 8 cities by total visit count
      const cityTotals = new Map<string, number>();
      data.forEach(d => {
        cityTotals.set(d.city, (cityTotals.get(d.city) || 0) + d.count);
      });
      filteredCities = Array.from(cityTotals.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(pageNum * 8, (pageNum + 1) * 8)
        .map(([city]) => city);
    } else if (mode === 'largestDays') {
      // Get cities with largest single-day counts
      const cityMaxDays = new Map<string, number>();
      data.forEach(d => {
        const current = cityMaxDays.get(d.city) || 0;
        if (d.count > current) {
          cityMaxDays.set(d.city, d.count);
        }
      });
      filteredCities = Array.from(cityMaxDays.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(pageNum * 8, (pageNum + 1) * 8)
        .map(([city]) => city);
    } else {
      // Show all cities, paginated
      filteredCities = allCitiesList.slice(pageNum * 8, (pageNum + 1) * 8);
    }

    setCities(filteredCities);

    // Filter data to only include selected cities and re-index
    const filtered = data
      .filter(d => filteredCities.includes(d.city))
      .map(d => ({
        ...d,
        cityIndex: filteredCities.indexOf(d.city),
      }));

    setChartData(filtered);
  };

  useEffect(() => {
    if (allChartData.length > 0) {
      applyFilter(allChartData, allCities, filterMode, page);
    }
  }, [filterMode, page]);

  const handleFilterChange = (mode: FilterMode) => {
    setFilterMode(mode);
    setPage(0);
  };

  const getTotalPages = () => {
    let totalCities = allCities.length;
    if (filterMode === 'top8' || filterMode === 'largestDays') {
      const citySet = new Set(allChartData.map(d => d.city));
      totalCities = citySet.size;
    }
    return Math.ceil(totalCities / 8);
  };

  const canGoNext = page < getTotalPages() - 1;
  const canGoPrev = page > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`City Activity Over Time - ${locationName}`}
      size="half"
      zIndex={60}
    >
      <div className="space-y-4">
        {/* Filters and Pagination */}
        {!loading && !error && allChartData.length > 0 && (
          <div className="flex items-center justify-between bg-slate-800/40 rounded-lg p-3 border border-slate-700/40">
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange('top8')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  filterMode === 'top8'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Top 8
              </button>
              <button
                onClick={() => handleFilterChange('largestDays')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  filterMode === 'largestDays'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Largest Days
              </button>
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  filterMode === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All Cities
              </button>
            </div>

            {getTotalPages() > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">
                  Page {page + 1} of {getTotalPages()}
                </span>
                <button
                  onClick={() => setPage(p => p - 1)}
                  disabled={!canGoPrev}
                  className={`p-1 rounded ${
                    canGoPrev
                      ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <Icon name="chevronLeft" size="sm" />
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={!canGoNext}
                  className={`p-1 rounded ${
                    canGoNext
                      ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <Icon name="chevronRight" size="sm" />
                </button>
              </div>
            )}
          </div>
        )}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-900/20 border border-red-500/40 rounded-lg p-4">
            <p className="text-red-400 text-sm">
              Failed to load temporal data: {error}
            </p>
          </div>
        )}

        {!loading && !error && chartData.length === 0 && (
          <div className="text-center py-8">
            <Icon
              name="chart"
              size="lg"
              className="text-slate-600 mx-auto mb-4"
            />
            <p className="text-slate-500 text-sm italic">
              No temporal data available
            </p>
          </div>
        )}

        {!loading && !error && chartData.length > 0 && (
          <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/40">
            {/* Color Legend */}
            <div className="mb-4 flex items-center justify-center gap-4 text-xs">
              <span className="text-slate-400">Visit Count:</span>
              {COLOR_SCALE.map((scale, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: scale.color }}
                  />
                  <span className="text-slate-300">
                    {scale.max === Infinity ? `${scale.min}+` : `${scale.min}-${scale.max}`}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-[600px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 80, left: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis
                    type="number"
                    dataKey="dateIndex"
                    tick={{ fill: "#cbd5e1", fontSize: 10 }}
                    tickFormatter={(index) => {
                      const date = dates[Math.round(index)];
                      if (!date) return "";
                      // Format as MM/DD
                      const [, month, day] = date.split("-");
                      return `${month}/${day}`;
                    }}
                    domain={[0, dates.length - 1]}
                    tickCount={Math.min(dates.length, 10)}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    axisLine={{ stroke: "#475569" }}
                  />
                  <YAxis
                    type="number"
                    dataKey="cityIndex"
                    tick={{ fill: "#cbd5e1", fontSize: 11 }}
                    tickFormatter={(index) => cities[Math.round(index)] || ""}
                    domain={[0, Math.max(cities.length - 1, 0)]}
                    ticks={cities.map((_, i) => i)}
                    width={110}
                    axisLine={{ stroke: "#475569" }}
                  />
                  <ZAxis
                    type="number"
                    dataKey="count"
                    range={[300, 600]}
                    name="Visits"
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ strokeDasharray: "3 3" }}
                  />
                  <Scatter data={chartData} shape="circle">
                    {chartData.map((dataPoint, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getColorForCount(dataPoint.count)}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <p className="text-slate-400 text-xs">
                Each circle represents visits from a city on a specific day. Hover to see details.
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
