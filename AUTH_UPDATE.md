# Authentication Security Update

**Date**: 2025-12-02
**Status**: Planning
**Priority**: CRITICAL - Security Issue

---

## Problem Statement

### Current Security Vulnerabilities

1. **Client-Side Role Trust**: The frontend currently trusts the `user.role` value stored in React Context/localStorage, which can be manipulated via browser console

2. **No Server-Side Verification on Protected Routes**: Admin routes only check the client-side role, not verifying with the server that the token actually belongs to an admin

3. **JWT Token Contains Role**: While JWTs are signed and can't be forged, the frontend reads the role from the decoded JWT payload without server verification

4. **Session State Management**: The AuthContext stores user data from `/auth/me` call at app initialization, but this data is cached and never re-verified for protected operations

### Attack Vector

```javascript
// In browser console, a user could theoretically:
localStorage.setItem('auth_token', 'valid_user_token')
// Then modify the React state to show admin role
// Console page would render admin UI based on client-side check
```

### Why This Fails Currently

Good news: The API properly rejects unauthorized requests via middleware. However, the Console page shows "Authentication Required" even for valid admin users because:

1. Frontend calls `/auth/me` on app load
2. Gets user data with role='admin'
3. Stores in AuthContext
4. Console page checks `currentUser?.role === 'admin'`
5. **BUG**: The check is failing despite having valid admin credentials

**Root Cause**: There's likely a timing issue or the token isn't being sent properly in the `/auth/me` request.

---

## Security Requirements

### Non-Negotiable Rules

1. **Never trust client-side role checks for authorization**
2. **All protected operations MUST verify permissions on the server**
3. **Frontend should only use role for UI rendering decisions**
4. **Server must validate JWT signature AND check database for active session**
5. **Admin operations must verify admin role from database, not JWT payload**

---

## Proposed Solution Architecture

### Phase 1: API Security Hardening

#### 1.1 Enhanced `/auth/me` Endpoint

**Current**: Returns user info from JWT payload + database lookup
**Problem**: Only verifies session exists, doesn't re-check role from database

**New Implementation**:
```typescript
// functions/auth/me.ts
export const onRequestGet: PagesFunction<Env> = async (context) => {
  // Verify JWT signature
  const token = extractToken(context.request)
  const payload = await verifyToken(token, context.env.JWT_SECRET)

  // Hash token and check session exists in database
  const tokenHash = await hashToken(token)
  const session = await sessionRepo.findByTokenHash(tokenHash)
  if (!session || session.expires_at < new Date()) {
    return Response.json({ success: false, error: 'Invalid session' }, { status: 401 })
  }

  // Get CURRENT user data from database (not JWT payload)
  const user = await userRepo.findById(session.user_id)
  if (!user || !user.is_active) {
    return Response.json({ success: false, error: 'User inactive' }, { status: 401 })
  }

  // Return fresh data from database
  return Response.json({
    success: true,
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role  // Fresh from DB, not from JWT
    }
  })
}
```

**Why This Matters**: If an admin is demoted to 'user', their old JWT still says 'admin', but database says 'user'. We must trust the database.

#### 1.2 New `/auth/verify-role` Endpoint

**Purpose**: Allow frontend to explicitly verify role before rendering sensitive UI

**Endpoint**: `GET /auth/verify-role?required=admin`

**Implementation**:
```typescript
// functions/auth/verify-role.ts
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)
  const requiredRole = url.searchParams.get('required') // 'admin', 'user', etc.

  // Use existing requireAuth middleware
  const user = await requireAuth(context)
  if (!user) {
    return Response.json({
      success: false,
      hasRole: false,
      error: 'Not authenticated'
    }, { status: 401 })
  }

  // Check if user has required role
  const hasRole = user.role === requiredRole

  return Response.json({
    success: true,
    hasRole,
    currentRole: user.role
  })
}
```

**Usage**: Console page calls this before rendering admin UI

#### 1.3 Strengthen Admin Middleware

**File**: `functions/admin/_middleware.ts`

**Current**: Already good - verifies token and checks role='admin'

**Enhancement**: Add rate limiting and logging

```typescript
export const onRequest: PagesFunction<Env> = async (context) => {
  const user = await requireAuth(context)

  if (!user) {
    // Log unauthorized access attempt
    console.warn('Unauthorized admin access attempt', {
      ip: context.request.headers.get('CF-Connecting-IP'),
      path: new URL(context.request.url).pathname
    })
    return Response.json({ success: false, error: 'Authentication required' }, { status: 401 })
  }

  if (!requireRole(user, 'admin')) {
    // Log privilege escalation attempt
    console.warn('Non-admin tried to access admin route', {
      userId: user.id,
      userRole: user.role,
      path: new URL(context.request.url).pathname
    })
    return Response.json({ success: false, error: 'Admin access required' }, { status: 403 })
  }

  context.data.user = user
  return context.next()
}
```

---

### Phase 2: Frontend Security Updates

#### 2.1 Remove Client-Side Role Checks for Authorization

**Current Problem**:
```typescript
// Console.tsx - Line 232
const isAdmin = currentUser?.role === 'admin'

if (!isAdmin) {
  return <div>Authentication Required</div>
}
```

**This is WRONG** because:
- `currentUser.role` comes from client-side state
- Can be manipulated in browser console
- Doesn't verify current server-side permissions

**New Approach**:
```typescript
// Console.tsx
const [serverVerified, setServerVerified] = useState<{
  isAdmin: boolean
  verified: boolean
} | null>(null)

useEffect(() => {
  const verifyAdminAccess = async () => {
    try {
      const response = await apiClient.get('/auth/verify-role?required=admin')
      setServerVerified({
        isAdmin: response.data.hasRole,
        verified: true
      })
    } catch (error) {
      setServerVerified({
        isAdmin: false,
        verified: true
      })
    }
  }

  if (!authLoading) {
    verifyAdminAccess()
  }
}, [authLoading])

// Loading state
if (authLoading || !serverVerified?.verified) {
  return <LoadingSpinner />
}

// Authorization check based on SERVER verification
if (!serverVerified.isAdmin) {
  return <div>Access Denied - Admin privileges required</div>
}
```

#### 2.2 Update AuthContext

**File**: `src/contexts/AuthContext.tsx`

**Changes**:
1. Remove client-side `hasRole` and `hasAnyRole` functions (these are dangerous)
2. Add `verifyRole` function that calls the API
3. Make `/auth/me` call on every navigation to protected routes (or use polling)

```typescript
export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  guestLogin: (captchaToken: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>  // NEW: Force refresh user data
  verifyRole: (role: 'guest' | 'user' | 'admin') => Promise<boolean>  // NEW: Server-side verification
}

// Implementation
const verifyRole = async (role: 'guest' | 'user' | 'admin'): Promise<boolean> => {
  try {
    const response = await authService.verifyRole(role)
    return response.hasRole
  } catch (error) {
    return false
  }
}

const refreshUser = async () => {
  try {
    const userData = await authService.getCurrentUser()
    setUser(userData)
  } catch (error) {
    console.error('Failed to refresh user:', error)
    authService.removeToken()
    setUser(null)
  }
}
```

#### 2.3 New Auth Service Method

**File**: `src/services/auth.ts`

```typescript
/**
 * Verify user has specific role (server-side check)
 */
async verifyRole(role: 'guest' | 'user' | 'admin'): Promise<{ hasRole: boolean }> {
  try {
    const { data } = await apiClient.get(`/auth/verify-role?required=${role}`)
    return data
  } catch (error) {
    return { hasRole: false }
  }
}
```

#### 2.4 Protected Route Component

**File**: `src/components/ProtectedRoute.tsx` (NEW)

```typescript
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { LoadingSpinner } from './atoms'

interface ProtectedRouteProps {
  requiredRole: 'admin' | 'user'
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const ProtectedRoute = ({
  requiredRole,
  children,
  fallback
}: ProtectedRouteProps) => {
  const { isLoading, verifyRole } = useAuth()
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAccess = async () => {
      if (!isLoading) {
        const verified = await verifyRole(requiredRole)
        setHasAccess(verified)
      }
    }
    checkAccess()
  }, [isLoading, requiredRole, verifyRole])

  if (isLoading || hasAccess === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
        <p className="ml-4">Verifying permissions...</p>
      </div>
    )
  }

  if (!hasAccess) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You don't have permission to view this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
```

**Usage**:
```typescript
// App.tsx
import { ProtectedRoute } from './components/ProtectedRoute'

<Route path="/console" element={
  <ProtectedRoute requiredRole="admin">
    <Console />
  </ProtectedRoute>
} />
```

---

### Phase 3: UI/UX Considerations

#### 3.1 Progressive Enhancement

The client-side `user.role` is still useful for:
- ✅ Showing/hiding navigation items (UX optimization)
- ✅ Pre-rendering loading states
- ✅ Optimistic UI updates

It should NOT be used for:
- ❌ Authorizing access to routes
- ❌ Deciding whether to make API calls
- ❌ Validating permissions

#### 3.2 Navigation Updates

**File**: `src/components/molecules/Navigation.tsx`

```typescript
// It's OK to use client-side role for nav items (just UX)
// The routes themselves will verify on the server

{user?.role === 'admin' && (
  <Link to="/console">Console</Link>  // Shows link optimistically
)}
```

**Reasoning**: If a non-admin edits localStorage to show this link, clicking it will still be denied by the ProtectedRoute component (which calls the API).

---

## Implementation Plan

### API Changes (Do First)

**Priority**: CRITICAL
**Estimated Time**: 2-3 hours

1. ✅ **Verify `/auth/me` is working** - Test locally
2. ⚠️ **Add logging to `/auth/me`** - Debug why it might be failing
3. 🆕 **Create `/auth/verify-role` endpoint** - New file
4. 🔒 **Enhance admin middleware** - Add logging
5. 🧪 **Test all auth endpoints** - Manual testing

**Files to Create/Modify**:
- `functions/auth/verify-role.ts` (NEW)
- `functions/auth/me.ts` (MODIFY - add better error handling)
- `functions/admin/_middleware.ts` (MODIFY - add logging)

### Frontend Changes (Do Second)

**Priority**: HIGH
**Estimated Time**: 3-4 hours

1. 🆕 **Create ProtectedRoute component**
2. 🔄 **Update AuthContext** - Add verifyRole method
3. 🔄 **Update auth.ts service** - Add verifyRole API call
4. 🔄 **Update Console.tsx** - Use ProtectedRoute or server verification
5. 🔄 **Update App.tsx** - Wrap admin routes
6. 🧪 **Test authorization flow** - Try to bypass as non-admin

**Files to Create/Modify**:
- `src/components/ProtectedRoute.tsx` (NEW)
- `src/contexts/AuthContext.tsx` (MODIFY)
- `src/services/auth.ts` (MODIFY)
- `src/pages/Console.tsx` (MODIFY)
- `src/App.tsx` (MODIFY - wrap routes)

---

## Testing Checklist

### API Tests

- [ ] `/auth/me` returns user with correct role from database
- [ ] `/auth/me` returns 401 for invalid token
- [ ] `/auth/me` returns 401 for expired session
- [ ] `/auth/verify-role?required=admin` returns true for admin user
- [ ] `/auth/verify-role?required=admin` returns false for regular user
- [ ] `/admin/users` returns 403 for non-admin token
- [ ] `/admin/users` returns 200 for admin token

### Frontend Tests

- [ ] Console page shows loading state while verifying
- [ ] Console page shows "Access Denied" for non-admin
- [ ] Console page renders for admin user
- [ ] Navigation shows Console link only for admin (UX)
- [ ] Editing localStorage doesn't grant access (security)
- [ ] Token expiration redirects to login
- [ ] Refreshing page maintains admin access

### Security Tests (Penetration Testing)

- [ ] Try to access `/console` with guest token → Blocked
- [ ] Try to access `/console` with user token → Blocked
- [ ] Try to access `/console` with no token → Blocked
- [ ] Try to modify `localStorage` role → Still blocked
- [ ] Try to call admin API directly → Blocked by middleware
- [ ] Try to use expired admin token → Blocked

---

## Rollout Strategy

### Phase 1: API Security (Deploy First)

1. Deploy `/auth/verify-role` endpoint
2. Update logging in middleware
3. Verify existing `/auth/me` endpoint
4. Test all endpoints locally
5. Deploy to production

**Risk**: Low - additive changes only
**Rollback**: Easy - new endpoint can be ignored

### Phase 2: Frontend Security (Deploy Second)

1. Create ProtectedRoute component
2. Update AuthContext with verifyRole
3. Wrap Console route in ProtectedRoute
4. Test locally with admin and non-admin users
5. Deploy to production

**Risk**: Medium - changes authorization flow
**Rollback**: Revert to previous commit if issues

---

## Debugging Current Issue

### Why Console Shows "Authentication Required"

**Hypothesis**: The `/auth/me` call is failing or returning unexpected data

**Debug Steps**:

1. **Check browser Network tab**:
   - Is `/auth/me` being called on page load?
   - What's the response status and body?
   - Is the `Authorization` header present?

2. **Check API logs**:
   - Is the request reaching the API?
   - What error is being thrown?
   - Is JWT_SECRET configured correctly?

3. **Check localStorage**:
   - Is `auth_token` present after login?
   - Is it being sent in axios interceptor?

4. **Test directly**:
```bash
# Get token from localStorage
TOKEN="your_token_here"

# Call /auth/me
curl http://localhost:8788/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "id": "admin-user-001",
    "username": "admin",
    "email": "admin@plixo.com",
    "role": "admin"
  }
}
```

**Likely Issues**:
1. JWT_SECRET not configured in wrangler dev
2. Token not being sent (axios interceptor issue)
3. CORS blocking the request
4. Session not found in database

---

## Environment Configuration

### Required Environment Variables

**API (wrangler.toml or .dev.vars)**:
```toml
# .dev.vars (for local development)
JWT_SECRET = "your-secret-key-min-32-chars"
TURNSTILE_SECRET_KEY = "your-turnstile-secret"
```

**Frontend (.env.development)**:
```bash
VITE_API_URL=http://localhost:8788
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

---

## Success Criteria

### Security Goals

1. ✅ **No client-side authorization decisions** - All checks happen on server
2. ✅ **Server verifies every admin request** - Middleware validates token + role + active session
3. ✅ **Role changes take effect immediately** - Database is source of truth, not JWT payload
4. ✅ **Tokens can be revoked** - Deleting session invalidates JWT
5. ✅ **Audit trail** - All admin actions logged with user context

### User Experience Goals

1. ✅ **Fast initial load** - Client-side checks for optimistic UI
2. ✅ **Clear error messages** - "Access Denied" vs "Not Logged In"
3. ✅ **Graceful degradation** - If API is down, show appropriate error
4. ✅ **No flickering UI** - Loading states prevent flash of wrong content

---

## Long-Term Improvements

### Potential Enhancements

1. **Refresh token flow** - Auto-refresh expiring tokens
2. **Role-based routing** - Dynamic route generation based on permissions
3. **Permission system** - Move beyond roles to granular permissions
4. **Multi-factor authentication** - Add 2FA for admin accounts
5. **Session management UI** - Allow users to view/revoke active sessions
6. **API key authentication** - For programmatic access
7. **WebSocket authentication** - For real-time features

---

## Appendix: Security Best Practices

### JWT Security

- ✅ Sign JWTs with strong secret (min 256 bits)
- ✅ Set reasonable expiration (24h for users, 2h for guests)
- ✅ Store tokens in httpOnly cookies (future: currently using localStorage)
- ✅ Validate signature on every request
- ✅ Check session exists in database (don't trust JWT alone)

### Session Security

- ✅ Hash tokens before storing in database
- ✅ Set expiration timestamps
- ✅ Delete on logout
- ✅ Cascade delete when user is deleted
- ✅ Periodic cleanup of expired sessions

### RBAC Security

- ✅ Middleware enforces role requirements
- ✅ Database is source of truth for roles
- ✅ Role changes invalidate old decisions
- ✅ Audit log records who did what

---

## Questions for Review

1. **Should we use httpOnly cookies instead of localStorage?**
   - Pro: More secure (XSS-proof)
   - Con: Requires cookie handling in API

2. **Should we add permission-based auth (beyond roles)?**
   - Pro: More granular control
   - Con: More complex to implement

3. **Should we add rate limiting on `/auth/verify-role`?**
   - Pro: Prevents abuse
   - Con: Could slow down legitimate usage

4. **Should we cache role verification results?**
   - Pro: Reduces API calls
   - Con: Stale permissions if role changes

---

**Next Steps**: Review this plan, provide feedback, then we'll start implementing Phase 1 (API changes).
