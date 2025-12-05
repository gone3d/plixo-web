import { Icon } from "../atoms";

interface TechScrollerProps {
  technologies: string[];
  speed?: "slow" | "normal" | "fast";
  className?: string;
}

export const TechScroller = ({
  technologies,
  speed = "normal",
  className = "",
}: TechScrollerProps) => {
  // Animation duration based on speed - 1.25x faster
  const duration = speed === "slow" ? "24s" : speed === "fast" ? "12s" : "16s";

  // Create seamless infinite loop by duplicating the content
  // We need at least 2 copies for the animation to work seamlessly
  const content = technologies.map((tech, index) => (
    <div key={`tech-${index}`} className="flex items-center gap-2.5 shrink-0">
      <span className="px-3 py-1 text-sm bg-slate-700/50 text-slate-200 rounded-full border border-slate-600/30 whitespace-nowrap">
        {tech}
      </span>
      <Icon
        name="chevronRight"
        size="xs"
        className="text-slate-500 shrink-0"
      />
    </div>
  ));

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="flex items-center">
        {/* First copy */}
        <div
          className="flex items-center gap-2.5 shrink-0 animate-scroll"
          style={{
            animation: `scroll ${duration} linear infinite`,
          }}
        >
          {content}
        </div>
        {/* Second copy for seamless loop */}
        <div
          className="flex items-center gap-2.5 shrink-0 animate-scroll"
          style={{
            animation: `scroll ${duration} linear infinite`,
          }}
          aria-hidden="true"
        >
          {content}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};
