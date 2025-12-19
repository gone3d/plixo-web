/**
 * EventsChartComponent
 *
 * Combined component showing event data in two modes:
 * - Total: Bar chart of aggregated event counts
 * - Temporal: Stacked area chart timeline visualization
 */

import { useState } from 'react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';

export type EventsChartMode = 'total' | 'temporal';

export interface EventsChartComponentProps {
  eventsByType: Array<{ eventType: string; count: number }>;
  eventsTimeline: Array<{ date: string; eventType: string; count: number; page?: string; destination?: string }>;
  timeRange: 'hour_1' | 'hour_12' | 'hour_24' | 'hour_48' | '7' | '30';
  className?: string;
}

// Color getter for event types
const getEventTypeColor = (eventType: string): string => {
  const colors: Record<string, string> = {
    'page_view': '#3b82f6',
    'project_view': '#8b5cf6',
    'insights_view': '#06b6d4',
    'about_view': '#10b981',
    'external_link': '#f59e0b',
    'contact_form': '#ef4444',
  };
  return colors[eventType] || '#64748b';
};

export const EventsChartComponent = ({
  eventsByType,
  eventsTimeline,
  timeRange,
  className = '',
}: EventsChartComponentProps) => {
  const [mode, setMode] = useState<EventsChartMode>('total');

  // Check if we have data
  const hasTimelineData = eventsTimeline && eventsTimeline.length > 0;
  const hasTotalData = eventsByType && eventsByType.length > 0;

  // Transform timeline data for stacked area chart (all ranges)
  const getStackedAreaData = () => {
    if (!hasTimelineData) return [];

    const dateMap = new Map<string, any>();

    eventsTimeline.forEach(({ date, eventType, count }) => {
      if (!dateMap.has(date)) {
        dateMap.set(date, { date });
      }
      const entry = dateMap.get(date)!;
      entry[eventType] = (entry[eventType] || 0) + count;
    });

    return Array.from(dateMap.values()).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const stackedAreaData = getStackedAreaData();
  const eventTypes = hasTimelineData ? Array.from(new Set(eventsTimeline.map(e => e.eventType))) : [];

  // If no data, show empty state
  if (!hasTotalData && !hasTimelineData) {
    return (
      <div className={`w-full ${className}`}>
        <h4 className="text-xs font-semibold text-slate-300 mb-3">Events</h4>
        <div className="flex items-center justify-center h-[250px] bg-slate-800/20 rounded-lg border border-slate-700/40">
          <p className="text-slate-500 text-sm">No event data available</p>
        </div>
      </div>
    );
  }

  // Custom tooltip for temporal chart
  const TemporalTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const total = payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0);
    return (
      <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/40 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-slate-300 text-xs font-medium mb-1">{payload[0]?.payload.date}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name.replace('_', ' ')}: {entry.value}
          </p>
        ))}
        <p className="text-white text-xs font-semibold mt-1 pt-1 border-t border-slate-700">
          Total: {total}
        </p>
      </div>
    );
  };

  // Custom tooltip for total bar chart
  const TotalTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/40 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-slate-300 text-xs font-medium mb-1">{payload[0].payload.name}</p>
        <p className="text-white text-sm font-semibold">{payload[0].value.toLocaleString()}</p>
      </div>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Toggle between Total and Temporal */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-2">
          Events
        </h4>
        <div className="flex gap-1 bg-slate-800/60 rounded-lg p-1">
          <button
            onClick={() => setMode('total')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              mode === 'total'
                ? 'bg-purple-500 text-white'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Total
          </button>
          <button
            onClick={() => setMode('temporal')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              mode === 'temporal'
                ? 'bg-purple-500 text-white'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Temporal
          </button>
        </div>
      </div>

      {/* Chart Display */}
      {mode === 'total' ? (
        // Total: Bar Chart
        hasTotalData ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={eventsByType.map(e => ({
                name: e.eventType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                value: e.count,
                eventType: e.eventType,
              }))}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis
                type="number"
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                width={120}
              />
              <Tooltip content={<TotalTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {eventsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getEventTypeColor(entry.eventType)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] bg-slate-800/20 rounded-lg border border-slate-700/40">
            <p className="text-slate-500 text-sm">No total data available</p>
          </div>
        )
      ) : (
        // Temporal: Stacked area chart for all ranges
        hasTimelineData && stackedAreaData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={stackedAreaData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                {eventTypes.map((eventType) => (
                  <linearGradient key={eventType} id={`color-${eventType}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={getEventTypeColor(eventType)} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={getEventTypeColor(eventType)} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  if (isNaN(date.getTime())) return value;
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip content={<TemporalTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px' }}
                formatter={(value) => value.replace('_', ' ')}
              />
              {eventTypes.map((eventType) => (
                <Area
                  key={eventType}
                  type="monotone"
                  dataKey={eventType}
                  name={eventType}
                  stackId="1"
                  stroke={getEventTypeColor(eventType)}
                  fill={`url(#color-${eventType})`}
                  fillOpacity={1}
                  connectNulls
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] bg-slate-800/20 rounded-lg border border-slate-700/40">
            <p className="text-slate-500 text-sm">No timeline data available</p>
          </div>
        )
      )}
    </div>
  );
};
