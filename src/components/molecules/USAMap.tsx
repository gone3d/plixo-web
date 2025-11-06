/**
 * USAMap Component
 *
 * SVG-based choropleth US state map showing geographic distribution of visitors.
 * Uses react-simple-maps with US TopoJSON for performance.
 * Color gradient intensity based on visitor count (same scale as world map).
 */

import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

// TopoJSON US states data (10m resolution for performance)
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

export interface USAMapData {
  state: string; // State code (CA, TX, NY)
  stateName: string; // Full name
  count: number; // Visitor count
}

export interface USAMapProps {
  data: USAMapData[];
  className?: string;
}

/**
 * Calculate color based on percentage of maximum value
 * Relative scale: top 20% gets highest color, etc.
 */
function getColorForCount(count: number, max: number): string {
  if (count === 0 || max === 0) return "#1e293b"; // slate-800 (no data)

  // Calculate percentage of max (0-100)
  const percentOfMax = (count / max) * 100;

  // Relative 20% intervals based on max value
  if (percentOfMax >= 80) return "#9333ea"; // purple-600 (top 20%)
  if (percentOfMax >= 60) return "#8b5cf6"; // violet-500
  if (percentOfMax >= 40) return "#6366f1"; // indigo-500
  if (percentOfMax >= 20) return "#3b82f6"; // blue-500
  return "#334155"; // slate-700 (bottom 20%)
}

export function USAMap({ data, className = "" }: USAMapProps) {
  // Track hovered state for info panel
  const [hoveredState, setHoveredState] = useState<{
    name: string;
    count: number;
    percentage: string;
  } | null>(null);

  // Calculate max, total, and state map
  const { max, total, stateMap } = useMemo(() => {
    const counts = data.map((d) => d.count).filter((c) => c > 0);
    const total = data.reduce((sum, d) => sum + d.count, 0);
    const max = counts.length > 0 ? Math.max(...counts) : 0;
    const stateMap = new Map(
      data.map((d) => [
        d.state.toUpperCase(),
        { count: d.count, name: d.stateName },
      ])
    );

    console.log("USAMap stateMap:", Array.from(stateMap.entries()));
    console.log("USAMap total:", total, "max:", max);

    return {
      max,
      total,
      stateMap,
    };
  }, [data]);

  return (
    <div className={`w-full ${className}`}>
      {/* Zoom instruction */}
      <div className="text-center mb-3">
        <p className="text-slate-400 text-xs">
          🖱️ Scroll to zoom • Drag to pan
        </p>
      </div>

      <div className="relative rounded-lg overflow-hidden">
        {/* Subtle vignette fade */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(15, 23, 42, 0.5) 100%)",
          }}
        />

        {/* Hover info panel - bottom left */}
        {hoveredState && (
          <div className="absolute bottom-4 left-4 z-20 bg-slate-900/95 backdrop-blur-sm border border-slate-700/40 rounded-lg px-4 py-3 shadow-xl min-w-[200px]">
            <p className="text-slate-300 text-sm font-medium mb-1">
              {hoveredState.name}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-white text-2xl font-bold">
                {hoveredState.count.toLocaleString()}
              </p>
              <p className="text-slate-400 text-sm">
                visitor{hoveredState.count !== 1 ? "s" : ""} ({hoveredState.percentage}%)
              </p>
            </div>
          </div>
        )}

        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={{
            scale: 1000,
          }}
          width={975}
          height={610}
          style={{
            width: "100%",
            height: "auto",
            cursor: "grab",
          }}
        >
          <ZoomableGroup center={[-96, 38]} zoom={1}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  // Try to match by state ID or name
                  const geoId = geo.id?.toUpperCase();
                  const geoName = geo.properties?.name;

                  // Try to find matching state data
                  let stateData = geoId ? stateMap.get(geoId) : undefined;

                  // If not found by ID, try by name
                  if (!stateData && geoName) {
                    for (const [, data] of stateMap.entries()) {
                      if (data.name.toLowerCase() === geoName.toLowerCase()) {
                        stateData = data;
                        break;
                      }
                    }
                  }

                  const count = stateData?.count || 0;
                  const stateName = stateData?.name || geoName || "Unknown";

                  // Calculate percentage of total
                  const percentage =
                    total > 0 ? ((count / total) * 100).toFixed(1) : "0";

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getColorForCount(count, max)}
                      fillOpacity={0.7}
                      stroke="#64748b"
                      strokeWidth={0.5}
                      onMouseEnter={() => {
                        setHoveredState({
                          name: stateName,
                          count,
                          percentage,
                        });
                      }}
                      onMouseLeave={() => {
                        setHoveredState(null);
                      }}
                      style={{
                        default: {
                          outline: "none",
                          fillOpacity: 0.7,
                        },
                        hover: {
                          fill: count > 0 ? "#a855f7" : "#334155", // purple-500 on hover if has data
                          fillOpacity: 0.8,
                          outline: "none",
                          cursor: count > 0 ? "pointer" : "default",
                        },
                        pressed: {
                          outline: "none",
                          fillOpacity: 0.5,
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
        <span>Low</span>
        <div className="flex gap-1">
          <div
            className="w-8 h-4 rounded"
            style={{ backgroundColor: "#334155" }}
          />
          <div
            className="w-8 h-4 rounded"
            style={{ backgroundColor: "#3b82f6" }}
          />
          <div
            className="w-8 h-4 rounded"
            style={{ backgroundColor: "#6366f1" }}
          />
          <div
            className="w-8 h-4 rounded"
            style={{ backgroundColor: "#8b5cf6" }}
          />
          <div
            className="w-8 h-4 rounded"
            style={{ backgroundColor: "#9333ea" }}
          />
        </div>
        <span>High</span>
      </div>

      {/* Details Panel - List all states */}
      {data.length > 0 && (
        <div className="mt-6 bg-slate-800/30 rounded-lg p-4 border border-slate-700/40">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">
            State Breakdown ({data.length} {data.length === 1 ? 'state' : 'states'})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
            {data
              .sort((a, b) => b.count - a.count)
              .map((item) => {
                const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';
                return (
                  <div
                    key={item.state}
                    className="flex items-center justify-between p-2 bg-slate-900/40 rounded text-xs hover:bg-slate-900/60 transition-colors"
                  >
                    <span className="text-slate-300 font-medium truncate">
                      {item.stateName}
                    </span>
                    <div className="flex items-baseline gap-1.5 ml-2 shrink-0">
                      <span className="text-white font-semibold">
                        {item.count.toLocaleString()}
                      </span>
                      <span className="text-slate-400">
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
