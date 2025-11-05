/**
 * WorldMap Component
 *
 * SVG-based choropleth world map showing geographic distribution of visitors.
 * Uses react-simple-maps with TopoJSON for performance.
 * Color gradient intensity based on visitor count (Cloudflare-style).
 */

import { useMemo } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps'

// TopoJSON world map data (110m resolution for performance)
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

export interface WorldMapData {
  country: string       // ISO country code (US, GB, etc.)
  countryName: string   // Display name
  count: number         // Visitor count
}

export interface WorldMapProps {
  data: WorldMapData[]
  className?: string
}

/**
 * Calculate color intensity based on visitor count
 * Returns Tailwind-compatible color string
 */
function getColorForCount(count: number, min: number, max: number): string {
  if (count === 0) return '#1e293b' // slate-800 (no data)

  // Calculate intensity (0-1)
  const intensity = max === min ? 1 : (count - min) / (max - min)

  // 5-level gradient: slate-700 (low) → blue-500 (medium) → purple-600 (high)
  if (intensity < 0.2) return '#334155'      // slate-700
  if (intensity < 0.4) return '#3b82f6'      // blue-500
  if (intensity < 0.6) return '#6366f1'      // indigo-500
  if (intensity < 0.8) return '#8b5cf6'      // violet-500
  return '#9333ea'                            // purple-600
}

export function WorldMap({ data, className = '' }: WorldMapProps) {
  // Calculate min/max for color scale
  const { min, max, countryMap } = useMemo(() => {
    const counts = data.map(d => d.count).filter(c => c > 0)
    const countryMap = new Map(
      data.map(d => [d.country.toUpperCase(), { count: d.count, name: d.countryName }])
    )

    return {
      min: counts.length > 0 ? Math.min(...counts) : 0,
      max: counts.length > 0 ? Math.max(...counts) : 0,
      countryMap,
    }
  }, [data])

  return (
    <div className={`w-full ${className}`}>
      {/* Zoom instruction */}
      <div className="text-center mb-3">
        <p className="text-slate-400 text-xs">
          🖱️ Scroll to zoom • Drag to pan
        </p>
      </div>

      <div className="relative">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 100,
          }}
          width={800}
          height={400}
          style={{
            width: '100%',
            height: 'auto',
            cursor: 'grab',
          }}
        >
          <ZoomableGroup center={[0, 20]} zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                // Match geography to our data using ISO_A2 or ISO_A3 codes
                const isoCode = geo.id || geo.properties?.ISO_A2 || geo.properties?.ISO_A3 || ''
                const countryData = countryMap.get(isoCode.toUpperCase())
                const count = countryData?.count || 0
                const countryName = countryData?.name || geo.properties?.NAME || 'Unknown'

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getColorForCount(count, min, max)}
                    stroke="#1e293b"
                    strokeWidth={0.5}
                    style={{
                      default: {
                        outline: 'none',
                      },
                      hover: {
                        fill: count > 0 ? '#a855f7' : '#334155', // purple-500 on hover if has data
                        outline: 'none',
                        cursor: count > 0 ? 'pointer' : 'default',
                      },
                      pressed: {
                        outline: 'none',
                      },
                    }}
                  >
                    <title>
                      {countryName}: {count > 0 ? `${count} visitor${count !== 1 ? 's' : ''}` : 'No data'}
                    </title>
                  </Geography>
                )
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
          <div className="w-8 h-4 rounded" style={{ backgroundColor: '#334155' }} />
          <div className="w-8 h-4 rounded" style={{ backgroundColor: '#3b82f6' }} />
          <div className="w-8 h-4 rounded" style={{ backgroundColor: '#6366f1' }} />
          <div className="w-8 h-4 rounded" style={{ backgroundColor: '#8b5cf6' }} />
          <div className="w-8 h-4 rounded" style={{ backgroundColor: '#9333ea' }} />
        </div>
        <span>High</span>
      </div>
    </div>
  )
}
