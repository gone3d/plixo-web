# Milestone 6: CloudFlare Analytics Engine + GraphQL

> **Status**: 🚧 IN PROGRESS (Session 1: 2025-11-03)
> **Started**: 2025-11-03
> **Estimated Duration**: 12-16 hours
> **Progress**: ~40% complete (6 hours logged)
> **Target Completion**: 2025-11-10 (1 week)
> **Priority**: 🔴 HIGH
> **Strategic Value**: GraphQL resume gap + visitor insights
> **Dependencies**: Milestone 0 (Production Deployment) complete, Milestone 5 (Guest Login) complete

---

## Goal

Implement visitor analytics using **CloudFlare Analytics Engine** (purpose-built time-series database) with **GraphQL API** for flexible querying. Display real-time visitor insights on the Insights page to understand portfolio traffic, popular content, and user engagement.

**Why This Matters**:
- **Resume Gap**: GraphQL experience is missing from resume - this implementation provides production GraphQL expertise
- **Data-Driven Decisions**: Understand which projects resonate with visitors
- **Professional Credibility**: Modern analytics demonstrates technical sophistication
- **Privacy-First**: GDPR/CCPA compliant analytics with no PII storage

---

## Success Criteria

### Backend (plixo-api)
- ✅ CloudFlare Analytics Engine configured and bound to Worker
- ✅ Analytics service writing events successfully
- ✅ GraphQL schema defined for analytics queries
- ✅ GraphQL resolvers returning accurate aggregated data
- ✅ Sub-500ms query response times
- ✅ Event taxonomy documented (page views, clicks, projects)

### Frontend (plixo-web)
- ✅ Analytics tracking service implemented
- ✅ All pages and components tracking interactions
- ✅ GraphQL client configured (urql or Apollo)
- ✅ Insights dashboard displaying live data
- ✅ Temporal queries working (day/week/month/all)
- ✅ Geographic distribution visualized
- ✅ Project engagement metrics displayed

### Privacy & Compliance
- ✅ No PII collected or stored
- ✅ Country-level geographic data only (no city/precise location)
- ✅ Anonymous session management
- ✅ GDPR/CCPA compliant by design

### Role-Based Access Control
- ✅ **Guest role**: Can only view landing page metrics and guest login stats (public aggregate data)
- ✅ **User role**: Can view their own activity + guest data + landing page metrics
- ✅ **Admin role**: Full access to all analytics across all users and roles
- ✅ GraphQL resolvers enforce authorization checks
- ✅ Insights dashboard adapts to user role

---

## Role-Based Analytics Viewing

### Access Control Model

**Guest Users:**
- **Can View:**
  - Landing page total views
  - Total guest logins (aggregate count)
  - Geographic distribution (public aggregate)
  - Popular pages (limited to landing page only)
- **Cannot View:**
  - Individual user activity
  - Project engagement metrics
  - Admin-only analytics
  - Session details beyond their own

**Regular Users:**
- **Can View:**
  - All guest-level metrics (above)
  - Their own page views and navigation
  - Their own project views and clicks
  - Their own session history
  - Landing page aggregate data
- **Cannot View:**
  - Other users' individual activity
  - Admin-only analytics
  - System-wide detailed breakdowns

**Admin Users:**
- **Can View:**
  - Everything (no restrictions)
  - All user activity across all roles
  - Detailed session breakdowns
  - System-wide analytics
  - Export capabilities (future)

### Implementation Strategy

**GraphQL Schema:**
- Queries include `viewerRole` context parameter
- Resolvers check authorization before returning data
- Filtered results based on role permissions
- Clear error messages for unauthorized access

**Frontend:**
- Insights dashboard adapts to user role
- Hidden sections for unauthorized content
- Clear indicators of what data is being shown
- Role-appropriate empty states

**Security:**
- JWT token contains user role
- GraphQL context receives authenticated user
- Authorization checks on every resolver
- No client-side filtering (server enforces)

---

## Architecture Overview

### CloudFlare Analytics Engine

**What is it?**
- Purpose-built time-series database for analytics workloads
- Optimized for high write volumes and fast aggregation queries
- Built-in GraphQL API (no custom query engine needed)
- 10 million free writes/month (Workers Paid plan)

**Data Model:**
```typescript
// Analytics Engine Data Point
interface AnalyticsDataPoint {
  blobs: string[];    // Up to 20 text fields (e.g., event_type, page, user_role)
  doubles: number[];  // Up to 20 numeric fields (e.g., count, load_time, session_duration)
  indexes: string[];  // Up to 20 indexed fields for filtering (e.g., country, device_type)
}
```

**Example Write:**
```typescript
await env.ANALYTICS.writeDataPoint({
  blobs: ['page_view', '/work', 'guest'],
  doubles: [1, 1250.5],  // count, load_time_ms
  indexes: ['US']         // country_code
});
```

**Example Query (GraphQL):**
```graphql
query {
  viewer {
    accounts(filter: {accountTag: $accountId}) {
      analytics: analyticsEngineDatasets(filter: {name: "plixo_analytics"}) {
        pageViews: sum(
          filter: {where: {blob1: "page_view"}}
          orderBy: [timestamp_DESC]
          limit: 1000
        ) {
          dimensions { blob2 }  # page path
          sum { double1 }       # count
        }
      }
    }
  }
}
```

### System Flow

```
User visits page
  → Frontend: usePageView() hook fires
  → POST /api/analytics/track { event: 'page_view', page: '/work', role: 'guest' }
  → Backend: analytics.service.ts
  → Write to Analytics Engine
  → Data available for querying immediately

User views Insights page
  → Frontend: GraphQL query via urql
  → POST /api/analytics/graphql { query: "{ pageViews { ... } }" }
  → Backend: GraphQL resolver
  → Query Analytics Engine via GraphQL
  → Return aggregated data
  → Frontend: Visualize with charts
```

---

## Event Taxonomy

### Event Types (blob1)

| Event Type | Description | blob2 | blob3 | double1 | double2 |
|------------|-------------|-------|-------|---------|---------|
| `page_view` | Page visited | Page path | User role | Count (1) | Load time (ms) |
| `page_exit` | Page left | Page path | User role | Duration (s) | - |
| `project_view` | Project card opened | Project slug | Page source | Count (1) | - |
| `external_link` | External link clicked | Destination URL | Link text | Count (1) | - |
| `contact_form` | Contact form submitted | - | User role | Count (1) | - |
| `session_start` | New session started | Entry page | User role | Count (1) | - |
| `session_end` | Session ended | Exit page | User role | Duration (s) | Page count |

### Indexed Fields (indexes[])

- `indexes[0]`: Country code (ISO 3166-1 alpha-2, e.g., "US", "GB", "CA")
- `indexes[1]`: Device type (`desktop`, `mobile`, `tablet`, `unknown`)
- `indexes[2]`: Browser family (`chrome`, `safari`, `firefox`, `edge`, `unknown`)

### Privacy-Compliant Data

**What We Collect:**
- Event types (page_view, project_view, etc.)
- Page paths (/work, /about, etc.)
- User role (guest, user, admin)
- Country-level geographic data (US, not California or San Francisco)
- Device type and browser family (for debugging, not tracking)
- Aggregate timings (load time, session duration)

**What We DO NOT Collect:**
- IP addresses (not stored anywhere)
- Names, emails, or any PII
- City or precise location data
- User agents (only parsed to device/browser type)
- Cookies or persistent identifiers
- Cross-site tracking data

---

## Tasks

### 6.1 Backend - CloudFlare Analytics Engine Setup

**Effort**: ⏱️ S-M (3-4 hours)
**Priority**: 🔴 CRITICAL
**Repository**: plixo-api

#### Setup Tasks

- [ ] **Configure Analytics Engine in wrangler.toml**
  ```toml
  [[analytics_engine_datasets]]
  binding = "ANALYTICS"
  dataset = "plixo_analytics"
  ```

- [ ] **Create Analytics Engine dataset in CloudFlare Dashboard**
  - Navigate to Workers & Pages → Analytics Engine
  - Create dataset named `plixo_analytics`
  - Note: Dataset is created automatically on first write (no manual creation needed)

- [ ] **Create analytics service**
  ```typescript
  // src/lib/services/analytics.service.ts

  export interface AnalyticsEvent {
    eventType: 'page_view' | 'page_exit' | 'project_view' | 'external_link' | 'contact_form' | 'session_start' | 'session_end';
    metadata: {
      page?: string;
      projectSlug?: string;
      userRole?: 'guest' | 'user' | 'admin';
      destination?: string;
      [key: string]: any;
    };
    metrics?: {
      count?: number;
      duration?: number;
      loadTime?: number;
      [key: string]: number;
    };
    context: {
      country?: string;
      deviceType?: string;
      browserFamily?: string;
    };
  }

  export class AnalyticsService {
    constructor(private analyticsEngine: AnalyticsEngineDataset) {}

    async trackEvent(event: AnalyticsEvent): Promise<void> {
      const dataPoint = this.mapEventToDataPoint(event);
      await this.analyticsEngine.writeDataPoint(dataPoint);
    }

    private mapEventToDataPoint(event: AnalyticsEvent): AnalyticsEngineDataPoint {
      return {
        blobs: [
          event.eventType,
          event.metadata.page || '',
          event.metadata.userRole || 'unknown'
        ],
        doubles: [
          event.metrics?.count || 1,
          event.metrics?.duration || event.metrics?.loadTime || 0
        ],
        indexes: [
          event.context.country || 'unknown',
          event.context.deviceType || 'unknown',
          event.context.browserFamily || 'unknown'
        ]
      };
    }
  }
  ```

- [ ] **Create analytics tracking endpoint**
  ```typescript
  // functions/api/analytics/track.ts

  export async function onRequestPost(context: RequestContext) {
    const { request, env } = context;
    const analyticsService = new AnalyticsService(env.ANALYTICS);

    const body = await request.json();
    const event: AnalyticsEvent = {
      eventType: body.event,
      metadata: body.metadata,
      metrics: body.metrics,
      context: {
        country: request.cf?.country as string,
        deviceType: detectDeviceType(request.headers.get('user-agent')),
        browserFamily: detectBrowserFamily(request.headers.get('user-agent'))
      }
    };

    await analyticsService.trackEvent(event);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  ```

- [ ] **Create device/browser detection utilities**
  ```typescript
  // src/lib/utils/userAgent.ts

  export function detectDeviceType(userAgent: string | null): string {
    if (!userAgent) return 'unknown';
    if (/mobile/i.test(userAgent)) return 'mobile';
    if (/tablet|ipad/i.test(userAgent)) return 'tablet';
    return 'desktop';
  }

  export function detectBrowserFamily(userAgent: string | null): string {
    if (!userAgent) return 'unknown';
    if (/chrome/i.test(userAgent) && !/edge/i.test(userAgent)) return 'chrome';
    if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return 'safari';
    if (/firefox/i.test(userAgent)) return 'firefox';
    if (/edge/i.test(userAgent)) return 'edge';
    return 'unknown';
  }
  ```

**Acceptance Criteria**:
- ✅ Analytics Engine binding configured in wrangler.toml
- ✅ AnalyticsService class implemented with type-safe event mapping
- ✅ POST /api/analytics/track endpoint accepting events
- ✅ Device and browser detection working accurately
- ✅ Events writing to Analytics Engine successfully (verify in CloudFlare dashboard)

**Testing**:
```bash
# Test analytics tracking locally
curl -X POST http://localhost:8788/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{
    "event": "page_view",
    "metadata": { "page": "/work", "userRole": "guest" },
    "metrics": { "count": 1, "loadTime": 1250 }
  }'
```

---

### 6.2 Backend - GraphQL API Implementation

**Effort**: ⏱️ M-L (4-5 hours)
**Priority**: 🔴 CRITICAL
**Repository**: plixo-api

#### GraphQL Setup Tasks

- [ ] **Install GraphQL dependencies**
  ```bash
  npm install graphql graphql-yoga
  npm install -D @graphql-tools/schema
  ```

- [ ] **Create GraphQL schema with role-based access**
  ```typescript
  // src/graphql/schema.ts

  import { buildSchema } from 'graphql';

  export const schema = buildSchema(`
    type Query {
      """
      Get analytics summary - filtered by viewer role
      - Guest: Landing page + guest login stats only
      - User: Own activity + guest data + landing page
      - Admin: All data (no restrictions)
      """
      analytics(period: AnalyticsPeriod!): AnalyticsSummary!

      """
      Get page view breakdown - role-filtered
      """
      pageViews(period: AnalyticsPeriod!): [PageViewStats!]!

      """
      Get project engagement - admin and user roles only
      """
      projectEngagement(period: AnalyticsPeriod!): [ProjectStats!]!

      """
      Get geographic distribution - public aggregate data
      """
      geographicDistribution(period: AnalyticsPeriod!): [CountryStats!]!

      """
      Get device breakdown - admin and user roles only
      """
      deviceBreakdown(period: AnalyticsPeriod!): DeviceStats!

      """
      Get viewer's own session history - user sees own, admin sees all
      """
      mySessions(period: AnalyticsPeriod!): [UserSession!]!
    }

    enum AnalyticsPeriod {
      DAY
      WEEK
      MONTH
      YEAR
      ALL
    }

    enum UserRole {
      GUEST
      USER
      ADMIN
    }

    type AnalyticsSummary {
      totalVisitors: Int!
      totalPageViews: Int!
      totalProjects: Int!        # Null for guests
      averageSessionDuration: Float!
      topCountries: [CountryStats!]!
      topPages: [PageViewStats!]!
      viewerRole: UserRole!      # Shows what role is viewing this data
      dataScope: String!         # Description of what data is shown
    }

    type PageViewStats {
      page: String!
      views: Int!
      averageLoadTime: Float!
      userRole: UserRole         # Only shown for admin
    }

    type ProjectStats {
      projectSlug: String!
      views: Int!
      clickThroughRate: Float!
      topReferrers: [String!]    # Admin only
    }

    type CountryStats {
      country: String!
      countryName: String!       # Full name (e.g., "United States")
      visitors: Int!
    }

    type DeviceStats {
      desktop: Int!
      mobile: Int!
      tablet: Int!
      unknown: Int!
    }

    type UserSession {
      sessionId: String!
      startTime: String!
      endTime: String
      duration: Float            # Seconds
      pageCount: Int!
      pages: [String!]!
      role: UserRole!
    }
  `);
  ```

- [ ] **Create GraphQL resolvers with authorization**
  ```typescript
  // src/graphql/resolvers.ts

  import { AnalyticsService } from '../lib/services/analytics.service';
  import { GraphQLError } from 'graphql';

  export interface AuthenticatedUser {
    id: string;
    role: 'guest' | 'user' | 'admin';
    username: string;
  }

  export interface ResolverContext {
    analyticsService: AnalyticsService;
    accountId: string;
    authToken: string;
    user: AuthenticatedUser | null; // From JWT token
  }

  // Authorization helper functions
  function requireAuth(context: ResolverContext): AuthenticatedUser {
    if (!context.user) {
      throw new GraphQLError('Authentication required', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
    }
    return context.user;
  }

  function requireRole(context: ResolverContext, allowedRoles: string[]) {
    const user = requireAuth(context);
    if (!allowedRoles.includes(user.role)) {
      throw new GraphQLError(
        `Access denied. Required role: ${allowedRoles.join(' or ')}`,
        { extensions: { code: 'FORBIDDEN' } }
      );
    }
    return user;
  }

  export const resolvers = {
    Query: {
      analytics: async (_: any, { period }: { period: string }, context: ResolverContext) => {
        const user = requireAuth(context); // Must be logged in
        const timeRange = getPeriodTimeRange(period);

        // Query Analytics Engine with role-based filtering
        const data = await context.analyticsService.querySummary(timeRange, user.role, user.id);

        // Return data shaped by role
        return {
          totalVisitors: data.visitors,
          totalPageViews: data.pageViews,
          totalProjects: user.role === 'guest' ? null : data.projectViews, // Guests can't see
          averageSessionDuration: data.avgDuration,
          topCountries: data.countries,
          topPages: data.pages,
          viewerRole: user.role.toUpperCase(),
          dataScope: getDataScopeDescription(user.role)
        };
      },

      pageViews: async (_: any, { period }: { period: string }, context: ResolverContext) => {
        const user = requireAuth(context);
        const timeRange = getPeriodTimeRange(period);

        // Filter based on role
        return await context.analyticsService.queryPageViews(
          timeRange,
          user.role,
          user.id
        );
      },

      projectEngagement: async (_: any, { period }: { period: string }, context: ResolverContext) => {
        // Project engagement only for users and admins
        const user = requireRole(context, ['user', 'admin']);
        const timeRange = getPeriodTimeRange(period);

        return await context.analyticsService.queryProjectEngagement(
          timeRange,
          user.role,
          user.id
        );
      },

      geographicDistribution: async (_: any, { period }: { period: string }, context: ResolverContext) => {
        // Public aggregate data - all roles can view
        const user = requireAuth(context);
        const timeRange = getPeriodTimeRange(period);

        return await context.analyticsService.queryGeographicDistribution(timeRange);
      },

      deviceBreakdown: async (_: any, { period }: { period: string }, context: ResolverContext) => {
        // Device data only for users and admins
        const user = requireRole(context, ['user', 'admin']);
        const timeRange = getPeriodTimeRange(period);

        return await context.analyticsService.queryDeviceBreakdown(
          timeRange,
          user.role
        );
      },

      mySessions: async (_: any, { period }: { period: string }, context: ResolverContext) => {
        const user = requireAuth(context);
        const timeRange = getPeriodTimeRange(period);

        // Users see their own sessions, admins see all
        return await context.analyticsService.queryUserSessions(
          timeRange,
          user.role === 'admin' ? null : user.id // null = all users (admin only)
        );
      }
    }
  };

  function getDataScopeDescription(role: string): string {
    switch (role) {
      case 'guest':
        return 'Landing page views and guest login statistics';
      case 'user':
        return 'Your activity, guest data, and public metrics';
      case 'admin':
        return 'All analytics data across all users';
      default:
        return 'Limited data';
    }
  }

  function getPeriodTimeRange(period: string): { start: Date; end: Date } {
    const now = new Date();
    const start = new Date();

    switch (period) {
      case 'DAY':
        start.setDate(now.getDate() - 1);
        break;
      case 'WEEK':
        start.setDate(now.getDate() - 7);
        break;
      case 'MONTH':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'YEAR':
        start.setFullYear(now.getFullYear() - 1);
        break;
      case 'ALL':
        start.setFullYear(2025, 10, 1); // Project start date
        break;
    }

    return { start, end: now };
  }
  ```

- [ ] **Update GraphQL endpoint to pass authenticated user in context**
  ```typescript
  // functions/api/analytics/graphql.ts

  import { createYoga } from 'graphql-yoga';
  import { schema } from '../../../src/graphql/schema';
  import { resolvers } from '../../../src/graphql/resolvers';
  import { verifyJWT } from '../../../src/lib/utils/jwt';
  import { AnalyticsService } from '../../../src/lib/services/analytics.service';

  const yoga = createYoga({
    schema,
    graphqlEndpoint: '/api/analytics/graphql',
    landingPage: false,
    context: async ({ request, env }) => {
      // Extract JWT from Authorization header
      const authHeader = request.headers.get('Authorization');
      let user = null;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          const payload = await verifyJWT(token, env.JWT_SECRET);
          user = {
            id: payload.userId,
            role: payload.role,
            username: payload.username
          };
        } catch (error) {
          console.error('JWT verification failed:', error);
          // Don't throw - allow unauthenticated queries (will fail in resolvers)
        }
      }

      return {
        analyticsService: new AnalyticsService(env.ANALYTICS),
        accountId: env.CLOUDFLARE_ACCOUNT_ID,
        authToken: env.CLOUDFLARE_API_TOKEN,
        user
      };
    }
  });

  export const onRequest = yoga;
  ```

- [ ] **Implement Analytics Engine GraphQL queries**
  ```typescript
  // src/lib/services/analytics.service.ts (additions)

  export class AnalyticsService {
    // ... existing trackEvent method

    async querySummary(timeRange: { start: Date; end: Date }) {
      const query = `
        query ($accountId: String!, $datasetName: String!, $startTime: String!, $endTime: String!) {
          viewer {
            accounts(filter: {accountTag: $accountId}) {
              pageViews: analyticsEngineDatasets(filter: {name: $datasetName}) {
                sum(
                  filter: {
                    where: {
                      blob1: "page_view"
                      timestamp_geq: $startTime
                      timestamp_leq: $endTime
                    }
                  }
                ) {
                  sum { double1 }
                }
              }

              countries: analyticsEngineDatasets(filter: {name: $datasetName}) {
                sum(
                  filter: {
                    where: {
                      blob1: "page_view"
                      timestamp_geq: $startTime
                      timestamp_leq: $endTime
                    }
                  }
                  groupBy: [index1]
                  orderBy: [sum_double1_DESC]
                  limit: 10
                ) {
                  dimensions { index1 }
                  sum { double1 }
                }
              }
            }
          }
        }
      `;

      const variables = {
        accountId: this.accountId,
        datasetName: 'plixo_analytics',
        startTime: timeRange.start.toISOString(),
        endTime: timeRange.end.toISOString()
      };

      const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, variables })
      });

      const data = await response.json();

      // Transform and return data
      return {
        visitors: data.data.viewer.accounts[0].pageViews.sum[0].sum.double1,
        countries: data.data.viewer.accounts[0].countries.sum.map((item: any) => ({
          country: item.dimensions.index1,
          visitors: item.sum.double1
        })),
        // ... more transformations
      };
    }

    // Similar methods for queryPageViews, queryProjectEngagement, etc.
  }
  ```

- [ ] **Create GraphQL endpoint**
  ```typescript
  // functions/api/analytics/graphql.ts

  import { createYoga } from 'graphql-yoga';
  import { schema } from '../../../src/graphql/schema';
  import { resolvers } from '../../../src/graphql/resolvers';

  const yoga = createYoga({
    schema,
    graphqlEndpoint: '/api/analytics/graphql',
    landingPage: false
  });

  export const onRequest = yoga;
  ```

**Acceptance Criteria**:
- ✅ GraphQL schema defined with all analytics queries
- ✅ Resolvers implemented for all query types
- ✅ Analytics Engine GraphQL queries working correctly
- ✅ Sub-500ms query response times
- ✅ Data transformations returning correct structures
- ✅ GraphQL endpoint accessible at /api/analytics/graphql

**Testing**:
```bash
# Test GraphQL query
curl -X POST http://localhost:8788/api/analytics/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { analytics(period: WEEK) { totalVisitors totalPageViews } }"
  }'
```

---

### 6.3 Frontend - Analytics Tracking Integration

**Effort**: ⏱️ S-M (2-3 hours)
**Priority**: 🔴 CRITICAL
**Repository**: plixo-web

#### Tracking Implementation Tasks

- [ ] **Create analytics tracking service**
  ```typescript
  // src/services/analytics.ts

  interface TrackEventParams {
    event: string;
    metadata?: Record<string, any>;
    metrics?: Record<string, number>;
  }

  class AnalyticsTracker {
    private apiUrl: string;
    private sessionId: string;
    private enabled: boolean;

    constructor() {
      this.apiUrl = import.meta.env.VITE_API_URL;
      this.sessionId = this.getOrCreateSessionId();
      this.enabled = !import.meta.env.DEV; // Disable in development
    }

    async trackEvent(params: TrackEventParams): Promise<void> {
      if (!this.enabled) {
        console.log('[Analytics]', params);
        return;
      }

      try {
        await fetch(`${this.apiUrl}/api/analytics/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
        });
      } catch (error) {
        console.error('Analytics tracking failed:', error);
      }
    }

    trackPageView(page: string, userRole: string = 'guest', loadTime?: number) {
      this.trackEvent({
        event: 'page_view',
        metadata: { page, userRole },
        metrics: { count: 1, loadTime }
      });
    }

    trackProjectView(projectSlug: string, pageSource: string) {
      this.trackEvent({
        event: 'project_view',
        metadata: { projectSlug, pageSource },
        metrics: { count: 1 }
      });
    }

    trackExternalLink(destination: string, linkText: string) {
      this.trackEvent({
        event: 'external_link',
        metadata: { destination, linkText },
        metrics: { count: 1 }
      });
    }

    private getOrCreateSessionId(): string {
      let sessionId = sessionStorage.getItem('analytics_session_id');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('analytics_session_id', sessionId);
      }
      return sessionId;
    }
  }

  export const analytics = new AnalyticsTracker();
  ```

- [ ] **Create tracking hooks**
  ```typescript
  // src/hooks/useAnalytics.ts

  import { useEffect } from 'react';
  import { useLocation } from 'react-router-dom';
  import { useAuth } from '../contexts/AuthContext';
  import { analytics } from '../services/analytics';

  export function usePageView() {
    const location = useLocation();
    const { user } = useAuth();

    useEffect(() => {
      const startTime = performance.now();

      // Track page view on mount
      analytics.trackPageView(
        location.pathname,
        user?.role || 'guest',
        performance.now() - startTime
      );

      // Track page exit on unmount
      return () => {
        const duration = (performance.now() - startTime) / 1000; // seconds
        analytics.trackEvent({
          event: 'page_exit',
          metadata: { page: location.pathname, userRole: user?.role || 'guest' },
          metrics: { duration }
        });
      };
    }, [location.pathname, user?.role]);
  }

  export function useProjectTracking(projectSlug: string, pageSource: string) {
    const handleProjectView = () => {
      analytics.trackProjectView(projectSlug, pageSource);
    };

    return { trackProjectView: handleProjectView };
  }

  export function useExternalLinkTracking() {
    const handleExternalClick = (destination: string, linkText: string) => {
      analytics.trackExternalLink(destination, linkText);
    };

    return { trackExternalLink: handleExternalClick };
  }
  ```

- [ ] **Add tracking to App.tsx**
  ```typescript
  // src/App.tsx

  import { usePageView } from './hooks/useAnalytics';

  function App() {
    usePageView(); // Track all page views globally

    return (
      // ... existing app structure
    );
  }
  ```

- [ ] **Add tracking to ProjectCard**
  ```typescript
  // src/components/molecules/ProjectCard.tsx

  import { useProjectTracking } from '../../hooks/useAnalytics';

  export const ProjectCard = ({ project }: ProjectCardProps) => {
    const { trackProjectView } = useProjectTracking(project.slug, 'work_page');

    const handleImageClick = () => {
      trackProjectView();
      // ... existing image click logic
    };

    return (
      // ... existing component
    );
  };
  ```

- [ ] **Add tracking to external links**
  ```typescript
  // src/components/atoms/ExternalLink.tsx (new component)

  import { useExternalLinkTracking } from '../../hooks/useAnalytics';

  interface ExternalLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
  }

  export const ExternalLink = ({ href, children, className }: ExternalLinkProps) => {
    const { trackExternalLink } = useExternalLinkTracking();

    const handleClick = () => {
      const linkText = typeof children === 'string' ? children : href;
      trackExternalLink(href, linkText);
    };

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  };
  ```

**Acceptance Criteria**:
- ✅ Analytics tracking service implemented with session management
- ✅ Page view tracking working on all pages
- ✅ Project view tracking on Work page
- ✅ External link tracking on all external links
- ✅ Disabled in development mode (console logging only)
- ✅ No impact on page performance (async tracking)

---

### 6.4 Frontend - GraphQL Client & Insights Dashboard

**Effort**: ⏱️ M-L (3-4 hours)
**Priority**: 🟡 HIGH
**Repository**: plixo-web

#### GraphQL Client Setup

- [ ] **Install GraphQL client dependencies**
  ```bash
  npm install urql graphql
  ```

  **Why urql?**
  - Lightweight (only 20KB vs Apollo's 100KB+)
  - Built-in caching and request deduplication
  - Excellent TypeScript support
  - React hooks for queries and mutations
  - Simpler API than Apollo

- [ ] **Configure urql client**
  ```typescript
  // src/lib/graphqlClient.ts

  import { createClient, cacheExchange, fetchExchange } from 'urql';

  export const graphqlClient = createClient({
    url: `${import.meta.env.VITE_API_URL}/api/analytics/graphql`,
    exchanges: [cacheExchange, fetchExchange],
    requestPolicy: 'cache-and-network' // Always fetch fresh data
  });
  ```

- [ ] **Add GraphQL provider to App**
  ```typescript
  // src/main.tsx

  import { Provider as UrqlProvider } from 'urql';
  import { graphqlClient } from './lib/graphqlClient';

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <UrqlProvider value={graphqlClient}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </QueryClientProvider>
      </UrqlProvider>
    </React.StrictMode>
  );
  ```

#### GraphQL Queries

- [ ] **Create analytics queries**
  ```typescript
  // src/graphql/queries.ts

  import { gql } from 'urql';

  export const GET_ANALYTICS_SUMMARY = gql`
    query GetAnalyticsSummary($period: AnalyticsPeriod!) {
      analytics(period: $period) {
        totalVisitors
        totalPageViews
        totalProjects
        averageSessionDuration
        topCountries {
          country
          visitors
        }
        topPages {
          page
          views
          averageLoadTime
        }
      }
    }
  `;

  export const GET_PAGE_VIEWS = gql`
    query GetPageViews($period: AnalyticsPeriod!) {
      pageViews(period: $period) {
        page
        views
        averageLoadTime
      }
    }
  `;

  export const GET_PROJECT_ENGAGEMENT = gql`
    query GetProjectEngagement($period: AnalyticsPeriod!) {
      projectEngagement(period: $period) {
        projectSlug
        views
        clickThroughRate
      }
    }
  `;

  export const GET_GEOGRAPHIC_DISTRIBUTION = gql`
    query GetGeographicDistribution($period: AnalyticsPeriod!) {
      geographicDistribution(period: $period) {
        country
        visitors
      }
    }
  `;

  export const GET_DEVICE_BREAKDOWN = gql`
    query GetDeviceBreakdown($period: AnalyticsPeriod!) {
      deviceBreakdown(period: $period) {
        desktop
        mobile
        tablet
        unknown
      }
    }
  `;
  ```

#### Insights Dashboard Components

- [ ] **Create analytics hook**
  ```typescript
  // src/hooks/useAnalyticsDashboard.ts

  import { useQuery } from 'urql';
  import { GET_ANALYTICS_SUMMARY } from '../graphql/queries';

  export type AnalyticsPeriod = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR' | 'ALL';

  export function useAnalyticsDashboard(period: AnalyticsPeriod = 'WEEK') {
    const [result] = useQuery({
      query: GET_ANALYTICS_SUMMARY,
      variables: { period }
    });

    return {
      data: result.data?.analytics,
      loading: result.fetching,
      error: result.error
    };
  }
  ```

- [ ] **Create metric card component**
  ```typescript
  // src/components/molecules/MetricCard.tsx

  interface MetricCardProps {
    title: string;
    value: number | string;
    subtitle?: string;
    icon: React.ReactNode;
    loading?: boolean;
  }

  export const MetricCard = ({ title, value, subtitle, icon, loading }: MetricCardProps) => {
    return (
      <div className="bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-400">{title}</p>
            {loading ? (
              <LoadingSpinner variant="dots" size="sm" />
            ) : (
              <p className="text-3xl font-bold text-white mt-2">{value}</p>
            )}
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          </div>
          <div className="text-blue-400">{icon}</div>
        </div>
      </div>
    );
  };
  ```

- [ ] **Update Insights page**
  ```typescript
  // src/pages/Insights.tsx

  import { useState } from 'react';
  import { useAnalyticsDashboard, AnalyticsPeriod } from '../hooks/useAnalyticsDashboard';
  import { MetricCard } from '../components/molecules/MetricCard';
  import { Icon } from '../components/atoms';

  const Insights = () => {
    const [period, setPeriod] = useState<AnalyticsPeriod>('WEEK');
    const { data, loading, error } = useAnalyticsDashboard(period);

    if (error) {
      return <div>Error loading analytics: {error.message}</div>;
    }

    return (
      <div className="min-h-full pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Analytics & Insights</h1>

            {/* Period Selector */}
            <div className="flex gap-2">
              {(['DAY', 'WEEK', 'MONTH', 'YEAR', 'ALL'] as AnalyticsPeriod[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    period === p
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/40'
                  }`}
                >
                  {p.charAt(0) + p.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Visitors"
              value={data?.totalVisitors || 0}
              icon={<Icon name="user" size="lg" />}
              loading={loading}
            />
            <MetricCard
              title="Page Views"
              value={data?.totalPageViews || 0}
              icon={<Icon name="chart" size="lg" />}
              loading={loading}
            />
            <MetricCard
              title="Project Views"
              value={data?.totalProjects || 0}
              icon={<Icon name="work" size="lg" />}
              loading={loading}
            />
            <MetricCard
              title="Avg Session"
              value={`${Math.round(data?.averageSessionDuration || 0)}s`}
              icon={<Icon name="activity" size="lg" />}
              loading={loading}
            />
          </div>

          {/* Top Pages */}
          <div className="bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Top Pages</h2>
            <div className="space-y-3">
              {data?.topPages.map((page: any) => (
                <div key={page.page} className="flex justify-between items-center">
                  <span className="text-slate-300">{page.page}</span>
                  <span className="text-white font-semibold">{page.views} views</span>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Geographic Distribution</h2>
            <div className="space-y-3">
              {data?.topCountries.map((country: any) => (
                <div key={country.country} className="flex justify-between items-center">
                  <span className="text-slate-300">{country.country}</span>
                  <span className="text-white font-semibold">{country.visitors} visitors</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Insights;
  ```

- [ ] **Add role-based UI adaptations**
  ```typescript
  // src/pages/Insights.tsx (role-based rendering)

  const Insights = () => {
    const { user } = useAuth(); // Get current user role
    const [period, setPeriod] = useState<AnalyticsPeriod>('WEEK');
    const { data, loading, error } = useAnalyticsDashboard(period);

    // Role-specific UI rendering
    const canViewProjects = user?.role !== 'guest';
    const canViewDevices = user?.role !== 'guest';
    const isAdmin = user?.role === 'admin';

    return (
      <div className="min-h-full pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Data Scope Indicator */}
          {data?.dataScope && (
            <div className="mb-4 bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
              <p className="text-sm text-blue-300">
                <strong>Viewing:</strong> {data.dataScope}
              </p>
            </div>
          )}

          {/* Metric Cards - hide Project Views for guests */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard title="Total Visitors" value={data?.totalVisitors || 0} />
            <MetricCard title="Page Views" value={data?.totalPageViews || 0} />

            {/* Only show to users and admins */}
            {canViewProjects && (
              <MetricCard title="Project Views" value={data?.totalProjects || 0} />
            )}

            <MetricCard
              title="Avg Session"
              value={`${Math.round(data?.averageSessionDuration || 0)}s`}
            />
          </div>

          {/* Device Breakdown - users and admins only */}
          {canViewDevices && (
            <div className="bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Device Breakdown</h2>
              {/* Device chart component */}
            </div>
          )}

          {/* Admin-only sections */}
          {isAdmin && (
            <div className="bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                All User Sessions
                <span className="ml-2 text-xs bg-red-600 text-white px-2 py-1 rounded">ADMIN</span>
              </h2>
              {/* Admin-only session data */}
            </div>
          )}
        </div>
      </div>
    );
  };
  ```

**Acceptance Criteria**:
- ✅ urql GraphQL client configured and working
- ✅ Analytics queries returning data successfully
- ✅ Insights page displaying live metrics
- ✅ Period selector (day/week/month/year/all) functional
- ✅ Loading states showing during data fetch
- ✅ Error handling for failed queries
- ✅ Responsive design on mobile/tablet/desktop
- ✅ **Role-based UI rendering** (guests see limited data, users see own data, admin sees all)
- ✅ **Data scope indicator** shows what role is viewing
- ✅ **Graceful degradation** for unauthorized sections

---

## Technical Decisions

### Why CloudFlare Analytics Engine over D1?
- Purpose-built for time-series analytics (optimized for this use case)
- Built-in GraphQL API (no custom query engine needed)
- Automatic data aggregation and indexing
- 10 million free writes/month (far exceeds portfolio traffic)
- Sub-millisecond query performance
- No schema migrations or maintenance

### Why GraphQL over REST?
- **Resume gap** - GraphQL experience needed for job applications
- Flexible queries (frontend can request exactly what it needs)
- Single endpoint (simpler than multiple REST endpoints)
- Built-in type system with TypeScript integration
- Reduced over-fetching (only requested fields returned)
- Industry standard (used by Facebook, GitHub, Shopify, etc.)

### Why urql over Apollo Client?
- Much smaller bundle size (20KB vs 100KB+)
- Simpler API (less boilerplate)
- Excellent TypeScript support
- Built-in caching and request deduplication
- Good enough for portfolio analytics (don't need Apollo's advanced features)

### Privacy-First Analytics
- No cookies or persistent tracking
- Anonymous session IDs (cleared on browser close)
- Country-level geographic data only (no city/precise location)
- No PII collection (no names, emails, IPs stored)
- GDPR/CCPA compliant by design
- Device/browser data for debugging only (not tracking)

### Role-Based Access Control (RBAC)
**Why server-side authorization?**
- Client-side filtering is insecure (can be bypassed)
- GraphQL resolvers enforce access control at data layer
- JWT tokens carry authenticated user role
- Clear separation: authentication (who you are) vs authorization (what you can do)

**Security Model:**
1. **Authentication**: JWT token verified on every GraphQL request
2. **Authorization**: Resolvers check user role before returning data
3. **Filtering**: Data filtered at query level (not client-side)
4. **Fail-safe**: Unauthorized queries return `FORBIDDEN` error

**Guest Protection:**
- Guests cannot see individual user activity
- Guests cannot see project engagement metrics
- Guests limited to public aggregate data only
- Server enforces these restrictions (not client UI)

**User Privacy:**
- Users only see their own activity data
- Users cannot see other users' sessions
- Admin role required for cross-user analytics
- Session IDs anonymized for non-admin users

**Admin Capabilities:**
- Full access to all analytics data
- Can view all user sessions (for support/debugging)
- Can export data (future feature)
- Audit logging of admin actions (future feature)

---

## Testing Strategy

### Backend Testing
```bash
# Test analytics tracking
curl -X POST http://localhost:8788/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{"event":"page_view","metadata":{"page":"/work","userRole":"guest"},"metrics":{"count":1}}'

# Test GraphQL query without authentication (should fail)
curl -X POST http://localhost:8788/api/analytics/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ analytics(period: WEEK) { totalVisitors totalPageViews } }"}'
# Expected: Authentication required error

# Test GraphQL query with guest token
curl -X POST http://localhost:8788/api/analytics/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <GUEST_JWT_TOKEN>" \
  -d '{"query":"{ analytics(period: WEEK) { totalVisitors totalPageViews dataScope } }"}'
# Expected: Limited data (landing page + guest logins)

# Test project engagement with guest token (should fail)
curl -X POST http://localhost:8788/api/analytics/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <GUEST_JWT_TOKEN>" \
  -d '{"query":"{ projectEngagement(period: WEEK) { projectSlug views } }"}'
# Expected: FORBIDDEN error

# Test GraphQL query with user token
curl -X POST http://localhost:8788/api/analytics/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <USER_JWT_TOKEN>" \
  -d '{"query":"{ analytics(period: WEEK) { totalVisitors totalPageViews totalProjects } }"}'
# Expected: User's own data + guest data + landing page

# Test GraphQL query with admin token
curl -X POST http://localhost:8788/api/analytics/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -d '{"query":"{ analytics(period: WEEK) { totalVisitors totalPageViews totalProjects } }"}'
# Expected: All data (no restrictions)
```

### Frontend Testing
1. Open DevTools Network tab
2. Navigate between pages
3. Verify POST /api/analytics/track requests
4. Click project cards, verify tracking
5. Visit Insights page, verify data loads
6. Change period selector, verify new data fetches

### Production Verification
1. Deploy to production
2. Visit plixo.com as guest user
3. Navigate through pages
4. Visit Insights page (as admin after login implemented)
5. Verify CloudFlare Analytics Engine dashboard shows events
6. Check query response times (should be < 500ms)

---

## Performance Budget

**Bundle Size Impact**:
- urql: +20KB
- graphql: +10KB
- Total increase: ~30KB
- New total: ~130KB gzipped (well under 500KB target)

**Query Performance Targets**:
- Analytics tracking: Fire-and-forget (no UI blocking)
- GraphQL queries: < 500ms response time
- Insights page load: < 2 seconds total

**Network Impact**:
- Analytics tracking: 1 request per page view (~200 bytes)
- GraphQL queries: 1 request per period change (~5KB response)
- Minimal impact on user experience

---

## Rollback Plan

If issues discovered:

1. **Disable tracking**:
   ```typescript
   // src/services/analytics.ts
   this.enabled = false; // Disable all tracking
   ```

2. **Fallback Insights page**:
   ```typescript
   // Show "Coming Soon" message instead of dashboard
   return <div>Analytics dashboard launching soon...</div>;
   ```

3. **Remove Analytics Engine binding**:
   ```toml
   # wrangler.toml - comment out
   # [[analytics_engine_datasets]]
   # binding = "ANALYTICS"
   ```

---

## Post-Milestone Enhancements (Not in Scope)

- Real-time WebSocket updates (Milestone 3)
- Chart visualizations (line charts, bar charts)
- Heatmap of page interactions
- Session replay (privacy-compliant)
- A/B testing framework
- Conversion funnel tracking
- Retention cohort analysis

---

## Resume Impact

**New Skills Demonstrated**:
- ✅ GraphQL schema design and implementation
- ✅ GraphQL query resolver development
- ✅ Time-series database modeling (Analytics Engine)
- ✅ Real-time analytics architecture
- ✅ Privacy-compliant data collection (GDPR/CCPA)
- ✅ CloudFlare Workers advanced features
- ✅ Modern frontend data fetching (urql)

**Portfolio Talking Points**:
- "Implemented GraphQL API for analytics using CloudFlare Analytics Engine"
- "Built privacy-first visitor tracking system with GDPR compliance"
- "Achieved sub-500ms query response times on time-series analytics data"
- "Designed flexible GraphQL schema supporting multiple aggregation queries"

---

## Success Metrics

**Technical Success**:
- ✅ All analytics events tracked successfully
- ✅ GraphQL API returning accurate data
- ✅ Sub-500ms query response times
- ✅ Zero impact on page load performance
- ✅ Privacy-compliant (no PII collected)

**Business Success**:
- ✅ Understand which projects resonate with visitors
- ✅ Track resume distribution effectiveness
- ✅ Identify popular portfolio content
- ✅ Geographic reach insights

**Resume Success**:
- ✅ GraphQL experience added to resume
- ✅ Production GraphQL deployment demonstrated
- ✅ Modern analytics architecture showcased
- ✅ Privacy-first engineering highlighted

---

**Estimated Total Time**: 12-16 hours (1 week at 2-3 hours/day)
**Target Completion**: 2025-11-10
**Strategic Value**: HIGH - Fills resume gap + enables data-driven portfolio optimization

---

## Session Log

### Session 1 - 2025-11-03 (6 hours)

**Goal**: Implement CloudFlare Analytics Engine GraphQL queries and get data flowing to Insights dashboard

#### Accomplishments

1. **✅ CloudFlare Web Analytics Integration - WORKING**
   - Fixed GraphQL query parsing bug (`zone.totals` vs `zone.httpRequests1dGroups`)
   - Added error handling to analytics overview endpoint (failures don't kill entire endpoint)
   - Web Analytics now returning real data: 17,853 page views, 2,561 unique visitors, 370MB bandwidth
   - Simplified query to fetch only totals (removed problematic dimension queries)

2. **✅ Analytics Engine GraphQL Implementation**
   - Created `analyticsEngineQuery.service.ts` with complete GraphQL query methods
   - Implemented queries for: total events, page views, geographic distribution, device breakdown, browser breakdown
   - Added parallel query execution for better performance
   - Used `analyticsEngineEventsAdaptiveGroups` GraphQL API

3. **✅ Custom Analytics Event Tracking - DEPLOYED**
   - Events successfully writing to Analytics Engine (tested with curl)
   - `/api/analytics/track` endpoint accepting events and returning success
   - Sent 8 test events: page_view (4), project_view (2), contact_form (1), external_link (1)

4. **✅ Environment Configuration**
   - Added `CLOUDFLARE_ACCOUNT_ID` to production environment variables
   - Confirmed account ID is set and recognized (`hasAccountId: true`)
   - Debug endpoint showing partial account ID for verification

5. **✅ Insights Page Updates**
   - Added timeframe dropdown (1/7/30 days)
   - Added visualization sections for geo, browser, device, event types
   - Added flag emojis for country display
   - Added percentage bars for device/browser breakdowns

#### Current Blockers

**🔴 BLOCKER: Custom Analytics GraphQL Queries Returning Zeros**
- Web Analytics working perfectly ✅
- Custom Analytics queries execute without errors ✅
- But all custom analytics data returns 0 despite events being written ✅
- GraphQL query may be missing dataset specification or using wrong field names

**Debugging Steps Taken**:
1. ✅ Verified events writing successfully (curl tests return `{"success":true}`)
2. ✅ Confirmed `CLOUDFLARE_ACCOUNT_ID` environment variable set
3. ✅ Added `dataset: this.datasetName` filter to all GraphQL queries
4. ✅ Added debug logging to see GraphQL response structure
5. ⏳ Need to check CloudFlare logs to see actual GraphQL response

**Possible Issues**:
- Dataset filter syntax may be incorrect for Analytics Engine GraphQL
- Data propagation delay (Analytics Engine can take 5-10 minutes)
- GraphQL schema mismatch (field names don't match Analytics Engine schema)
- Query filtering on wrong dimensions

#### Files Modified

**Backend (plixo-api)**:
- `src/lib/services/analyticsEngineQuery.service.ts` - Complete GraphQL query implementation
- `src/lib/services/webAnalytics.service.ts` - Fixed query parsing, simplified to totals only
- `functions/api/analytics/overview.ts` - Added error handling and debug info
- `src/lib/utils/turnstile.ts` - Added test token detection

**Frontend (plixo-web)**:
- `src/pages/Insights.tsx` - Enhanced with new analytics visualizations
- `src/types/analytics.ts` - Added new data types for custom analytics
- `.env.development` - Updated to use production API and prod Turnstile key

#### Next Session Priorities

1. **🔴 CRITICAL: Fix Custom Analytics GraphQL Queries**
   - Check CloudFlare logs for actual GraphQL response structure
   - Verify dataset filter syntax against Analytics Engine docs
   - Test with different query structures to isolate issue
   - May need to remove dataset filter or use different approach

2. **Validate Data Flow**
   - Wait 10-15 minutes for data propagation
   - Send more test events to build dataset
   - Verify events appear in CloudFlare Analytics Engine dashboard

3. **Query Refinement**
   - Once data flowing, optimize query structure
   - Add missing dimensions (top pages, countries, etc.) back to Web Analytics
   - Implement proper error messages for empty data states

4. **Frontend Integration**
   - Wire up GraphQL client (urql) once queries working
   - Add real-time data refresh
   - Implement loading states and error handling

#### Technical Decisions

**Web Analytics Simplification**:
- Removed dimension queries (countries, browsers, devices, status codes) due to schema issues
- CloudFlare GraphQL field names (`clientCountryName`, `clientBrowser`, etc.) causing errors
- Kept only totals query which works reliably
- Can add dimensions back once we find correct field names

**Error Handling Strategy**:
- Analytics overview endpoint now catches errors independently for Web Analytics vs Custom Analytics
- Failures in one don't break the other
- Returns null for failed sections instead of 500 error
- Debug info helps identify configuration issues

**Dataset Specification**:
- Added `dataset: "plixo_analytics"` to GraphQL filter variables
- May need different approach (binding name vs dataset name)
- CloudFlare docs unclear on exact syntax for Analytics Engine queries

#### Performance Metrics

- Web Analytics query: ~200-300ms response time ✅
- Custom Analytics query: ~150-250ms (but returning empty) ⚠️
- Analytics tracking POST: ~50-100ms ✅
- Frontend build: 150.26 KB gzipped ✅

#### Time Logged: 6 hours

**Breakdown**:
- GraphQL implementation: 2 hours
- Web Analytics debugging: 1.5 hours
- Custom Analytics setup: 1.5 hours
- Frontend visualization: 1 hour

**Estimated Remaining**: 6-10 hours
- Fix Custom Analytics queries: 2-3 hours
- Frontend GraphQL client setup: 1-2 hours
- Dashboard polish: 1-2 hours
- Testing & deployment: 2-3 hours
