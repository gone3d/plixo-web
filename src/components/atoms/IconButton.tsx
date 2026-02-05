import Icon, { type IconName } from './Icon'

interface IconButtonProps {
  icon: IconName
  onClick: () => void
  disabled?: boolean
  title?: string
  variant?: 'default' | 'blue' | 'red'
}

const variantStyles = {
  default: 'bg-slate-600/60 text-slate-300 hover:text-white hover:bg-slate-600/80',
  blue: 'bg-blue-500/20 text-blue-400 hover:text-blue-300 hover:bg-blue-500/30',
  red: 'bg-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/30'
}

export const IconButton = ({
  icon,
  onClick,
  disabled = false,
  title,
  variant = 'default'
}: IconButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${variantStyles[variant]}`}
    >
      <Icon name={icon} size="sm" />
    </button>
  )
}
