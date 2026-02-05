import type { ReactNode } from 'react'
import { Icon } from '../atoms'
import type { IconName } from '../atoms/Icon'

interface UIPanelProps {
  icon?: IconName
  color?: 'blue' | 'purple' | 'green' | 'red' | 'yellow' | 'cyan' | 'orange'
  title: string
  children: ReactNode
}

const colorMap = {
  blue: 'border-blue-500/20 text-blue-400',
  purple: 'border-purple-500/20 text-purple-400',
  green: 'border-green-500/20 text-green-400',
  red: 'border-red-500/20 text-red-400',
  yellow: 'border-yellow-500/20 text-yellow-400',
  cyan: 'border-cyan-500/20 text-cyan-400',
  orange: 'border-orange-500/20 text-orange-400'
}

export const UIPanel = ({ icon = 'work', color = 'blue', title, children }: UIPanelProps) => {
  return (
    <div className={`p-3 bg-slate-800/30 rounded-lg border ${colorMap[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon name={icon} size="sm" className={colorMap[color].split(' ')[1]} />
        <span className="font-semibold text-white">{title}</span>
      </div>
      <div className="space-y-1 text-sm text-slate-400">
        {children}
      </div>
    </div>
  )
}
