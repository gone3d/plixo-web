# Milestone 12.2 - M1: Critical Security Configuration

**Milestone Version:** 1.4.8 (starting version from Task 0)
**Date Created:** 2026-04-02
**Date Started:** [YYYY-MM-DD when Task 0 begins]
**Date Completed:** [YYYY-MM-DD when all tasks complete]
**Status:** Planning
**Based on:** [docs/SECURITY_AUDIT.md - Milestone M1](../docs/SECURITY_AUDIT.md#milestone-1-critical-security-configuration)

**🟠 HIGH PRIORITY SECURITY MILESTONE - REQUIRED FOR PRODUCTION**

Implements critical security headers, verifies JWT secret strength, fixes dependency vulnerabilities, and documents environment variables. These security configurations are essential for production deployment.

---

## Version Information

**Versioning Strategy:**
- **v1.x.x** - Production release (current)
- Task-level versioning: Each task adds +0.0.1

**Current Versions (before milestone):**
- **plixo-web:** `1.4.7` (after M0)
- **plixo-api:** `1.4.6` (after M0)

**Starting Versions (milestone begins):**
- **plixo-web:** `1.4.8` (from Task 0)
- **plixo-api:** `1.4.7` (API changes required)

**Target Versions (after milestone completion):**
- **plixo-web:** `1.4.11` (3 tasks × 0.0.1)
- **plixo-api:** `1.4.10` (3 tasks × 0.0.1)

**Git Branches:**
- **plixo-web:** `don-040226-milestone-M1-web`
- **plixo-api:** `don-040226-milestone-M1-api`

---

## Progress Summary

**Completion:** 0 of 6 tasks complete (0%)

| Task                                     | Priority | Status     | Version (Web) | Version (API) | Deployed |
| ---------------------------------------- | -------- | ---------- | ------------- | ------------- | -------- |
| Task 0: Milestone Initialization         | SETUP    | ⏳ Pending | 1.4.7         | 1.4.6         | -        |
| Task 1: Verify JWT Secret Strength       | HIGH     | ⏳ Pending | 1.4.8         | 1.4.7         | -        |
| Task 2: Add Security Headers Middleware  | CRITICAL | ⏳ Pending | 1.4.8         | 1.4.8         | -        |
| Task 3: Fix Frontend Dependencies        | HIGH     | ⏳ Pending | 1.4.9         | 1.4.8         | -        |
| Task 4: Verify No Secrets in Git History | HIGH     | ⏳ Pending | 1.4.10        | 1.4.9         | -        |
| Task 5: Document Environment Variables   | MEDIUM   | ⏳ Pending | 1.4.11        | 1.4.10        | -        |

**Status Legend:**
- ⏳ Pending
- 🚧 In Progress
- ✅ Complete
- 🚀 Deployed

---

## Overview

**Objective:** Configure critical security settings including headers, JWT secrets, dependency updates, and environment documentation.

**Scope:**

- JWT secret strength verification (256+ bits entropy)
- Security headers middleware (CSP, HSTS, X-Frame-Options, etc.)
- Frontend dependency vulnerability fixes
- Git history secret verification
- Environment variable documentation

**Priority Breakdown:**

- Critical: 1 task (Security Headers)
- High: 3 tasks (JWT, Dependencies, Git History)
- Medium: 1 task (Documentation)
- Setup: 1 task (Initialization)

**Estimated Effort:** 4-6 hours total
**Actual Progress:** [Track actual time spent]

**Dependencies:**

- Milestone 12.1 (M0 - CSRF Protection) must be complete

**Blocks:**

- Milestone 12.3 (M2 - Token Security Enhancements)
- Production deployment (missing critical security headers)

---

## Background

### The Problem

**Current Security Gaps:**

1. **Missing Security Headers** - Vulnerable to clickjacking, MIME sniffing, XSS attacks
2. **Unverified JWT Secret** - May be weak or default value
3. **Dependency Vulnerabilities** - 11 npm vulnerabilities in plixo-web (2 moderate, 9 high)
4. **Undocumented Secrets** - Environment variables not formally documented
5. **Unknown Git History** - Possible committed secrets in repository history

**Impact:**
- Missing CSP allows inline script injection
- No X-Frame-Options allows clickjacking attacks
- No HSTS allows downgrade attacks
- Dependency vulnerabilities expose attack surface
- Weak JWT secret compromises authentication

### The Solution

**Comprehensive Security Configuration:**

1. Generate and verify strong JWT secret (256+ bits)
2. Add security headers middleware to API responses
3. Update frontend dependencies to patch vulnerabilities
4. Scan git history for accidentally committed secrets
5. Document all required environment variables in README

**Why This Matters:**
- Security headers are defense-in-depth layers
- Strong JWT secret prevents brute-force token generation
- Updated dependencies eliminate known vulnerabilities
- Documentation prevents accidental secret exposure
- Git history audit ensures no historical leaks

---

## Task 0: Milestone Initialization (SETUP PRIORITY)

**Purpose:** Initialize milestone by determining current version and creating feature branches
**Estimated Time:** 10 minutes
**Status:** ⏳ Pending
**Dependencies:** Milestone 12.1 (M0) complete

### Description

Establish baseline versions and create feature branches for this security configuration milestone.

### Step 0.1: Verify M0 Completion

```bash
# Verify M0 is deployed and complete
cd /Users/don/Projects\ 2/GitHub/plixo-web
git log --oneline -5 | grep "M0"
# Should show M0 merge commit

cd /Users/don/Projects\ 2/GitHub/plixo-api
git log --oneline -5 | grep "M0"
# Should show M0 merge commit
```

### Step 0.2: Determine Current Web Version

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-web
git checkout main
git pull origin main
cat package.json | grep '"version"'
```

**Expected:** `"version": "1.4.7"` (after M0)

### Step 0.3: Determine Current API Version

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-api
git checkout main
git pull origin main
cat package.json | grep '"version"'
```

**Expected:** `"version": "1.4.6"` (after M0)

### Step 0.4: Create Web Branch

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-web
git checkout main
git pull origin main
git checkout -b don-040226-milestone-M1-web
git push -u origin don-040226-milestone-M1-web
```

### Step 0.5: Create API Branch

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-api
git checkout main
git pull origin main
git checkout -b don-040226-milestone-M1-api
git push -u origin don-040226-milestone-M1-api
```

### Step 0.6: Update Milestone Header

Update this document with:
- **Date Started:** [Current date]
- **Status:** In Progress
- Confirm version numbers

### Success Criteria

- ✅ M0 deployment verified
- ✅ Current versions recorded (web: 1.4.7, api: 1.4.6)
- ✅ Web branch `don-040226-milestone-M1-web` created and pushed
- ✅ API branch `don-040226-milestone-M1-api` created and pushed
- ✅ Milestone document updated with start date
- ✅ Ready to proceed with Task 1

---

## Task 1: Verify JWT Secret Strength (HIGH)

**Severity:** HIGH
**Risk:** Weak JWT secret compromises entire authentication system
**Estimated Time:** 30 minutes
**Actual Time:** [Fill in when complete]
**Status:** ⏳ Pending
**Version (API):** 1.4.7
**Dependencies:** Task 0

### Description

Generate a strong JWT secret (256+ bits entropy) and verify it's properly configured in Cloudflare Pages environment variables.

### Affected Files

**plixo-api:**
- Environment variables (Cloudflare Dashboard)
- `.dev.vars` (local development - gitignored)
- No code changes required

### Implementation Steps

1. **Generate strong JWT secret**:

```bash
# Generate 256-bit (32-byte) secret in base64
openssl rand -base64 64

# Output example:
# Xk7pQ2vL8mN9rT6wY5uE3sD1aH4jK0lM8nP7qR9tU2vX5zB6cF1dG8hJ3kL4mN0o
```

2. **Verify current secret strength** (local):

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-api

# Check .dev.vars (should exist and be gitignored)
cat .dev.vars

# Verify JWT_SECRET length
cat .dev.vars | grep JWT_SECRET | wc -c
# Should be 80+ characters (64 base64 + "JWT_SECRET=" + newline)
```

3. **Update local development secret** (if needed):

```bash
# Backup current .dev.vars
cp .dev.vars .dev.vars.backup

# Update JWT_SECRET in .dev.vars
# Use a text editor or:
echo 'JWT_SECRET="<generated-secret-from-step-1>"' >> .dev.vars
```

4. **Update Cloudflare production secret**:

```
# Manual steps (cannot automate for security):
1. Go to Cloudflare Dashboard
2. Navigate to Workers & Pages > plixo-api
3. Settings > Environment Variables
4. Find JWT_SECRET variable
5. Click "Edit"
6. Paste new strong secret
7. Save changes
8. Redeploy (automatic on save)
```

5. **Document secret rotation date**:

```bash
# Add to SECURITY_AUDIT.md or create SECRETS.md
echo "## JWT Secret Rotation

Last Rotated: $(date +%Y-%m-%d)
Rotation Schedule: Quarterly (every 3 months)
Next Rotation: $(date -v+3m +%Y-%m-%d)

**Rotation Procedure:**
1. Generate new secret: \`openssl rand -base64 64\`
2. Update Cloudflare environment variables
3. Update .dev.vars for local development
4. Document rotation date
5. Old tokens remain valid until 24h expiration
" >> docs/SECRET_ROTATION.md
```

### Testing Checklist

**Local Testing:**
- [ ] JWT secret in .dev.vars is 64+ characters
- [ ] JWT secret is base64 encoded
- [ ] JWT secret not committed to git
- [ ] Login works with new secret locally

**Production Testing:**
- [ ] JWT secret updated in Cloudflare Dashboard
- [ ] Login works with new secret in production
- [ ] Existing tokens expire gracefully (24h)
- [ ] New tokens generated successfully

**Security Verification:**
```bash
# Verify secret entropy
python3 << 'EOF'
import base64
import math

secret = input("Enter JWT secret: ")
decoded = base64.b64decode(secret)
bits = len(decoded) * 8
print(f"Secret length: {len(decoded)} bytes")
print(f"Entropy: {bits} bits")
print(f"Security level: {'✅ Strong (256+ bits)' if bits >= 256 else '⚠️ Weak (<256 bits)'}")
EOF
```

**Manual Testing:**
```bash
# Test login with new secret
curl -X POST http://localhost:8788/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq '.data.token'
# Should return valid JWT token
```

### Success Criteria

- ✅ Strong JWT secret generated (256+ bits)
- ✅ JWT secret updated in .dev.vars
- ✅ JWT secret updated in Cloudflare Dashboard
- ✅ Login works with new secret (local and production)
- ✅ Secret rotation documented
- ✅ .dev.vars in .gitignore verified
- ✅ API version updated to 1.4.7 in package.json

### Rollback Plan

```bash
# Restore old secret from backup
cp .dev.vars.backup .dev.vars

# Revert Cloudflare secret via Dashboard
# (Manual - use previous value)
```

---

## Task 2: Add Security Headers Middleware (CRITICAL)

**Severity:** CRITICAL
**Risk:** Missing security headers expose application to XSS, clickjacking, MIME sniffing
**Estimated Time:** 1.5 hours
**Actual Time:** [Fill in when complete]
**Status:** ⏳ Pending
**Version (API):** 1.4.8
**Dependencies:** Task 1

### Description

Implement security headers middleware to add critical HTTP security headers to all API responses. This protects against common web attacks.

### Affected Files

**plixo-api:**
- `/functions/_middleware.ts`

### Implementation Steps

1. **Update global middleware with security headers**:

```typescript
// plixo-api/functions/_middleware.ts
import type { PagesFunction } from '@cloudflare/workers-types'
import type { Env } from '../src/lib/types/env'

/**
 * Global middleware
 * 1. CORS headers
 * 2. Security headers (NEW)
 * 3. Error handling
 */
export const onRequest: PagesFunction<Env> = async (context) => {
  const request = context.request
  const origin = request.headers.get('Origin')

  // Allowed origins for CORS
  const allowedOrigins = [
    'https://plixo.com',
    'https://www.plixo.com',
    'http://localhost:5173', // Development
  ]

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    if (origin && allowedOrigins.includes(origin)) {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400',
        },
      })
    }
    return new Response(null, { status: 204 })
  }

  // Process request
  const response = await context.next()

  // Clone response to add headers
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers(response.headers),
  })

  // **NEW: Security Headers**

  // CORS headers (if valid origin)
  if (origin && allowedOrigins.includes(origin)) {
    newResponse.headers.set('Access-Control-Allow-Origin', origin)
    newResponse.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  // X-Content-Type-Options: Prevent MIME sniffing
  newResponse.headers.set('X-Content-Type-Options', 'nosniff')

  // X-Frame-Options: Prevent clickjacking
  newResponse.headers.set('X-Frame-Options', 'DENY')

  // X-XSS-Protection: Enable browser XSS filter (legacy but harmless)
  newResponse.headers.set('X-XSS-Protection', '1; mode=block')

  // Referrer-Policy: Control referrer information
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions-Policy: Disable unnecessary browser features
  newResponse.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()'
  )

  // Strict-Transport-Security: Force HTTPS (only for production)
  const url = new URL(request.url)
  if (url.protocol === 'https:') {
    newResponse.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }

  // Content-Security-Policy: Restrict resource loading
  // Adjusted for API (no scripts/styles needed)
  newResponse.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'none'",                    // Block all by default
      "frame-ancestors 'none'",                 // Prevent embedding
      "base-uri 'none'",                        // Prevent base tag injection
      "form-action 'none'",                     // No forms in API responses
    ].join('; ')
  )

  // Cache-Control: Prevent caching of sensitive data
  const pathname = url.pathname
  if (pathname.startsWith('/admin/') || pathname.startsWith('/auth/')) {
    newResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    newResponse.headers.set('Pragma', 'no-cache')
    newResponse.headers.set('Expires', '0')
  }

  return newResponse
}
```

2. **Verify existing middleware doesn't conflict**:

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-api

# Check for other _middleware.ts files
find functions -name "_middleware.ts"

# Review each to ensure no header conflicts
# Priority order: nested middleware > global middleware
```

3. **Add CSP to frontend** (optional but recommended):

```typescript
// plixo-web/vite.config.ts
// Add security headers to Vite preview server

export default defineConfig({
  // ... existing config ...
  preview: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "connect-src 'self' https://api.plixo.com http://localhost:8788",
        "font-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests"
      ].join('; ')
    }
  }
})
```

### Testing Checklist

**Header Verification:**
```bash
# Test all security headers present
curl -I http://localhost:8788/health

# Should see:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
# Referrer-Policy: strict-origin-when-cross-origin
# Permissions-Policy: geolocation=(), ...
# Content-Security-Policy: default-src 'none'; ...
```

**HSTS Verification (production only):**
```bash
curl -I https://api.plixo.com/health | grep -i "strict-transport"
# Should see: Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**CSP Violation Testing:**
```bash
# API should not load in iframe
# Create test HTML:
cat > /tmp/csp-test.html << 'EOF'
<iframe src="https://api.plixo.com/health"></iframe>
EOF

open /tmp/csp-test.html
# Expected: Browser blocks iframe (X-Frame-Options: DENY)
```

**Cache-Control Verification:**
```bash
# Admin endpoints should not be cached
curl -I http://localhost:8788/admin/users \
  -H "Authorization: Bearer <token>" | grep -i "cache-control"
# Expected: Cache-Control: no-store, no-cache, must-revalidate, private
```

**Manual Tests:**
- [ ] All security headers present on API responses
- [ ] HSTS header present on HTTPS responses only
- [ ] CSP blocks inline scripts (if tested)
- [ ] X-Frame-Options prevents iframe embedding
- [ ] Cache-Control prevents sensitive data caching
- [ ] CORS still works for allowed origins
- [ ] Application functionality unaffected

### Success Criteria

- ✅ Security headers middleware implemented
- ✅ All 9 security headers present
- ✅ HSTS configured for HTTPS only
- ✅ CSP configured for API (no script/style needed)
- ✅ Cache-Control prevents admin endpoint caching
- ✅ CORS headers preserved
- ✅ Application functionality unchanged
- ✅ TypeScript compilation passes
- ✅ API version updated to 1.4.8 in package.json

### Rollback Plan

```bash
# Revert _middleware.ts changes
cd /Users/don/Projects\ 2/GitHub/plixo-api
git checkout HEAD~1 functions/_middleware.ts
```

---

## Task 3: Fix Frontend Dependency Vulnerabilities (HIGH)

**Severity:** HIGH
**Risk:** Known vulnerabilities in npm packages expose attack surface
**Estimated Time:** 1 hour
**Actual Time:** [Fill in when complete]
**Status:** ⏳ Pending
**Version (Web):** 1.4.9
**Dependencies:** Task 0

### Description

Update frontend dependencies to fix 11 known vulnerabilities (2 moderate, 9 high) identified by npm audit.

### Affected Files

**plixo-web:**
- `/package.json`
- `/package-lock.json`

### Implementation Steps

1. **Run npm audit to identify vulnerabilities**:

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-web
npm audit

# Expected output shows:
# - d3-color (HIGH ReDoS)
# - flatted (HIGH DoS)
# - minimatch (HIGH ReDoS)
# - picomatch (HIGH ReDoS)
# - rollup (HIGH path traversal - dev only)
# - brace-expansion (MODERATE process hang)
# - ajv (MODERATE ReDoS)
```

2. **Apply safe fixes first**:

```bash
# Safe (non-breaking) fixes
npm audit fix

# Check what's fixed
npm audit
```

3. **Apply force fixes if needed**:

```bash
# Review breaking changes first
npm audit fix --dry-run --force

# If acceptable, apply
npm audit fix --force

# Note: May update major versions
```

4. **Manually update critical packages**:

```bash
# If audit fix doesn't resolve all issues, manually update:

# Update rollup (dev dependency)
npm update rollup

# Update d3-color (via react-simple-maps)
npm update react-simple-maps

# Update minimatch
npm update minimatch
```

5. **Verify build still works**:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Build
npm run build

# Expected: Build succeeds with no errors
```

6. **Test application**:

```bash
# Start dev server
npm run dev

# Test critical paths:
# 1. Homepage loads
# 2. 3D spaceship renders
# 3. Projects page loads
# 4. About page loads
# 5. Admin console accessible
# 6. Login works
```

### Testing Checklist

**Vulnerability Resolution:**
- [ ] npm audit shows 0 critical vulnerabilities
- [ ] npm audit shows 0 high vulnerabilities
- [ ] Moderate vulnerabilities reduced or documented
- [ ] No new vulnerabilities introduced

**Build Verification:**
- [ ] `npm install` succeeds
- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] Bundle size within 10% of previous (check with `npm run build`)

**Functionality Testing:**
- [ ] Homepage loads without errors
- [ ] 3D spaceship renders correctly
- [ ] Navigation works (all routes)
- [ ] Projects page displays data
- [ ] About page renders markdown
- [ ] Admin console loads
- [ ] Login/logout works
- [ ] Admin CRUD operations work
- [ ] No console errors
- [ ] No runtime errors

**Cross-Browser Testing:**
- [ ] Chrome: Application works
- [ ] Firefox: Application works
- [ ] Safari: Application works

### Success Criteria

- ✅ Critical and high vulnerabilities fixed
- ✅ Moderate vulnerabilities resolved or documented
- ✅ Build succeeds with no errors
- ✅ Application functionality unchanged
- ✅ No new vulnerabilities introduced
- ✅ package.json and package-lock.json updated
- ✅ Web version updated to 1.4.9 in package.json

### Rollback Plan

```bash
# Restore previous package files
git checkout HEAD~1 package.json package-lock.json

# Reinstall old dependencies
rm -rf node_modules
npm install
```

**If specific package causes issues:**
```bash
# Pin problematic package to previous version
npm install package-name@previous-version --save-exact
```

---

## Task 4: Verify No Secrets in Git History (HIGH)

**Severity:** HIGH
**Risk:** Accidentally committed secrets in git history expose credentials
**Estimated Time:** 45 minutes
**Actual Time:** [Fill in when complete]
**Status:** ⏳ Pending
**Version (API):** 1.4.9
**Dependencies:** Task 1

### Description

Scan both plixo-web and plixo-api git histories for accidentally committed secrets (JWT secrets, API keys, database URLs, etc.). If found, rotate secrets and optionally clean git history.

### Affected Files

**Both repos:**
- Git history
- `.gitignore` files
- Environment configuration files

### Implementation Steps

1. **Search for JWT_SECRET in git history**:

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-api

# Search all branches and history
git log --all --full-history --source --pickaxe-all -S'JWT_SECRET=' -- wrangler.toml .env .dev.vars

# If found: SECRET LEAK - must rotate immediately
```

2. **Search for other secrets in plixo-api**:

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-api

# Search for various secret patterns
git log --all --full-history --source --pickaxe-all -S'SECRET='
git log --all --full-history --source --pickaxe-all -S'API_KEY='
git log --all --full-history --source --pickaxe-all -S'password='
git log --all --full-history --source --pickaxe-all -S'TURNSTILE_SECRET'

# Check wrangler.toml history
git log --all --full-history -- wrangler.toml | head -20
```

3. **Search for secrets in plixo-web**:

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-web

# Search for API URLs, keys, tokens
git log --all --full-history --source --pickaxe-all -S'VITE_API_URL='
git log --all --full-history --source --pickaxe-all -S'VITE_TURNSTILE_SITE_KEY='

# Check .env files history
git log --all --full-history -- .env .env.local .env.production
```

4. **Verify .gitignore coverage**:

```bash
# plixo-api
cd /Users/don/Projects\ 2/GitHub/plixo-api
cat .gitignore | grep -E '(\.env|\.dev\.vars|wrangler\.toml)'

# Expected:
# .dev.vars
# .env*
# !.env.example

# plixo-web
cd /Users/don/Projects\ 2/GitHub/plixo-web
cat .gitignore | grep -E '(\.env)'

# Expected:
# .env*.local
# .env
```

5. **If secrets found, rotate immediately**:

```bash
# CRITICAL: If JWT_SECRET found in history:
# 1. Generate new JWT secret (see Task 1)
# 2. Update Cloudflare environment variables
# 3. Update .dev.vars
# 4. Force all users to re-login (old tokens expire)

# CRITICAL: If TURNSTILE_SECRET found:
# 1. Rotate Turnstile secret in Cloudflare Dashboard
# 2. Update environment variables
# 3. Test CAPTCHA still works

# OPTIONAL: Clean git history (DANGEROUS - coordinate with team)
# Only if secrets are recent and not widely distributed
git filter-repo --path .env --invert-paths --force
git push origin --force --all
```

6. **Document findings**:

```bash
# Create security scan report
cat > docs/GIT_HISTORY_AUDIT.md << 'EOF'
# Git History Security Audit

**Date:** $(date +%Y-%m-%d)
**Auditor:** [Your name]
**Scope:** plixo-web and plixo-api repositories

## Findings

### JWT_SECRET
- Status: [✅ Clean / ⚠️ Found - rotated / 🔴 Found - not rotated]
- Action: [None required / Secret rotated on YYYY-MM-DD / IMMEDIATE ACTION REQUIRED]

### TURNSTILE_SECRET
- Status: [✅ Clean / ⚠️ Found - rotated]
- Action: [None required / Secret rotated]

### Other Secrets
- API Keys: [✅ Clean / ⚠️ Found]
- Database URLs: [✅ Clean / ⚠️ Found]
- Passwords: [✅ Clean / ⚠️ Found]

## Recommendations

1. [List any recommendations]
2. Quarterly secret rotation schedule
3. Pre-commit hooks to prevent future leaks

## Next Audit

Scheduled: $(date -v+3m +%Y-%m-%d)
EOF
```

### Testing Checklist

**Secret Scanning:**
- [ ] JWT_SECRET not in plixo-api git history
- [ ] TURNSTILE_SECRET not in plixo-api git history
- [ ] API_KEY patterns not found
- [ ] Password patterns not found
- [ ] .env files not committed (except .env.example)
- [ ] wrangler.toml secrets not hardcoded

**.gitignore Verification:**
- [ ] .dev.vars in .gitignore (plixo-api)
- [ ] .env* in .gitignore (both repos)
- [ ] .env.example NOT in .gitignore (documentation)

**If Secrets Found:**
- [ ] All found secrets rotated
- [ ] Cloudflare environment variables updated
- [ ] Local .dev.vars updated
- [ ] Application tested with new secrets
- [ ] Team notified of secret rotation
- [ ] Git history cleaned (if necessary)

### Success Criteria

- ✅ No secrets found in git history, OR
- ✅ All found secrets rotated and documented
- ✅ .gitignore properly configured
- ✅ Security audit report created
- ✅ Pre-commit hook considered (optional)
- ✅ API version updated to 1.4.9 in package.json

### Rollback Plan

**If secret rotation breaks application:**
```bash
# Revert to previous secret (temporarily)
# Update Cloudflare Dashboard with old secret
# Investigate why new secret doesn't work
# Re-attempt rotation with fix
```

**If git history cleaning fails:**
```bash
# Restore from backup
git fetch origin
git reset --hard origin/main

# Secrets remain in history - must rotate
```

---

## Task 5: Document Environment Variables (MEDIUM)

**Severity:** MEDIUM
**Risk:** Undocumented environment variables lead to misconfiguration
**Estimated Time:** 1 hour
**Actual Time:** [Fill in when complete]
**Status:** ⏳ Pending
**Version (Web):** 1.4.11, **Version (API):** 1.4.10
**Dependencies:** Task 4

### Description

Create comprehensive documentation of all required environment variables for both plixo-web and plixo-api, including purpose, format, and examples.

### Affected Files

**plixo-web:**
- `/README.md`
- `/.env.example` (NEW)

**plixo-api:**
- `/README.md`
- `/.dev.vars.example` (NEW)

### Implementation Steps

1. **Create .env.example for plixo-web**:

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-web

cat > .env.example << 'EOF'
# Plixo Web - Environment Variables
# Copy to .env for local development

# API Configuration
VITE_API_URL=http://localhost:8788
# Production: https://api.plixo.com

# Cloudflare Turnstile (CAPTCHA)
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
# Get from: https://dash.cloudflare.com/?to=/:account/turnstile

# Analytics (Optional)
# VITE_ANALYTICS_ENABLED=false
EOF

git add .env.example
```

2. **Create .dev.vars.example for plixo-api**:

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-api

cat > .dev.vars.example << 'EOF'
# Plixo API - Local Development Environment Variables
# Copy to .dev.vars (gitignored)

# JWT Configuration
JWT_SECRET="CHANGE_ME_GENERATE_WITH_openssl_rand_base64_64"
# CRITICAL: Must be 256+ bits (64+ characters base64)
# Generate: openssl rand -base64 64

# Cloudflare Turnstile
TURNSTILE_SECRET="1x0000000000000000000000000000000AA"
# Get from: https://dash.cloudflare.com/?to=/:account/turnstile

# Database (Cloudflare D1)
# DB is automatically bound in Cloudflare Workers
# Local: wrangler d1 ... --local
# Production: Bound via wrangler.toml

# CORS Configuration (built into code)
# Allowed origins: plixo.com, www.plixo.com, localhost:5173
EOF

git add .dev.vars.example
```

3. **Update plixo-web README.md**:

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-web

# Add environment variables section
cat >> README.md << 'EOF'

## Environment Variables

### Required Variables

| Variable                    | Description                          | Example                      | Required |
| --------------------------- | ------------------------------------ | ---------------------------- | -------- |
| `VITE_API_URL`              | Backend API base URL                 | `http://localhost:8788`      | ✅ Yes   |
| `VITE_TURNSTILE_SITE_KEY`   | Cloudflare Turnstile public key      | `1x000...`                   | ✅ Yes   |

### Optional Variables

| Variable                    | Description                          | Default                      | Required |
| --------------------------- | ------------------------------------ | ---------------------------- | -------- |
| `VITE_ANALYTICS_ENABLED`    | Enable custom analytics tracking     | `false`                      | ❌ No    |

### Setup Instructions

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update values in `.env`:
   - `VITE_API_URL`: Local development uses `http://localhost:8788`
   - `VITE_TURNSTILE_SITE_KEY`: Get from [Cloudflare Turnstile Dashboard](https://dash.cloudflare.com/?to=/:account/turnstile)

3. Never commit `.env` to version control (included in `.gitignore`)

### Production Configuration

Production environment variables are configured in Cloudflare Pages Dashboard:

1. Go to Cloudflare Dashboard > Workers & Pages > plixo-web
2. Settings > Environment Variables
3. Add production values:
   - `VITE_API_URL=https://api.plixo.com`
   - `VITE_TURNSTILE_SITE_KEY=<production-key>`

EOF

git add README.md
```

4. **Update plixo-api README.md**:

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-api

cat >> README.md << 'EOF'

## Environment Variables

### Required Variables

| Variable             | Description                           | Example                                   | Required |
| -------------------- | ------------------------------------- | ----------------------------------------- | -------- |
| `JWT_SECRET`         | Secret key for JWT token signing      | (64+ char base64)                         | ✅ Yes   |
| `TURNSTILE_SECRET`   | Cloudflare Turnstile secret key       | `1x000...`                                | ✅ Yes   |

### Database Binding

| Binding    | Type | Description                    | Config Location      |
| ---------- | ---- | ------------------------------ | -------------------- |
| `DB`       | D1   | SQLite database (Cloudflare)   | `wrangler.toml`      |

### Setup Instructions

#### Local Development

1. Copy `.dev.vars.example` to `.dev.vars`:
   ```bash
   cp .dev.vars.example .dev.vars
   ```

2. Generate strong JWT secret:
   ```bash
   openssl rand -base64 64
   ```

3. Update `.dev.vars` with:
   - `JWT_SECRET`: Paste generated secret
   - `TURNSTILE_SECRET`: Get from [Cloudflare Turnstile Dashboard](https://dash.cloudflare.com/?to=/:account/turnstile)

4. **NEVER commit `.dev.vars`** (included in `.gitignore`)

#### Production Configuration

Production environment variables are configured in Cloudflare Dashboard:

1. Go to Cloudflare Dashboard > Workers & Pages > plixo-api
2. Settings > Environment Variables
3. Add production values:
   - `JWT_SECRET`: Strong 256-bit secret
   - `TURNSTILE_SECRET`: Production Turnstile secret

### Security Notes

- ⚠️ **JWT_SECRET** must be 256+ bits (64+ characters base64)
- 🔄 Rotate `JWT_SECRET` quarterly
- 🔒 Never commit secrets to git
- 📝 Document rotation dates in `docs/SECRET_ROTATION.md`

EOF

git add README.md
```

5. **Verify .gitignore protects secrets**:

```bash
# plixo-api
cd /Users/don/Projects\ 2/GitHub/plixo-api
grep -E '(\.dev\.vars|\.env)' .gitignore

# plixo-web
cd /Users/don/Projects\ 2/GitHub/plixo-web
grep -E '\.env' .gitignore
```

### Testing Checklist

**Documentation Verification:**
- [ ] `.env.example` created in plixo-web
- [ ] `.dev.vars.example` created in plixo-api
- [ ] README.md updated with environment variables section (both repos)
- [ ] All required variables documented
- [ ] Examples provided (non-secret values)
- [ ] Setup instructions clear
- [ ] Security warnings included

**Example File Testing:**
- [ ] `.env.example` contains no real secrets
- [ ] `.dev.vars.example` contains no real secrets
- [ ] Example values clearly marked as placeholders
- [ ] Copy-paste instructions accurate

**.gitignore Verification:**
- [ ] `.env` ignored (plixo-web)
- [ ] `.env.local` ignored (plixo-web)
- [ ] `.dev.vars` ignored (plixo-api)
- [ ] `.env.example` NOT ignored
- [ ] `.dev.vars.example` NOT ignored

**Usability Testing:**
```bash
# Test setup from scratch (plixo-web)
cd /tmp
git clone <plixo-web-repo>
cd plixo-web
cp .env.example .env
# Edit .env with real values
npm install
npm run dev
# Expected: Application runs

# Test setup from scratch (plixo-api)
cd /tmp
git clone <plixo-api-repo>
cd plixo-api
cp .dev.vars.example .dev.vars
# Edit .dev.vars with real secrets
npm install
npx wrangler dev
# Expected: API runs
```

### Success Criteria

- ✅ `.env.example` created with all variables
- ✅ `.dev.vars.example` created with all secrets (placeholders)
- ✅ README.md updated with comprehensive environment docs
- ✅ Setup instructions clear and tested
- ✅ Security warnings prominent
- ✅ No real secrets in example files
- ✅ .gitignore properly configured
- ✅ Web version 1.4.11, API version 1.4.10 in package.json

### Rollback Plan

```bash
# Revert documentation changes
git checkout HEAD~1 README.md .env.example .dev.vars.example
```

---

## Testing Strategy

### Test Environments

**Development:**
- Local: `http://localhost:5173` (web), `http://localhost:8788` (API)
- Branches: `don-040226-milestone-M1-web`, `don-040226-milestone-M1-api`

**Staging (Cloudflare Pages Preview):**
- Auto-generated preview URLs from feature branches
- Test security headers before merging

**Production:**
- URL: https://plixo.com
- API: https://api.plixo.com
- Deploy only after all tests pass

### Critical Test Scenarios

1. **Security Headers**: All headers present in API responses
2. **JWT Secret**: Login works with new strong secret
3. **Dependencies**: Application functions after updates
4. **Git History**: No secrets found or all rotated
5. **Documentation**: New developer can set up environment

---

## Deployment Plan

### Pre-Deployment Checklist

**Security Verification:**
- [ ] JWT secret is 256+ bits
- [ ] Security headers present on all API responses
- [ ] npm audit shows 0 critical/high vulnerabilities
- [ ] Git history clean or secrets rotated
- [ ] Environment variables documented

**Code Quality:**
- [ ] TypeScript compilation successful (both repos)
- [ ] No console errors
- [ ] Build successful (`npm run build`)
- [ ] Tests passing (if applicable)

**Documentation:**
- [ ] README.md updated (both repos)
- [ ] .env.example / .dev.vars.example created
- [ ] SECRET_ROTATION.md updated
- [ ] GIT_HISTORY_AUDIT.md created

### Deployment Steps

**Step 1: Deploy API (1.4.10)**

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-api
git checkout main
git pull origin main
git merge don-040226-milestone-M1-api
git push origin main

# Tag release
git tag -a v1.4.10 -m "M1: Critical Security Configuration"
git push origin v1.4.10

# Verify security headers
curl -I https://api.plixo.com/health | grep -E 'X-|Content-Security|Strict-Transport'
```

**Step 2: Deploy Web (1.4.11)**

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-web
git checkout main
git pull origin main
git merge don-040226-milestone-M1-web
git push origin main

# Tag release
git tag -a v1.4.11 -m "M1: Security Configuration - Dependencies"
git push origin v1.4.11

# Cloudflare Pages deploys automatically
open https://plixo.com
```

**Step 3: Production Verification**

- [ ] API responds with security headers
- [ ] Application loads without errors
- [ ] Login/logout works
- [ ] Admin functions work
- [ ] No console errors
- [ ] Monitor logs for 1 hour

---

## Success Metrics

### Quantitative Metrics

**Security:**
- JWT secret strength: 256+ bits ✅
- Security headers: 9 headers added ✅
- Dependency vulnerabilities: 11 → 0 (target)
- Secrets in git history: 0 ✅

**Code Quality:**
- TypeScript errors: 0 (maintained)
- Build time: < 5 seconds (maintained)
- npm audit: 0 critical/high vulnerabilities

### Qualitative Metrics

- ✅ Security posture significantly improved
- ✅ Attack surface reduced
- ✅ Developer onboarding easier (documentation)
- ✅ Compliance with security best practices

### Acceptance Criteria

- ✅ All 5 tasks complete
- ✅ JWT secret verified strong (256+ bits)
- ✅ Security headers middleware implemented
- ✅ Dependency vulnerabilities fixed
- ✅ Git history verified clean
- ✅ Environment variables documented
- ✅ SECURITY_AUDIT.md M1 marked complete

---

## Rollback Plan

### When to Rollback

Rollback if:
- Security headers break CORS
- JWT secret rotation breaks authentication
- Dependency updates break functionality
- Critical bug discovered

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

**Step 3: Revert JWT Secret** (if needed)

```bash
# Restore old JWT secret from backup
# Update Cloudflare Dashboard
# Old tokens remain valid until 24h expiration
```

**Step 4: Verify Rollback**

- [ ] Application functional
- [ ] Login works
- [ ] Admin operations work
- [ ] No console errors

---

## Security Considerations

**This milestone addresses:**
- 🟠 HIGH: JWT secret management
- 🔴 CRITICAL: Missing security headers
- 🟡 MEDIUM: Dependency vulnerabilities
- 🟢 LOW: Undocumented environment variables

**After this milestone:**
- ✅ JWT secret verified strong (256+ bits)
- ✅ Security headers protecting against XSS, clickjacking, MIME sniffing
- ✅ Dependency vulnerabilities patched
- ✅ Git history verified clean
- ✅ Environment variables documented

**Still requires:**
- ⚠️ M2: Token blacklist (logout revocation)
- ⚠️ M3: Secure token persistence
- ⚠️ M4: Input validation & XSS prevention
- ⚠️ M5: Production hardening
- ⚠️ M6: Compliance & monitoring

---

## Related Documentation

- [SECURITY_AUDIT.md - Milestone M1](../docs/SECURITY_AUDIT.md#milestone-1-critical-security-configuration)
- [ARCHITECTURE.md - Security Architecture](../ARCHITECTURE.md#security-architecture)
- [Milestone 12.1 (M0) - CSRF Protection](Milestone12.1.md)
- [MilestoneTemplate.md](MilestoneTemplate.md)

---

**End of Milestone 12.2 (M1) Specification**
