import { Button, Icon } from '../atoms'
import { cn } from '../../utils/cn'
import type { IconName } from '../atoms/Icon'

export interface ProjectCardProps {
  title: string
  description: string
  technologies: string[]
  status: 'Live' | 'Demo' | 'In Development' | 'Archived'
  image?: string
  liveUrl?: string
  githubUrl?: string
  demoUrl?: string
  featured?: boolean
  metrics?: {
    users?: string
    performance?: string
    impact?: string
  }
  className?: string
}

const ProjectCard = ({
  title,
  description,
  technologies,
  status,
  image,
  liveUrl,
  githubUrl,
  demoUrl,
  featured = false,
  metrics,
  className
}: ProjectCardProps) => {
  const statusColors = {
    'Live': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Demo': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'In Development': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Archived': 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  }

  const statusIcons: Record<typeof status, IconName> = {
    'Live': 'check',
    'Demo': 'external',
    'In Development': 'loading',
    'Archived': 'close'
  }

  const primaryAction = liveUrl || demoUrl || githubUrl

  return (
    <div
      className={cn(
        'group relative bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden transition-all duration-300',
        'hover:bg-slate-800/70 hover:border-slate-600/50 hover:scale-105 hover:shadow-xl',
        featured && 'ring-2 ring-blue-500/30 border-blue-500/30',
        className
      )}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </span>
        </div>
      )}

      {/* Image Section */}
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={`${title} preview`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        </div>
      )}

      {/* Content Section */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <span
            className={cn(
              'flex items-center gap-1 px-2 py-1 text-xs rounded-full border',
              statusColors[status]
            )}
          >
            <Icon name={statusIcons[status]} size="xs" />
            {status}
          </span>
        </div>

        {/* Description */}
        <p className="text-slate-300 mb-4 leading-relaxed">
          {description}
        </p>

        {/* Metrics */}
        {metrics && (
          <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-slate-800/50 rounded-lg">
            {metrics.users && (
              <div className="text-center">
                <div className="text-sm font-semibold text-white">{metrics.users}</div>
                <div className="text-xs text-slate-400">Users</div>
              </div>
            )}
            {metrics.performance && (
              <div className="text-center">
                <div className="text-sm font-semibold text-white">{metrics.performance}</div>
                <div className="text-xs text-slate-400">Performance</div>
              </div>
            )}
            {metrics.impact && (
              <div className="text-center">
                <div className="text-sm font-semibold text-white">{metrics.impact}</div>
                <div className="text-xs text-slate-400">Impact</div>
              </div>
            )}
          </div>
        )}

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-6">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-sm bg-slate-700/50 text-slate-200 rounded-full border border-slate-600/30 transition-colors hover:bg-slate-600/50"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {liveUrl && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Icon name="external" size="sm" />}
              onClick={() => window.open(liveUrl, '_blank')}
            >
              View Live
            </Button>
          )}
          {demoUrl && !liveUrl && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Icon name="external" size="sm" />}
              onClick={() => window.open(demoUrl, '_blank')}
            >
              View Demo
            </Button>
          )}
          {githubUrl && (
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Icon name="github" size="sm" />}
              onClick={() => window.open(githubUrl, '_blank')}
            >
              Code
            </Button>
          )}
          {!primaryAction && (
            <Button variant="ghost" size="sm" disabled>
              Coming Soon
            </Button>
          )}
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-xl transition-all duration-300 pointer-events-none" />
    </div>
  )
}

export default ProjectCard