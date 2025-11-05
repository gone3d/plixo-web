/**
 * ChartToggle Component
 *
 * Toggle button group for switching between chart visualization types.
 * Supports Bar and Pie chart modes with active state highlighting.
 */

export type ChartType = 'bar' | 'pie'

export interface ChartToggleProps {
  activeChart: ChartType
  onToggle: (type: ChartType) => void
  className?: string
}

export function ChartToggle({ activeChart, onToggle, className = '' }: ChartToggleProps) {
  const buttonBaseClasses = 'px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50'
  const activeClasses = 'bg-blue-500 text-white'
  const inactiveClasses = 'bg-slate-800/40 text-slate-400 hover:bg-slate-700/40 hover:text-slate-300'

  return (
    <div className={`inline-flex rounded-lg border border-slate-700/40 overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={() => onToggle('bar')}
        className={`${buttonBaseClasses} ${activeChart === 'bar' ? activeClasses : inactiveClasses} rounded-l-lg border-r border-slate-700/40`}
        aria-pressed={activeChart === 'bar'}
        aria-label="Bar chart view"
      >
        Bar
      </button>
      <button
        type="button"
        onClick={() => onToggle('pie')}
        className={`${buttonBaseClasses} ${activeChart === 'pie' ? activeClasses : inactiveClasses} rounded-r-lg`}
        aria-pressed={activeChart === 'pie'}
        aria-label="Pie chart view"
      >
        Pie
      </button>
    </div>
  )
}
