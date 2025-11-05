/**
 * BarChartComponent
 *
 * Horizontal bar chart for categorical data (top pages, event types, devices, browsers).
 * Uses recharts library with responsive design and interactive tooltips.
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

export interface BarChartData {
  name: string   // Label (page path, event type, etc.)
  value: number  // Count
}

export interface BarChartComponentProps {
  data: BarChartData[]
  title?: string
  xAxisLabel?: string
  yAxisLabel?: string
  className?: string
}

// Color gradient for bars (blue → purple)
const COLORS = [
  '#3b82f6', // blue-500
  '#6366f1', // indigo-500
  '#8b5cf6', // violet-500
  '#a855f7', // purple-500
  '#c084fc', // purple-400
  '#e879f9', // fuchsia-400
  '#f0abfc', // fuchsia-300
  '#fbbf24', // amber-400
  '#fb923c', // orange-400
  '#f87171', // red-400
]

// Custom tooltip with dark theme
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/40 rounded-lg px-4 py-2 shadow-xl">
        <p className="text-slate-300 text-sm font-medium">{payload[0].payload.name}</p>
        <p className="text-white text-base font-semibold mt-1">
          {payload[0].value.toLocaleString()} events
        </p>
      </div>
    )
  }
  return null
}

export function BarChartComponent({
  data,
  title,
  xAxisLabel,
  yAxisLabel,
  className = '',
}: BarChartComponentProps) {
  // Take top 10 items only for performance
  const chartData = data.slice(0, 10)

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-slate-200 mb-4">{title}</h3>
      )}

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
          <XAxis
            type="number"
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            width={80}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b', opacity: 0.3 }} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={500}>
            {chartData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
