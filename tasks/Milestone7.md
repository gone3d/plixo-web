# Milestone 7: Analytics Data Visualizations

> **Status**: 🔄 IN PROGRESS (Phase 1: 70% complete)
> **Duration**: 21-26 hours (expanded to include US state tracking)
> **Priority**: MEDIUM
> **Dependencies**: Analytics tracking system (Milestone 6)
>
> **Phase 1 Complete**: ✅ World map, bar/pie charts, chart toggles integrated
> **Phase 2 Pending**: ⏳ US state map with tabs (backend + frontend)

---

## Goal

Transform the Insights page from text-based analytics display to rich data visualizations using interactive charts and maps, including state-level analytics for US visitors.

---

## Success Criteria

### Phase 1 (Complete)
- ✅ World map showing geographic distribution with color intensity
- ✅ Bar and pie chart toggle for categorical data (pages, devices, browsers, event types)
- ✅ Interactive hover panels on world map (bottom left)
- ✅ Responsive design for mobile and desktop
- ✅ Performance: Charts render in < 500ms with up to 1000 data points

### Phase 2 (Pending)
- ⏳ USA state map with same visual style as world map
- ⏳ Tab navigation: "World" and "USA" views
- ⏳ Backend region tracking (capture state/province data)
- ⏳ State-level analytics query (US only)
- ⏳ Hover panels showing state name + count + percentage
- ⏳ AlbersUSA projection (proper Alaska/Hawaii positioning)

### Optional
- ⏳ Line chart showing visitor trends over time (when timeframe > 1 day)
- ⏳ Time series API endpoint

---

## Tasks

### 7.1 Install Chart Libraries ✅

**Effort**: ⏱️ XS (15 minutes)
**Status**: COMPLETE

**Dependencies to Install:**
```bash
npm install react-simple-maps recharts
npm install --save-dev @types/react-simple-maps
```

**Libraries:**
- **react-simple-maps**: Lightweight SVG-based world maps with TopoJSON
- **recharts**: React charting library built on D3 (composable, responsive)

---

### 7.2 World Map Component for Geographic Distribution ✅

**Effort**: ⏱️ M (2-3 hours)
**Status**: COMPLETE

**Create: `src/components/molecules/WorldMap.tsx`**

**Features:**
- [ ] Import TopoJSON world data (110m resolution for performance)
- [ ] Choropleth map with color scale based on visitor count
- [ ] Color gradient: `slate-700` (low) → `blue-500` (medium) → `purple-600` (high)
- [ ] Interactive tooltips showing country name + visitor count
- [ ] Responsive SVG scaling
- [ ] Handle missing country codes gracefully
- [ ] Mercator or Natural Earth projection (Cloudflare-style)

**Props Interface:**
```typescript
interface WorldMapProps {
  data: Array<{
    country: string;      // ISO country code (US, GB, etc.)
    countryName: string;  // Display name
    count: number;        // Visitor count
  }>;
  className?: string;
}
```

**Color Scale Logic:**
- Calculate min/max visitor counts
- Create 5-level intensity scale
- Countries with 0 visitors: dark gray
- Countries with data: gradient from blue to purple

---

### 7.3 Chart Toggle Component (Bar/Pie) ✅

**Effort**: ⏱️ S (1 hour)
**Status**: COMPLETE

**Create: `src/components/molecules/ChartToggle.tsx`**

**Features:**
- [ ] Toggle button group (Bar | Pie)
- [ ] Active state highlighting
- [ ] Smooth transition between chart types
- [ ] Accessible keyboard navigation

**Props Interface:**
```typescript
interface ChartToggleProps {
  activeChart: 'bar' | 'pie';
  onToggle: (type: 'bar' | 'pie') => void;
}
```

---

### 7.4 Bar Chart Component (Categorical Data) ✅

**Effort**: ⏱️ M (1.5 hours)
**Status**: COMPLETE

**Create: `src/components/molecules/BarChartComponent.tsx`**

**Use Cases:**
- Top pages by views
- Event types by count
- Device types by count
- Browser families by count

**Features:**
- [ ] Horizontal bars for better label readability
- [ ] Color-coded bars (gradient: blue → purple)
- [ ] Interactive tooltips with formatted numbers
- [ ] Responsive width/height
- [ ] Top 10 items only (performance)
- [ ] Animated bars on load

**Props Interface:**
```typescript
interface BarChartData {
  name: string;   // Label (page path, event type, etc.)
  value: number;  // Count
}

interface BarChartComponentProps {
  data: BarChartData[];
  title: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}
```

---

### 7.5 Pie Chart Component (Categorical Data) ✅

**Effort**: ⏱️ M (1.5 hours)
**Status**: COMPLETE

**Create: `src/components/molecules/PieChartComponent.tsx`**

**Use Cases:**
- Device type distribution (Desktop vs Mobile vs Tablet)
- Browser family distribution
- Event type breakdown

**Features:**
- [ ] Donut chart style (modern, better for percentages)
- [ ] Color palette: blue, purple, cyan, green, orange
- [ ] Interactive tooltips showing percentage + count
- [ ] Legend with color indicators
- [ ] Responsive sizing
- [ ] Animated segments on load
- [ ] Center text showing total count

**Props Interface:**
```typescript
interface PieChartData {
  name: string;   // Category name
  value: number;  // Count
}

interface PieChartComponentProps {
  data: PieChartData[];
  title: string;
  showPercentage?: boolean;
}
```

---

### 7.6 Line Chart Component (Time Series Data)

**Effort**: ⏱️ L (2-3 hours)

**Create: `src/components/molecules/LineChartComponent.tsx`**

**Use Case:**
- Visitor trends over time (when timeframe > 1 day)
- Unique visitors vs Total page views

**Features:**
- [ ] Dual-line chart (visitors + unique visitors)
- [ ] Color-coded lines (blue for total, purple for unique)
- [ ] Interactive tooltips showing date + counts
- [ ] Gradient area fill under lines (optional)
- [ ] Responsive width/height
- [ ] X-axis: Date labels (smart formatting: "Nov 5" or "5 PM")
- [ ] Y-axis: Visitor count (formatted with commas)
- [ ] Dot markers on hover
- [ ] Smooth curves (monotone or basis)

**Props Interface:**
```typescript
interface LineChartData {
  date: string;          // ISO date or timestamp
  visitors: number;      // Total page views
  uniqueVisitors: number; // Unique visitor count
}

interface LineChartComponentProps {
  data: LineChartData[];
  title: string;
  showUniqueVisitors?: boolean;
}
```

**Backend Requirements:**
- [ ] Add new endpoint: `GET /api/analytics/timeseries?since=X&until=Y`
- [ ] Returns daily visitor counts grouped by date
- [ ] Include both total events and unique visitor estimates

---

### 7.7 Integrate Visualizations into Insights Page ✅

**Effort**: ⏱️ M (2 hours)
**Status**: COMPLETE

**Update: `src/pages/Insights.tsx`**

**Changes:**
- [ ] Replace text list for Geographic Distribution with `<WorldMap />`
- [ ] Add chart toggle state for each data section
- [ ] Replace text lists with `<BarChartComponent />` or `<PieChartComponent />`
  - Top Pages: Bar chart (default)
  - Event Types: Bar chart (default)
  - Device Types: Pie chart (default)
  - Browser Families: Pie chart (default)
- [ ] Add time series section (only show if timeframe > 1 day)
- [ ] Fetch timeseries data when needed
- [ ] Maintain existing fallback text lists for accessibility

**Conditional Rendering:**
```typescript
{timeRange !== 'hour_1' && (
  <LineChartComponent
    data={timeseriesData}
    title="Visitor Trends"
    showUniqueVisitors={true}
  />
)}
```

---

### 7.8 Styling and Polish

**Effort**: ⏱️ S (1 hour)

**Tasks:**
- [ ] Consistent card styling for all charts
- [ ] Loading skeletons for chart containers
- [ ] Empty state messages ("No data to display")
- [ ] Responsive breakpoints (mobile: stacked, desktop: grid)
- [ ] Dark mode colors for all charts
- [ ] Glassmorphism backgrounds matching site theme
- [ ] Chart container hover effects

**Color Palette:**
- Primary: `blue-500` (#3B82F6)
- Secondary: `purple-500` (#A855F7)
- Accent: `cyan-400` (#22D3EE)
- Success: `green-500` (#10B981)
- Warning: `orange-500` (#F97316)
- Neutral: `slate-700` (#334155)

---

## Technical Considerations

### Performance
- Limit data points: Top 10 for bar/pie charts
- Lazy load chart libraries (code splitting)
- Debounce chart resizing on window resize
- Use CSS transforms for animations (hardware accelerated)

### Accessibility
- ARIA labels for all charts
- Keyboard navigation for chart toggles
- Screen reader-friendly data tables as fallback
- High contrast colors (WCAG AA compliant)

### Responsive Design
- Mobile: Single column, stacked charts
- Tablet: 2-column grid
- Desktop: 2-3 column grid
- Chart heights: Mobile 200px, Desktop 300px

---

## API Changes Required

### New Endpoint: Time Series Data
**Endpoint:** `GET /api/analytics/timeseries`

**Query Parameters:**
- `since`: Start date (YYYY-MM-DD)
- `until`: End date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "timeRange": { "since": "2025-11-01", "until": "2025-11-05" },
  "data": [
    {
      "date": "2025-11-01",
      "visitors": 45,
      "uniqueVisitors": 32,
      "pageViews": 120
    },
    {
      "date": "2025-11-02",
      "visitors": 67,
      "uniqueVisitors": 48,
      "pageViews": 189
    }
  ]
}
```

**Backend Implementation:**
- Query `analytics_events` table
- Group by `DATE(created_at)`
- Count total events, estimate unique visitors (distinct IP hashes per day)

---

## Phase 2: US State-Level Analytics (NEW)

> **Goal**: Add tabbed map view showing US state-level visitor distribution
>
> **Why**: Currently only tracking country-level data. Users want to see which US states visitors come from.
>
> **Approach**:
> 1. Backend: Capture `request.cf?.region` (state code) from Cloudflare
> 2. Backend: Add `region_code` column to database
> 3. Backend: Create query for US state aggregation
> 4. Frontend: Build USA state map using us-atlas TopoJSON
> 5. Frontend: Add tabs to toggle between World and USA views
>
> **Key Features**:
> - Same color scale as world map (0-20%, 20-40%, etc.)
> - Same hover panel design (bottom left)
> - Tab navigation with visitor counts: "World (41)" and "USA (38)"
> - AlbersUSA projection for proper state positioning
> - 70% opacity fills with visible borders

---

### 7.9 Backend: Add Region/State Tracking

**Effort**: ⏱️ M (1.5 hours)

**Database Migration: `0004_add_region_tracking.sql`**

**Tasks:**
- [ ] Create new migration file in `plixo-api/src/db/migrations/`
- [ ] Add `region_code TEXT` column to `analytics_events` table
- [ ] Add index: `CREATE INDEX idx_analytics_events_region ON analytics_events(region_code)`
- [ ] Run migration locally: `npx wrangler d1 execute plixo-api-db --local --file=./src/db/migrations/0004_add_region_tracking.sql`
- [ ] Run migration on production: `npx wrangler d1 execute plixo-api-db --remote --file=./src/db/migrations/0004_add_region_tracking.sql`

**Migration SQL:**
```sql
-- Add region/state tracking for US state-level analytics
-- Region codes: CA, TX, NY, etc. (ISO 3166-2 subdivision codes)

ALTER TABLE analytics_events ADD COLUMN region_code TEXT;

-- Index for region queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_region ON analytics_events(region_code);

-- Index for US state queries (country + region)
CREATE INDEX IF NOT EXISTS idx_analytics_events_us_states ON analytics_events(country_code, region_code) WHERE country_code = 'US';
```

---

### 7.10 Backend: Update Analytics Tracking Service

**Effort**: ⏱️ S (45 minutes)

**Update: `plixo-api/functions/api/analytics/track.ts`**

**Changes:**
- [ ] Capture `request.cf?.region` from Cloudflare
- [ ] Add `region` to event context
- [ ] Update `context` interface to include region

**Code Changes:**
```typescript
// Build analytics event with context
const event: AnalyticsEvent = {
  eventType: body.event as AnalyticsEvent['eventType'],
  metadata: body.metadata || {},
  metrics: body.metrics || {},
  context: {
    country: (request.cf?.country as string) || 'unknown',
    region: (request.cf?.region as string) || null, // NEW: State/province code
    deviceType: detectDeviceType(request.headers.get('user-agent')),
    browserFamily: detectBrowserFamily(request.headers.get('user-agent')),
  },
};
```

**Update: `plixo-api/src/lib/services/analytics.service.ts`**
- [ ] Add `region_code` to INSERT statement
- [ ] Update context interface to include `region?: string`

---

### 7.11 Backend: Add US State Query Method

**Effort**: ⏱️ M (1 hour)

**Update: `plixo-api/src/lib/services/analyticsD1Query.service.ts`**

**Add New Interface:**
```typescript
export interface CustomAnalyticsData {
  // ... existing fields ...
  eventsByUSState: Array<{
    state: string;        // State code (CA, TX, NY)
    stateName: string;    // Full name (California, Texas, New York)
    count: number;
  }>;
}
```

**Add New Query Method:**
```typescript
/**
 * Query events by US state (only for country_code = 'US')
 */
private async queryEventsByUSState(
  range: TimeRange
): Promise<Array<{ state: string; stateName: string; count: number }>> {
  const { sinceTimestamp, untilTimestamp } = this.getTimestampRange(range);

  const results = await this.db
    .prepare(
      `SELECT region_code as state, COUNT(*) as count
       FROM analytics_events
       WHERE event_type = 'page_view'
         AND country_code = 'US'
         AND region_code IS NOT NULL
         AND created_at >= ? AND created_at <= ?
       GROUP BY region_code
       ORDER BY count DESC
       LIMIT 50`
    )
    .bind(sinceTimestamp, untilTimestamp)
    .all<{ state: string; count: number }>();

  return (results.results || [])
    .filter((item) => item.state !== null)
    .map((item) => ({
      state: item.state,
      stateName: this.getStateName(item.state), // Helper to convert CA → California
      count: item.count,
    }));
}
```

**Add State Name Helper:**
```typescript
/**
 * Convert state code to full name
 */
private getStateName(code: string): string {
  const stateNames: Record<string, string> = {
    AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas',
    CA: 'California', CO: 'Colorado', CT: 'Connecticut',
    DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
    HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana',
    IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
    ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts',
    MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
    MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
    NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico',
    NY: 'New York', NC: 'North Carolina', ND: 'North Dakota',
    OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon',
    PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
    SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas',
    UT: 'Utah', VT: 'Vermont', VA: 'Virginia',
    WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin',
    WY: 'Wyoming', DC: 'District of Columbia',
    PR: 'Puerto Rico', VI: 'Virgin Islands', GU: 'Guam',
    AS: 'American Samoa', MP: 'Northern Mariana Islands',
  };
  return stateNames[code] || code;
}
```

**Update `getCustomAnalytics()` Method:**
- [ ] Add `queryEventsByUSState(range)` to Promise.all
- [ ] Include `eventsByUSState` in return object

---

### 7.12 Frontend: USA State Map Component

**Effort**: ⏱️ L (2-3 hours)

**Create: `src/components/molecules/USAMap.tsx`**

**Features:**
- [ ] Import US TopoJSON data (states-10m.json)
- [ ] Choropleth map with same color scale as WorldMap
- [ ] State-level visitor distribution
- [ ] Hover panel (bottom left) showing state name + count + percentage
- [ ] AlbersUSA projection for proper US map display (including Alaska & Hawaii)
- [ ] Responsive SVG scaling
- [ ] 70% opacity fills with visible borders

**Props Interface:**
```typescript
interface USAMapData {
  state: string;      // State code (CA, TX, NY)
  stateName: string;  // Full name
  count: number;      // Visitor count
}

interface USAMapProps {
  data: USAMapData[];
  className?: string;
}
```

**TopoJSON Data Source:**
- Use CDN: `https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json`
- 10m resolution for good performance
- Includes all 50 states + DC, PR, territories

**Projection:**
```typescript
<ComposableMap
  projection="geoAlbersUsa"
  projectionConfig={{
    scale: 1000,
  }}
  width={975}
  height={610}
>
```

---

### 7.13 Frontend: Map Tab Navigation Component

**Effort**: ⏱️ S (1 hour)

**Create: `src/components/molecules/MapTabs.tsx`**

**Features:**
- [ ] Tab buttons: "World" and "USA"
- [ ] Active tab highlighting
- [ ] Smooth transition between maps
- [ ] Accessible keyboard navigation (arrow keys)
- [ ] ARIA attributes for screen readers

**Props Interface:**
```typescript
type MapView = 'world' | 'usa';

interface MapTabsProps {
  activeView: MapView;
  onViewChange: (view: MapView) => void;
  worldCount: number;  // Total visitors worldwide
  usaCount: number;    // Total US visitors
  className?: string;
}
```

**Tab Display:**
- "World" tab with total visitor count: `World (41 visitors)`
- "USA" tab with US-only count: `USA (38 visitors)`
- Active tab: blue-500 background, white text
- Inactive tab: slate-800/40 background, slate-400 text
- Hover: slight color change

---

### 7.14 Frontend: Integrate Tabs into WorldMap

**Effort**: ⏱️ M (1.5 hours)

**Update: `src/components/molecules/WorldMap.tsx`**

**Rename to:** `src/components/molecules/GeographicMap.tsx` (wrapper component)

**Changes:**
- [ ] Add state for active map view: `const [view, setView] = useState<'world' | 'usa'>('world')`
- [ ] Render `<MapTabs />` at the top
- [ ] Conditionally render `<WorldMapView />` or `<USAMapView />`
- [ ] Calculate total counts for each view
- [ ] Maintain existing WorldMap features (hover panel, zoom, color scale)

**New Component Structure:**
```typescript
export function GeographicMap({ worldData, usaData, className }: GeographicMapProps) {
  const [view, setView] = useState<'world' | 'usa'>('world');

  const worldTotal = worldData.reduce((sum, c) => sum + c.count, 0);
  const usaTotal = usaData.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className={className}>
      <MapTabs
        activeView={view}
        onViewChange={setView}
        worldCount={worldTotal}
        usaCount={usaTotal}
      />

      {view === 'world' ? (
        <WorldMapView data={worldData} />
      ) : (
        <USAMapView data={usaData} />
      )}
    </div>
  );
}
```

---

### 7.15 Frontend: Update Insights Page with Tabbed Maps

**Effort**: ⏱️ S (45 minutes)

**Update: `src/pages/Insights.tsx`**

**Changes:**
- [ ] Import `GeographicMap` instead of `WorldMap`
- [ ] Pass both `worldData` and `usaData` props
- [ ] Extract US state data from `analyticsData.customAnalytics.eventsByUSState`
- [ ] Update section title to just "Geographic Distribution" (remove visitor count)
- [ ] Move total visitor count to tab labels

**Code Changes:**
```typescript
// Extract data
const worldData = analyticsData.customAnalytics.eventsByCountry;
const usaData = analyticsData.customAnalytics.eventsByUSState || [];

// Render
<div className="bg-slate-800/40 rounded-xl p-8 border border-slate-700/40">
  <div className="flex items-center gap-3 mb-6">
    <Icon name="globe" size="lg" className="text-yellow-400" />
    <h2 className="text-2xl font-semibold">Geographic Distribution</h2>
  </div>
  <GeographicMap worldData={worldData} usaData={usaData} />
</div>
```

---

### 7.16 Testing: US State Map Features

**Effort**: ⏱️ S (30 minutes)

**Test Cases:**
- [ ] US map renders all 50 states correctly
- [ ] Alaska and Hawaii positioned correctly (AlbersUSA projection)
- [ ] State colors match visitor count intensity
- [ ] Hover panel shows correct state name and count
- [ ] Tab navigation switches between World and USA smoothly
- [ ] Total counts on tabs are accurate
- [ ] Both maps maintain same color scale (0-20%, 20-40%, etc.)
- [ ] Responsive on mobile (stacked layout)
- [ ] Keyboard navigation works (Tab to switch, Enter to activate)

**Edge Cases:**
- [ ] Handle states with 0 visitors (show 0 in hover panel)
- [ ] Handle missing US state data gracefully
- [ ] Verify DC, Puerto Rico, and territories display correctly

---

### 7.17 Documentation: Region Tracking

**Effort**: ⏱️ XS (15 minutes)

**Update Files:**
- [ ] Update `plixo-api/README.md` with region tracking details
- [ ] Document state code format (ISO 3166-2)
- [ ] Note Cloudflare provides region automatically
- [ ] Add privacy note: "State-level only, no city/zip tracking"

**Update Type Definitions:**
- [ ] Confirm `src/types/analytics.ts` includes `region?: string`
- [ ] Add JSDoc comments explaining region usage

---

## Testing Checklist

### Chart Visualizations
- [ ] World map renders with correct country coloring
- [ ] USA state map renders all 50 states + territories correctly
- [ ] Map tabs switch smoothly between World and USA views
- [ ] All chart types render without errors
- [ ] Chart toggle switches smoothly between bar/pie
- [ ] Tooltips show correct data on hover
- [ ] Hover panels (bottom left) display correctly on both maps
- [ ] Line chart only appears when timeframe > 1 day

### Data Accuracy
- [ ] World map shows correct visitor counts by country
- [ ] USA map shows correct visitor counts by state
- [ ] Tab labels show accurate totals (World: 41, USA: 38)
- [ ] Percentage calculations are correct (relative to maximum)
- [ ] State names convert correctly (CA → California)

### Responsive Design
- [ ] Responsive layout works on mobile (320px width)
- [ ] Maps scale properly on all screen sizes
- [ ] Hover panels don't overflow on small screens
- [ ] Tab navigation works on touch devices

### Performance & Polish
- [ ] Charts animate smoothly on initial load
- [ ] Map transitions are smooth (no flickering)
- [ ] Empty state displays when no data available
- [ ] Loading states show skeleton loaders
- [ ] All charts are accessible via keyboard navigation
- [ ] Alaska and Hawaii positioned correctly on USA map

---

## Files to Create

**Frontend Components:**
```
src/components/molecules/
  ├── WorldMap.tsx (enhanced with tabs)
  ├── USAMap.tsx (NEW - state-level map)
  ├── MapTabs.tsx (NEW - World/USA toggle)
  ├── GeographicMap.tsx (NEW - wrapper with tabs)
  ├── ChartToggle.tsx
  ├── BarChartComponent.tsx
  ├── PieChartComponent.tsx
  └── LineChartComponent.tsx
```

**Backend API:**
```
plixo-api/functions/api/analytics/
  └── timeseries.ts

plixo-api/src/db/migrations/
  └── 0004_add_region_tracking.sql (NEW)
```

**Backend Services (Updates):**
```
plixo-api/src/lib/services/
  ├── analytics.service.ts (add region_code column)
  └── analyticsD1Query.service.ts (add queryEventsByUSState)

plixo-api/functions/api/analytics/
  └── track.ts (capture request.cf?.region)
```

**Services (if needed):**
```
src/services/
  └── chartUtils.ts (color scales, formatters)
```

---

## Dependencies

**npm packages:**
- `react-simple-maps` (^3.0.0) - World and USA maps
- `recharts` (^2.15.0) - Bar/pie/line charts
- `@types/react-simple-maps` (dev dependency)

**CDN Resources:**
- World TopoJSON: `https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json`
- USA TopoJSON: `https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json`

**Existing:**
- Analytics tracking system (Milestone 6)
- D1 database with `analytics_events` table
- `/api/analytics/overview` endpoint

**New Backend Requirements:**
- Cloudflare Workers `request.cf?.region` API
- Database migration: Add `region_code` column
- Updated analytics queries for US state data

---

## Estimated Timeline

| Task | Duration |
|------|----------|
| 7.1 Install libraries | 15 min |
| 7.2 World map component | 2-3 hours |
| 7.3 Chart toggle | 1 hour |
| 7.4 Bar chart component | 1.5 hours |
| 7.5 Pie chart component | 1.5 hours |
| 7.6 Line chart component | 2-3 hours |
| 7.7 Integrate into Insights | 2 hours |
| 7.8 Styling and polish | 1 hour |
| **7.9 Backend: Region tracking migration** | **1.5 hours** |
| **7.10 Backend: Update tracking service** | **45 min** |
| **7.11 Backend: US state query method** | **1 hour** |
| **7.12 Frontend: USA state map** | **2-3 hours** |
| **7.13 Frontend: Map tabs component** | **1 hour** |
| **7.14 Frontend: Integrate tabs** | **1.5 hours** |
| **7.15 Frontend: Update Insights page** | **45 min** |
| **7.16 Testing: US state features** | **30 min** |
| **7.17 Documentation** | **15 min** |
| Backend timeseries endpoint (optional) | 1 hour |
| Final testing | 1 hour |
| **Total** | **21-26 hours** |

**Phase Breakdown:**
- **Phase 1** (Tasks 7.1-7.8): Basic visualizations - 12-15 hours
- **Phase 2** (Tasks 7.9-7.17): US state tracking - 9-11 hours

---

## Next Steps After Milestone 7

- Add export functionality (download charts as images)
- Real-time updates with WebSocket
- Advanced filters (date range picker, country filter)
- Comparison mode (compare two time periods)
- Custom dashboard builder

---

---

**Milestone 7 Status**: 🔄 IN PROGRESS

**Phase 1 Summary (Complete):**
- ✅ World map with hover panels
- ✅ Bar and pie chart components
- ✅ Chart toggle functionality
- ✅ Integration into Insights page
- ✅ Responsive styling and polish

**Phase 2 Summary (Pending Review):**
- ⏳ Backend: Database migration for region tracking
- ⏳ Backend: Update analytics tracking to capture state data
- ⏳ Backend: Add US state query methods
- ⏳ Frontend: USA state map component
- ⏳ Frontend: Map tabs (World/USA toggle)
- ⏳ Frontend: Integrate tabbed maps into Insights

**Next Action:** Review Phase 2 tasks and approve for implementation

---

## Phase 3: Admin Login Audit Tracking (NEW)

> **Goal**: Track detailed login information for admin users with complete Cloudflare request data for security audit and compliance.
>
> **Why**: Security monitoring, compliance requirements (SOC 2, ISO 27001), detect compromised accounts, track privilege escalation.
>
> **Approach**:
> 1. Backend: Create `admin_login_audit` table for detailed login tracking
> 2. Backend: Create repository for audit operations
> 3. Backend: Capture all available Cloudflare request.cf data on login
> 4. Backend: Implement automated 30-day data purge (Cloudflare Cron Trigger)
> 5. Frontend: Map tabs moved to right side (space optimization)
>
> **Key Features**:
> - Capture IP address, geographic location (city-level), ASN, timezone
> - Track both successful and failed login attempts
> - Record HTTP protocol, TLS version, User-Agent
> - Automated 30-day purge for privacy compliance (GDPR/CCPA)
> - Privacy-first: No PII beyond necessary audit data
>
> **Data Captured**:
> - **Network**: IP address, ASN, AS organization, Cloudflare colo
> - **Geographic**: Country, region/state, city, timezone, lat/long, postal code
> - **Request**: User-Agent, HTTP protocol, TLS version
> - **Login**: Success/failure, reason for failure, timestamp

---

### 7.18 Backend: Admin Login Audit Database Migration

**Effort**: ⏱️ M (1 hour)
**Status**: ✅ COMPLETE

**Migration File: `plixo-api/src/db/migrations/0005_admin_login_audit.sql`**

**Tables Created:**
- `admin_login_audit` - Main audit log table
  - Tracks user_id, username, IP address
  - Geographic location (country, region, city, timezone, lat/long, postal code, metro code)
  - Network details (ASN, AS organization, Cloudflare colo)
  - Request information (User-Agent, HTTP protocol, TLS version)
  - Login result (success/failure, failure reason)
  - Created timestamp

**Indexes:**
- `idx_admin_audit_user` - Query by user_id
- `idx_admin_audit_timestamp` - Query by date range
- `idx_admin_audit_ip` - Query by IP address
- `idx_admin_audit_success` - Query by login success/failure
- `idx_admin_audit_user_failed` - Composite index for failed login queries

**Privacy Compliance:**
- 30-day automated purge via Cloudflare Cron Trigger
- IP addresses stored (justified for security audit)
- City-level geographic data (no street addresses)
- Retention policy: 30 days maximum

---

### 7.19 Backend: Admin Audit Repository

**Effort**: ⏱️ S (45 minutes)
**Status**: ✅ COMPLETE

**Create: `plixo-api/src/lib/repositories/admin-audit.repository.ts`**

**Methods:**
- `recordLoginAttempt(data: AdminLoginAuditData)` - Record login attempt
- `getUserLoginHistory(userId, limit)` - Get recent logins for user
- `getFailedLoginsByIP(ipAddress, since)` - Detect brute force attacks
- `purgeOldLogs(beforeDate)` - Delete logs older than 30 days

**Features:**
- Full type safety with TypeScript interfaces
- Error handling for failed inserts
- Performance-optimized queries with proper indexing
- GDPR-compliant data management

---

### 7.20 Backend: Update Auth Service for Audit Tracking

**Effort**: ⏱️ M (1.5 hours)
**Status**: ✅ COMPLETE

**Update: `plixo-api/src/lib/services/auth.service.ts`**

**Changes:**
- Added `CloudflareRequestData` interface with all available request.cf properties
- Updated `login()` method to accept optional `requestData` parameter
- Record audit data for:
  - ✅ Successful logins
  - ✅ Failed logins (user not found)
  - ✅ Failed logins (password mismatch)
  - ✅ Unexpected errors during login
- Added `AdminAuditRepository` to constructor dependencies

**Interface:**
```typescript
export interface CloudflareRequestData {
  ip: string;
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  latitude?: string;
  longitude?: string;
  postalCode?: string;
  metroCode?: string;
  asn?: string;
  asOrganization?: string;
  colo?: string;
  userAgent?: string;
  httpProtocol?: string;
  tlsVersion?: string;
}
```

---

### 7.21 Backend: Update Login Endpoint

**Effort**: ⏱️ S (30 minutes)
**Status**: ✅ COMPLETE

**Update: `plixo-api/functions/api/auth/login.ts`**

**Changes:**
- Import `AdminAuditRepository` and `CloudflareRequestData`
- Capture all Cloudflare request.cf properties from context
- Pass `requestData` to `authService.login()` method
- Instantiate `AdminAuditRepository` in login handler

**Data Captured from Cloudflare:**
- `request.headers.get('CF-Connecting-IP')` - Real visitor IP
- `request.cf?.country` - Country code
- `request.cf?.region` - State/province code
- `request.cf?.city` - City name
- `request.cf?.timezone` - IANA timezone
- `request.cf?.latitude` - Latitude coordinate
- `request.cf?.longitude` - Longitude coordinate
- `request.cf?.postalCode` - ZIP/postal code
- `request.cf?.metroCode` - DMA metro code
- `request.cf?.asn` - Autonomous System Number
- `request.cf?.asOrganization` - ISP/organization name
- `request.cf?.colo` - Cloudflare data center code
- `request.headers.get('user-agent')` - Browser/device info
- `request.cf?.httpProtocol` - HTTP version
- `request.cf?.tlsVersion` - TLS version

---

### 7.22 Backend: Automated 30-Day Purge (Cron Trigger)

**Effort**: ⏱️ M (1 hour)
**Status**: ✅ COMPLETE

**Create: `plixo-api/functions/scheduled/purge-old-audit-logs.ts`**

**Features:**
- Runs daily at 2 AM UTC via Cloudflare Cron Trigger
- Deletes `admin_login_audit` records older than 30 days
- Privacy compliance: Automatic data retention enforcement
- Error handling: Logs failures without breaking cron job
- Returns count of purged records

**Configuration: `plixo-api/wrangler.toml`**
```toml
[triggers]
crons = ["0 2 * * *"]  # Daily at 2 AM UTC
```

**Cron Trigger Behavior:**
- Runs automatically in production (no manual intervention)
- Cloudflare manages scheduling and retries
- Logs visible in Cloudflare dashboard
- Free tier compatible (1 scheduled job included)

**Data Retention Policy:**
- Admin login audit logs: 30 days maximum
- Automated purge prevents manual cleanup
- GDPR/CCPA compliant retention period
- Justification: Security audit, fraud prevention

---

### 7.23 Frontend: Map Tabs Spacing Optimization

**Effort**: ⏱️ XS (15 minutes)
**Status**: ✅ COMPLETE

**Update: `plixo-web/src/components/molecules/MapTabs.tsx`**

**Changes:**
- Removed `mb-6` margin (let parent handle spacing)
- Updated button padding from `px-6 py-3` to `px-4 py-2` (match ChartToggle)
- Reduced gap between elements from `gap-2` to `gap-1.5`
- Added `text-sm` to emoji spans for consistent sizing

**Update: `plixo-web/src/pages/Insights.tsx`**

**Changes:**
- Moved `MapTabs` from inside `GeographicMap` to page header (right side)
- Added `mapView` state to Insights page
- Passed `activeView` prop to `GeographicMap`
- Calculated totals for World and USA in page component
- Aligned spacing with other section headers (Top Pages, Event Types)

**Result:**
- Uniform spacing across all dashboard sections
- Consistent toggle button sizing (Bar/Pie vs World/USA)
- Space optimization: Tabs on right, title on left
- Professional, polished UI matching Cloudflare Analytics design

---

## Phase 3 Implementation Summary

### Files Created (Backend - plixo-api)
```
src/db/migrations/
  └── 0005_admin_login_audit.sql (NEW)

src/lib/repositories/
  └── admin-audit.repository.ts (NEW)

functions/scheduled/
  └── purge-old-audit-logs.ts (NEW)
```

### Files Modified (Backend - plixo-api)
```
src/lib/services/
  └── auth.service.ts (added CloudflareRequestData + audit tracking)

functions/api/auth/
  └── login.ts (capture Cloudflare data + pass to auth service)

wrangler.toml (added cron trigger configuration)
```

### Files Modified (Frontend - plixo-web)
```
src/components/molecules/
  ├── MapTabs.tsx (spacing optimization)
  └── GeographicMap.tsx (accept activeView prop)

src/pages/
  └── Insights.tsx (map tabs moved to header right side)
```

---

## Phase 3 Testing Checklist

### Admin Audit Tracking
- [ ] Successful admin login recorded with all Cloudflare data
- [ ] Failed login (wrong password) recorded with failure reason
- [ ] Failed login (user not found) recorded with failure reason
- [ ] IP address captured correctly (CF-Connecting-IP header)
- [ ] Geographic data captured (country, region, city, timezone)
- [ ] Network data captured (ASN, AS organization, Cloudflare colo)
- [ ] Request data captured (User-Agent, HTTP protocol, TLS version)
- [ ] Login success boolean set correctly (1 for success, 0 for failure)

### Database & Repository
- [ ] `admin_login_audit` table created successfully
- [ ] All indexes created and operational
- [ ] `recordLoginAttempt()` inserts data without errors
- [ ] `getUserLoginHistory()` returns recent logins correctly
- [ ] `getFailedLoginsByIP()` counts failed attempts accurately
- [ ] `purgeOldLogs()` deletes records older than 30 days

### Automated Purge
- [ ] Cron trigger configured in wrangler.toml
- [ ] Scheduled function runs daily at 2 AM UTC
- [ ] Old audit logs deleted automatically after 30 days
- [ ] Purge count logged correctly in Cloudflare dashboard
- [ ] Error handling prevents cron job failure

### Frontend Spacing
- [ ] Map tabs moved to right side of header
- [ ] Spacing matches Top Pages section
- [ ] Button sizes match ChartToggle component
- [ ] Responsive design maintained on mobile
- [ ] Tab navigation still works correctly

---

## Privacy & Compliance Notes (Phase 3)

### GDPR/CCPA Compliance
- **Lawful Basis**: Legitimate interest (security monitoring, fraud prevention)
- **Data Minimization**: Only capture data necessary for security audit
- **Retention Limit**: Automatic 30-day purge enforced by cron job
- **Transparency**: Update privacy policy to mention admin activity logging

### Security Benefits
- **Detect Compromised Accounts**: Unusual login locations/times
- **Track Privilege Escalation**: Monitor admin access patterns
- **Audit Trail**: Compliance with SOC 2, ISO 27001 requirements
- **Brute Force Detection**: Count failed logins by IP address
- **Incident Response**: Complete forensic data for security investigations

### Data Protection Measures
- **IP Addresses**: Stored for security (justified under GDPR Article 6(1)(f))
- **Geographic Precision**: City-level only (no street addresses)
- **Automatic Purge**: No manual cleanup required
- **Access Control**: Audit logs only accessible to admins
- **Encryption**: HTTPS for all data transmission

---

**Phase 3 Status**: ✅ COMPLETE
**Implementation Date**: 2025-11-05
**Deployment Status**: Ready for production (database migration pending)
