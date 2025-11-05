/**
 * PieChartComponent
 *
 * Donut-style pie chart for categorical data distribution.
 * Shows percentages and counts with interactive tooltips and legend.
 */

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export interface PieChartData {
  name: string   // Category name
  value: number  // Count
}

export interface PieChartComponentProps {
  data: PieChartData[]
  title?: string
  showPercentage?: boolean
  className?: string
}

// Color palette: blue, purple, cyan, green, orange
const COLORS = [
  '#3b82f6', // blue-500
  '#a855f7', // purple-500
  '#22d3ee', // cyan-400
  '#10b981', // green-500
  '#f97316', // orange-500
  '#6366f1', // indigo-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
]

// Custom tooltip with dark theme
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0]
    const total = payload[0].payload.total || 0
    const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0'

    return (
      <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/40 rounded-lg px-4 py-2 shadow-xl">
        <p className="text-slate-300 text-sm font-medium">{data.name}</p>
        <p className="text-white text-base font-semibold mt-1">
          {data.value.toLocaleString()} ({percentage}%)
        </p>
      </div>
    )
  }
  return null
}

// Custom label renderer for center text
function CenterLabel({ total }: { total: number }) {
  return (
    <g>
      <text
        x="50%"
        y="47%"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-slate-400 text-sm"
      >
        Total
      </text>
      <text
        x="50%"
        y="53%"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-white text-2xl font-bold"
      >
        {total.toLocaleString()}
      </text>
    </g>
  )
}

export function PieChartComponent({
  data,
  title,
  showPercentage = true,
  className = '',
}: PieChartComponentProps) {
  // Calculate total for center display
  const total = data.reduce((sum, item) => sum + item.value, 0)

  // Add total to each data item for tooltip percentage calculation
  const chartData = data.map(item => ({ ...item, total }))

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-slate-200 mb-4">{title}</h3>
      )}

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            animationDuration={500}
            label={showPercentage ? (entry: any) => {
              const percent = total > 0 ? ((entry.value / total) * 100).toFixed(0) : '0'
              return `${percent}%`
            } : false}
            labelLine={showPercentage}
          >
            {chartData.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="#1e293b"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '14px',
            }}
            formatter={(value) => (
              <span className="text-slate-300">{value}</span>
            )}
          />
          {/* Center label showing total count */}
          <CenterLabel total={total} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
