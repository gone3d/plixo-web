# Milestone 2: API/Backend Integration

> **Status**: ⏳ PENDING
> **Duration**: 4-6 weeks (API development + frontend integration)
> **Priority**: HIGH
> **Dependencies**: Milestone 0 (Production Deployment), plixo-api development
> **Blocks**: Real-time features, analytics dashboard, contact form functionality

---

## Goal

Integrate plixo-web frontend with plixo-api backend to enable dynamic portfolio content, contact form submissions, analytics tracking, and GitHub integration.

**Why This Matters**: Transforms static portfolio into dynamic, data-driven application with real-time features, visitor analytics, and content management capabilities.

---

## Success Criteria

- ✅ Frontend successfully fetching data from api.plixo.com
- ✅ Contact form submitting messages with bot protection
- ✅ Insights page displaying real analytics data
- ✅ GitHub stats showing live repository data
- ✅ Portfolio content served from database
- ✅ Admin authentication working
- ✅ Analytics tracking all visitor interactions
- ✅ Privacy-compliant (GDPR/CCPA)
- ✅ Sub-500ms API response times

---

## Tasks

### 2.1 API Service Layer Setup

**Effort**: ⏱️ S (4-6 hours)
**Priority**: 🔴 CRITICAL
**Repository**: plixo-web

#### Implementation Tasks

- [ ] **Create API client service**
  ```typescript
  // src/services/api.ts
  - Configure base URL (api.plixo.com)
  - Set up fetch wrapper with error handling
  - Add request/response interceptors
  - Implement retry logic
  - Configure timeout settings
  ```

- [ ] **Install dependencies**
  ```bash
  npm install @tanstack/react-query axios
  npm install -D @tanstack/react-query-devtools
  ```

- [ ] **Configure React Query**
  ```typescript
  // src/main.tsx
  - Set up QueryClient with caching strategy
  - Configure staleTime and cacheTime
  - Add QueryClientProvider
  - Set up dev tools (development only)
  ```

- [ ] **Create environment configuration**
  ```typescript
  // .env files
  .env.development:  VITE_API_URL=http://localhost:8788
  .env.production:   VITE_API_URL=https://api.plixo.com
  ```

**Acceptance Criteria**:
- ✅ API client configured with proper error handling
- ✅ React Query set up with optimal caching
- ✅ Environment-based URL configuration working

---

### 2.2 Portfolio Content Integration

**Effort**: ⏱️ M (8-12 hours)
**Priority**: 🟡 HIGH

#### API Endpoints to Integrate

- [ ] **Projects API**
  ```typescript
  // src/hooks/useProjects.ts
  GET /api/projects → Replace temp-data.ts
  - Fetch all projects with filters
  - Handle loading and error states
  - Implement optimistic updates (admin)
  - Cache for 5 minutes
  ```

- [ ] **Skills API**
  ```typescript
  // src/hooks/useSkills.ts
  GET /api/skills → Replace temp-data.ts
  - Fetch skills with proficiency levels
  - Group by category
  - Cache for 10 minutes
  ```

- [ ] **Experience API**
  ```typescript
  // src/hooks/useExperience.ts
  GET /api/experience → Replace temp-data.ts
  - Fetch career timeline
  - Sort by date descending
  - Cache for 15 minutes
  ```

- [ ] **About Content API**
  ```typescript
  // src/hooks/useAbout.ts
  GET /api/about → Replace static content
  - Fetch about sections
  - Cache for 30 minutes
  ```

#### Page Updates

- [ ] **Update Work page**
  - Replace temp-data import with useProjects hook
  - Add loading skeleton states
  - Handle error states gracefully
  - Implement filters (status, featured, tech)

- [ ] **Update About page**
  - Use useAbout and useSkills hooks
  - Dynamic content rendering
  - Loading states for sections

**Acceptance Criteria**:
- ✅ All portfolio data served from API
- ✅ Loading states professional and smooth
- ✅ Error handling with fallbacks
- ✅ Caching working correctly

---

### 2.3 GitHub Integration

**Effort**: ⏱️ S (4-6 hours)
**Priority**: 🟡 HIGH

#### Implementation Tasks

- [ ] **Create GitHub service**
  ```typescript
  // src/hooks/useGitHubStats.ts
  GET /api/github/repo/gone3d/plixo-web
  - Fetch repo statistics (stars, forks, watchers)
  - Get recent commits
  - Fetch contributor data
  - Cache for 5 minutes (GitHub API limits)
  ```

- [ ] **Update About page**
  - Display live GitHub stats
  - Show star count, forks, watchers
  - Render recent commits
  - Handle API failures gracefully

- [ ] **Add loading states**
  - Skeleton loader for stats
  - Pulsing animation while fetching
  - Fallback to static data on error

**Acceptance Criteria**:
- ✅ Live GitHub stats displaying
- ✅ Graceful degradation on API failure
- ✅ Cache working to avoid rate limits

---

### 2.4 Contact Form Integration

**Effort**: ⏱️ M (6-8 hours)
**Priority**: 🔴 CRITICAL

#### Implementation Tasks

- [ ] **Install form libraries**
  ```bash
  npm install react-hook-form zod @hookform/resolvers
  npm install @cloudflare/turnstile
  ```

- [ ] **Build contact form component**
  ```typescript
  // src/components/molecules/ContactForm.tsx
  - Form validation with Zod schema
  - CloudFlare Turnstile CAPTCHA integration
  - Loading states during submission
  - Success/error messaging
  - Rate limit handling (client-side feedback)
  ```

- [ ] **Create submission hook**
  ```typescript
  // src/hooks/useContactForm.ts
  POST /api/submit
  - Handle form submission
  - Manage CAPTCHA token
  - Show success/error states
  - Clear form on success
  ```

- [ ] **Update Connect page**
  - Replace "Messaging Offline" with live form
  - Add form validation feedback
  - Show submission status
  - Display rate limit messages

**Acceptance Criteria**:
- ✅ Contact form fully functional
- ✅ CAPTCHA protection working
- ✅ Validation providing helpful feedback
- ✅ Success/error states clear

---

### 2.5 Analytics Integration

**Effort**: ⏱️ L (10-14 hours)
**Priority**: 🟡 HIGH

#### Event Tracking Implementation

- [ ] **Create analytics service**
  ```typescript
  // src/services/analytics.ts
  - Page view tracking
  - Click event tracking
  - Project view tracking
  - External link tracking
  - Anonymous session management
  ```

- [ ] **Implement tracking hooks**
  ```typescript
  // src/hooks/useAnalytics.ts
  - usePageView() - Track page visits
  - useClickTracking() - Track interactions
  - useProjectView() - Track project engagement
  ```

- [ ] **Add tracking to components**
  - Landing page views
  - Work page project clicks
  - External link clicks (GitHub, LinkedIn)
  - Download tracking (future resume)

#### Insights Dashboard Implementation

- [ ] **Create analytics components**
  ```typescript
  // src/components/molecules/AnalyticsDashboard.tsx
  - Visitor count cards
  - Geographic distribution chart
  - Page views over time graph
  - Popular projects list
  - Click heatmap
  ```

- [ ] **Create analytics hooks**
  ```typescript
  // src/hooks/useAnalyticsDashboard.ts
  GET /api/analytics/public
  GET /admin/analytics/events?period=week
  - Fetch public stats
  - Support temporal queries (day, week, month, year, all)
  - Real-time updates (optional WebSocket)
  ```

- [ ] **Update Insights page**
  - Replace "Awaiting API" with live dashboard
  - Add period selector (day/week/month/year/all)
  - Display visitor metrics
  - Show geographic distribution
  - Render top pages and projects

**Acceptance Criteria**:
- ✅ All visitor interactions tracked
- ✅ Privacy-compliant (no PII)
- ✅ Insights dashboard functional
- ✅ Temporal queries working
- ✅ Real-time or near-real-time updates

---

### 2.6 Authentication & Protected Routes

**Effort**: ⏱️ M (6-8 hours)
**Priority**: 🟢 MEDIUM (Future admin features)

#### Implementation Tasks

- [ ] **Create auth service**
  ```typescript
  // src/services/auth.ts
  POST /api/auth/login
  POST /api/auth/logout
  GET /api/auth/me
  - JWT token management
  - LocalStorage or sessionStorage
  - Token refresh logic
  - Logout functionality
  ```

- [ ] **Create auth context**
  ```typescript
  // src/contexts/AuthContext.tsx
  - User state management
  - Login/logout actions
  - Protected route wrapper
  - Role-based access control
  ```

- [ ] **Build admin dashboard (future)**
  - Message management
  - Content editing
  - Analytics deep dive
  - User management

**Acceptance Criteria**:
- ✅ Authentication flow working
- ✅ JWT tokens stored securely
- ✅ Protected routes functional
- ✅ Auto-logout on token expiry

---

### 2.7 Error Handling & Loading States

**Effort**: ⏱️ S (4-6 hours)
**Priority**: 🟡 HIGH

#### Implementation Tasks

- [ ] **Create error boundary**
  ```typescript
  // src/components/ErrorBoundary.tsx
  - Catch React errors
  - Display friendly error UI
  - Log errors to console (dev)
  - Fallback to safe state
  ```

- [ ] **Create loading components**
  ```typescript
  // src/components/atoms/Skeleton.tsx
  - Skeleton loader for content
  - Pulsing animation
  - Match content structure
  ```

- [ ] **Implement retry logic**
  - Automatic retry on failure
  - Exponential backoff
  - User-triggered retry button
  - Offline detection

**Acceptance Criteria**:
- ✅ Errors handled gracefully
- ✅ Loading states professional
- ✅ Retry logic working
- ✅ Offline state detected

---

## Dependencies

### External Dependencies
- ✅ plixo-api deployed to api.plixo.com
- ✅ plixo-api health endpoint working
- ✅ All API endpoints implemented and tested
- ✅ CORS configured for plixo.com
- ✅ CloudFlare Turnstile configured

### Internal Dependencies
- ✅ Milestone 0 (Production Deployment) complete
- ✅ Milestone 1 (Foundation) complete

---

## Timeline

| Task | Duration | Dependencies |
|------|----------|--------------|
| 2.1 API Service Layer | 4-6 hours | None |
| 2.2 Portfolio Integration | 8-12 hours | 2.1, API Portfolio endpoints |
| 2.3 GitHub Integration | 4-6 hours | 2.1, API GitHub endpoints |
| 2.4 Contact Form | 6-8 hours | 2.1, API Contact endpoint |
| 2.5 Analytics | 10-14 hours | 2.1, API Analytics endpoints |
| 2.6 Authentication | 6-8 hours | 2.1, API Auth endpoints |
| 2.7 Error Handling | 4-6 hours | All above |

**Total Estimated Time**: 42-60 hours (1-1.5 weeks full-time)

**Note**: API development (plixo-api) runs in parallel and takes 4-6 weeks. Frontend integration can begin once API endpoints are available.

---

## Testing Strategy

### Integration Testing

- [ ] **API endpoint testing**
  - Test all GET requests
  - Test POST requests (contact form)
  - Verify error handling
  - Check caching behavior

- [ ] **User flow testing**
  - Submit contact form end-to-end
  - Navigate all pages with API data
  - View analytics dashboard
  - Test offline behavior

- [ ] **Performance testing**
  - Measure API response times
  - Check bundle size impact
  - Verify loading state performance
  - Test slow network conditions

---

## Rollout Strategy

### Phase 1: Portfolio Content (Week 1)
- Deploy API portfolio endpoints
- Integrate frontend hooks
- Replace temp-data gradually
- Monitor for errors

### Phase 2: GitHub & Contact (Week 2)
- Add GitHub integration
- Deploy contact form
- Enable CAPTCHA
- Test submission flow

### Phase 3: Analytics (Week 3)
- Enable event tracking
- Deploy insights dashboard
- Monitor data collection
- Verify privacy compliance

### Phase 4: Polish & Optimize (Week 4)
- Add authentication
- Optimize caching
- Improve error handling
- Performance tuning

---

## Blockers & Risks

### Potential Blockers
- API development timeline longer than expected
- CORS configuration issues
- CloudFlare Turnstile setup challenges
- Rate limiting from GitHub API

### Mitigation Strategies
- Start with mock API endpoints locally
- Test CORS early with dev environment
- Implement graceful fallbacks
- Cache GitHub data aggressively

---

**Next Milestone**: Milestone 3 - Advanced Features (3D integration, real-time analytics, enhanced interactivity)

---

## References

- **plixo-api PRD**: ../plixo-api/PRD.md
- **plixo-api Development**: ../plixo-api/tasks/
- **React Query Docs**: https://tanstack.com/query/latest
- **CloudFlare Turnstile**: https://developers.cloudflare.com/turnstile/
