import { forwardRef, useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'error' | 'success'
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  label?: string
  error?: string
  helpText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      leftIcon,
      rightIcon,
      label,
      error,
      helpText,
      id,
      type,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const isPasswordField = type === 'password'
    const inputType = isPasswordField && showPassword ? 'text' : type

    const baseStyles = 'block w-full border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-slate-500 bg-transparent'

    const variants = {
      default: 'border-white/20 text-white focus:border-blue-500 focus:ring-blue-500 [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_transparent]',
      error: 'border-red-500 text-white focus:border-red-500 focus:ring-red-500',
      success: 'border-green-500 text-white focus:border-green-500 focus:ring-green-500'
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-4 py-3 text-lg'
    }

    const iconSizes = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    }

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-200 mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className={cn('text-slate-400', iconSizes[size])}>
                {leftIcon}
              </span>
            </div>
          )}

          <input
            id={inputId}
            type={inputType}
            className={cn(
              baseStyles,
              variants[error ? 'error' : variant],
              sizes[size],
              leftIcon && 'pl-10',
              (rightIcon || isPasswordField) && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />

          {/* Password visibility toggle */}
          {isPasswordField && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className={iconSizes[size]} />
              ) : (
                <Eye className={iconSizes[size]} />
              )}
            </button>
          )}

          {/* Right icon (only shown if not a password field) */}
          {rightIcon && !isPasswordField && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className={cn('text-slate-400', iconSizes[size])}>
                {rightIcon}
              </span>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        {helpText && !error && (
          <p className="mt-1 text-sm text-slate-400">
            {helpText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input