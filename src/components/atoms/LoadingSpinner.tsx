import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'primary' | 'white'
  text?: string
}

const LoadingSpinner = ({
  size = 'md',
  variant = 'default',
  text,
  className,
  ...props
}: LoadingSpinnerProps) => {
  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  const variants = {
    default: 'text-slate-400',
    primary: 'text-blue-500',
    white: 'text-white'
  }

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  return (
    <div
      className={cn('flex flex-col items-center justify-center space-y-2', className)}
      role="status"
      aria-label={text || 'Loading'}
      {...props}
    >
      {/* Primary spinner */}
      <svg
        className={cn(
          'animate-spin',
          sizes[size],
          variants[variant]
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>

      {text && (
        <span
          className={cn(
            'font-medium',
            textSizes[size],
            variants[variant]
          )}
        >
          {text}
        </span>
      )}
    </div>
  )
}

// Alternative pulsing dots loader for variety
export const PulsingDots = ({
  size = 'md',
  variant = 'default',
  className
}: Pick<LoadingSpinnerProps, 'size' | 'variant' | 'className'>) => {
  const dotSizes = {
    xs: 'h-1 w-1',
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4'
  }

  const variants = {
    default: 'bg-slate-400',
    primary: 'bg-blue-500',
    white: 'bg-white'
  }

  const spacing = {
    xs: 'space-x-1',
    sm: 'space-x-1',
    md: 'space-x-1.5',
    lg: 'space-x-2',
    xl: 'space-x-2.5'
  }

  return (
    <div
      className={cn('flex items-center', spacing[size], className)}
      role="status"
      aria-label="Loading"
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full animate-pulse',
            dotSizes[size],
            variants[variant]
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.5s'
          }}
        />
      ))}
    </div>
  )
}

// Skeleton loader for content placeholders
export const Skeleton = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-800/50',
        className
      )}
      {...props}
    />
  )
}

export default LoadingSpinner