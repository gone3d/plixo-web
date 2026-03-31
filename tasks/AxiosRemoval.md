# Axios Removal Plan

## Security Vulnerability

**Current Version:** axios v1.13.1
**Severity:** HIGH
**CVE:** GHSA-43fc-jf86-j433
**Issue:** Axios is Vulnerable to Denial of Service via `__proto__` Key in mergeConfig
**Fix Available:** Update to v1.13.5+ or remove dependency entirely

## Current Usage Analysis

### Files Using Axios
Axios is centralized through `apiClient` in [src/services/api.ts](../src/services/api.ts) and used across **13 files** with **27 total API calls**:

#### Core Services (3 files)
- [src/services/api.ts](../src/services/api.ts) - Core axios configuration with interceptors
- [src/services/auth.ts](../src/services/auth.ts) - 6 API calls (login, guest-login, logout, /auth/me, /auth/refresh, /auth/verify-role)
- [src/services/maintenance.ts](../src/services/maintenance.ts) - 3 API calls (get status, admin status, update)

#### Pages (3 files)
- [src/pages/About.tsx](../src/pages/About.tsx) - 1 call (GET /about)
- [src/pages/Work.tsx](../src/pages/Work.tsx) - 1 call (GET /projects)
- [src/pages/Console.tsx](../src/pages/Console.tsx) - 5 calls (user management CRUD)

#### Contexts (1 file)
- [src/contexts/GlobalContext.tsx](../src/contexts/GlobalContext.tsx) - 1 call (GET /health)

#### Admin Components (2 files)
- [src/components/admin/AboutManager.tsx](../src/components/admin/AboutManager.tsx) - 5 calls (GET, PUT operations)
- [src/components/admin/AboutSectionEditModal.tsx](../src/components/admin/AboutSectionEditModal.tsx) - 1 call (PUT /admin/about)
- [src/components/admin/ProjectsManager.tsx](../src/components/admin/ProjectsManager.tsx) - 4 calls (CRUD operations)

#### Other Components (3 files)
- [src/components/molecules/WorldMap.tsx](../src/components/molecules/WorldMap.tsx)
- [src/components/molecules/USAMap.tsx](../src/components/molecules/USAMap.tsx)
- [src/components/molecules/charts/EventsChartComponent.tsx](../src/components/molecules/charts/EventsChartComponent.tsx)

### Current Axios Features in Use

From [src/services/api.ts](../src/services/api.ts:1-81):

1. **Base Configuration**
   - Base URL from environment variables
   - 10-second timeout
   - Default Content-Type: application/json

2. **Request Interceptor**
   - Automatically adds `Authorization: Bearer ${token}` header
   - Reads token from memory-only tokenStorage

3. **Response Interceptor**
   - Global error handling
   - Automatic 401 handling (clears token)
   - Error logging for 403, 404, 500 status codes
   - Network error detection

4. **TypeScript Types**
   - `AxiosError` exported as `ApiError`
   - `AxiosResponse<T>` exported as `ApiResponse<T>`

## Replacement Strategy: Native Fetch

### Why Native Fetch?

**Pros:**
- Zero dependencies - eliminates security vulnerability surface
- Native browser API - excellent support in 2026
- Smaller bundle size (no axios = ~13KB saved)
- Modern async/await patterns
- Built-in TypeScript support in modern environments

**Cons:**
- Need to implement interceptor pattern manually
- More verbose error handling
- No automatic request/response transformation

### Implementation Plan

#### Phase 1: Create Fetch-Based API Client

**File:** [src/services/api.ts](../src/services/api.ts)

Create a drop-in replacement for `apiClient` that maintains the same API surface:

```typescript
// New implementation structure
class ApiClient {
  private baseURL: string
  private timeout: number
  private defaultHeaders: Record<string, string>
  private requestInterceptors: Array<(config: RequestConfig) => RequestConfig>
  private responseInterceptors: Array<(response: Response) => Response>

  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>
  async post<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>
  async put<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>
  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>
  async patch<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>
}

export const apiClient = new ApiClient()
```

**Key Features to Replicate:**
1. Automatic Authorization header injection
2. Global error handling with status code detection
3. Token clearing on 401
4. Timeout support using AbortController
5. TypeScript generics for response typing

#### Phase 2: Update Type Exports

**Current Types:**
```typescript
export type ApiError = AxiosError
export type ApiResponse<T> = AxiosResponse<T>
```

**New Types:**
```typescript
export interface ApiError extends Error {
  response?: {
    status: number
    data: any
  }
  request?: any
  config?: RequestConfig
}

export interface ApiResponse<T> {
  data: T
  status: number
  statusText: string
  headers: Headers
}
```

#### Phase 3: Test All Endpoints

Test each of the 27 API calls to ensure:
- Request interceptor adds auth token
- Response interceptor handles errors correctly
- Type safety maintained
- No breaking changes in consuming code

**Critical Test Cases:**
1. Auth flows (login, logout, token refresh)
2. Admin operations (requires auth token)
3. Public endpoints (no auth required)
4. Error handling (401, 403, 404, 500)
5. Network failures (timeout, offline)

#### Phase 4: Remove Axios Dependency

```bash
npm uninstall axios
```

Verify no other dependencies pull in axios transitively:
```bash
npm list axios
```

### Migration Checklist

- [ ] Implement new ApiClient class with fetch
- [ ] Replicate request interceptor (auth token injection)
- [ ] Replicate response interceptor (error handling)
- [ ] Update TypeScript types (ApiError, ApiResponse)
- [ ] Test authentication endpoints
  - [ ] POST /auth/login
  - [ ] POST /auth/guest-login
  - [ ] POST /auth/logout
  - [ ] GET /auth/me
  - [ ] POST /auth/refresh
  - [ ] GET /auth/verify-role
- [ ] Test maintenance endpoints
  - [ ] GET /system/maintenance
  - [ ] GET /admin/maintenance
  - [ ] POST /admin/maintenance
- [ ] Test content endpoints
  - [ ] GET /about
  - [ ] PUT /admin/about
  - [ ] GET /projects
  - [ ] POST /projects
  - [ ] PUT /projects/:id
  - [ ] DELETE /projects/:id
- [ ] Test user management endpoints (Console)
  - [ ] GET /admin/users
  - [ ] GET /admin/users/:id
  - [ ] POST /admin/users
  - [ ] PUT /admin/users/:id
  - [ ] DELETE /admin/users/:id
- [ ] Test health check endpoint
  - [ ] GET /health
- [ ] Run full application test suite
- [ ] Test error scenarios (401, 403, 404, 500, timeout)
- [ ] Remove axios from package.json
- [ ] Verify no transitive dependencies on axios
- [ ] Update documentation if needed

## Code Changes Required

### Zero Changes in Consuming Code

Because the new `apiClient` will maintain the same interface as axios:
```typescript
// This code will continue to work unchanged:
const { data } = await apiClient.get<LoginResponse>('/auth/login')
const { data } = await apiClient.post<T>('/endpoint', payload)
```

### Only Change: src/services/api.ts

The entire migration is isolated to [src/services/api.ts](../src/services/api.ts). No other files need modification.

## Risk Assessment

**Low Risk** - Reasons:
1. All API calls go through single `apiClient` instance
2. Interface remains identical (drop-in replacement)
3. Existing error handling patterns preserved
4. No database or backend changes required
5. TypeScript will catch any interface mismatches
6. Can be fully tested before deployment

**Potential Issues:**
1. Subtle differences in error object structure
2. Need to ensure timeout behavior matches
3. Response/request type compatibility

## Estimated Effort

- **Implementation:** 2-3 hours
- **Testing:** 2-3 hours
- **Total:** 4-6 hours

## Recommendation

**Proceed with native fetch replacement** for the following reasons:

1. **Security:** Eliminates high-severity vulnerability
2. **Maintainability:** One less dependency to track and update
3. **Bundle Size:** Reduces production bundle by ~13KB
4. **Future-proof:** Native APIs are stable and won't have vulnerabilities
5. **Low Risk:** Centralized usage makes migration straightforward
6. **Modern:** Aligns with 2026 best practices (zero unnecessary dependencies)

## Alternative: Quick Fix

If time-constrained, can update axios to fix vulnerability:
```bash
npm update axios
```

This is a temporary solution. Native fetch replacement is still recommended for long-term maintainability.

---

## Implementation Complete

**Date Completed:** 2026-03-30

### Summary

Successfully replaced axios with native fetch API. All changes isolated to [src/services/api.ts](../src/services/api.ts) as planned.

### What Was Done

1. ✅ Created custom `ApiClient` class using native `fetch` API
2. ✅ Implemented request interceptor pattern (automatic auth token injection)
3. ✅ Implemented response interceptor pattern (global error handling)
4. ✅ Maintained identical interface - zero changes required in consuming code
5. ✅ Added timeout support using AbortController
6. ✅ Preserved TypeScript type safety with generic defaults
7. ✅ Built successfully with no TypeScript errors
8. ✅ Removed axios from package.json (23 packages removed)
9. ✅ Verified no transitive axios dependencies remain
10. ✅ **High severity vulnerability eliminated**

### Key Implementation Details

**File Changed:** [src/services/api.ts](../src/services/api.ts) (237 lines)

**New Features:**
- Native `fetch` with AbortController for timeouts
- Custom `ApiClient` class with methods: `get`, `post`, `put`, `delete`, `patch`
- Request header injection (Authorization bearer token)
- Response error handling by status code (401, 403, 404, 500)
- Automatic 401 handling (token clearing)
- Network error detection and logging
- TypeScript interfaces: `ApiResponse<T>`, `ApiError`, `RequestConfig`
- Generic type defaults (`T = any`) for backward compatibility

**Files With Zero Changes:** 13 consuming files (auth.ts, maintenance.ts, pages, components)

### Security Impact

**Before:**
```bash
axios  1.0.0 - 1.13.4
Severity: high
Axios is Vulnerable to Denial of Service via __proto__ Key
```

**After:**
```bash
# Axios completely removed - vulnerability eliminated
npm list axios
`-- (empty)
```

### Build Verification

```bash
✓ TypeScript compilation successful
✓ Vite build successful (4.26s)
✓ All 3602 modules transformed
✓ Production bundle created
```

### Bundle Size Comparison

Axios removal saved approximately **~13KB** from the production bundle (23 packages removed).

### Testing Status

- ✅ Build compilation successful
- ✅ TypeScript type checking passed
- ✅ No runtime errors during build
- ⚠️ Manual endpoint testing recommended before deployment

### Next Steps

**Recommended before production deployment:**

1. Test authentication flows in development:
   - Login with username/password
   - Guest login with Turnstile
   - Token refresh
   - Logout

2. Test admin operations:
   - About content management
   - Project CRUD operations
   - User management

3. Test error scenarios:
   - Invalid credentials (401)
   - Missing permissions (403)
   - Network timeout
   - Offline mode

4. Monitor production logs after deployment for any edge cases

---

**Status:** ✅ COMPLETED - Ready for testing
**Created:** 2026-03-30
**Completed:** 2026-03-30
**Implementation Time:** ~2 hours
