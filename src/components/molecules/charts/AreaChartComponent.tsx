/**
 * AreaChartComponent
 *
 * Stacked area chart for timeline data showing events over time.
 * Uses recharts library with responsive design and interactive tooltips.
 */

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

export interface TimelineData {
  date: string
  [key: string]: string | number  // Dynamic event type keys
}

export interface AreaChartComponentProps {
  data: TimelineData[]
  eventTypes: string[]
  className?: string
}

// Color palette for different event types
const EVENT_COLORS: Record<string, string> = {
  'page_view': '#3b82f6',      // blue
  'project_view': '#8b5cf6',   // purple
  'external_link': '#10b981',  // green
  'contact_form': '#f59e0b',   // amber
  'default': '#64748b',        // slate
}

const getEventColor = (eventType: string): string => {
  return EVENT_COLORS[eventType] || EVENT_COLORS.default
}

export const AreaChartComponent = ({
  data,
  eventTypes,
  className = '',
}: AreaChartComponentProps) => {
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0)
      return (
        <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/40 rounded-lg px-3 py-2 shadow-xl">
          <p className="text-slate-300 text-xs font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name.replace('_', ' ')}: {entry.value}
            </p>
          ))}
          <p className="text-white text-xs font-semibold mt-1 pt-1 border-t border-slate-700">
            Total: {total}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            {eventTypes.map((eventType) => (
              <linearGradient key={eventType} id={`color-${eventType}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getEventColor(eventType)} stopOpacity={0.8} />
                <stop offset="95%" stopColor={getEventColor(eventType)} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={(value) => {
              // Format date to show only month/day
              const date = new Date(value)
              return `${date.getMonth() + 1}/${date.getDate()}`
            }}
          />
          <YAxis
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
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
              stroke={getEventColor(eventType)}
              fill={`url(#color-${eventType})`}
              fillOpacity={1}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
