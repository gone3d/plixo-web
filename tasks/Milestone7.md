# Milestone 7: Analytics Data Visualizations

> **Status**: 📋 PLANNING
> **Duration**: 4-6 hours
> **Priority**: MEDIUM
> **Dependencies**: Analytics tracking system (Milestone 6)

---

## Goal

Transform the Insights page from text-based analytics display to rich data visualizations using interactive charts and maps.

---

## Success Criteria

- ✅ World map showing geographic distribution with color intensity
- ✅ Bar and pie chart toggle for categorical data (pages, devices, browsers, event types)
- ✅ Line chart showing visitor trends over time (when timeframe > 1 day)
- ✅ Interactive tooltips on all visualizations
- ✅ Responsive design for mobile and desktop
- ✅ Performance: Charts render in < 500ms with up to 1000 data points

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

## Testing Checklist

- [ ] World map renders with correct country coloring
- [ ] All chart types render without errors
- [ ] Chart toggle switches smoothly between bar/pie
- [ ] Tooltips show correct data on hover
- [ ] Line chart only appears when timeframe > 1 day
- [ ] Responsive layout works on mobile (320px width)
- [ ] Charts animate smoothly on initial load
- [ ] Empty state displays when no data available
- [ ] Loading states show skeleton loaders
- [ ] All charts are accessible via keyboard navigation

---

## Files to Create

**Components:**
```
src/components/molecules/
  ├── WorldMap.tsx
  ├── ChartToggle.tsx
  ├── BarChartComponent.tsx
  ├── PieChartComponent.tsx
  └── LineChartComponent.tsx
```

**Backend:**
```
functions/api/analytics/
  └── timeseries.ts
```

**Services (if needed):**
```
src/services/
  └── chartUtils.ts (color scales, formatters)
```

---

## Dependencies

**npm packages:**
- `react-simple-maps` (^3.0.0)
- `recharts` (^2.15.0)
- `@types/react-simple-maps` (dev dependency)

**Existing:**
- Analytics tracking system (Milestone 6)
- D1 database with `analytics_events` table
- `/api/analytics/overview` endpoint

---

## Estimated Timeline

| Task | Duration |
|------|----------|
| Install libraries | 15 min |
| World map component | 2-3 hours |
| Chart toggle | 1 hour |
| Bar chart component | 1.5 hours |
| Pie chart component | 1.5 hours |
| Line chart component | 2-3 hours |
| Integrate into Insights | 2 hours |
| Styling and polish | 1 hour |
| Backend timeseries endpoint | 1 hour |
| Testing | 1 hour |
| **Total** | **12-15 hours** |

---

## Next Steps After Milestone 7

- Add export functionality (download charts as images)
- Real-time updates with WebSocket
- Advanced filters (date range picker, country filter)
- Comparison mode (compare two time periods)
- Custom dashboard builder

---

**Milestone 7 Status**: 📋 PLANNING - Ready for review and approval
