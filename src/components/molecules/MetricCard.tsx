import { Icon, LoadingSpinner } from '../atoms'
import { cn } from '../../utils/cn'
import type { IconName } from '../atoms/Icon'

export interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: IconName
  trend?: {
    direction: 'up' | 'down' | 'neutral'
    percentage: number
    period: string
  }
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  isLoading?: boolean
  animated?: boolean
  className?: string
}

const MetricCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  isLoading = false,
  animated = false,
  className
}: MetricCardProps) => {
  const variants = {
    default: {
      bg: 'bg-slate-800/50 border-slate-700/50',
      icon: 'text-slate-400',
      value: 'text-white',
      title: 'text-slate-300'
    },
    success: {
      bg: 'bg-green-500/10 border-green-500/30',
      icon: 'text-green-400',
      value: 'text-green-400',
      title: 'text-green-300'
    },
    warning: {
      bg: 'bg-yellow-500/10 border-yellow-500/30',
      icon: 'text-yellow-400',
      value: 'text-yellow-400',
      title: 'text-yellow-300'
    },
    danger: {
      bg: 'bg-red-500/10 border-red-500/30',
      icon: 'text-red-400',
      value: 'text-red-400',
      title: 'text-red-300'
    },
    info: {
      bg: 'bg-blue-500/10 border-blue-500/30',
      icon: 'text-blue-400',
      value: 'text-blue-400',
      title: 'text-blue-300'
    }
  }

  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-slate-400'
  }

  const trendIcons: Record<'up' | 'down' | 'neutral', IconName> = {
    up: 'chevronRight',
    down: 'chevronDown',
    neutral: 'chevronRight'
  }

  const currentVariant = variants[variant]

  return (
    <div
      className={cn(
        'relative border rounded-xl p-6 transition-all duration-200',
        currentVariant.bg,
        'hover:bg-opacity-70 hover:scale-105 hover:shadow-lg',
        animated && 'animate-fade-in',
        className
      )}
    >
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-24">
          <LoadingSpinner size="md" variant="default" />
        </div>
      )}

      {/* Content */}
      {!isLoading && (
        <>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className={cn('text-sm font-medium', currentVariant.title)}>
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
              )}
            </div>
            {icon && (
              <div className={cn('ml-3', currentVariant.icon)}>
                <Icon name={icon} size="lg" />
              </div>
            )}
          </div>

          {/* Value */}
          <div className="mb-2">
            <div className={cn('text-2xl font-bold', currentVariant.value)}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
          </div>

          {/* Trend */}
          {trend && (
            <div className="flex items-center gap-1">
              <Icon
                name={trendIcons[trend.direction]}
                size="sm"
                className={cn(
                  'transition-transform',
                  trend.direction === 'up' && 'rotate-[-90deg]',
                  trend.direction === 'down' && 'rotate-90',
                  trendColors[trend.direction]
                )}
              />
              <span className={cn('text-sm font-medium', trendColors[trend.direction])}>
                {trend.percentage}%
              </span>
              <span className="text-xs text-slate-400">
                vs {trend.period}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// Specialized metric card variants for common use cases
export const VisitorMetricCard = ({ visitors, isLoading }: { visitors: number; isLoading?: boolean }) => (
  <MetricCard
    title="Total Visitors"
    value={visitors}
    icon="user"
    variant="info"
    isLoading={isLoading}
    trend={{
      direction: 'up',
      percentage: 12,
      period: 'last week'
    }}
  />
)

export const PageViewMetricCard = ({ pageViews, isLoading }: { pageViews: number; isLoading?: boolean }) => (
  <MetricCard
    title="Page Views"
    value={pageViews}
    icon="chart"
    variant="success"
    isLoading={isLoading}
    trend={{
      direction: 'up',
      percentage: 8,
      period: 'last week'
    }}
  />
)

export const SessionMetricCard = ({ avgSession, isLoading }: { avgSession: string; isLoading?: boolean }) => (
  <MetricCard
    title="Avg Session"
    value={avgSession}
    icon="loading"
    variant="default"
    isLoading={isLoading}
    trend={{
      direction: 'up',
      percentage: 15,
      period: 'last week'
    }}
  />
)

export const BounceRateMetricCard = ({ bounceRate, isLoading }: { bounceRate: string; isLoading?: boolean }) => (
  <MetricCard
    title="Bounce Rate"
    value={bounceRate}
    icon="check"
    variant="success"
    isLoading={isLoading}
    trend={{
      direction: 'down',
      percentage: 5,
      period: 'last week'
    }}
  />
)

export default MetricCard