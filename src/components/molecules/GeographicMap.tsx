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
}

export function GeographicMap({
  activeView,
  worldData,
  usaData,
  className = "",
}: GeographicMapProps) {
  return (
    <div className={className}>
      {activeView === "world" ? (
        <div
          role="tabpanel"
          id="world-map-panel"
          aria-labelledby="world-tab"
        >
          <WorldMap data={worldData} />
        </div>
      ) : (
        <div
          role="tabpanel"
          id="usa-map-panel"
          aria-labelledby="usa-tab"
        >
          <USAMap data={usaData} />
        </div>
      )}
    </div>
  );
}
