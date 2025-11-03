# Production Deployment Checklist - Guest Login

**Date**: 2025-11-03
**Feature**: Guest Login with Cloudflare Turnstile
**Repositories**: plixo-api, plixo-web
**Status**: Ready for deployment

---

## Pre-Deployment Verification

### ✅ Development Complete
- [x] plixo-web build successful (158 KB gzipped)
- [x] plixo-api build successful (TypeScript compiled)
- [x] Guest login tested locally with test keys
- [x] Rate limiting verified (10 attempts per IP per 24h)
- [x] Session expiration working (2-hour timeout)
- [x] All code committed to Git

### ✅ Code Review
- [x] Guest authentication logic reviewed
- [x] Security measures validated (CAPTCHA + rate limiting + expiration)
- [x] Error handling comprehensive
- [x] No console errors in development

---

## API Deployment (plixo-api)

### 1. Get Production Turnstile Credentials

**From Cloudflare Dashboard → Turnstile**:
- [ ] Navigate to existing Turnstile site for tenebrae.ai/plixo.com
- [ ] Verify `plixo.com` is in allowed domains list
- [ ] Copy **Secret Key** (for backend): `0x4AAAAAAB40k...` (starts with 0x4)
- [ ] Copy **Site Key** (for frontend): `0x4AAAAAAB40k...` (starts with 0x4)

**Important**: Use PRODUCTION keys, not test keys (1x0000...)

### 2. Run Database Migration

**Command**:
```bash
cd /Users/don/Projects\ 2/GitHub/plixo-api
npx wrangler d1 execute plixo-api-db --remote --file=./src/db/migrations/0002_guest_authentication.sql
```

**Expected Output**:
```
🌀 Executing on remote database plixo-api-db (05146a1c-3b8c-4471-8ca6-c74a494064cb):
🌀 To execute on your local development database, pass the --local flag
✅ Executed 2 commands in 0.234ms
```

**Verify**:
```bash
npx wrangler d1 execute plixo-api-db --remote --command="SELECT name FROM sqlite_master WHERE type='table';"
```

**Expected Tables** (should include):
- guest_sessions
- guest_rate_limits

**Migration Tasks**:
- [ ] Migration executed successfully
- [ ] guest_sessions table created
- [ ] guest_rate_limits table created
- [ ] Indexes created for performance
- [ ] No errors in migration output

### 3. Set Production Environment Variables

**In CloudFlare Dashboard → Workers & Pages → plixo-api → Settings → Environment Variables**:

Add new variable:
- [ ] **TURNSTILE_SECRET_KEY**: `[Production secret key from Step 1]`

**Verify Existing Variables** (should already be set):
- [x] JWT_SECRET
- [x] ADMIN_API_KEY
- [x] ENCRYPTION_KEY
- [x] ENVIRONMENT: `production`
- [x] JWT_EXPIRES_IN: `24h`

### 4. Deploy API to Production

**CloudFlare Pages auto-deploys from GitHub when you push to main branch**:

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-api
git add .
git commit -m "Add guest login with Turnstile CAPTCHA"
git push origin main
```

**Monitor Deployment**:
- [ ] Go to CloudFlare Dashboard → Workers & Pages → plixo-api → Deployments
- [ ] Wait for deployment to complete (1-2 minutes)
- [ ] Check deployment logs for errors
- [ ] Verify deployment status: Success

**Test API Health**:
```bash
curl https://api.plixo.com/health
```

**Expected Response**:
```json
{
  "status": "healthy",
  "version": "1.1.2",
  "database": "connected"
}
```

- [ ] API health check successful
- [ ] No errors in CloudFlare logs
- [ ] Database connection working

---

## Frontend Deployment (plixo-web)

### 5. Update Frontend Environment Variables

**In CloudFlare Dashboard → Workers & Pages → plixo-web → Settings → Environment Variables**:

Add/Update variable for **Production** environment:
- [ ] **VITE_TURNSTILE_SITE_KEY**: `[Production site key from Step 1]`
- [ ] **VITE_API_URL**: `https://api.plixo.com` (should already be set)

**Note**: Do NOT use test keys (1x0000...) in production!

### 6. Deploy Frontend to Production

**CloudFlare Pages auto-deploys from GitHub**:

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-web
git add .
git commit -m "Add guest login with Turnstile CAPTCHA"
git push origin main
```

**Monitor Deployment**:
- [ ] Go to CloudFlare Dashboard → Workers & Pages → plixo-web → Deployments
- [ ] Wait for deployment to complete (1-2 minutes)
- [ ] Check deployment logs for errors
- [ ] Verify deployment status: Success

### 7. Verify Production Build

**Check live site**:
- [ ] Navigate to https://plixo.com
- [ ] Verify site loads without errors
- [ ] Open browser console - no errors
- [ ] Background slideshow working smoothly
- [ ] Login button visible in navigation

---

## Production Testing

### 8. Test Guest Login Flow (End-to-End)

**Open incognito/private window**: https://plixo.com

**Test Steps**:
1. [ ] Click "Login" button in navigation
2. [ ] LoginModal appears with "Continue as Guest" button
3. [ ] Click "Continue as Guest"
4. [ ] Cloudflare Turnstile CAPTCHA widget appears
5. [ ] Complete CAPTCHA (checkbox or challenge)
6. [ ] "Verifying..." loading state shows
7. [ ] Success: Redirected to portfolio content
8. [ ] Verify "Guest" indicator in navigation
9. [ ] Can access /work, /about, /insights, /connect pages
10. [ ] Contact information visible on /connect page

**Verify Authentication**:
- [ ] Guest user can access protected routes
- [ ] No errors in browser console
- [ ] JWT token stored in localStorage
- [ ] Token has role: 'guest' and 2-hour expiration

### 9. Test Rate Limiting

**In incognito window**:
1. [ ] Logout (if logged in as guest)
2. [ ] Complete guest login 10 times successfully
3. [ ] Attempt 11th guest login
4. [ ] Verify error message: "Rate limit exceeded. Try again in X hours."
5. [ ] Verify cannot bypass with new incognito window (same IP)

**Expected Behavior**:
- First 10 attempts: Success
- 11th+ attempts: HTTP 429 (Rate Limited)
- Error message shows retry time

### 10. Test Session Expiration

**Option A - Wait 2 hours** (thorough but slow):
- [ ] Login as guest
- [ ] Wait 2+ hours
- [ ] Try to navigate to protected page
- [ ] Verify auto-logout and redirect to login

**Option B - Manually expire token** (quick test):
- [ ] Login as guest
- [ ] Open browser DevTools → Application → Local Storage
- [ ] Find auth token, decode JWT (jwt.io)
- [ ] Verify `exp` claim is ~2 hours from now
- [ ] Manually set token to expired value or delete it
- [ ] Refresh page
- [ ] Verify redirect to login

### 11. Test Turnstile CAPTCHA Verification

**Test valid CAPTCHA**:
- [ ] Complete CAPTCHA normally → Guest login successful

**Test invalid CAPTCHA** (if possible):
- [ ] Attempt to bypass CAPTCHA → Backend rejects with 400 error
- [ ] Error message: "CAPTCHA verification failed"

**Test edge cases**:
- [ ] Slow/unstable connection → CAPTCHA loads correctly
- [ ] Mobile device → CAPTCHA is responsive
- [ ] Different browsers → Chrome, Safari, Firefox

---

## Database Verification

### 12. Check Guest Sessions Created

**Query remote database**:
```bash
npx wrangler d1 execute plixo-api-db --remote --command="SELECT COUNT(*) as active_guests FROM guest_sessions WHERE expires_at > datetime('now');"
```

**Expected**: Count matches number of active guest logins

**Check rate limiting records**:
```bash
npx wrangler d1 execute plixo-api-db --remote --command="SELECT ip_hash, attempt_count FROM guest_rate_limits LIMIT 5;"
```

**Expected**: Shows IP hashes and attempt counts

- [ ] Guest sessions being created correctly
- [ ] Rate limit records tracking attempts
- [ ] No database errors in CloudFlare logs
- [ ] Indexes improving query performance

---

## Monitoring & Logs

### 13. Monitor CloudFlare Logs

**For plixo-api**:
- [ ] Check: CloudFlare Dashboard → Workers & Pages → plixo-api → Logs
- [ ] Filter: `/api/auth/guest-login` endpoint
- [ ] Verify: Successful guest logins (HTTP 200)
- [ ] Check: No 500 errors
- [ ] Monitor: Turnstile verification calls

**For plixo-web**:
- [ ] Check: CloudFlare Dashboard → Workers & Pages → plixo-web → Logs
- [ ] Verify: Page loads without errors
- [ ] Check: No asset loading failures

**Watch for**:
- Turnstile verification failures
- Rate limit rejections (429)
- Database query errors
- JWT verification failures

### 14. Security Validation

**Verify security measures active**:
- [ ] CAPTCHA required for all guest logins (cannot bypass)
- [ ] Rate limiting enforced (max 10 per IP per 24h)
- [ ] Sessions expire after 2 hours (no indefinite access)
- [ ] Guest sessions stored with hashed IPs (privacy)
- [ ] No sensitive data exposed in JWT tokens
- [ ] HTTPS enforced on all endpoints

---

## Rollback Plan

### If Issues Arise in Production

**Quick Rollback - Disable Guest Login**:

1. **Frontend Rollback**:
```bash
cd /Users/don/Projects\ 2/GitHub/plixo-web
git revert HEAD
git push origin main
```
- CloudFlare auto-deploys reverted version
- Guest login button removed from UI
- Existing authenticated users unaffected

2. **API Rollback** (if needed):
```bash
cd /Users/don/Projects\ 2/GitHub/plixo-api
git revert HEAD
git push origin main
```
- Guest login endpoint removed
- Regular user login still works

3. **Database Cleanup** (if needed):
```bash
npx wrangler d1 execute plixo-api-db --remote --command="DELETE FROM guest_sessions;"
npx wrangler d1 execute plixo-api-db --remote --command="DELETE FROM guest_rate_limits;"
```

**Partial Rollback - Keep Auth, Disable Guest**:
- Option: Keep changes but disable guest button in UI only
- Edit LoginModal to hide guest login temporarily
- Investigate and fix issues without full rollback

---

## Post-Deployment

### 15. Final Verification

**Success Criteria**:
- [ ] Guest login working on plixo.com
- [ ] Cloudflare Turnstile CAPTCHA functioning correctly
- [ ] Rate limiting enforcing 10 per IP per 24h
- [ ] Sessions expiring after 2 hours
- [ ] No errors in CloudFlare logs
- [ ] Database tables populated with guest sessions
- [ ] Background slideshow smooth on all devices
- [ ] No performance degradation

### 16. Documentation Updates

- [ ] Update DEPLOYMENT_CHECKLIST.md with TURNSTILE_SECRET_KEY added
- [ ] Document production Turnstile site key location
- [ ] Update API_REFERENCE.md with guest login endpoint
- [ ] Note guest role in authentication documentation

### 17. Monitoring Setup

**Set up alerts** (optional but recommended):
- [ ] CloudFlare Alert: High error rate on /api/auth/guest-login
- [ ] CloudFlare Alert: Unusual spike in guest logins
- [ ] CloudFlare Alert: High rate limit rejection rate

### 18. Team Communication

- [ ] Notify team that guest login is live
- [ ] Provide production URL: https://plixo.com
- [ ] Share guest login testing steps
- [ ] Document known limitations (2-hour sessions, 10 per IP)

---

## Validation Complete ✅

**Deployment completed**: ☐ YES ☐ NO
**Production ready**: ☐ YES ☐ NO
**Guest login functional**: ☐ YES ☐ NO
**Issues encountered**: _____________________________________

**Deployed by**: _____________ **Date**: _____________
**Verified by**: _____________ **Date**: _____________

---

## Quick Reference Commands

**Check API health**:
```bash
curl https://api.plixo.com/health
```

**Check guest sessions**:
```bash
npx wrangler d1 execute plixo-api-db --remote --command="SELECT COUNT(*) FROM guest_sessions WHERE expires_at > datetime('now');"
```

**Check rate limits**:
```bash
npx wrangler d1 execute plixo-api-db --remote --command="SELECT * FROM guest_rate_limits ORDER BY last_attempt_at DESC LIMIT 10;"
```

**View recent logs**:
- CloudFlare Dashboard → Workers & Pages → plixo-api → Logs (Real-time)
- CloudFlare Dashboard → Workers & Pages → plixo-web → Logs (Real-time)

---

**Estimated deployment time**: 30-45 minutes
**Critical path**: Database migration → Env vars → Deploy → Test
**Rollback time**: 5-10 minutes
