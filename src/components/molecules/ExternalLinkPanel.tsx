import { ReactNode } from 'react'
import { Icon, IconButton } from '../atoms'
import type { IconName } from '../atoms/Icon'

interface ExternalLinkPanelProps {
  icon?: IconName
  title: string
  description?: string
  href: string
  children?: ReactNode
}

export const ExternalLinkPanel = ({
  icon = 'github',
  title,
  description,
  href,
  children
}: ExternalLinkPanelProps) => {
  const handleClick = (e: React.MouseEvent) => {
    // Prevent default and open in new tab
    e.preventDefault()
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    // Stop propagation so button click doesn't trigger panel click
    e.stopPropagation()
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-600/40 hover:border-slate-500/60 rounded-lg transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        {/* Left - Icon */}
        <div className="flex-shrink-0">
          <Icon name={icon} size="md" className="text-slate-400 group-hover:text-slate-300 transition-colors" />
        </div>

        {/* Middle - Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
          {description && (
            <p className="text-sm text-slate-400 line-clamp-2">{description}</p>
          )}
          {children}
        </div>

        {/* Right - External link button */}
        <div className="flex-shrink-0" onClick={handleButtonClick}>
          <IconButton
            icon="external"
            onClick={() => {}}
            title="Open in new tab"
            variant="default"
          />
        </div>
      </div>
    </a>
  )
}
