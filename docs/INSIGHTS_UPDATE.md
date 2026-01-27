# Insights Update: City-Level Analytics (Admin Only)

> **Feature Request**: Display granular city-level analytics for admin users only
> **Current Issue**: Nebraska visits show up frequently, but can't identify which cities
> **Created**: 2026-01-27

---

## Current State

### What Works ✅
- Country-level analytics displayed on world map
- US state-level analytics displayed on USA map
- Location details modal shows breakdown by pages, devices, browsers
- Session-based analytics captures full location data (city, region, lat/long)

### What's Missing ❌
- **City-level visibility** - Data is collected but not displayed
- **Admin-only drill-down** - No role-based restrictions on detailed location data
- **City ranking/filtering** - Can't easily see top cities within a state or country

### Data Architecture
```
analytics_sessions table (has ALL location data):
├── country_code (e.g., "US")
├── region_code (e.g., "NE" for Nebraska)
├── city (e.g., "Omaha", "Lincoln")
├── postal_code
├── latitude / longitude
└── session_id (primary key)

analytics_events table (lightweight):
├── event_type, page_path, etc.
├── country_code (duplicated for fast queries)
├── region_code (duplicated for fast queries)
├── session_id (JOIN to sessions for full context)
└── NO city column (must JOIN)
```

**Key Discovery**: City data exists in `analytics_sessions`, but current queries don't JOIN to retrieve it.

---

## Proposed Solution

### 1. Backend API Changes

#### New Query Method: `queryEventsByCity()`

**File**: `plixo-api/src/lib/services/analyticsD1Query.service.ts`

Add new method to query events grouped by city (requires JOIN with sessions):

```typescript
/**
 * Query events grouped by city (with optional country/state filter)
 * Requires JOIN with analytics_sessions to access city data
 */
private async queryEventsByCity(
  range: TimeRange,
  countryCode?: string,
  regionCode?: string
): Promise<Array<{ city: string; region: string; country: string; count: number }>> {
  const { sinceTimestamp, untilTimestamp } = this.getTimestampRange(range);

  // Build WHERE clause based on filters
  let whereClause = 's.city IS NOT NULL';
  const bindings: any[] = [];

  if (countryCode) {
    whereClause += ' AND s.country_code = ?';
    bindings.push(countryCode);

    if (regionCode) {
      whereClause += ' AND s.region_code = ?';
      bindings.push(regionCode);
    }
  }

  bindings.push(sinceTimestamp, untilTimestamp);

  const results = await this.db
    .prepare(
      `SELECT
         s.city as city,
         s.region_code as region,
         s.country_code as country,
         COUNT(e.id) as count
       FROM analytics_sessions s
       LEFT JOIN analytics_events e ON e.session_id = s.id
       WHERE ${whereClause}
         AND e.created_at >= ? AND e.created_at <= ?
       GROUP BY s.city, s.region_code, s.country_code
       ORDER BY count DESC
       LIMIT 50`
    )
    .bind(...bindings)
    .all<{ city: string; region: string; country: string; count: number }>();

  return results.results || [];
}
```

#### New API Endpoint: `/admin/analytics/cities`

**File**: `plixo-api/functions/admin/analytics/cities.ts` (NEW)

```typescript
/**
 * GET /admin/analytics/cities
 * Returns city-level analytics breakdown (ADMIN ONLY)
 *
 * Query params:
 * - since, until (date range)
 * - country (optional filter, e.g., "US")
 * - state (optional filter, e.g., "NE" for Nebraska)
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  // Middleware already enforces admin role

  const url = new URL(context.request.url);
  const since = url.searchParams.get('since');
  const until = url.searchParams.get('until');
  const country = url.searchParams.get('country');
  const state = url.searchParams.get('state');

  const analyticsService = new AnalyticsD1QueryService(context.env.DB);

  const timeRange = since && until ? { since, until } : undefined;
  const cities = await analyticsService.queryEventsByCity(
    timeRange,
    country || undefined,
    state || undefined
  );

  return Response.json({
    success: true,
    data: cities,
    filters: { country, state },
    timeRange
  });
};
```

**Security**: Place under `/admin/analytics/` so existing admin middleware applies automatically.

---

### 2. Frontend UI Changes

#### A. Add "View Cities" Button to Location Details Modal (Admin Only)

**File**: `plixo-web/src/components/molecules/LocationDetailsModal.tsx`

Add conditional button when user is admin and viewing a US state:

```typescript
import { useAuth } from '../../contexts/AuthContext'

// Inside component:
const { hasRole } = useAuth()
const isAdmin = hasRole('admin')

// After existing device/browser charts:
{isAdmin && locationType === 'state' && (
  <div className="bg-slate-800/40 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">City Breakdown</h3>
      <Button
        onClick={() => setShowCities(!showCities)}
        variant="secondary"
        size="sm"
      >
        {showCities ? 'Hide' : 'View'} Cities
      </Button>
    </div>

    {showCities && (
      <CitiesList
        locationCode={locationCode}
        timeRange={timeRange}
      />
    )}
  </div>
)}
```

#### B. New Component: `CitiesList`

**File**: `plixo-web/src/components/molecules/CitiesList.tsx` (NEW)

Displays ranked list of cities with visit counts:

```typescript
interface City {
  city: string
  region: string
  country: string
  count: number
}

export const CitiesList = ({
  locationCode,
  timeRange
}: {
  locationCode: string
  timeRange: string
}) => {
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCities()
  }, [locationCode, timeRange])

  const fetchCities = async () => {
    // Calculate date range from timeRange string
    const now = new Date()
    const daysAgo = new Date(now.getTime() - parseInt(timeRange) * 24 * 60 * 60 * 1000)
    const since = formatDate(daysAgo)
    const until = formatDate(now)

    const response = await fetch(
      `${API_BASE_URL}/admin/analytics/cities?country=US&state=${locationCode}&since=${since}&until=${until}`,
      {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      }
    )

    const data = await response.json()
    if (data.success) {
      setCities(data.data)
    }
    setLoading(false)
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-2">
      {cities.length === 0 ? (
        <p className="text-slate-500 text-sm italic">No city data available</p>
      ) : (
        cities.map((city, idx) => (
          <div key={idx} className="flex justify-between items-center p-3 bg-slate-900/40 rounded-lg hover:bg-slate-900/60 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-slate-500 font-mono text-sm w-8">#{idx + 1}</span>
              <div>
                <div className="text-white font-medium">{city.city}</div>
                <div className="text-slate-400 text-xs">{city.region}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">{city.count}</div>
              <div className="text-slate-500 text-xs">visits</div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
```

#### C. Add City Column to Main Insights Page (Admin Only)

**File**: `plixo-web/src/pages/Insights.tsx`

Add new section after Geographic Distribution (admin only):

```typescript
{isAdmin && analyticsData.customAnalytics && analyticsData.customAnalytics.totalEvents > 0 && (
  <div className="bg-slate-800/40 rounded-xl p-8 border border-slate-700/40">
    <div className="flex items-center gap-3 mb-6">
      <Icon name="map-pin" size="lg" className="text-red-400" />
      <h2 className="text-2xl font-semibold">Top Cities</h2>
      <span className="ml-auto text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
        Admin Only
      </span>
    </div>

    <div className="mb-4 flex gap-2">
      <select
        value={cityFilterCountry}
        onChange={(e) => setCityFilterCountry(e.target.value)}
        className="bg-slate-800/60 border border-slate-700/40 text-white rounded-lg px-3 py-2 text-sm"
      >
        <option value="">All Countries</option>
        <option value="US">United States</option>
        {/* Add more as needed */}
      </select>

      {cityFilterCountry === 'US' && (
        <select
          value={cityFilterState}
          onChange={(e) => setCityFilterState(e.target.value)}
          className="bg-slate-800/60 border border-slate-700/40 text-white rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All States</option>
          <option value="NE">Nebraska</option>
          <option value="CA">California</option>
          {/* Add all states */}
        </select>
      )}
    </div>

    <TopCitiesTable
      timeRange={timeRange}
      country={cityFilterCountry}
      state={cityFilterState}
    />
  </div>
)}
```

---

### 3. Privacy & Security Considerations

#### Admin-Only Access ✅
- City-level data is personally identifiable when combined with timestamps
- **Solution**: Require admin role for all city-level endpoints
- Frontend components conditionally render based on `hasRole('admin')`
- Backend enforces via existing admin middleware

#### RBAC Enforcement
```typescript
// Backend (automatic via /admin/* routes)
/admin/analytics/cities.ts  ← Requires admin role

// Frontend (explicit checks)
{isAdmin && <CitiesList />}
```

#### Data Retention
- City data follows same 30-day retention as all analytics
- Auto-purge cron job already handles `analytics_sessions` table
- No additional privacy concerns

---

### 4. Database Performance

#### Query Optimization

**Current Indexes** (already exist):
```sql
CREATE INDEX idx_sessions_country ON analytics_sessions(country_code);
CREATE INDEX idx_sessions_region ON analytics_sessions(region_code);
CREATE INDEX idx_events_session ON analytics_events(session_id);
```

**Recommendation**: Add composite index for faster city queries:
```sql
-- NEW INDEX for city queries
CREATE INDEX IF NOT EXISTS idx_sessions_location
  ON analytics_sessions(country_code, region_code, city);
```

**Why**: The city query JOINs sessions → events and filters by country/region/city. Composite index will speed this up significantly.

**Migration**: `plixo-api/src/db/migrations/0007_city_analytics_index.sql`

---

### 5. UX/UI Mockup

```
┌─────────────────────────────────────────────────────┐
│ [Map] Nebraska - 47 visits                          │
│                                                     │
│ [Events by Type] [Pages] [Devices] [Browsers]      │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ 📍 City Breakdown          [View Cities ▼]  │   │ ← Admin Only
│ │                                              │   │
│ │ #1  Omaha              ├──────────────┤ 32  │   │
│ │     NE                                       │   │
│ │                                              │   │
│ │ #2  Lincoln            ├─────┤ 12           │   │
│ │     NE                                       │   │
│ │                                              │   │
│ │ #3  Grand Island       ├──┤ 3               │   │
│ │     NE                                       │   │
│ └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## Implementation Checklist

### Backend (plixo-api)

- [ ] **Step 1**: Add composite index for city queries
  - File: `src/db/migrations/0007_city_analytics_index.sql`
  - Command: `npx wrangler d1 execute plixo-api-db --file=src/db/migrations/0007_city_analytics_index.sql`

- [ ] **Step 2**: Add `queryEventsByCity()` method
  - File: `src/lib/services/analyticsD1Query.service.ts`
  - Add method around line 350 (after `queryEventsByUSState`)
  - Export in `CustomAnalyticsData` interface (optional, since it's admin-only)

- [ ] **Step 3**: Create admin cities endpoint
  - File: `functions/admin/analytics/cities.ts` (NEW)
  - Test locally: `curl http://localhost:8787/admin/analytics/cities?country=US&state=NE`
  - Ensure 401 Unauthorized without admin token

- [ ] **Step 4**: Deploy to production
  - Push migration to remote: `npx wrangler d1 execute plixo-api-db --remote --file=src/db/migrations/0007_city_analytics_index.sql`
  - Deploy API: `git push origin main` (auto-deploys via Cloudflare)

### Frontend (plixo-web)

- [ ] **Step 5**: Create CitiesList component
  - File: `src/components/molecules/CitiesList.tsx` (NEW)
  - Props: `locationCode`, `timeRange`
  - Fetches from `/admin/analytics/cities`

- [ ] **Step 6**: Update LocationDetailsModal
  - File: `src/components/molecules/LocationDetailsModal.tsx`
  - Add `useAuth()` hook
  - Conditionally render "View Cities" section if `isAdmin`

- [ ] **Step 7**: Add Top Cities section to Insights page
  - File: `src/pages/Insights.tsx`
  - Add state filter dropdowns (country, state)
  - Render `<TopCitiesTable />` component

- [ ] **Step 8**: Test locally
  - Login as admin
  - Navigate to Insights → Click Nebraska → Should see "City Breakdown" section
  - Verify guest/regular users don't see it

- [ ] **Step 9**: Deploy to production
  - `git push origin main` (auto-deploys to Cloudflare Pages)

---

## Testing Plan

### Unit Tests
```bash
# Backend (to be added)
- Test queryEventsByCity() with various filters
- Test admin middleware enforcement
- Test JOIN performance with large datasets

# Frontend (to be added)
- Test CitiesList renders correctly
- Test admin-only visibility (mock different roles)
- Test loading/error states
```

### Manual Testing
1. **As Admin**:
   - [ ] Login to production site as admin
   - [ ] Navigate to Insights page
   - [ ] Click on "Nebraska" on USA map
   - [ ] Verify "City Breakdown" section appears
   - [ ] Click "View Cities" → Should show Omaha, Lincoln, etc.
   - [ ] Change time range → Cities should update

2. **As Guest**:
   - [ ] Login as guest
   - [ ] Navigate to Insights page
   - [ ] Click on "Nebraska"
   - [ ] Verify "City Breakdown" does NOT appear

3. **Performance**:
   - [ ] Verify query response time < 200ms
   - [ ] Check browser console for errors
   - [ ] Verify no data leaks in network tab

---

## Estimated Time

| Task | Time |
|------|------|
| Backend query method | 30 min |
| Backend endpoint | 30 min |
| Database migration | 15 min |
| CitiesList component | 1 hour |
| LocationDetailsModal update | 30 min |
| Insights page section | 1 hour |
| Testing (local) | 30 min |
| Deploy + Production testing | 30 min |
| **Total** | **~5 hours** |

---

## Future Enhancements

### Phase 2 (Optional)
- [ ] **City-level map visualization** - Show cities as pins on map
- [ ] **Heatmap overlay** - Density visualization for metro areas
- [ ] **Postal code drill-down** - Even more granular (admin only)
- [ ] **Export city data** - CSV download for analysis
- [ ] **City comparison** - Side-by-side metrics for 2+ cities

### Phase 3 (Advanced)
- [ ] **IP address lookup** (admin only, temporary display, not stored)
- [ ] **ISP/Organization detection** - Identify crawlers, bots, corporate networks
- [ ] **Geographic clustering** - Auto-group nearby cities into metro areas

---

## Security Audit Checklist

Before deploying:
- [x] City data requires admin authentication
- [x] No city data exposed in public endpoints
- [x] No PII (IP addresses, user IDs) exposed with city data
- [ ] Rate limiting on admin endpoints (future enhancement)
- [x] Same 30-day retention as other analytics data
- [x] GDPR/CCPA compliant (aggregated data only)

---

## References

**Files to Create**:
- `plixo-api/src/db/migrations/0007_city_analytics_index.sql`
- `plixo-api/functions/admin/analytics/cities.ts`
- `plixo-web/src/components/molecules/CitiesList.tsx`
- `plixo-web/src/components/molecules/TopCitiesTable.tsx` (optional)

**Files to Modify**:
- `plixo-api/src/lib/services/analyticsD1Query.service.ts` (add method)
- `plixo-web/src/components/molecules/LocationDetailsModal.tsx` (add section)
- `plixo-web/src/pages/Insights.tsx` (add top cities panel)

**Testing Commands**:
```bash
# Backend (local)
cd plixo-api
npm run dev
curl http://localhost:8787/admin/analytics/cities?country=US&state=NE

# Backend (production)
curl https://api.plixo.com/admin/analytics/cities?country=US&state=NE \
  -H "Authorization: Bearer <admin-token>"

# Frontend (local)
cd plixo-web
npm run dev
# Open http://localhost:5173/insights (login as admin)
```

---

**Status**: 📝 Plan Complete - Ready for Implementation
**Next Action**: Review with user, then proceed with Step 1 (database migration)
