/**
 * WorldMap Component
 *
 * SVG-based choropleth world map showing geographic distribution of visitors.
 * Uses react-simple-maps with TopoJSON for performance.
 * Color gradient intensity based on visitor count (Cloudflare-style).
 */

import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

// TopoJSON world map data (110m resolution for performance)
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export interface WorldMapData {
  country: string; // ISO country code (US, GB, etc.)
  countryName: string; // Display name
  count: number; // Visitor count
}

export interface WorldMapProps {
  data: WorldMapData[];
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

export function WorldMap({ data, className = "" }: WorldMapProps) {
  // Track hovered country for info panel
  const [hoveredCountry, setHoveredCountry] = useState<{
    name: string;
    count: number;
    percentage: string;
  } | null>(null);

  // Calculate max, total, and country map
  const { max, total, countryMap } = useMemo(() => {
    const counts = data.map((d) => d.count).filter((c) => c > 0);
    const total = data.reduce((sum, d) => sum + d.count, 0);
    const max = counts.length > 0 ? Math.max(...counts) : 0;
    const countryMap = new Map(
      data.map((d) => [
        d.country.toUpperCase(),
        { count: d.count, name: d.countryName },
      ])
    );

    console.log("WorldMap countryMap:", Array.from(countryMap.entries()));
    console.log("WorldMap total:", total, "max:", max);

    return {
      max,
      total,
      countryMap,
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
        {hoveredCountry && (
          <div className="absolute bottom-4 left-4 z-20 bg-slate-900/95 backdrop-blur-sm border border-slate-700/40 rounded-lg px-4 py-3 shadow-xl min-w-[200px]">
            <p className="text-slate-300 text-sm font-medium mb-1">
              {hoveredCountry.name}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-white text-2xl font-bold">
                {hoveredCountry.count.toLocaleString()}
              </p>
              <p className="text-slate-400 text-sm">
                visitor{hoveredCountry.count !== 1 ? "s" : ""} ({hoveredCountry.percentage}%)
              </p>
            </div>
          </div>
        )}

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 100,
          }}
          width={800}
          height={400}
          style={{
            width: "100%",
            height: "auto",
            cursor: "grab",
          }}
        >
          <ZoomableGroup center={[0, 20]} zoom={1}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo, index) => {
                  // Debug logging for USA specifically (id 840 is USA)
                  if (geo.id === "840" || index < 3) {
                    console.log(
                      `Geography ${index}:`,
                      JSON.stringify(
                        {
                          id: geo.id,
                          properties: geo.properties,
                        },
                        null,
                        2
                      )
                    );
                  }

                  // TopoJSON only provides properties.name, no ISO codes
                  const geoName = geo.properties?.name;

                  // Try to match by country name (with partial matching for variations)
                  let countryData: { count: number; name: string } | undefined;

                  if (geoName) {
                    const geoNameLower = geoName.toLowerCase();

                    // Try exact match first
                    for (const [, data] of countryMap.entries()) {
                      if (data.name.toLowerCase() === geoNameLower) {
                        countryData = data;
                        break;
                      }
                    }

                    // If no exact match, try partial matching
                    // e.g., "United States" matches "United States of America"
                    if (!countryData) {
                      for (const [, data] of countryMap.entries()) {
                        const dataNameLower = data.name.toLowerCase();
                        if (
                          geoNameLower.includes(dataNameLower) ||
                          dataNameLower.includes(geoNameLower)
                        ) {
                          countryData = data;
                          break;
                        }
                      }
                    }
                  }

                  const count = countryData?.count || 0;
                  const countryName =
                    countryData?.name || geo.properties?.name || "Unknown";

                  // Debug log when we have data
                  if (countryData) {
                    console.log(
                      `✓ Matched: ${countryName} - ${count} visitors`
                    );
                  }

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
                        setHoveredCountry({
                          name: countryName,
                          count,
                          percentage,
                        });
                      }}
                      onMouseLeave={() => {
                        setHoveredCountry(null);
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
    </div>
  );
}
