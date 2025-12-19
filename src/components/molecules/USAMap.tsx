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
import { getColorForCount } from "../../utils/utils";

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
  onLocationClick?: (name: string, count: number) => void;
}

/**
 * Normalize state name/code to standard 2-letter abbreviation
 * Handles both full names and abbreviations from backend
 */
function normalizeStateCode(stateInput: string): string {
  const upper = stateInput.toUpperCase();

  // If already 2-letter code, return it
  if (upper.length === 2) return upper;

  // Map full state names to abbreviations
  const stateNameToCode: Record<string, string> = {
    'ALABAMA': 'AL', 'ALASKA': 'AK', 'ARIZONA': 'AZ', 'ARKANSAS': 'AR',
    'CALIFORNIA': 'CA', 'COLORADO': 'CO', 'CONNECTICUT': 'CT',
    'DELAWARE': 'DE', 'FLORIDA': 'FL', 'GEORGIA': 'GA',
    'HAWAII': 'HI', 'IDAHO': 'ID', 'ILLINOIS': 'IL', 'INDIANA': 'IN',
    'IOWA': 'IA', 'KANSAS': 'KS', 'KENTUCKY': 'KY', 'LOUISIANA': 'LA',
    'MAINE': 'ME', 'MARYLAND': 'MD', 'MASSACHUSETTS': 'MA',
    'MICHIGAN': 'MI', 'MINNESOTA': 'MN', 'MISSISSIPPI': 'MS',
    'MISSOURI': 'MO', 'MONTANA': 'MT', 'NEBRASKA': 'NE', 'NEVADA': 'NV',
    'NEW HAMPSHIRE': 'NH', 'NEW JERSEY': 'NJ', 'NEW MEXICO': 'NM',
    'NEW YORK': 'NY', 'NORTH CAROLINA': 'NC', 'NORTH DAKOTA': 'ND',
    'OHIO': 'OH', 'OKLAHOMA': 'OK', 'OREGON': 'OR',
    'PENNSYLVANIA': 'PA', 'RHODE ISLAND': 'RI', 'SOUTH CAROLINA': 'SC',
    'SOUTH DAKOTA': 'SD', 'TENNESSEE': 'TN', 'TEXAS': 'TX',
    'UTAH': 'UT', 'VERMONT': 'VT', 'VIRGINIA': 'VA',
    'WASHINGTON': 'WA', 'WEST VIRGINIA': 'WV', 'WISCONSIN': 'WI',
    'WYOMING': 'WY', 'DISTRICT OF COLUMBIA': 'DC',
    'PUERTO RICO': 'PR', 'VIRGIN ISLANDS': 'VI', 'GUAM': 'GU',
    'AMERICAN SAMOA': 'AS', 'NORTHERN MARIANA ISLANDS': 'MP',
  };

  return stateNameToCode[upper] || upper;
}

export function USAMap({ data, className = "", onLocationClick }: USAMapProps) {
  // Track hovered state for info panel
  const [hoveredState, setHoveredState] = useState<{
    name: string;
    count: number;
    percentage: string;
  } | null>(null);

  // Track zoom level for dynamic stroke width
  const [zoom, setZoom] = useState(1);

  // Calculate max, total, and state map
  const { max, total, stateMap } = useMemo(() => {
    const counts = data.map((d) => d.count).filter((c) => c > 0);
    const total = data.reduce((sum, d) => sum + d.count, 0);
    const max = counts.length > 0 ? Math.max(...counts) : 0;

    // Build state map with normalized keys (merge duplicates)
    const stateMap = new Map<string, { count: number; name: string }>();

    for (const item of data) {
      const normalizedCode = normalizeStateCode(item.state);
      const existing = stateMap.get(normalizedCode);

      if (existing) {
        // Merge duplicate entries by summing counts
        existing.count += item.count;
      } else {
        stateMap.set(normalizedCode, {
          count: item.count,
          name: item.stateName,
        });
      }
    }

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
          <ZoomableGroup
            center={[-96, 38]}
            zoom={1}
            onMoveEnd={(position) => setZoom(position.zoom)}
          >
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

                  // Calculate stroke width inversely proportional to zoom
                  const strokeWidth = 0.5 / zoom;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getColorForCount(count, max)}
                      fillOpacity={0.7}
                      stroke="#64748b"
                      strokeWidth={strokeWidth}
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
                      onClick={() => {
                        if (count > 0 && onLocationClick) {
                          onLocationClick(stateName, count);
                        }
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
            style={{ backgroundColor: "#0ea5e9" }}
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
                    className="flex items-center justify-between p-2 bg-slate-900/40 rounded text-xs hover:bg-slate-900/60 transition-colors cursor-pointer"
                    onClick={() => {
                      if (onLocationClick) {
                        onLocationClick(item.stateName, item.count);
                      }
                    }}
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
