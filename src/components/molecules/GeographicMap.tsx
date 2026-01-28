/**
 * GeographicMap Component
 *
 * Wrapper component that conditionally renders World or USA maps
 * Map selection is controlled by parent component (Insights page)
 */

import { WorldMap, type WorldMapData } from "./WorldMap";
import { USAMap, type USAMapData } from "./USAMap";
import type { MapView } from "./MapTabs";

export interface GeographicMapProps {
  activeView: MapView;
  worldData: WorldMapData[];
  usaData: USAMapData[];
  className?: string;
  onLocationClick?: (locationCode: string, locationName: string, locationType: "country" | "state", visitCount: number) => void;
}

export function GeographicMap({
  activeView,
  worldData,
  usaData,
  className = "",
  onLocationClick,
}: GeographicMapProps) {
  return (
    <div className={className}>
      {activeView === "world" ? (
        <div
          role="tabpanel"
          id="world-map-panel"
          aria-labelledby="world-tab"
        >
          <WorldMap
            data={worldData}
            onLocationClick={onLocationClick ? (code, name, count) => onLocationClick(code, name, "country", count) : undefined}
          />
        </div>
      ) : (
        <div
          role="tabpanel"
          id="usa-map-panel"
          aria-labelledby="usa-tab"
        >
          <USAMap
            data={usaData}
            onLocationClick={onLocationClick ? (code, name, count) => onLocationClick(code, name, "state", count) : undefined}
          />
        </div>
      )}
    </div>
  );
}
