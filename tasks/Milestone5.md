# Milestone 5: Guest Login with Cloudflare Turnstile

> **Status**: 🚧 IN PROGRESS
> **Started**: 2025-11-02
> **Target Completion**: 2025-11-03 (ASAP - Resume distribution active)
> **Priority**: 🔴 CRITICAL
> **Dependencies**: Milestone 0 (Production Deployment) complete
> **Blocks**: Resume distribution with secure portfolio access

---

## Goal

Implement secure guest login functionality using Cloudflare Turnstile CAPTCHA to allow visitors to access portfolio content without requiring account creation, while maintaining protection against bot access and abuse.

**Why This Matters**: Portfolio link (plixo.com) is being distributed with resumes. Need to balance accessibility (no barriers to recruiters/employers) with security (protect contact information from bots/scrapers). Guest login with CAPTCHA verification provides human verification without friction of account creation.

**Business Context**: Resume distribution is starting immediately. This is a critical security feature that must be deployed ASAP to protect contact information while maintaining professional accessibility.

---

## Success Criteria

- ✅ Guest login button added to authentication modal
- ✅ Cloudflare Turnstile widget integrated and functional
- ✅ Backend `/api/guest-login` endpoint with CAPTCHA verification
- ✅ IP-based rate limiting (10 guest logins per IP per 24 hours)
- ✅ Guest sessions tracked in database with 2-hour expiration
- ✅ Short-lived JWT tokens issued for guest role
- ✅ AuthContext updated to handle guest role and session expiration
- ✅ End-to-end guest login flow tested and working
- ✅ Deployed to production at plixo.com
- ✅ Turnstile verified working on production domain

---

## Architecture Overview

### Frontend Flow
```
User clicks "Continue as Guest"
  → Turnstile widget appears
  → User completes CAPTCHA
  → Frontend receives turnstile token
  → POST /api/guest-login with token
  → Receive JWT with role: 'guest', expires: 2h
  → Store in AuthContext
  → Navigate to portfolio content
```

### Backend Flow
```
POST /api/guest-login { captchaToken }
  → Verify token with Cloudflare API
  → Check IP rate limit (10/24h)
  → Create guest session in database
  → Generate JWT (2 hour expiration)
  → Return { token, expiresAt, role: 'guest' }
```

### Security Layers
1. **CAPTCHA Verification**: Cloudflare Turnstile behavioral analysis
2. **Rate Limiting**: 10 guest logins per IP per 24 hours
3. **Session Expiration**: 2-hour guest sessions (vs 30 days for authenticated)
4. **Database Tracking**: All guest sessions logged with IP and timestamp
5. **Token Rotation**: Short-lived JWTs force re-verification

---

## Tasks

### 5.1 Frontend - Cloudflare Turnstile Integration

**Effort**: ⏱️ S (1-2 hours)
**Priority**: 🔴 CRITICAL

#### Integration Tasks

- [x] **Install Cloudflare Turnstile SDK**
  ```bash
  npm install @marsidev/react-turnstile
  ```

- [ ] **Get Turnstile credentials from Cloudflare dashboard**
  - Navigate to Tenebrae Turnstile configuration
  - Verify `plixo.com` is in allowed domains
  - Copy Site Key (public, for frontend)
  - Copy Secret Key (private, for backend API)

- [ ] **Add environment variables**
  - Frontend (.env.development, .env.production):
    ```
    VITE_TURNSTILE_SITE_KEY=0x4AAA...
    ```
  - Backend (plixo-api .dev.vars, CloudFlare env):
    ```
    TURNSTILE_SECRET_KEY=0x4BBB...
    ```

- [ ] **Create Turnstile widget component**
  - Path: `src/components/atoms/TurnstileWidget.tsx`
  - Wrap @marsidev/react-turnstile with error handling
  - Emit token on success via callback
  - Handle widget reset on errors

- [ ] **Update LoginModal with guest login button**
  - Add "Continue as Guest" button below password field
  - Show Turnstile widget when guest login clicked
  - Handle CAPTCHA completion → call guest login API
  - Show loading state during verification
  - Display error messages for failures

**Acceptance Criteria**:
- ✅ Turnstile widget renders without errors
- ✅ CAPTCHA can be completed by human users
- ✅ Token passed to backend on successful completion
- ✅ Error handling covers network failures and invalid tokens
- ✅ Loading states provide clear user feedback

**Files Changed**:
- `package.json` - Add turnstile dependency
- `.env.development` - Add VITE_TURNSTILE_SITE_KEY
- `src/components/atoms/TurnstileWidget.tsx` - New component
- `src/components/molecules/LoginModal.tsx` - Add guest login UI
- `src/components/atoms/index.ts` - Export TurnstileWidget

---

### 5.2 Backend - Guest Login API Endpoint

**Effort**: ⏱️ M (2-3 hours)
**Priority**: 🔴 CRITICAL
**Repository**: plixo-api

#### Backend Tasks

- [ ] **Create guest_sessions table**
  ```sql
  CREATE TABLE guest_sessions (
    id TEXT PRIMARY KEY,
    session_token TEXT UNIQUE NOT NULL,
    ip_address TEXT NOT NULL,
    captcha_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_accessed TIMESTAMP
  );

  CREATE INDEX idx_guest_expires ON guest_sessions(expires_at);
  CREATE INDEX idx_guest_ip ON guest_sessions(ip_address);
  ```

- [ ] **Create rate_limits table**
  ```sql
  CREATE TABLE guest_rate_limits (
    ip_address TEXT NOT NULL,
    attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (ip_address, attempt_time)
  );

  CREATE INDEX idx_rate_ip_time ON guest_rate_limits(ip_address, attempt_time);
  ```

- [ ] **Implement Turnstile verification function**
  - Path: `src/utils/turnstile.ts`
  - Verify token with Cloudflare API
  - Handle verification failures gracefully
  - Return boolean + error message

- [ ] **Implement rate limiting function**
  - Path: `src/utils/rateLimit.ts`
  - Check IP against guest_rate_limits table
  - Count attempts in last 24 hours
  - Return boolean + remaining attempts

- [ ] **Create /api/guest-login endpoint**
  - Path: `src/routes/auth.ts`
  - Accept POST with { captchaToken }
  - Verify captcha with Cloudflare
  - Check rate limit (10/24h)
  - Create guest session (expires 2h)
  - Generate JWT with role: 'guest'
  - Return { token, expiresAt, role }

- [ ] **Add cleanup cron job**
  - Delete expired guest sessions daily
  - Clear old rate limit entries (> 24h)

**Acceptance Criteria**:
- ✅ Database tables created successfully
- ✅ Turnstile verification working correctly
- ✅ Rate limiting enforced (10 per IP per 24h)
- ✅ Guest sessions expire after 2 hours
- ✅ JWT tokens contain correct role and expiration
- ✅ Error responses provide clear feedback

**Files Changed**:
- `migrations/XXX_create_guest_auth.sql` - New migration
- `src/utils/turnstile.ts` - New utility
- `src/utils/rateLimit.ts` - New utility
- `src/routes/auth.ts` - Add guest login endpoint
- `wrangler.toml` - Add cron trigger for cleanup

---

### 5.3 Frontend - AuthContext Guest Support

**Effort**: ⏱️ S (1-2 hours)
**Priority**: 🔴 CRITICAL

#### AuthContext Tasks

- [ ] **Update user interface to include guest role**
  ```typescript
  interface User {
    id: string | null
    username: string | null
    role: 'admin' | 'user' | 'guest'
    isGuest: boolean
    expiresAt?: string
  }
  ```

- [ ] **Add guest login action**
  - Call `/api/guest-login` with captcha token
  - Store JWT token in localStorage
  - Set user state with role: 'guest'
  - Track expiration time

- [ ] **Implement session expiration handling**
  - Check token expiration on mount
  - Auto-logout when guest session expires
  - Show modal: "Session expired, please verify again"
  - Clear expired tokens from storage

- [ ] **Update protected route logic**
  - Allow guest role to access portfolio pages
  - Restrict admin-only features from guests
  - Show appropriate UI for guest users

**Acceptance Criteria**:
- ✅ Guest users can log in via CAPTCHA
- ✅ Guest session tracked with expiration
- ✅ Auto-logout when session expires
- ✅ Protected routes allow guest access
- ✅ Admin features hidden from guests

**Files Changed**:
- `src/contexts/AuthContext.tsx` - Update for guest support
- `src/services/api.ts` - Add guestLogin function
- `src/components/ProtectedRoute.tsx` - Allow guest role

---

### 5.4 Testing & Validation

**Effort**: ⏱️ S (1-2 hours)
**Priority**: 🟡 HIGH

#### Testing Tasks

- [ ] **End-to-end guest login flow**
  - Open site in incognito window
  - Click "Continue as Guest"
  - Complete Turnstile CAPTCHA
  - Verify access granted to portfolio
  - Verify contact info visible/accessible
  - Wait 2 hours, verify session expires

- [ ] **Rate limiting validation**
  - Attempt 11 guest logins from same IP
  - Verify 11th attempt blocked
  - Wait 24 hours or clear DB
  - Verify rate limit reset

- [ ] **CAPTCHA verification testing**
  - Test with valid CAPTCHA token
  - Test with invalid/expired token
  - Test with missing token
  - Verify appropriate error messages

- [ ] **Cross-browser testing**
  - Chrome (desktop + mobile)
  - Safari (desktop + iOS)
  - Firefox
  - Edge

- [ ] **Mobile responsive testing**
  - Turnstile widget displays correctly
  - Login modal responsive
  - Error messages readable

**Acceptance Criteria**:
- ✅ Guest login works in all major browsers
- ✅ Rate limiting enforced correctly
- ✅ CAPTCHA required for all guest logins
- ✅ Sessions expire after 2 hours
- ✅ Error handling covers all edge cases

---

### 5.5 Production Deployment

**Effort**: ⏱️ XS (30-60 minutes)
**Priority**: 🔴 CRITICAL

#### Deployment Tasks

- [ ] **Deploy plixo-api with guest login**
  1. Run migrations to create tables
  2. Set TURNSTILE_SECRET_KEY environment variable
  3. Deploy to CloudFlare Pages Functions
  4. Verify /api/guest-login endpoint live

- [ ] **Deploy plixo-web with guest login UI**
  1. Set VITE_TURNSTILE_SITE_KEY environment variable
  2. Build and deploy to CloudFlare Pages
  3. Verify guest login button appears
  4. Test Turnstile widget loads correctly

- [ ] **Verify production domain whitelisting**
  - Check plixo.com in Turnstile allowed domains
  - Test CAPTCHA on production domain
  - Verify no CORS errors

- [ ] **Monitor first production guest logins**
  - Watch CloudFlare logs for errors
  - Check database for guest_sessions creation
  - Verify rate limiting working
  - Test session expiration

**Acceptance Criteria**:
- ✅ Guest login fully functional on plixo.com
- ✅ Turnstile CAPTCHA working on production domain
- ✅ Database tables created and accessible
- ✅ Rate limiting enforced in production
- ✅ No console errors or API failures

---

## Technical Decisions

### Why Cloudflare Turnstile?
- Already configured for tenebrae.ai with plixo.com whitelisted
- Better UX than reCAPTCHA (less intrusive)
- Free tier includes unlimited verifications
- Behavioral analysis reduces false positives
- Integration with CloudFlare ecosystem

### Why 2-Hour Guest Sessions?
- Long enough for portfolio review (30-45 min typical)
- Short enough to prevent token sharing
- Forces re-verification if returning later
- Reduces abuse potential vs longer sessions

### Why 10 Attempts Per IP Per 24h?
- Allows legitimate users multiple retries
- Prevents mass bot access attempts
- Accounts for shared office IPs
- Can be adjusted based on usage patterns

### Why JWT Over Session Cookies?
- Stateless authentication easier with CloudFlare Workers
- No session storage infrastructure needed
- Token contains role and expiration
- Compatible with future mobile app if needed

---

## Security Considerations

### Turnstile Bypass Protection
- Token is one-time use and expires quickly
- Server-side verification required (can't fake)
- Rate limiting prevents brute force attempts
- IP tracking enables abuse monitoring

### Contact Information Protection
- Guest access required (no anonymous viewing)
- CAPTCHA ensures human verification
- Rate limiting prevents scraping
- Session logs enable abuse investigation

### Token Security
- Short expiration (2 hours)
- Stored in localStorage (auto-cleared on logout)
- Role-based access control
- No sensitive data in JWT payload

---

## Rollback Plan

If issues discovered in production:

1. **Quick Rollback**
   - Remove guest login button from UI
   - Deploy previous version of plixo-web
   - Disable /api/guest-login endpoint

2. **Partial Rollback**
   - Keep authenticated login working
   - Disable only guest access
   - Investigate and fix issues

3. **Database Cleanup**
   ```sql
   -- Clear guest sessions if needed
   DELETE FROM guest_sessions;
   DELETE FROM guest_rate_limits;
   ```

---

## Post-Deployment Monitoring

### Metrics to Track
- Guest login success rate
- Average session duration
- Rate limit hit frequency
- Turnstile failure rate
- Session expiration patterns

### CloudFlare Logs to Monitor
- `/api/guest-login` error rate
- Turnstile verification failures
- Rate limit rejections
- Guest session creation rate

### Database Queries
```sql
-- Active guest sessions
SELECT COUNT(*) FROM guest_sessions
WHERE expires_at > datetime('now');

-- Rate limit hits today
SELECT ip_address, COUNT(*) as attempts
FROM guest_rate_limits
WHERE attempt_time > datetime('now', '-24 hours')
GROUP BY ip_address
HAVING attempts >= 10;

-- Session duration analysis
SELECT
  AVG((julianday(last_accessed) - julianday(created_at)) * 24) as avg_hours
FROM guest_sessions
WHERE last_accessed IS NOT NULL;
```

---

## Future Enhancements (Not in Scope)

- Magic link guest access via email
- OAuth guest login (Google, GitHub)
- Progressive trust (longer sessions for returning guests)
- Analytics dashboard for guest usage patterns
- Honeypot fields in contact form
- Advanced bot detection (mouse movement, typing patterns)

---

## Related Documentation

- **Tenebrae Turnstile Integration**: `../tenebrae-api-cloudflare/src/utils/turnstile.ts`
- **Tenebrae Contact Form**: `../tenebraeV2/src/components/ContactView.tsx`
- **CloudFlare Turnstile Docs**: https://developers.cloudflare.com/turnstile/
- **JWT Best Practices**: https://datatracker.ietf.org/doc/html/rfc8725

---

## Milestone Completion Checklist

- [ ] All 5 task groups complete (5.1 - 5.5)
- [ ] Guest login functional in production
- [ ] CAPTCHA verification working correctly
- [ ] Rate limiting enforced
- [ ] Sessions expire after 2 hours
- [ ] Error handling comprehensive
- [ ] Cross-browser testing passed
- [ ] Mobile responsive verified
- [ ] Production monitoring configured
- [ ] Documentation updated
- [ ] Team notified of deployment
- [ ] Resume distribution can proceed safely ✅

---

**Estimated Total Time**: 6-10 hours
**Target Completion**: 2025-11-03 (Within 24 hours)
**Urgency**: CRITICAL - Resume distribution active
