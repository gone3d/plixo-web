# Security Audit Report - Plixo Portfolio System
## Plixo-Web (Frontend) & Plixo-API (Backend)

**Audit Date:** 2026-04-02
**Auditor:** Claude Code Security Review
**Scope:** Full-stack portfolio application (React frontend + Cloudflare Pages Functions backend)
**Severity Levels:** 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low | ℹ️ Info

---

## Executive Summary

The Plixo portfolio system demonstrates **solid security fundamentals** with proper authentication, authorization, and input validation patterns. However, several areas require attention to meet production-grade security standards. This audit identifies **18 findings** across both codebases, with **1 critical CSRF vulnerability** and **2 high-priority** items requiring immediate attention.

### Risk Summary

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 Critical | 1 | **MUST FIX IMMEDIATELY** |
| 🟠 High | 2 | Needs immediate attention |
| 🟡 Medium | 7 | Should address before production |
| 🟢 Low | 5 | Best practice improvements |
| ℹ️ Info | 3 | Documentation/monitoring |

### Key Strengths ✅

1. **Strong Authentication**: JWT-based auth with proper token handling
2. **Password Security**: bcryptjs with appropriate salt rounds (10)
3. **Rate Limiting**: Guest login rate limiting implemented
4. **CAPTCHA Protection**: Cloudflare Turnstile integration
5. **Parameterized Queries**: SQL injection protection via D1 prepared statements
6. **IP Hashing**: Privacy-compliant IP address storage
7. **Session Management**: Proper token expiration and refresh mechanisms
8. **RBAC Implementation**: Role-based access control with middleware

---

## Findings by Category

## 1. Authentication & Authorization

### 🟠 HIGH: JWT Secret Management
**Location:** `plixo-api/wrangler.toml`, environment configuration
**Issue:** JWT secret must be stored as environment variable, not in code or config files
**Current State:** References `context.env.JWT_SECRET` (correct pattern)
**Risk:** If JWT secret is weak, hardcoded, or leaked, entire authentication system is compromised

**Remediation:**
```bash
# Set strong JWT secret (256+ bits)
openssl rand -base64 64

# Add to Cloudflare Pages Environment Variables
# Dashboard > Workers & Pages > plixo-api > Settings > Environment Variables
JWT_SECRET=<generated-secret>

# Verify in .dev.vars for local development (gitignored)
JWT_SECRET="<same-secret-for-local>"
```

**Milestone:** M1 - Critical Security Configuration

---

### 🟠 HIGH: No Token Blacklist/Revocation Strategy
**Location:** `plixo-api/src/lib/services/auth.service.ts`, `plixo-web/src/services/auth.ts`
**Issue:** Logout only clears client-side token; server has no revocation mechanism
**Impact:** Stolen/leaked tokens remain valid until expiration (24h)

**Current Logout Implementation:**
```typescript
// plixo-web/src/services/auth.ts:91-98
async logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout')
  } catch (error) {
    console.error('Logout request failed:', error)
  } finally {
    this.removeToken()  // Only clears client memory
  }
}
```

**Remediation:**
1. Implement token blacklist table in D1:
```sql
CREATE TABLE token_blacklist (
  id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL,
  blacklisted_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  reason TEXT
);
CREATE INDEX idx_token_blacklist_hash ON token_blacklist(token_hash);
CREATE INDEX idx_token_blacklist_expires ON token_blacklist(expires_at);
```

2. Add middleware to check blacklist on each authenticated request
3. Implement cleanup cron to remove expired blacklist entries

**Milestone:** M2 - Token Security Enhancements

---

### 🟡 MEDIUM: Token Stored Only in Memory (No Persistence)
**Location:** `plixo-web/src/services/tokenStorage.ts`
**Issue:** Memory-only storage requires re-login on every page refresh
**Impact:** Poor UX; users must re-authenticate frequently

**Current Implementation:**
```typescript
class TokenStorage {
  private token: string | null = null  // Lost on refresh

  setToken(token: string): void {
    this.token = token
  }
}
```

**Remediation:**
1. Implement secure httpOnly cookie storage (preferred for production)
2. Alternative: Encrypted sessionStorage with short TTL
3. Never use localStorage for tokens (XSS vulnerability)

**Options:**
```typescript
// Option 1: httpOnly Cookie (Server-side required)
// Set-Cookie: auth_token=<jwt>; HttpOnly; Secure; SameSite=Strict

// Option 2: Encrypted sessionStorage (Client-side fallback)
import { encrypt, decrypt } from './crypto-utils'
sessionStorage.setItem('_t', encrypt(token, deviceKey))
```

**Milestone:** M3 - User Experience & Session Management

---

### 🟡 MEDIUM: No Token Refresh Before Expiration
**Location:** `plixo-web/src/services/auth.ts:125-141`
**Issue:** Token refresh exists but not automatically called before expiration
**Impact:** Users experience sudden logouts at 24h mark

**Remediation:**
```typescript
// Add automatic token refresh 5 minutes before expiration
useEffect(() => {
  const checkTokenExpiration = async () => {
    const token = authService.getToken()
    if (!token) return

    const payload = parseJWT(token)
    const expiresIn = payload.exp * 1000 - Date.now()

    // Refresh if expiring in < 5 minutes
    if (expiresIn < 5 * 60 * 1000 && expiresIn > 0) {
      await authService.refreshToken()
    }
  }

  const interval = setInterval(checkTokenExpiration, 60000) // Check every minute
  return () => clearInterval(interval)
}, [])
```

**Milestone:** M3 - User Experience & Session Management

---

### 🟡 MEDIUM: Missing Admin Session Timeout
**Location:** Admin console authentication
**Issue:** Admin sessions don't have stricter timeout policies
**Risk:** Elevated privilege escalation if admin leaves workstation unlocked

**Remediation:**
```typescript
// Implement 15-minute idle timeout for admin roles
const ADMIN_IDLE_TIMEOUT = 15 * 60 * 1000

if (user.role === 'admin') {
  let lastActivity = Date.now()

  document.addEventListener('mousemove', () => lastActivity = Date.now())
  document.addEventListener('keydown', () => lastActivity = Date.now())

  setInterval(() => {
    if (Date.now() - lastActivity > ADMIN_IDLE_TIMEOUT) {
      authService.logout()
      navigate('/login?reason=timeout')
    }
  }, 60000)
}
```

**Milestone:** M2 - Token Security Enhancements

---

## 2. Input Validation & Injection Prevention

### ℹ️ INFO: SQL Injection Protection ✅ GOOD
**Location:** All `plixo-api/src/lib/repositories/*.repository.ts`
**Status:** **Properly implemented** via D1 prepared statements

**Example (Secure):**
```typescript
// plixo-api/src/lib/repositories/user.repository.ts:28-32
async findByUsername(username: string): Promise<User | null> {
  const result = await this.db
    .prepare('SELECT * FROM users WHERE username = ?')  // Parameterized
    .bind(username)  // Safe binding
    .first();
  return result as User | null;
}
```

**Finding:** All database queries use parameterized statements. ✅ No SQL injection vulnerabilities found.

---

### 🟡 MEDIUM: Incomplete Input Validation on Frontend
**Location:** `plixo-web/src/pages/Console.tsx`, admin forms
**Issue:** Client-side validation relies heavily on HTML5 attributes without schema validation
**Risk:** Malformed data could reach backend if direct API calls bypass UI

**Remediation:**
```typescript
// Add Zod validation schemas matching backend
import { z } from 'zod'

const createUserSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  role: z.enum(['guest', 'user', 'admin'])
})

// Use in form validation
const handleSubmit = async (data: unknown) => {
  const validated = createUserSchema.parse(data)  // Throws on invalid
  await apiClient.post('/admin/users', validated)
}
```

**Milestone:** M4 - Input Validation & XSS Prevention

---

### 🟡 MEDIUM: XSS Risk in Dynamic Content Rendering
**Location:** `plixo-web/src/utils/MarkdownRenderer.tsx`, About page content
**Issue:** Markdown content from database rendered without explicit sanitization
**Current State:** Using `react-markdown` (generally safe, but needs verification)

**Verification Needed:**
```typescript
// Check if react-markdown config includes HTML sanitization
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeSanitize]}  // ⚠️ Is this configured?
  components={{
    // Ensure no dangerouslySetInnerHTML usage
  }}
>
  {content}
</ReactMarkdown>
```

**Remediation:**
```bash
npm install rehype-sanitize
```

```typescript
import rehypeSanitize from 'rehype-sanitize'

<ReactMarkdown
  rehypePlugins={[rehypeSanitize]}  // Add explicit sanitization
  skipHtml={true}  // Block raw HTML entirely
>
```

**Milestone:** M4 - Input Validation & XSS Prevention

---

## 3. CSRF (Cross-Site Request Forgery) Protection

### 🔴 CRITICAL: No CSRF Protection for State-Changing Operations
**Location:** `plixo-api/functions/_middleware.ts`, all POST/PUT/DELETE endpoints
**Issue:** JWT-in-Authorization-header approach provides **NO CSRF protection by default**
**Impact:** Malicious websites can make authenticated requests on behalf of logged-in users

#### Current Vulnerability

**Attack Scenario:**
```html
<!-- Attacker's website: evil.com -->
<script>
// If user is logged in to plixo.com, their JWT is in memory/storage
// Attacker can trick browser into making authenticated requests
fetch('https://api.plixo.com/admin/users', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + stolenOrLeakedToken,
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

**Why Current Implementation is Vulnerable:**

1. **JWT in Authorization header** - Can be read by JavaScript (unlike httpOnly cookies)
2. **No CSRF token validation** - Server doesn't verify request origin
3. **CORS allows credentials** - `Access-Control-Allow-Credentials: true` (line 24)
4. **Memory-only token storage** - Accessible via XSS if any vulnerability exists

**Current State Analysis:**
```typescript
// plixo-api/functions/_middleware.ts:24
"Access-Control-Allow-Credentials": "true",  // ⚠️ Allows cookies/auth headers

// plixo-web/src/services/tokenStorage.ts
class TokenStorage {
  private token: string | null = null  // ⚠️ Accessible via XSS
}
```

---

#### Remediation Strategy

**Option 1: Add CSRF Tokens (Recommended for JWT-based auth)**

**Step 1:** Generate CSRF token on login
```typescript
// plixo-api/functions/auth/login.ts
import { generateCSRFToken, hashToken } from '../../src/lib/utils/csrf'

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const result = await authService.login(username, password, requestData)

  // Generate CSRF token
  const csrfToken = crypto.randomUUID()
  const csrfTokenHash = await hashToken(csrfToken)

  // Store hash in session table
  await db.prepare(
    'UPDATE sessions SET csrf_token_hash = ? WHERE token_hash = ?'
  ).bind(csrfTokenHash, result.sessionId).run()

  return Response.json({
    success: true,
    data: {
      ...result,
      csrfToken  // Send to client
    }
  })
}
```

**Step 2:** Store CSRF token separately from JWT
```typescript
// plixo-web/src/services/tokenStorage.ts
class TokenStorage {
  private token: string | null = null
  private csrfToken: string | null = null  // Store separately

  setTokens(token: string, csrfToken: string): void {
    this.token = token
    this.csrfToken = csrfToken
  }

  getCSRFToken(): string | null {
    return this.csrfToken
  }
}
```

**Step 3:** Send CSRF token in custom header
```typescript
// plixo-web/src/services/api.ts
private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
  const headers = { ...this.defaultHeaders, ...customHeaders }

  const token = tokenStorage.getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  // Add CSRF token for state-changing operations
  const csrfToken = tokenStorage.getCSRFToken()
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken
  }

  return headers
}
```

**Step 4:** Validate CSRF token on server
```typescript
// plixo-api/src/lib/middleware/csrf.ts
export async function validateCSRF(
  context: any,
  userPayload: JWTPayload
): Promise<void> {
  // Skip for GET/HEAD/OPTIONS (safe methods)
  if (['GET', 'HEAD', 'OPTIONS'].includes(context.request.method)) {
    return
  }

  const csrfToken = context.request.headers.get('X-CSRF-Token')
  if (!csrfToken) {
    throw new Error('CSRF token required')
  }

  const csrfTokenHash = await hashToken(csrfToken)

  // Verify CSRF token matches session
  const session = await db.prepare(
    'SELECT csrf_token_hash FROM sessions WHERE user_id = ? AND expires_at > datetime("now")'
  ).bind(userPayload.sub).first()

  if (!session || session.csrf_token_hash !== csrfTokenHash) {
    throw new Error('Invalid CSRF token')
  }
}
```

**Step 5:** Apply CSRF validation middleware
```typescript
// plixo-api/functions/admin/_middleware.ts
import { validateCSRF } from '../../src/lib/middleware/csrf'

export const onRequest: PagesFunction<Env> = async (context) => {
  // Existing auth check...
  const user = context.data.user

  // Add CSRF validation for state-changing operations
  try {
    await validateCSRF(context, user)
  } catch (error) {
    return Response.json(
      { success: false, error: 'CSRF validation failed' },
      { status: 403 }
    )
  }

  return context.next()
}
```

---

**Option 2: Use SameSite Cookies (Alternative - requires architecture change)**

Switch from Authorization header to httpOnly cookies with SameSite=Strict:

```typescript
// Set cookie on login (server-side)
Set-Cookie: auth_token=<jwt>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400

// Benefits:
// - Browser automatically prevents CSRF (SameSite=Strict)
// - JavaScript cannot access token (HttpOnly)
// - HTTPS only (Secure)

// Trade-offs:
// - Requires CORS credentials: true (already set ✅)
// - More complex mobile app integration
// - Cookie domain management for subdomains
```

---

**Option 3: Origin/Referer Validation (Defense in depth, not primary)**

Add as additional layer:
```typescript
// plixo-api/functions/_middleware.ts
const ALLOWED_ORIGINS = [
  'https://plixo.com',
  'https://www.plixo.com'
]

// Validate Origin or Referer for state-changing operations
if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(context.request.method)) {
  const origin = context.request.headers.get('Origin')
  const referer = context.request.headers.get('Referer')

  const isValidOrigin = origin && ALLOWED_ORIGINS.includes(origin)
  const isValidReferer = referer && ALLOWED_ORIGINS.some(allowed => referer.startsWith(allowed))

  if (!isValidOrigin && !isValidReferer) {
    return Response.json(
      { success: false, error: 'Invalid origin' },
      { status: 403 }
    )
  }
}
```

**Note:** Origin/Referer can be stripped by proxies/browsers - **not reliable alone**

---

#### Recommended Implementation

**Use CSRF tokens (Option 1)** because:
1. ✅ Works with current JWT-in-header architecture
2. ✅ No breaking changes to frontend
3. ✅ Industry standard for token-based auth
4. ✅ Compatible with mobile apps (can implement token exchange)
5. ✅ Defense in depth (add Origin validation too)

**Migration Path:**
```
Phase 1: Implement CSRF tokens (backward compatible)
  - Generate CSRF on login, make optional
  - Add validation middleware (warn but don't block)
  - Update frontend to send CSRF token

Phase 2: Enforce CSRF tokens (breaking change)
  - Make CSRF token required for all state-changing operations
  - Return 403 if missing/invalid

Phase 3: Consider httpOnly cookies for long-term
  - Migrate to cookie-based auth (major version)
```

---

#### Database Migration for CSRF Support

```sql
-- plixo-api/src/db/migrations/00XX_add_csrf_tokens.sql
-- Add CSRF token support to sessions table

ALTER TABLE sessions ADD COLUMN csrf_token_hash TEXT;
CREATE INDEX idx_sessions_csrf ON sessions(csrf_token_hash);

-- Add CSRF validation to token blacklist
ALTER TABLE token_blacklist ADD COLUMN csrf_token_hash TEXT;
```

---

### Additional CSRF Considerations

**1. CSRF Token Rotation**
```typescript
// Rotate CSRF token on sensitive operations
if (isSensitiveOperation) {
  const newCSRFToken = crypto.randomUUID()
  await updateSessionCSRF(userId, newCSRFToken)
  response.headers.set('X-New-CSRF-Token', newCSRFToken)
}
```

**2. CSRF Token Expiration**
```typescript
// Expire CSRF tokens with session (24h)
// Shorter expiration for admin operations (15 min)
const csrfExpiry = user.role === 'admin' ? '15m' : '24h'
```

**3. Double-Submit Cookie Pattern (Alternative)**
```typescript
// Set CSRF token as both cookie and header requirement
Set-Cookie: XSRF-TOKEN=<csrf>; SameSite=Strict
// Client must send same value in X-XSRF-TOKEN header
```

---

**Milestone:** M0 - CRITICAL SECURITY FIX (Deploy ASAP)
**Effort:** 6-8 hours for full CSRF token implementation
**Priority:** 🔴 CRITICAL - Must be addressed before production

---

## 4. Security Headers & CORS

### 🟠 HIGH: Missing Security Headers
**Location:** `plixo-api/functions/_middleware.ts`
**Issue:** Critical security headers not configured
**Impact:** Vulnerable to clickjacking, MIME sniffing, and other attacks

**Current State:** No security headers middleware found

**Remediation:**
```typescript
// plixo-api/functions/_middleware.ts
export const onRequest: PagesFunction = async (context) => {
  const response = await context.next()

  // Clone response to add headers
  const newResponse = new Response(response.body, response)

  // Security headers
  newResponse.headers.set('X-Content-Type-Options', 'nosniff')
  newResponse.headers.set('X-Frame-Options', 'DENY')
  newResponse.headers.set('X-XSS-Protection', '1; mode=block')
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  newResponse.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')

  // HSTS (only if HTTPS enforced)
  newResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

  // CSP (adjust based on needs)
  newResponse.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.plixo.com"
  )

  return newResponse
}
```

**Milestone:** M1 - Critical Security Configuration

---

### 🟢 LOW: CORS Configuration Review Needed
**Location:** API CORS policy (Cloudflare Pages configuration)
**Issue:** CORS policy should be explicitly defined and restrictive
**Current State:** Needs verification

**Remediation:**
```typescript
// Verify in _middleware.ts
const ALLOWED_ORIGINS = [
  'https://plixo.com',
  'https://www.plixo.com',
  process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : null
].filter(Boolean)

if (context.request.method === 'OPTIONS') {
  const origin = context.request.headers.get('Origin')
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    })
  }
}
```

**Milestone:** M5 - Production Hardening

---

## 4. Rate Limiting & DoS Prevention

### ℹ️ INFO: Guest Login Rate Limiting ✅ GOOD
**Location:** `plixo-api/src/lib/utils/rateLimit.ts`
**Status:** **Well implemented** - 10 attempts per 24 hours per IP (hashed)

**Strengths:**
- IP address hashing for privacy compliance
- Configurable window (24h) and limit (10 attempts)
- Automatic cleanup of expired records
- Separate tracking for failed CAPTCHA attempts

---

### 🟡 MEDIUM: No Rate Limiting on Admin Login
**Location:** `plixo-api/functions/auth/login.ts`
**Issue:** Admin login endpoint lacks rate limiting
**Risk:** Brute force attacks on admin credentials

**Remediation:**
```typescript
// Add to auth/login.ts
import { checkLoginRateLimit, recordLoginAttempt } from '../../src/lib/utils/loginRateLimit'

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const ip = context.request.headers.get('CF-Connecting-IP') || 'unknown'

  // Check rate limit BEFORE authentication attempt
  await checkLoginRateLimit(context.env.DB, ip)  // Throws if exceeded

  try {
    const result = await authService.login(username, password, requestData)
    await resetLoginAttempts(context.env.DB, ip)  // Clear on success
    return Response.json({ success: true, data: result })
  } catch (error) {
    await recordLoginAttempt(context.env.DB, ip, false)  // Track failure
    throw error
  }
}
```

**Milestone:** M2 - Token Security Enhancements

---

### 🟡 MEDIUM: No API-Wide Rate Limiting
**Location:** Global API middleware
**Issue:** No general rate limiting for API endpoints
**Risk:** Resource exhaustion, DoS attacks

**Remediation:**
```typescript
// Implement Cloudflare Rate Limiting via Workers
// Or use D1-based rate limiting per IP/user
const RATE_LIMITS = {
  anonymous: { requests: 100, window: '15m' },
  authenticated: { requests: 1000, window: '15m' },
  admin: { requests: 5000, window: '15m' }
}

// Apply in _middleware.ts
```

**Alternative:** Use Cloudflare's built-in Rate Limiting rules (Dashboard > Security > WAF)

**Milestone:** M5 - Production Hardening

---

## 5. Data Privacy & Compliance

### ℹ️ INFO: IP Address Hashing ✅ GOOD
**Location:** `plixo-api/src/lib/utils/hash.ts:22-28`, rate limiting
**Status:** **Well implemented** - SHA-256 hashing for GDPR/CCPA compliance

---

### 🟢 LOW: Sensitive Data Logging
**Location:** Multiple `console.error()` calls throughout codebase
**Issue:** Error messages may log sensitive data (tokens, passwords, PII)
**Risk:** Exposure in Cloudflare Logs

**Examples:**
```typescript
// plixo-api/functions/auth/login.ts:59
console.error('Login error:', error)  // Could contain password

// plixo-web/src/services/auth.ts:189
console.error('Role verification failed:', error.response?.status, error.response?.data || error.message)
```

**Remediation:**
```typescript
// Sanitize error logging
const sanitizeError = (error: any) => {
  if (error.response?.data) {
    const { password, token, ...safe } = error.response.data
    return { ...error, response: { ...error.response, data: safe } }
  }
  return error
}

console.error('Login error:', sanitizeError(error))
```

**Milestone:** M6 - Compliance & Monitoring

---

### 🟢 LOW: No Privacy Policy/Cookie Consent
**Location:** Frontend application
**Issue:** No visible privacy policy or cookie consent mechanism
**Compliance:** Required for GDPR (EU visitors)

**Remediation:**
1. Add `/privacy` and `/terms` routes
2. Implement cookie consent banner if using analytics cookies
3. Document data collection practices (IP hashing, analytics)

**Milestone:** M6 - Compliance & Monitoring

---

## 6. Dependency Vulnerabilities

### 🟡 MEDIUM: Frontend Dependency Vulnerabilities
**Location:** `plixo-web/package.json`
**Status:** 11 vulnerabilities (2 moderate, 9 high)

**Findings from `npm audit`:**
```
axios - ✅ FIXED (removed in recent audit)
d3-color - 🔴 HIGH: ReDoS vulnerability (via react-simple-maps)
flatted - 🔴 HIGH: Unbounded recursion DoS
minimatch - 🔴 HIGH: ReDoS via wildcards
picomatch - 🔴 HIGH: ReDoS in extglobs
rollup - 🔴 HIGH: Path traversal (dev dependency)
brace-expansion - 🟡 MODERATE: Process hang
ajv - 🟡 MODERATE: ReDoS in $data option
```

**Remediation:**
```bash
cd plixo-web

# Safe fixes (non-breaking)
npm audit fix

# Review breaking changes
npm audit fix --force  # May update react-simple-maps to v1.0.0

# Manual updates for dev dependencies
npm update rollup minimatch
```

**Milestone:** M1 - Critical Security Configuration

---

### 🟢 LOW: Backend Dependencies Review
**Location:** `plixo-api/package.json`
**Status:** Minimal dependencies (good security posture)

**Dependencies:**
```json
{
  "bcryptjs": "^3.0.2",    // Password hashing - ✅ Secure
  "hono": "^4.10.4",       // Web framework - ✅ Up to date
  "jose": "^6.1.0",        // JWT - ✅ Modern, secure
  "zod": "^4.1.12"         // Validation - ✅ Latest
}
```

**Action:** Run `npm audit` to verify, but risk appears low.

**Milestone:** M5 - Production Hardening

---

## 7. Secrets Management

### 🟢 LOW: Environment Variable Handling
**Location:** Both repos
**Status:** Generally good, needs verification

**Good Practices Observed:**
- ✅ `.env` files in `.gitignore`
- ✅ `context.env.JWT_SECRET` pattern
- ✅ Turnstile secret from environment

**Verification Needed:**
```bash
# Check for accidentally committed secrets
cd plixo-api && git log --all --full-history --source --pickaxe-all -S'JWT_SECRET=' -- wrangler.toml .env
cd plixo-web && git log --all --full-history --source --pickaxe-all -S'VITE_API_URL' -- .env.local .env
```

**If secrets found in history:**
```bash
# Rotate ALL secrets immediately
# Remove from git history using git-filter-repo or BFG
```

**Milestone:** M1 - Critical Security Configuration

---

## 8. Session Security

### 🟡 MEDIUM: No Session Fingerprinting
**Location:** JWT token generation
**Issue:** Tokens don't include device/browser fingerprint
**Risk:** Stolen token can be used from any device

**Remediation:**
```typescript
// Add device fingerprint to JWT payload
interface JWTPayload {
  sub: string
  username: string
  role: string
  fingerprint: string  // Hash of User-Agent + IP subnet
}

// Generate fingerprint
const createFingerprint = (userAgent: string, ip: string) => {
  const ipSubnet = ip.split('.').slice(0, 3).join('.')  // /24 subnet
  return hashToken(`${userAgent}:${ipSubnet}`)
}

// Verify on each request
if (payload.fingerprint !== createFingerprint(userAgent, ip)) {
  throw new Error('Session hijack detected')
}
```

**Trade-off:** May cause issues with legitimate IP changes (mobile networks)

**Milestone:** M2 - Token Security Enhancements

---

### 🟢 LOW: Session Table Cleanup
**Location:** `plixo-api` session management
**Issue:** No automated cleanup of expired sessions
**Impact:** Database bloat over time

**Remediation:**
```typescript
// Add to scheduled/purge-old-audit-logs.ts
export const onRequest: PagesFunction<Env> = async (context) => {
  const db = context.env.DB

  // Purge sessions older than 30 days
  await db.prepare(
    'DELETE FROM sessions WHERE expires_at < datetime("now", "-30 days")'
  ).run()

  // Purge expired token blacklist entries
  await db.prepare(
    'DELETE FROM token_blacklist WHERE expires_at < datetime("now")'
  ).run()
}
```

**Milestone:** M5 - Production Hardening

---

## 9. Additional Security Concerns

### 🟢 LOW: No Subresource Integrity (SRI)
**Location:** `plixo-web/index.html` (if using external CDNs)
**Issue:** No SRI hashes for external scripts
**Risk:** CDN compromise could inject malicious code

**Remediation:**
```html
<!-- Add integrity hashes for any CDN resources -->
<script
  src="https://cdn.example.com/lib.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/ux..."
  crossorigin="anonymous"
></script>
```

**Note:** Vite bundles handle this automatically for local builds ✅

**Milestone:** M5 - Production Hardening

---

### 🟢 LOW: Error Messages Too Verbose
**Location:** Multiple error handlers
**Issue:** Error messages may reveal system details

**Example:**
```typescript
// plixo-api/functions/auth/login.ts:60-63
catch (error) {
  console.error('Login error:', error)
  return Response.json(
    { success: false, error: 'Invalid credentials' },  // ✅ Good - generic
    { status: 401 }
  )
}
```

**Current State:** Generally good - most errors return generic messages ✅

**Milestone:** M6 - Compliance & Monitoring

---

## 10. Monitoring & Incident Response

### ℹ️ INFO: Audit Logging ✅ GOOD
**Location:** `plixo-api/src/lib/repositories/login-audit.repository.ts`
**Status:** **Well implemented** - Comprehensive login audit trail

**Captures:**
- IP address, country, region, city
- User agent, HTTP protocol, TLS version
- Login success/failure with timestamps
- Automatic 30-day retention

---

### 🟢 LOW: No Security Monitoring/Alerting
**Location:** Production infrastructure
**Issue:** No alerting for suspicious patterns
**Examples:**
  - Multiple failed login attempts from same IP
  - Admin login from unusual location
  - Spike in 401/403 errors

**Remediation:**
```typescript
// Implement threshold alerts
- Failed login > 5 attempts in 1 hour → Notify
- Guest login rate limit hit → Log + Review
- Admin login from new country → 2FA challenge
```

**Integration Options:**
- Cloudflare Logs → Datadog/Splunk
- Custom webhook to Slack/PagerDuty
- Cloudflare Workers Analytics

**Milestone:** M6 - Compliance & Monitoring

---

## Remediation Roadmap

### ⚠️ MILESTONE 0: CRITICAL CSRF FIX (IMMEDIATE - DO NOT DEPLOY WITHOUT)
**Priority:** 🔴 **BLOCKING** - System is vulnerable to CSRF attacks

- [ ] **M0.1** - Implement CSRF token generation on login/guest-login
- [ ] **M0.2** - Add csrf_token_hash column to sessions table
- [ ] **M0.3** - Update frontend to store and send CSRF tokens
- [ ] **M0.4** - Implement CSRF validation middleware for POST/PUT/DELETE
- [ ] **M0.5** - Add CSRF validation to all admin endpoints
- [ ] **M0.6** - Test CSRF protection with attack simulation
- [ ] **M0.7** - (Optional) Add Origin/Referer validation as defense-in-depth

**Effort:** 6-8 hours
**Owner:** Senior Backend + Frontend Developer
**Success Criteria:**
  - All state-changing operations require valid CSRF token
  - CSRF attack attempts return 403 Forbidden
  - Unit tests confirm CSRF validation works
  - Penetration test confirms CSRF protection

**Testing:**
```bash
# Test CSRF protection
curl -X POST https://api.plixo.com/admin/users \
  -H "Authorization: Bearer <valid-token>" \
  -H "Content-Type: application/json" \
  # Missing X-CSRF-Token header should return 403
```

---

### Milestone 1: Critical Security Configuration (Week 1)
**Priority:** 🔴 CRITICAL - Deploy immediately

- [ ] **M1.1** - Verify JWT secret strength (256+ bits entropy)
- [ ] **M1.2** - Add security headers middleware (`_middleware.ts`)
- [ ] **M1.3** - Run `npm audit fix` on plixo-web
- [ ] **M1.4** - Verify no secrets in git history
- [ ] **M1.5** - Document environment variables in README

**Effort:** 4-6 hours
**Owner:** DevOps/Security
**Success Criteria:** All HIGH severity issues resolved

---

### Milestone 2: Token Security Enhancements (Week 1-2)
**Priority:** 🟠 HIGH - Critical for production

- [ ] **M2.1** - Implement token blacklist table + migration
- [ ] **M2.2** - Add blacklist check to auth middleware
- [ ] **M2.3** - Implement admin session idle timeout (15 min)
- [ ] **M2.4** - Add rate limiting to admin login endpoint
- [ ] **M2.5** - (Optional) Add session fingerprinting

**Effort:** 8-12 hours
**Owner:** Backend Developer
**Success Criteria:** Logout properly revokes tokens; admin sessions timeout

---

### Milestone 3: User Experience & Session Management (Week 2)
**Priority:** 🟡 MEDIUM - Quality of life

- [ ] **M3.1** - Implement secure token persistence (httpOnly cookies or encrypted sessionStorage)
- [ ] **M3.2** - Add automatic token refresh before expiration
- [ ] **M3.3** - Add "Remember Me" functionality (optional)
- [ ] **M3.4** - Improve session expired user messaging

**Effort:** 6-8 hours
**Owner:** Frontend Developer
**Success Criteria:** Users stay logged in across refreshes; no sudden logouts

---

### Milestone 4: Input Validation & XSS Prevention (Week 2-3)
**Priority:** 🟡 MEDIUM - Data integrity

- [ ] **M4.1** - Add Zod validation to all frontend forms
- [ ] **M4.2** - Install and configure `rehype-sanitize` for markdown
- [ ] **M4.3** - Add CSP violation reporting endpoint
- [ ] **M4.4** - Review all `dangerouslySetInnerHTML` usage (if any)

**Effort:** 4-6 hours
**Owner:** Frontend Developer
**Success Criteria:** All user input validated; markdown sanitized

---

### Milestone 5: Production Hardening (Week 3)
**Priority:** 🟢 LOW - Best practices

- [ ] **M5.1** - Implement API-wide rate limiting
- [ ] **M5.2** - Configure CORS explicitly
- [ ] **M5.3** - Update remaining npm dependencies
- [ ] **M5.4** - Add session/blacklist cleanup to cron job
- [ ] **M5.5** - Enable Cloudflare WAF rules

**Effort:** 6-8 hours
**Owner:** DevOps
**Success Criteria:** Rate limits enforced; automated cleanup working

---

### Milestone 6: Compliance & Monitoring (Week 4)
**Priority:** 🟢 LOW - Long-term maintenance

- [ ] **M6.1** - Add privacy policy and terms pages
- [ ] **M6.2** - Implement cookie consent if using analytics cookies
- [ ] **M6.3** - Sanitize all error logging (remove sensitive data)
- [ ] **M6.4** - Set up security monitoring/alerting
- [ ] **M6.5** - Document data retention policies
- [ ] **M6.6** - Create incident response playbook

**Effort:** 8-12 hours
**Owner:** Legal/Compliance + DevOps
**Success Criteria:** GDPR compliant; security alerts configured

---

## Testing Checklist

### Pre-Deployment Security Tests

#### Authentication Tests
- [ ] Cannot access admin endpoints without valid token
- [ ] Token expires after 24 hours
- [ ] Logout invalidates token (after M2.1)
- [ ] Rate limiting blocks after 10 failed guest logins
- [ ] Admin login requires valid credentials
- [ ] Token refresh extends session properly

#### Authorization Tests
- [ ] Guest users cannot access user/admin endpoints
- [ ] Regular users cannot access admin endpoints
- [ ] RBAC middleware enforces role restrictions
- [ ] Token tampering detected and rejected

#### Input Validation Tests
- [ ] SQL injection attempts fail (test with `' OR '1'='1`)
- [ ] XSS attempts sanitized in markdown (`<script>alert('XSS')</script>`)
- [ ] Invalid email formats rejected
- [ ] Password complexity requirements enforced

#### Security Header Tests
```bash
curl -I https://api.plixo.com | grep -E 'X-Content-Type|X-Frame|CSP|Strict-Transport'
```
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY
- [ ] Content-Security-Policy present
- [ ] Strict-Transport-Security present (HTTPS only)

#### CORS Tests
```bash
curl -H "Origin: https://evil.com" -I https://api.plixo.com/health
```
- [ ] Invalid origins rejected
- [ ] Valid origins allowed

#### CSRF Protection Tests (CRITICAL)
```bash
# Test 1: POST without CSRF token should fail
curl -X POST https://api.plixo.com/admin/users \
  -H "Authorization: Bearer <valid-token>" \
  -H "Content-Type: application/json" \
  -d '{"username":"hacker","role":"admin"}' \
# Expected: 403 Forbidden with "CSRF token required"

# Test 2: POST with invalid CSRF token should fail
curl -X POST https://api.plixo.com/admin/users \
  -H "Authorization: Bearer <valid-token>" \
  -H "X-CSRF-Token: invalid-token-12345" \
  -H "Content-Type: application/json" \
  -d '{"username":"hacker","role":"admin"}' \
# Expected: 403 Forbidden with "Invalid CSRF token"

# Test 3: POST with valid CSRF token should succeed
curl -X POST https://api.plixo.com/admin/users \
  -H "Authorization: Bearer <valid-token>" \
  -H "X-CSRF-Token: <valid-csrf-from-login>" \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","role":"user"}' \
# Expected: 200 OK

# Test 4: GET requests should work without CSRF token
curl -X GET https://api.plixo.com/admin/users \
  -H "Authorization: Bearer <valid-token>"
# Expected: 200 OK (GET is safe, no CSRF needed)

# Test 5: Simulate CSRF attack from evil.com
# Create HTML file: csrf-attack.html
cat > /tmp/csrf-attack.html << 'EOF'
<!DOCTYPE html>
<html>
<head><title>CSRF Attack Test</title></head>
<body>
<h1>CSRF Attack Simulation</h1>
<script>
// Attempt to create admin user via CSRF
fetch('https://api.plixo.com/admin/users', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <stolen-token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'csrf-hacker',
    role: 'admin',
    password: 'backdoor123'
  })
})
.then(r => r.json())
.then(data => {
  console.log('Attack result:', data)
  document.body.innerHTML += '<pre>' + JSON.stringify(data, null, 2) + '</pre>'
})
</script>
</body>
</html>
EOF
# Open in browser: file:///tmp/csrf-attack.html
# Expected: 403 Forbidden (CSRF protection blocks attack)
```

- [ ] POST without CSRF token returns 403
- [ ] POST with invalid CSRF token returns 403
- [ ] POST with valid CSRF token succeeds
- [ ] GET requests work without CSRF token
- [ ] Simulated CSRF attack from external site blocked

#### Rate Limiting Tests
- [ ] Guest login blocked after 10 attempts
- [ ] Admin login blocked after threshold (if implemented)
- [ ] API rate limits enforced

---

## Recommended Security Tools

### Automated Scanning
```bash
# Frontend
npm audit                    # Dependency vulnerabilities
npm install -g snyk && snyk test  # Advanced scanning

# Backend
npm audit
wrangler tail --format=pretty  # Monitor production logs

# Web Security
observatory https://plixo.com  # Mozilla Observatory
securityheaders.com/plixo.com  # Header analysis
ssllabs.com/ssltest/           # TLS configuration
```

### Penetration Testing Tools
- **OWASP ZAP** - Automated vulnerability scanner
- **Burp Suite** - Manual penetration testing
- **sqlmap** - SQL injection testing (should all fail)
- **wrk** or **vegeta** - Load testing / DoS simulation

---

## Security Best Practices Documentation

### For Developers

1. **Never commit secrets** - Use `.env` files and environment variables
2. **Always validate input** - Client-side AND server-side
3. **Use parameterized queries** - Never string concatenation for SQL
4. **Hash sensitive data** - Passwords, tokens, PII
5. **Log securely** - Sanitize before logging
6. **Keep dependencies updated** - Run `npm audit` weekly
7. **Review PRs for security** - Check for vulnerabilities before merge

### For DevOps

1. **Rotate secrets regularly** - JWT secret, API keys (quarterly)
2. **Monitor logs** - Set up alerts for anomalies
3. **Backup data** - Regular D1 database backups
4. **Test disaster recovery** - Quarterly restore drills
5. **Keep infrastructure updated** - Cloudflare Pages, Workers runtime
6. **Principle of least privilege** - Minimize permissions everywhere

---

## Conclusion

The Plixo portfolio system has a **strong security foundation** with proper authentication, input validation, and privacy practices. The identified issues are **not critical vulnerabilities** but rather opportunities to harden the system before production use.

### Immediate Actions (Before Production)
1. ⚠️ **IMPLEMENT CSRF PROTECTION (M0 - CRITICAL)**
2. ✅ Add security headers middleware (M1.2)
3. ✅ Implement token blacklist (M2.1-2.2)
4. ✅ Fix dependency vulnerabilities (M1.3)
5. ✅ Add admin session timeout (M2.3)

### Next 30 Days
- Complete Milestones 1-4 (Critical through Medium priority)
- Set up security monitoring
- Run penetration tests

### Ongoing
- Weekly dependency audits
- Quarterly secret rotation
- Monthly security review
- Incident response drills

---

**Next Steps:** Review this audit with the team, prioritize milestones, and create implementation tickets.

**Questions?** Reference specific finding IDs (e.g., "M2.1 - Token Blacklist") in discussions.

**Document Version:** 1.0
**Last Updated:** 2026-04-02
**Next Review:** 2026-07-02 (quarterly)
