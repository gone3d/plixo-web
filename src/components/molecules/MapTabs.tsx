/**
 * MapTabs Component
 *
 * Tab navigation for switching between World and USA map views
 * Shows visitor counts for each view
 */

export type MapView = "world" | "usa";

export interface MapTabsProps {
  activeView: MapView;
  onViewChange: (view: MapView) => void;
  worldCount: number; // Total visitors worldwide
  usaCount: number; // Total US visitors
  className?: string;
}

export function MapTabs({
  activeView,
  onViewChange,
  worldCount,
  usaCount,
  className = "",
}: MapTabsProps) {
  const buttonBaseClasses =
    "px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50";
  const activeClasses = "bg-blue-500 text-white";
  const inactiveClasses =
    "bg-slate-800/40 text-slate-400 hover:bg-slate-700/40 hover:text-slate-300";

  return (
    <div
      className={`inline-flex rounded-lg border border-slate-700/40 overflow-hidden ${className}`}
      role="tablist"
    >
      <button
        onClick={() => onViewChange("world")}
        className={`${buttonBaseClasses} ${
          activeView === "world" ? activeClasses : inactiveClasses
        } flex items-center gap-1.5`}
        role="tab"
        aria-selected={activeView === "world"}
        aria-controls="world-map-panel"
      >
        <span className="text-sm">🌍</span>
        <span>World</span>
        <span className="text-xs opacity-75">
          ({worldCount.toLocaleString()})
        </span>
      </button>
      <button
        onClick={() => onViewChange("usa")}
        className={`${buttonBaseClasses} ${
          activeView === "usa" ? activeClasses : inactiveClasses
        } border-l border-slate-700/40 flex items-center gap-1.5`}
        role="tab"
        aria-selected={activeView === "usa"}
        aria-controls="usa-map-panel"
      >
        <span className="text-sm">🇺🇸</span>
        <span>USA</span>
        <span className="text-xs opacity-75">
          ({usaCount.toLocaleString()})
        </span>
      </button>
    </div>
  );
}
