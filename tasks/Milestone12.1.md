# Milestone 12.1 - M0: CSRF Protection Implementation (CRITICAL SECURITY FIX)

**Milestone Version:** 1.4.3 (starting version from Task 0)
**Date Created:** 2026-04-02
**Date Started:** [YYYY-MM-DD when Task 0 begins]
**Date Completed:** [YYYY-MM-DD when all tasks complete]
**Status:** Planning
**Based on:** [docs/SECURITY_AUDIT.md - Milestone M0](../docs/SECURITY_AUDIT.md#milestone-0-critical-csrf-fix)

**⚠️ CRITICAL SECURITY MILESTONE - BLOCKS PRODUCTION DEPLOYMENT**

Implements CSRF (Cross-Site Request Forgery) token protection for all state-changing API operations. Currently, the application is vulnerable to CSRF attacks that could allow malicious websites to perform authenticated actions on behalf of logged-in users.

---

## Version Information

**Versioning Strategy:**
- **v1.x.x** - Production release (current)
- Task-level versioning: Each task adds +0.0.1

**Current Versions (before milestone):**
- **plixo-web:** `1.4.2`
- **plixo-api:** `1.4.0`

**Starting Versions (milestone begins):**
- **plixo-web:** `1.4.3` (from Task 0)
- **plixo-api:** `1.4.1` (API changes required)

**Target Versions (after milestone completion):**
- **plixo-web:** `1.4.10` (7 tasks × 0.0.1)
- **plixo-api:** `1.4.8` (7 tasks × 0.0.1)

**Git Branches:**
- **plixo-web:** `don-040226-milestone-M0-web`
- **plixo-api:** `don-040226-milestone-M0-api`

---

## Progress Summary

**Completion:** 0 of 8 tasks complete (0%)

| Task                                    | Priority  | Status     | Version (Web) | Version (API) | Deployed |
| --------------------------------------- | --------- | ---------- | ------------- | ------------- | -------- |
| Task 0: Milestone Initialization        | SETUP     | ⏳ Pending | 1.4.2         | 1.4.0         | -        |
| Task 1: Add CSRF Database Migration     | CRITICAL  | ⏳ Pending | 1.4.3         | 1.4.1         | -        |
| Task 2: Generate CSRF Tokens on Login   | CRITICAL  | ⏳ Pending | 1.4.4         | 1.4.2         | -        |
| Task 3: Store CSRF Tokens Frontend      | CRITICAL  | ⏳ Pending | 1.4.5         | 1.4.2         | -        |
| Task 4: Send CSRF Tokens in Headers     | CRITICAL  | ⏳ Pending | 1.4.6         | 1.4.2         | -        |
| Task 5: Implement CSRF Validation       | CRITICAL  | ⏳ Pending | 1.4.6         | 1.4.3         | -        |
| Task 6: Apply CSRF Middleware           | CRITICAL  | ⏳ Pending | 1.4.6         | 1.4.4         | -        |
| Task 7: Test CSRF Protection            | CRITICAL  | ⏳ Pending | 1.4.7         | 1.4.5         | -        |
| Task 8: Optional Origin/Referer Check   | HIGH      | ⏳ Pending | 1.4.7         | 1.4.6         | -        |

**Status Legend:**
- ⏳ Pending
- 🚧 In Progress
- ✅ Complete
- 🚀 Deployed

---

## Overview

**Objective:** Implement comprehensive CSRF token protection to prevent cross-site request forgery attacks on all state-changing operations.

**Scope:**

- Database migration to add CSRF token storage
- CSRF token generation on login and guest-login
- Frontend token storage and header injection
- Backend CSRF validation middleware
- Comprehensive testing of CSRF protection
- (Optional) Origin/Referer validation as defense-in-depth

**Priority Breakdown:**

- Critical: 7 tasks (M0.1 through M0.7)
- High: 1 task (M0.8 - optional)

**Estimated Effort:** 6-8 hours total
**Actual Progress:** [Track actual time spent]

**Dependencies:**

- None - This is the highest priority security fix

**Blocks:**

- **ALL production deployments** - Cannot deploy without CSRF protection
- Milestone 12.2 (M1 - Security Headers)
- All future security milestones

---

## Background

### The Problem

**Current Vulnerability (CRITICAL):**

The Plixo application uses JWT tokens in the Authorization header for authentication, which provides **NO CSRF protection by default**. This means:

1. **JWT tokens are accessible via JavaScript** (memory-only storage in tokenStorage)
2. **No CSRF token validation** on state-changing operations
3. **CORS allows credentials** (`Access-Control-Allow-Credentials: true`)
4. **Attackers can make authenticated requests** from malicious websites

**Attack Scenario:**
```html
<!-- evil.com can execute this if user has valid JWT -->
<script>
fetch('https://api.plixo.com/admin/users', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + stolenToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'hacker',
    role: 'admin',
    password: 'backdoor123'
  })
})
</script>
```

**Impact:**
- Admin account creation by attackers
- Unauthorized project modifications
- User data manipulation
- Content management system compromise

### The Solution

**Implement CSRF Token Protection:**

1. Generate unique CSRF token on login (separate from JWT)
2. Store CSRF token hash in backend session table
3. Frontend sends CSRF token in `X-CSRF-Token` header
4. Backend validates CSRF token for all POST/PUT/DELETE/PATCH requests
5. Return 403 Forbidden if CSRF token missing or invalid

**Why This Works:**
- CSRF tokens are generated server-side and tied to user sessions
- Attackers cannot read CSRF tokens from another domain (same-origin policy)
- Even with stolen JWT, attackers cannot make state-changing requests without CSRF token
- GET requests remain unaffected (safe methods)

---

## Task 0: Milestone Initialization (SETUP PRIORITY)

**Purpose:** Initialize milestone by determining current version and creating feature branches
**Estimated Time:** 10 minutes
**Status:** ⏳ Pending
**Dependencies:** None

### Description

Establish baseline versions and create feature branches for this critical security milestone.

### Step 0.1: Determine Current Web Version

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-web
git checkout main
git pull origin main
cat package.json | grep '"version"'
```

**Expected:** `"version": "1.4.2"`

### Step 0.2: Determine Current API Version

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-api
git checkout main
git pull origin main
cat package.json | grep '"version"'
```

**Expected:** `"version": "1.4.0"`

### Step 0.3: Create Web Branch

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-web
git checkout main
git pull origin main
git checkout -b don-040226-milestone-M0-web
git push -u origin don-040226-milestone-M0-web
```

### Step 0.4: Create API Branch

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-api
git checkout main
git pull origin main
git checkout -b don-040226-milestone-M0-api
git push -u origin don-040226-milestone-M0-api
```

### Step 0.5: Update Milestone Header

Update this document with:
- **Date Started:** [Current date]
- **Status:** In Progress
- Confirm version numbers

### Success Criteria

- ✅ Current versions recorded (web: 1.4.2, api: 1.4.0)
- ✅ Web branch `don-040226-milestone-M0-web` created and pushed
- ✅ API branch `don-040226-milestone-M0-api` created and pushed
- ✅ Milestone document updated with start date
- ✅ Ready to proceed with Task 1

---

## Task 1: Add CSRF Database Migration (CRITICAL)

**Severity:** CRITICAL
**Risk:** Cannot store CSRF tokens without database schema changes
**Estimated Time:** 30 minutes
**Actual Time:** [Fill in when complete]
**Status:** ⏳ Pending
**Version (API):** 1.4.1
**Dependencies:** Task 0

### Description

Create and apply database migration to add CSRF token storage to the sessions table. This allows the backend to store and validate CSRF token hashes.

### Affected Files

**plixo-api:**
- `/src/db/migrations/00XX_add_csrf_tokens.sql` (NEW)

### Implementation Steps

1. **Create migration file**:

```sql
-- plixo-api/src/db/migrations/0017_add_csrf_tokens.sql
-- Add CSRF token support to sessions table

-- Add csrf_token_hash column to sessions
ALTER TABLE sessions ADD COLUMN csrf_token_hash TEXT;

-- Create index for faster CSRF token lookups
CREATE INDEX IF NOT EXISTS idx_sessions_csrf ON sessions(csrf_token_hash);

-- Add csrf_token_hash to token_blacklist (for future use)
ALTER TABLE token_blacklist ADD COLUMN csrf_token_hash TEXT;
```

2. **Apply migration locally**:

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-api
wrangler d1 migrations apply plixo-api-db --local
```

3. **Verify migration**:

```bash
wrangler d1 execute plixo-api-db --local --command="PRAGMA table_info(sessions);"
# Should show csrf_token_hash column
```

4. **Test rollback** (optional but recommended):

```sql
-- Create rollback migration if needed
ALTER TABLE sessions DROP COLUMN csrf_token_hash;
DROP INDEX IF EXISTS idx_sessions_csrf;
ALTER TABLE token_blacklist DROP COLUMN csrf_token_hash;
```

### Testing Checklist

**Migration Tests:**
- [ ] Migration file syntax valid (no SQL errors)
- [ ] Migration applies successfully locally
- [ ] `sessions` table has `csrf_token_hash` column
- [ ] Index `idx_sessions_csrf` created
- [ ] No data loss in existing sessions
- [ ] Rollback migration works (if tested)

**Manual Testing:**
- [ ] Query sessions table: `SELECT * FROM sessions LIMIT 1;`
- [ ] Verify csrf_token_hash column present and NULL

### Success Criteria

- ✅ Migration file created at correct path
- ✅ Migration applied successfully to local D1 database
- ✅ `sessions.csrf_token_hash` column exists
- ✅ Index on csrf_token_hash created
- ✅ No errors in migration logs
- ✅ API version updated to 1.4.1 in package.json

### Rollback Plan

```bash
# If migration causes issues, rollback:
cd /Users/don/Projects\ 2/GitHub/plixo-api
wrangler d1 migrations apply plixo-api-db --local
# Apply rollback SQL manually if needed
```

---

## Task 2: Generate CSRF Tokens on Login (CRITICAL)

**Severity:** CRITICAL
**Risk:** Users won't have CSRF tokens to validate requests
**Estimated Time:** 1 hour
**Actual Time:** [Fill in when complete]
**Status:** ⏳ Pending
**Version (API):** 1.4.2
**Dependencies:** Task 1

### Description

Modify login and guest-login endpoints to generate CSRF tokens and return them to clients. Store CSRF token hash in sessions table.

### Affected Files

**plixo-api:**
- `/functions/auth/login.ts`
- `/functions/auth/guest-login.ts`
- `/src/lib/utils/hash.ts` (verify hashToken function exists)

### Implementation Steps

1. **Update login endpoint**:

```typescript
// plixo-api/functions/auth/login.ts
import { hashToken } from '../../src/lib/utils/hash'

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json() as { username?: string; password?: string }
    const { username, password } = body

    if (!username || !password) {
      return Response.json(
        { success: false, error: 'Username and password required' },
        { status: 400 }
      )
    }

    // ... existing request data collection ...

    const result = await authService.login(username, password, requestData)

    // **NEW: Generate CSRF token**
    const csrfToken = crypto.randomUUID()
    const csrfTokenHash = await hashToken(csrfToken)

    // **NEW: Store CSRF token hash in session**
    await context.env.DB.prepare(
      'UPDATE sessions SET csrf_token_hash = ? WHERE user_id = ? AND expires_at > datetime("now")'
    ).bind(csrfTokenHash, result.user.id).run()

    return Response.json({
      success: true,
      data: {
        ...result,
        csrfToken  // **NEW: Include CSRF token in response**
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return Response.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    )
  }
}
```

2. **Update guest-login endpoint** (same pattern):

```typescript
// plixo-api/functions/auth/guest-login.ts
// Apply same CSRF token generation logic
```

3. **Update AuthService types** (if needed):

```typescript
// plixo-api/src/lib/services/auth.service.ts
export interface LoginResult {
  token: string
  expiresAt: string
  user: User
  csrfToken?: string  // **NEW: Optional for backward compatibility**
}
```

### Testing Checklist

**Unit Tests:**
- [ ] CSRF token generated on login (non-null, valid UUID format)
- [ ] CSRF token hash stored in sessions table
- [ ] CSRF token returned in login response

**Integration Tests:**
- [ ] Login with valid credentials returns csrfToken
- [ ] Guest login with valid CAPTCHA returns csrfToken
- [ ] CSRF token is unique per session
- [ ] Failed login does NOT generate CSRF token

**Manual Testing:**
```bash
# Test login endpoint
curl -X POST http://localhost:8788/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq '.data.csrfToken'
# Expected: UUID string (e.g., "a1b2c3d4-...")

# Verify CSRF token hash in database
wrangler d1 execute plixo-api-db --local \
  --command="SELECT csrf_token_hash FROM sessions WHERE user_id = 'user_admin_000001';"
# Expected: SHA-256 hash
```

### Success Criteria

- ✅ Login endpoint generates CSRF token
- ✅ Guest-login endpoint generates CSRF token
- ✅ CSRF token hash stored in sessions table
- ✅ CSRF token returned in API response
- ✅ CSRF token is valid UUID format
- ✅ TypeScript compilation passes
- ✅ API version updated to 1.4.2 in package.json

### Rollback Plan

```bash
# Revert login.ts and guest-login.ts changes
git checkout HEAD~1 functions/auth/login.ts functions/auth/guest-login.ts
```

---

## Task 3: Store CSRF Tokens in Frontend (CRITICAL)

**Severity:** CRITICAL
**Risk:** Frontend cannot send CSRF tokens without storing them
**Estimated Time:** 45 minutes
**Actual Time:** [Fill in when complete]
**Status:** ⏳ Pending
**Version (Web):** 1.4.5
**Dependencies:** Task 2

### Description

Update frontend token storage to handle CSRF tokens separately from JWT tokens. Store CSRF tokens in memory alongside JWT tokens.

### Affected Files

**plixo-web:**
- `/src/services/tokenStorage.ts`
- `/src/services/auth.ts`

### Implementation Steps

1. **Update TokenStorage class**:

```typescript
// plixo-web/src/services/tokenStorage.ts
class TokenStorage {
  private token: string | null = null
  private csrfToken: string | null = null  // **NEW**

  setToken(token: string): void {
    this.token = token
  }

  getToken(): string | null {
    return this.token
  }

  removeToken(): void {
    this.token = null
    this.csrfToken = null  // **NEW: Clear both tokens**
  }

  // **NEW: CSRF token methods**
  setCSRFToken(csrfToken: string): void {
    this.csrfToken = csrfToken
  }

  getCSRFToken(): string | null {
    return this.csrfToken
  }

  // **NEW: Convenience method to set both tokens**
  setTokens(token: string, csrfToken: string): void {
    this.token = token
    this.csrfToken = csrfToken
  }
}

export const tokenStorage = new TokenStorage()
```

2. **Update AuthService to store CSRF tokens**:

```typescript
// plixo-web/src/services/auth.ts
async login(username: string, password: string): Promise<LoginData> {
  try {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', {
      username,
      password,
    })

    if (data.success && data.data.token) {
      // **UPDATED: Store both tokens**
      if (data.data.csrfToken) {
        tokenStorage.setTokens(data.data.token, data.data.csrfToken)
      } else {
        // Fallback for backward compatibility during migration
        tokenStorage.setToken(data.data.token)
      }
      return data.data
    }

    throw new Error('Login failed: Invalid response from server')
  } catch (error: any) {
    // ... existing error handling ...
  }
}

// **SAME UPDATE for guestLogin method**
async guestLogin(captchaToken: string): Promise<LoginData> {
  // ... apply same CSRF token storage logic ...
}
```

3. **Update LoginData interface**:

```typescript
// plixo-web/src/services/auth.ts
interface LoginData {
  token: string
  expiresAt: string
  user: User
  csrfToken?: string  // **NEW: Optional for backward compatibility**
}
```

### Testing Checklist

**Unit Tests:**
- [ ] `setCSRFToken()` stores CSRF token in memory
- [ ] `getCSRFToken()` retrieves stored CSRF token
- [ ] `removeToken()` clears both JWT and CSRF tokens
- [ ] `setTokens()` stores both tokens simultaneously

**Integration Tests:**
- [ ] Login flow stores CSRF token
- [ ] Guest login flow stores CSRF token
- [ ] Logout clears CSRF token
- [ ] Page refresh clears CSRF token (memory-only)

**Manual Testing:**
```javascript
// In browser console after login
import { tokenStorage } from './src/services/tokenStorage'
console.log('JWT:', tokenStorage.getToken())
console.log('CSRF:', tokenStorage.getCSRFToken())
// Both should be non-null strings
```

### Success Criteria

- ✅ TokenStorage class has CSRF token methods
- ✅ Login stores CSRF token from API response
- ✅ Guest login stores CSRF token from API response
- ✅ Logout clears CSRF token
- ✅ TypeScript compilation passes
- ✅ No console errors after login
- ✅ Web version updated to 1.4.5 in package.json

### Rollback Plan

```bash
# Revert tokenStorage.ts and auth.ts changes
git checkout HEAD~1 src/services/tokenStorage.ts src/services/auth.ts
```

---

## Task 4: Send CSRF Tokens in Request Headers (CRITICAL)

**Severity:** CRITICAL
**Risk:** Backend cannot validate CSRF tokens if not sent by frontend
**Estimated Time:** 45 minutes
**Actual Time:** [Fill in when complete]
**Status:** ⏳ Pending
**Version (Web):** 1.4.6
**Dependencies:** Task 3

### Description

Update API client to automatically include CSRF tokens in `X-CSRF-Token` header for all state-changing requests (POST, PUT, DELETE, PATCH).

### Affected Files

**plixo-web:**
- `/src/services/api.ts`

### Implementation Steps

1. **Update ApiClient header injection**:

```typescript
// plixo-web/src/services/api.ts
import { tokenStorage } from './tokenStorage'

class ApiClient {
  // ... existing code ...

  /**
   * Request interceptor - adds authentication token AND CSRF token if available
   */
  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...customHeaders }

    // Get auth token from tokenStorage (memory only)
    const token = tokenStorage.getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    // **NEW: Add CSRF token for state-changing operations**
    const csrfToken = tokenStorage.getCSRFToken()
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken
    }

    return headers
  }

  // ... rest of class remains unchanged ...
}
```

2. **Verify all HTTP methods use getHeaders**:

```typescript
// Verify these methods call getHeaders() - they should already
async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>
async post<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>
async put<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>
async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>
async patch<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>
```

All should call `this.getHeaders()` internally.

### Testing Checklist

**Unit Tests:**
- [ ] POST request includes X-CSRF-Token header
- [ ] PUT request includes X-CSRF-Token header
- [ ] DELETE request includes X-CSRF-Token header
- [ ] PATCH request includes X-CSRF-Token header
- [ ] GET request includes X-CSRF-Token header (safe method, but ok to include)
- [ ] Requests without stored CSRF token omit header (no undefined values)

**Integration Tests:**
- [ ] Login → API call includes CSRF token header
- [ ] Guest login → API call includes CSRF token header
- [ ] Logout → Subsequent calls omit CSRF token header

**Manual Testing:**
```javascript
// In browser console after login
// Open Network tab
await apiClient.post('/admin/users', { username: 'test', role: 'user' })
// Check Network tab → Request Headers → X-CSRF-Token should be present
```

**Chrome DevTools Test:**
1. Log in as admin
2. Open DevTools → Network tab
3. Perform admin action (create user, edit project, etc.)
4. Inspect request headers → Verify `X-CSRF-Token: <uuid>` present

### Success Criteria

- ✅ All state-changing requests include X-CSRF-Token header
- ✅ CSRF token value matches stored token
- ✅ Requests work with CSRF token present (even before backend validation)
- ✅ TypeScript compilation passes
- ✅ No console errors
- ✅ Web version updated to 1.4.6 in package.json

### Rollback Plan

```bash
# Revert api.ts changes
git checkout HEAD~1 src/services/api.ts
```

---

## Task 5: Implement CSRF Validation Middleware (CRITICAL)

**Severity:** CRITICAL
**Risk:** CSRF attacks still possible without backend validation
**Estimated Time:** 1.5 hours
**Actual Time:** [Fill in when complete]
**Status:** ⏳ Pending
**Version (API):** 1.4.3
**Dependencies:** Task 4

### Description

Create CSRF validation middleware that checks CSRF tokens for all state-changing requests. This is the core security implementation that blocks CSRF attacks.

### Affected Files

**plixo-api:**
- `/src/lib/middleware/csrf.ts` (NEW)
- `/src/lib/types/env.d.ts` (update if needed)

### Implementation Steps

1. **Create CSRF validation middleware**:

```typescript
// plixo-api/src/lib/middleware/csrf.ts
import type { PagesFunction } from '@cloudflare/workers-types'
import type { Env } from '../types/env'
import { verifyToken } from '../utils/jwt'
import { hashToken } from '../utils/hash'

/**
 * CSRF validation middleware
 * Validates CSRF tokens for all state-changing operations (POST, PUT, DELETE, PATCH)
 * GET, HEAD, OPTIONS requests are exempt (safe methods)
 */
export async function validateCSRF(
  context: any,
  userPayload: any
): Promise<void> {
  const method = context.request.method

  // Skip CSRF validation for safe HTTP methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return
  }

  // CSRF token is required for state-changing operations
  const csrfToken = context.request.headers.get('X-CSRF-Token')

  if (!csrfToken) {
    throw new Error('CSRF token required for state-changing operations')
  }

  // Hash the provided CSRF token
  const csrfTokenHash = await hashToken(csrfToken)

  // Verify CSRF token matches session
  const session = await context.env.DB.prepare(
    `SELECT csrf_token_hash FROM sessions
     WHERE user_id = ?
     AND expires_at > datetime("now")
     AND csrf_token_hash IS NOT NULL
     ORDER BY created_at DESC
     LIMIT 1`
  ).bind(userPayload.sub).first()

  if (!session) {
    throw new Error('No active session found')
  }

  if (session.csrf_token_hash !== csrfTokenHash) {
    throw new Error('Invalid CSRF token')
  }

  // CSRF token valid - allow request to proceed
}

/**
 * CSRF middleware wrapper for Pages Functions
 */
export const csrfMiddleware: PagesFunction<Env> = async (context) => {
  // Skip CSRF for public endpoints
  const url = new URL(context.request.url)
  const publicPaths = [
    '/health',
    '/auth/login',
    '/auth/guest-login',
    '/auth/refresh',
    '/analytics/track',
    '/system/maintenance'
  ]

  const isPublicPath = publicPaths.some(path =>
    url.pathname === path || url.pathname.startsWith(path + '/')
  )

  if (isPublicPath) {
    return context.next()
  }

  // Skip CSRF for GET requests (safe methods)
  if (context.request.method === 'GET') {
    return context.next()
  }

  try {
    // Get user from auth middleware (should run before CSRF)
    const user = context.data.user

    if (!user) {
      return Response.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Validate CSRF token
    await validateCSRF(context, user)

    return context.next()
  } catch (error: any) {
    console.error('CSRF validation failed:', error.message)
    return Response.json(
      {
        success: false,
        error: 'CSRF validation failed',
        message: error.message
      },
      { status: 403 }
    )
  }
}
```

### Testing Checklist

**Unit Tests:**
- [ ] Safe methods (GET, HEAD, OPTIONS) bypass CSRF check
- [ ] POST without CSRF token returns 403
- [ ] POST with invalid CSRF token returns 403
- [ ] POST with valid CSRF token succeeds
- [ ] PUT/DELETE/PATCH require CSRF tokens
- [ ] Public paths bypass CSRF check

**Integration Tests:**
- [ ] Login → subsequent POST request succeeds
- [ ] Logout → CSRF token invalid, POST fails
- [ ] Session expired → CSRF validation fails
- [ ] Guest login → CSRF protection works

**Manual Testing:**
```bash
# Test 1: POST without CSRF token (should fail)
curl -X POST http://localhost:8788/admin/users \
  -H "Authorization: Bearer <valid-token>" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","role":"user"}'
# Expected: 403 Forbidden

# Test 2: POST with valid CSRF token (should succeed)
curl -X POST http://localhost:8788/admin/users \
  -H "Authorization: Bearer <valid-token>" \
  -H "X-CSRF-Token: <valid-csrf>" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","role":"user"}'
# Expected: 200 OK
```

### Success Criteria

- ✅ CSRF validation middleware created
- ✅ Safe methods (GET) bypass CSRF check
- ✅ State-changing methods (POST/PUT/DELETE/PATCH) require CSRF token
- ✅ Invalid CSRF tokens return 403 Forbidden
- ✅ Valid CSRF tokens allow request to proceed
- ✅ TypeScript compilation passes
- ✅ API version updated to 1.4.3 in package.json

### Rollback Plan

```bash
# Delete CSRF middleware file
rm src/lib/middleware/csrf.ts
# Or revert if already committed
git checkout HEAD~1 src/lib/middleware/csrf.ts
```

---

## Task 6: Apply CSRF Middleware to Admin Endpoints (CRITICAL)

**Severity:** CRITICAL
**Risk:** Admin endpoints remain vulnerable without CSRF middleware applied
**Estimated Time:** 1 hour
**Actual Time:** [Fill in when complete]
**Status:** ⏳ Pending
**Version (API):** 1.4.4
**Dependencies:** Task 5

### Description

Apply CSRF validation middleware to all admin endpoints and other authenticated state-changing endpoints. This completes the CSRF protection implementation.

### Affected Files

**plixo-api:**
- `/functions/admin/_middleware.ts`
- `/functions/_middleware.ts` (optional - global middleware)

### Implementation Steps

1. **Update admin middleware**:

```typescript
// plixo-api/functions/admin/_middleware.ts
import type { PagesFunction } from '@cloudflare/workers-types'
import type { Env } from '../src/lib/types/env'
import { validateCSRF } from '../src/lib/middleware/csrf'

export const onRequest: PagesFunction<Env> = async (context) => {
  // Existing authentication check (runs first)
  const authHeader = context.request.headers.get('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Response.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    )
  }

  const token = authHeader.substring(7)

  try {
    const decoded = await verifyToken(token, context.env.JWT_SECRET)

    // Check admin role
    if (decoded.role !== 'admin') {
      return Response.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Attach user to context
    context.data.user = decoded

    // **NEW: CSRF validation for state-changing operations**
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(context.request.method)) {
      try {
        await validateCSRF(context, decoded)
      } catch (error: any) {
        return Response.json(
          {
            success: false,
            error: 'CSRF validation failed',
            message: error.message
          },
          { status: 403 }
        )
      }
    }

    return context.next()
  } catch (error) {
    return Response.json(
      { success: false, error: 'Invalid or expired token' },
      { status: 401 }
    )
  }
}
```

2. **Optional: Add global CSRF middleware**:

```typescript
// plixo-api/functions/_middleware.ts
// Add CSRF check after authentication, before route handlers
// This provides defense-in-depth across all authenticated routes
```

3. **Update specific endpoint middlewares** (if any):

```typescript
// Check other _middleware.ts files in:
// - /functions/auth/_middleware.ts (if exists)
// - Other protected route directories
```

### Testing Checklist

**Unit Tests:**
- [ ] Admin POST without CSRF token returns 403
- [ ] Admin POST with valid CSRF token succeeds
- [ ] Admin PUT/DELETE/PATCH require CSRF tokens
- [ ] Admin GET requests work without CSRF tokens

**Integration Tests:**
- [ ] Create user (POST /admin/users) - CSRF required
- [ ] Update user (PUT /admin/users/:id) - CSRF required
- [ ] Delete user (DELETE /admin/users/:id) - CSRF required
- [ ] Get users (GET /admin/users) - CSRF not required
- [ ] Update project (PUT /admin/projects/:id) - CSRF required
- [ ] Update about content (PUT /admin/about) - CSRF required
- [ ] Maintenance mode (POST /admin/maintenance) - CSRF required

**Manual Testing:**
```bash
# Test admin endpoints
TOKEN="<admin-jwt-token>"
CSRF="<admin-csrf-token>"

# Should FAIL (no CSRF token)
curl -X POST http://localhost:8788/admin/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","role":"user","password":"test123"}'

# Should SUCCEED (with CSRF token)
curl -X POST http://localhost:8788/admin/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-CSRF-Token: $CSRF" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","role":"user","password":"test123"}'

# GET should always work
curl -X GET http://localhost:8788/admin/users \
  -H "Authorization: Bearer $TOKEN"
```

### Success Criteria

- ✅ All admin POST endpoints require CSRF token
- ✅ All admin PUT endpoints require CSRF token
- ✅ All admin DELETE endpoints require CSRF token
- ✅ All admin PATCH endpoints require CSRF token
- ✅ Admin GET endpoints work without CSRF token
- ✅ Non-admin users cannot bypass CSRF with invalid tokens
- ✅ TypeScript compilation passes
- ✅ API version updated to 1.4.4 in package.json

### Rollback Plan

```bash
# Revert middleware changes
git checkout HEAD~1 functions/admin/_middleware.ts
```

---

## Task 7: Test CSRF Protection (CRITICAL)

**Severity:** CRITICAL
**Risk:** Insufficient testing may leave vulnerabilities unpatched
**Estimated Time:** 2 hours
**Actual Time:** [Fill in when complete]
**Status:** ⏳ Pending
**Version (Web):** 1.4.7, **Version (API):** 1.4.5
**Dependencies:** Task 6

### Description

Comprehensive testing of CSRF protection including attack simulations, edge cases, and integration testing across all endpoints.

### Testing Scenarios

#### Scenario 1: Basic CSRF Protection

**Test:**
```bash
# Login to get tokens
LOGIN_RESPONSE=$(curl -X POST http://localhost:8788/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')
CSRF=$(echo $LOGIN_RESPONSE | jq -r '.data.csrfToken')

# Test 1: POST without CSRF token (should fail)
curl -X POST http://localhost:8788/admin/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"hacker","role":"admin","password":"backdoor123"}'
# Expected: 403 Forbidden

# Test 2: POST with invalid CSRF token (should fail)
curl -X POST http://localhost:8788/admin/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-CSRF-Token: invalid-token-12345" \
  -H "Content-Type: application/json" \
  -d '{"username":"hacker","role":"admin","password":"backdoor123"}'
# Expected: 403 Forbidden

# Test 3: POST with valid CSRF token (should succeed)
curl -X POST http://localhost:8788/admin/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-CSRF-Token: $CSRF" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","role":"user","password":"test123"}'
# Expected: 200 OK

# Test 4: GET without CSRF token (should succeed - safe method)
curl -X GET http://localhost:8788/admin/users \
  -H "Authorization: Bearer $TOKEN"
# Expected: 200 OK
```

#### Scenario 2: CSRF Attack Simulation

**Test:**
Create HTML attack page and verify it's blocked:

```html
<!-- /tmp/csrf-attack.html -->
<!DOCTYPE html>
<html>
<head><title>CSRF Attack Simulation</title></head>
<body>
<h1>CSRF Attack Test</h1>
<button id="attack">Launch Attack</button>
<pre id="result"></pre>

<script>
document.getElementById('attack').addEventListener('click', async () => {
  try {
    // Simulate stolen JWT token (attacker obtained somehow)
    const stolenToken = prompt('Enter stolen JWT token:')

    // Attacker CANNOT read CSRF token (same-origin policy)
    // So this request will fail
    const response = await fetch('http://localhost:8788/admin/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stolenToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'csrf-hacker',
        role: 'admin',
        password: 'backdoor123'
      })
    })

    const data = await response.json()
    document.getElementById('result').textContent = JSON.stringify(data, null, 2)
  } catch (error) {
    document.getElementById('result').textContent = `Error: ${error.message}`
  }
})
</script>
</body>
</html>
```

**Run test:**
```bash
# Open attack page in browser
open /tmp/csrf-attack.html

# Enter valid JWT token when prompted
# Click "Launch Attack"
# Expected: 403 Forbidden - CSRF token required
```

#### Scenario 3: Edge Cases

**Test edge cases:**
```bash
# Edge Case 1: Expired session
# Login → Wait for session expiry → Try POST with old CSRF token
# Expected: 403 - Session expired

# Edge Case 2: Multiple tabs
# Login in Tab 1 → Login in Tab 2 (new CSRF) → Try POST from Tab 1 (old CSRF)
# Expected: 403 - CSRF token mismatch

# Edge Case 3: Token reuse
# POST request with CSRF token → Repeat same request
# Expected: 200 OK (CSRF tokens are reusable within session)

# Edge Case 4: Guest user
# Guest login → Try admin endpoint with valid CSRF
# Expected: 403 - Admin access required (role check before CSRF)
```

#### Scenario 4: All Protected Endpoints

**Test all endpoints requiring CSRF:**
- [ ] POST /admin/users (create user)
- [ ] PUT /admin/users/:id (update user)
- [ ] DELETE /admin/users/:id (delete user)
- [ ] POST /admin/projects (create project)
- [ ] PUT /admin/projects/:id (update project)
- [ ] DELETE /admin/projects/:id (delete project)
- [ ] PUT /admin/about (update about content)
- [ ] POST /admin/maintenance (toggle maintenance mode)

### Testing Checklist

**Positive Tests (Should Succeed):**
- [ ] Login returns CSRF token
- [ ] Guest login returns CSRF token
- [ ] POST with valid CSRF token succeeds
- [ ] PUT with valid CSRF token succeeds
- [ ] DELETE with valid CSRF token succeeds
- [ ] PATCH with valid CSRF token succeeds
- [ ] GET requests work without CSRF token
- [ ] OPTIONS requests work without CSRF token

**Negative Tests (Should Fail):**
- [ ] POST without CSRF token returns 403
- [ ] POST with invalid CSRF token returns 403
- [ ] POST with expired CSRF token returns 403
- [ ] POST with CSRF token from different session returns 403
- [ ] PUT without CSRF token returns 403
- [ ] DELETE without CSRF token returns 403
- [ ] PATCH without CSRF token returns 403

**Attack Simulations:**
- [ ] CSRF attack from external domain blocked
- [ ] Stolen JWT cannot be used without CSRF token
- [ ] Token replay attacks blocked (different session)

**Browser Testing:**
- [ ] Chrome: Login → Admin actions work
- [ ] Firefox: Login → Admin actions work
- [ ] Safari: Login → Admin actions work
- [ ] Mobile Chrome: Login → Admin actions work

### Success Criteria

- ✅ All positive tests pass
- ✅ All negative tests correctly return 403
- ✅ CSRF attack simulation blocked
- ✅ All protected endpoints require CSRF tokens
- ✅ Safe methods (GET) work without CSRF tokens
- ✅ Cross-browser compatibility verified
- ✅ No false positives (legitimate requests blocked)
- ✅ No false negatives (attacks succeed)
- ✅ Web version 1.4.7, API version 1.4.5 in package.json

### Rollback Plan

If testing reveals issues:
1. Document failing test cases
2. Revert to previous milestone version
3. Fix issues in separate branch
4. Re-test before merging

---

## Task 8: Optional Origin/Referer Validation (HIGH)

**Severity:** HIGH (defense-in-depth)
**Risk:** Additional layer of protection, not critical
**Estimated Time:** 1 hour
**Actual Time:** [Fill in when complete]
**Status:** ⏳ Pending
**Version (API):** 1.4.6
**Dependencies:** Task 7

### Description

Add Origin and Referer header validation as an additional defense-in-depth layer. This is optional but recommended for extra security.

### Affected Files

**plixo-api:**
- `/functions/_middleware.ts` or `/src/lib/middleware/csrf.ts`

### Implementation Steps

1. **Add Origin/Referer validation**:

```typescript
// plixo-api/src/lib/middleware/csrf.ts
// Add this function

const ALLOWED_ORIGINS = [
  'https://plixo.com',
  'https://www.plixo.com',
  'http://localhost:5173',  // Dev environment
  'http://localhost:8788'   // Dev API
]

/**
 * Validate request origin for state-changing operations
 * Defense-in-depth: Origin/Referer check in addition to CSRF tokens
 */
export function validateOrigin(request: Request): boolean {
  // Skip for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return true
  }

  const origin = request.headers.get('Origin')
  const referer = request.headers.get('Referer')

  // Check Origin header (preferred)
  if (origin) {
    const isAllowed = ALLOWED_ORIGINS.includes(origin)
    if (!isAllowed) {
      console.warn(`Blocked request from unauthorized origin: ${origin}`)
    }
    return isAllowed
  }

  // Fallback to Referer header
  if (referer) {
    const isAllowed = ALLOWED_ORIGINS.some(allowed => referer.startsWith(allowed))
    if (!isAllowed) {
      console.warn(`Blocked request from unauthorized referer: ${referer}`)
    }
    return isAllowed
  }

  // No origin or referer (possibly stripped by proxy)
  // Log warning but allow request (CSRF token is primary defense)
  console.warn('Request missing Origin and Referer headers')
  return true  // Don't block - CSRF token is primary defense
}

// Update csrfMiddleware to include origin validation
export const csrfMiddleware: PagesFunction<Env> = async (context) => {
  // ... existing code ...

  // **NEW: Origin validation (defense-in-depth)**
  if (!validateOrigin(context.request)) {
    return Response.json(
      {
        success: false,
        error: 'Invalid request origin',
        message: 'Request must originate from plixo.com'
      },
      { status: 403 }
    )
  }

  // ... existing CSRF validation ...
}
```

### Testing Checklist

**Positive Tests:**
- [ ] Request from plixo.com succeeds
- [ ] Request from www.plixo.com succeeds
- [ ] Request from localhost (dev) succeeds
- [ ] Request without Origin/Referer succeeds (fallback)

**Negative Tests:**
- [ ] Request from evil.com blocked
- [ ] Request with spoofed Origin blocked
- [ ] Request with invalid Referer blocked

**Manual Testing:**
```bash
# Test with valid origin
curl -X POST http://localhost:8788/admin/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-CSRF-Token: $CSRF" \
  -H "Origin: http://localhost:5173" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","role":"user","password":"test123"}'
# Expected: 200 OK

# Test with invalid origin
curl -X POST http://localhost:8788/admin/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-CSRF-Token: $CSRF" \
  -H "Origin: https://evil.com" \
  -H "Content-Type: application/json" \
  -d '{"username":"hacker","role":"admin","password":"backdoor"}'
# Expected: 403 Forbidden
```

### Success Criteria

- ✅ Origin validation implemented
- ✅ Allowed origins include production and dev URLs
- ✅ Requests from unauthorized origins blocked
- ✅ Requests without Origin/Referer allowed (fallback to CSRF only)
- ✅ TypeScript compilation passes
- ✅ API version updated to 1.4.6 in package.json

### Rollback Plan

```bash
# Revert origin validation changes
git checkout HEAD~1 src/lib/middleware/csrf.ts
```

---

## Testing Strategy

### Test Environments

**Development:**
- Local: `http://localhost:5173` (web), `http://localhost:8788` (API)
- Branches: `don-040226-milestone-M0-web`, `don-040226-milestone-M0-api`

**Staging (Cloudflare Pages Preview):**
- Auto-generated preview URLs from feature branches
- Test before merging to main

**Production:**
- URL: https://plixo.com
- API: https://api.plixo.com
- **DO NOT DEPLOY until all tests pass**

### Critical Test Scenarios

1. **Happy Path**: Login → Admin action → Success
2. **No CSRF Token**: Login → Admin action without CSRF → 403
3. **Invalid CSRF Token**: Login → Admin action with fake CSRF → 403
4. **Expired Session**: Login → Wait → Admin action → 403
5. **CSRF Attack**: External site → Stolen JWT → Admin action → 403
6. **Safe Methods**: GET requests work without CSRF
7. **Guest User**: Guest login → Limited access with CSRF protection

---

## Deployment Plan

### Pre-Deployment Checklist

**Critical Security Checks:**
- [ ] ⚠️ **ALL TESTS PASSING** - No compromises
- [ ] CSRF tokens generated on login
- [ ] CSRF tokens stored in database
- [ ] CSRF tokens sent by frontend
- [ ] CSRF tokens validated by backend
- [ ] CSRF attack simulation blocked
- [ ] No false positives (legitimate requests work)
- [ ] All admin endpoints protected

**Code Quality:**
- [ ] TypeScript compilation successful (both repos)
- [ ] No console errors in development
- [ ] Build successful (`npm run build`)

**Database:**
- [ ] Migration applied to local D1
- [ ] Migration tested and verified
- [ ] Rollback migration prepared

**Documentation:**
- [ ] SECURITY_AUDIT.md updated (M0 marked complete)
- [ ] ARCHITECTURE.md security section updated
- [ ] This milestone marked complete

### Deployment Steps

**⚠️ CRITICAL: Deploy API before Web**

**Step 1: Deploy API (1.4.6)**

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-api
git checkout main
git pull origin main
git merge don-040226-milestone-M0-api
git push origin main

# Apply migration to production D1
wrangler d1 migrations apply plixo-api-db --remote

# Tag release
git tag -a v1.4.6 -m "M0: CSRF Protection Implementation"
git push origin v1.4.6

# Verify deployment
curl https://api.plixo.com/health
```

**Step 2: Deploy Web (1.4.7)**

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-web
git checkout main
git pull origin main
git merge don-040226-milestone-M0-web
git push origin main

# Tag release
git tag -a v1.4.7 -m "M0: CSRF Protection Frontend"
git push origin v1.4.7

# Cloudflare Pages deploys automatically
# Verify deployment
open https://plixo.com
```

**Step 3: Production Verification**

- [ ] Login works
- [ ] CSRF token generated
- [ ] Admin actions work
- [ ] No console errors
- [ ] Monitor logs for 1 hour

---

## Success Metrics

### Quantitative Metrics

**Security:**
- CSRF vulnerability: ❌ → ✅ FIXED
- Protected endpoints: 8 admin endpoints
- Attack simulations blocked: 100%

**Code Quality:**
- TypeScript errors: 0 (maintained)
- Build time: < 5 seconds (maintained)

**Performance:**
- API response time: +5ms overhead (acceptable)
- Additional header: 36 bytes per request (negligible)

### Qualitative Metrics

- ✅ CSRF attacks blocked
- ✅ Legitimate requests unaffected
- ✅ User experience unchanged
- ✅ Production deployment safe

### Acceptance Criteria

- ✅ All 8 tasks complete
- ✅ All tests passing
- ✅ CSRF protection verified
- ✅ Production deployment successful
- ✅ SECURITY_AUDIT.md M0 marked complete
- ✅ No critical bugs discovered in first 24 hours

---

## Rollback Plan

### When to Rollback

Rollback if:
- CSRF validation blocks legitimate users
- Database migration fails
- Critical bug discovered
- Performance severely impacted

### Rollback Procedure

**Step 1: Revert Web**

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-web
git checkout main
git revert [merge-commit-hash] --mainline 1
git push origin main
```

**Step 2: Revert API**

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-api
git checkout main
git revert [merge-commit-hash] --mainline 1
git push origin main
```

**Step 3: Rollback Database** (if needed)

```bash
# Manually remove csrf_token_hash column
wrangler d1 execute plixo-api-db --remote --command="ALTER TABLE sessions DROP COLUMN csrf_token_hash;"
```

**Step 4: Verify Rollback**

- [ ] Application functional
- [ ] Users can log in
- [ ] Admin actions work (without CSRF protection)

---

## Security Considerations

**This milestone addresses:**
- 🔴 CRITICAL: CSRF vulnerability (SECURITY_AUDIT.md M0)

**After this milestone:**
- ✅ CSRF protection implemented
- ⚠️ Still need: Security headers (M1), Token blacklist (M2), etc.

**Production Readiness:**
- **Before M0:** ❌ NOT SAFE for production
- **After M0:** ⚠️ SAFER but still requires M1-M6 milestones

---

## Related Documentation

- [SECURITY_AUDIT.md - Milestone M0](../docs/SECURITY_AUDIT.md#milestone-0-critical-csrf-fix)
- [ARCHITECTURE.md - Security Architecture](../ARCHITECTURE.md#security-architecture)
- [MilestoneTemplate.md](MilestoneTemplate.md)

---

**End of Milestone 12.1 (M0) Specification**
