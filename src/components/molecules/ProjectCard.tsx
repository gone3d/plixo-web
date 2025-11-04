import { Icon, SlideInImage } from "../atoms";
import { cn } from "../../utils/cn";
import type { IconName } from "../atoms/Icon";

export interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  status: "Live" | "Demo" | "In Development" | "Archived" | "Prototype";
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  className?: string;
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
  className,
}: ProjectCardProps) => {
  const statusColors = {
    Live: "bg-green-500/20 text-green-400 border-green-500/30",
    Demo: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "In Development": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Archived: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    Prototype: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };

  const statusIcons: Record<typeof status, IconName> = {
    Live: "check",
    Demo: "external",
    "In Development": "loading",
    Archived: "close",
    Prototype: "work",
  };


  return (
    <div
      className={cn(
        "group relative bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden transition-all duration-300 flex flex-col h-96",
        "hover:bg-slate-800/70 hover:border-slate-600/50 hover:scale-105 hover:shadow-xl",
        featured && "ring-2 ring-blue-500/30 border-blue-500/30",
        className
      )}
    >
      {/* Content Section */}
      <div className="p-6 flex flex-col h-full">
        {/* Header with badges */}
        <div className="flex items-center justify-between mb-4">
          {featured && (
            <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </span>
          )}
          {!featured && <div></div>} {/* Spacer when no featured badge */}

          <span
            className={cn(
              "flex items-center gap-1 px-2 py-1 text-xs rounded-full border",
              statusColors[status]
            )}
          >
            <Icon name={statusIcons[status]} size="xs" />
            {status}
          </span>
        </div>

        {/* Title */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
        </div>

        {/* Description - fills available space and scrolls if needed */}
        <div className="flex-grow overflow-y-auto mb-4">
          <p className="text-slate-300 leading-relaxed">{description}</p>
        </div>

        {/* Technologies - fixed position above footer */}
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-sm bg-slate-700/50 text-slate-200 rounded-full border border-slate-600/30 transition-colors hover:bg-slate-600/50"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Footer with links - always at bottom */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-700/30 mt-auto">
          <a
            href={liveUrl || demoUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            {liveUrl ? 'View Live' : demoUrl ? 'View Demo' : 'View Project'}
            <Icon name="external" size="sm" />
          </a>

          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors"
              title="View on GitHub"
            >
              <Icon name="github" size="sm" />
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* Slide-in Image Preview - separate overlay */}
      {image && (
        <SlideInImage
          src={image}
          alt={`${title} preview`}
          verticalOffset={20}
        />
      )}

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-xl transition-all duration-300 pointer-events-none" />
    </div>
  );
};

export default ProjectCard;
