# Milestone X.X - [Milestone Title]

**Milestone Version:** [Starting version from Task 0, e.g., 1.4.2]
**Date Created:** YYYY-MM-DD
**Date Started:** YYYY-MM-DD (when Task 0 begins)
**Date Completed:** YYYY-MM-DD (when all tasks complete)
**Status:** Planning | In Progress | Complete
**Based on:** [Reference document/issue/request]

[Brief 1-2 sentence description of what this milestone accomplishes]

---

## Version Information

**Versioning Strategy:**
- **v0.x.x** - Development phase (pre-production)
- **v1.x.x** - Production release (current)
- **v2.x.x** - Major version updates

**Task-Level Versioning:**
Each task completion increments the PATCH number (3rd digit) by 1:
- Task 0 complete → 1.4.2
- Task 1 complete → 1.4.3
- Task 2 complete → 1.4.4
- Task 3 complete → 1.4.5
- etc.

This allows immediate deployment to Cloudflare Pages for browser testing after each task.

**Current Versions (at milestone start):**

- **plixo-web:** `[Check package.json in Task 0]`
- **plixo-api:** `[Check package.json in Task 0]`

**Target Versions (after milestone completion):**

- **plixo-web:** `[Starting version + 0.0.N]` (where N = number of tasks)
- **plixo-api:** `[Starting version + 0.0.N]` (where N = number of tasks, if API changes)

**Git Branches:**

- **plixo-web:** `{developer}-MMDDYY-milestone-X-web` (created in Task 0.3)
- **plixo-api:** `{developer}-MMDDYY-milestone-X-api` (created in Task 0.4)

---

## Progress Summary

**Completion:** X of Y tasks complete (Z%)

| Task                                | Priority | Status     | Version    | Deployed |
| ----------------------------------- | -------- | ---------- | ---------- | -------- |
| Task 0: Milestone Initialization    | SETUP    | ⏳ Pending | -          | -        |
| Task 1: [Task Name]                 | HIGH     | ⏳ Pending | [Current+1]| -        |
| Task 2: [Task Name]                 | MEDIUM   | ⏳ Pending | [Current+2]| -        |
| Task 3: [Task Name]                 | LOW      | ⏳ Pending | [Current+3]| -        |

**Status Legend:**

- ⏳ Pending - Not started
- 🚧 In Progress - Currently being worked on
- ✅ Complete - Implementation finished
- 🚀 Deployed - Live in production

---

## Overview

**Objective:** [What this milestone aims to achieve]

**Scope:**

- [Key deliverable 1]
- [Key deliverable 2]
- [Key deliverable 3]

**Priority Breakdown:**

- High: X tasks
- Medium: Y tasks
- Low: Z tasks
- Informational: N tasks

**Estimated Effort:** X hours / Y days / Z weeks
**Actual Progress:** [Track actual time spent]

**Dependencies:**

- Milestone X.X (status: ✅ Complete | 🚧 In Progress | ⏳ Pending)
- [External dependency name] (status)

**Blocks:**

- Milestone Y.Y - [Brief description of what's blocked]

---

## Git Workflow Policy

**CRITICAL: Claude Code must NOT commit or push code to GitHub.**

**Claude Code Responsibilities:**
- ✅ Write and modify code files
- ✅ Run TypeScript compilation to verify changes
- ✅ Run build commands (`npm run build`)
- ✅ Prepare code for review
- ✅ Create feature branches ONLY (git checkout -b, git push -u origin)
- ❌ **DO NOT** run `git add` or `git commit`
- ❌ **DO NOT** run `git push` (except initial branch creation)
- ❌ **DO NOT** create pull requests
- ❌ **DO NOT** run deployment commands

**User Responsibilities:**
- Review code changes in GitHub Desktop
- Create commits with appropriate messages
- Push commits to feature branch
- Create pull requests
- Manage branches and merges
- Deploy to production via Cloudflare Pages

**The ONLY Git Exception:**
Branch creation for milestones is allowed:
- `git checkout -b {developer}-MMDDYY-milestone-X-web` - Create feature branch
- `git push -u origin {developer}-MMDDYY-milestone-X-web` - Push branch to remote

**All other git operations are handled by the user via GitHub Desktop.**

---

## Background (OPTIONAL)

**Note:** This section is optional but recommended for complex milestones. Use it to provide context on the problem being solved and the chosen solution approach.

### The Problem

[Describe the problem or issue this milestone addresses]

**Example:**

- Security vulnerability: [Description]
- Technical debt: [Description]
- Feature gap: [Description]
- User-reported issue: [Description]

### The Solution

[Describe the approach/solution this milestone implements]

**Key Features:**

- ✅ Feature 1
- ✅ Feature 2
- ✅ Feature 3

**Code Examples (if applicable):**

```typescript
// Example of solution approach
// BEFORE
const oldApproach = () => {
  /* old code */
};

// AFTER
const newApproach = () => {
  /* new code */
};
```

---

## Task 0: Milestone Initialization (SETUP PRIORITY)

**Purpose:** Initialize milestone by determining current version and creating feature branches
**Estimated Time:** 5-10 minutes
**Status:** ⏳ Pending
**Dependencies:** None

### Description

Every milestone must start with Task 0 to establish the baseline version numbers. This ensures version tracking is accurate regardless of when the milestone was created vs when it starts.

**Why This Matters:**
- Milestones may be planned weeks before execution
- Other milestones may deploy between planning and execution
- Version numbers change frequently
- We need accurate baseline for +0.0.1 increments per task

### Step 0.1: Determine Current Web Version

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-web
git checkout main
git pull origin main
cat package.json | grep '"version"'
```

**Action:** Record current version from package.json

**Example Output:**
```
"version": "1.4.2"
```

**Update Milestone Document:**
- Current Web Version: `1.4.2`
- Starting Milestone Version: `1.4.2`
- Task versioning: Each task adds +0.0.1 (1.4.2 → 1.4.3 → 1.4.4, etc.)

### Step 0.2: Determine Current API Version

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-api
git checkout main
git pull origin main
cat package.json | grep '"version"'
```

**Action:** Record current version from package.json

**Example Output:**
```
"version": "1.4.0"
```

**Update Milestone Document:**
- Current API Version: `1.4.0`
- Starting Milestone Version: `1.4.1` (if API changes needed) OR `1.4.0` (if no API changes)
- Task versioning: Each API task adds +0.0.1 (e.g., 1.4.1 → 1.4.2 → 1.4.3)

### Step 0.3: Create Web Branch

**Branch Naming Format:** `{developer}-MMDDYY-milestone-X-web`

**Examples:**
- `don-040226-milestone-12-web` (Milestone 12 started April 2, 2026)
- `don-040226-milestone-M0-web` (M0 = CSRF security fix milestone)

**Note:** For security milestones, use milestone number from SECURITY_AUDIT.md (M0, M1, M2, etc.)

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-web
git checkout main
git pull origin main
git checkout -b {developer}-MMDDYY-milestone-X-web
git push -u origin {developer}-MMDDYY-milestone-X-web
```

**Success Criteria:**
- ✅ Branch `{developer}-MMDDYY-milestone-X-web` created from latest main
- ✅ Branch pushed to remote
- ✅ Branch name follows format: {developer}-MMDDYY-milestone-#-web

### Step 0.4: Create API Branch (if needed)

**Note:** Only create if milestone includes API changes

**Branch Naming Format:** `{developer}-MMDDYY-milestone-X-api` (matches web branch pattern)

```bash
cd /Users/don/Projects\ 2/GitHub/plixo-api
git checkout main
git pull origin main
git checkout -b {developer}-MMDDYY-milestone-X-api
git push -u origin {developer}-MMDDYY-milestone-X-api
```

**Success Criteria:**
- ✅ Branch `{developer}-MMDDYY-milestone-X-api` created from latest main
- ✅ Branch pushed to remote
- ✅ Branch name matches web branch pattern (milestone-X-api)

### Step 0.5: Update Milestone Header

Update the milestone document with discovered versions:

```markdown
**Milestone Version:** 1.4.2 (starting version)
**Date Started:** 2026-04-02

## Version Information

**Current Versions (before milestone):**
- **plixo-web:** `1.4.2`
- **plixo-api:** `1.4.0`

**Starting Versions (milestone begins):**
- **plixo-web:** `1.4.2`
- **plixo-api:** `1.4.0` (no changes this milestone)

**Task-Level Versioning:**
Each task increments PATCH number (+0.0.1):
- Task 0 complete → 1.4.2
- Task 1 complete → 1.4.3
- Task 2 complete → 1.4.4
- Task N complete → 1.4.N
```

### Success Criteria

- ✅ Current web version recorded from package.json
- ✅ Current API version recorded from package.json
- ✅ Target versions calculated
- ✅ Milestone version determined
- ✅ Web branch created and pushed
- ✅ API branch created and pushed (if needed)
- ✅ Milestone document header updated
- ✅ Date Started recorded
- ✅ Ready to proceed with Task 1

---

## Task 1: [Task Name] (PRIORITY LEVEL)

**Severity:** HIGH | MEDIUM | LOW | INFO
**Risk:** [Brief description of risk if not completed]
**Estimated Time:** X hours
**Actual Time:** [Fill in when complete]
**Status:** ⏳ Pending | 🚧 In Progress | ✅ Complete | 🚀 Deployed
**Version:** 1.4.3 (version when this task will be deployed)
**Dependencies:**

- Task 0.1, 0.2 (branch setup)
- Task X (if dependent on another task in this milestone)
- Milestone Y.Y - Task Z (if dependent on task in another milestone)

### Description

[Detailed description of what needs to be done and why]

### Affected Files

**plixo-web:**

- `/src/path/to/file1.tsx`
- `/src/path/to/file2.tsx`

**plixo-api:**

- `/functions/path/to/endpoint.ts`
- `/src/lib/path/to/utility.ts`

### Implementation Steps

1. **Step 1 - [Brief description]**:

   ```typescript
   // Code example or command
   ```

2. **Step 2 - [Brief description]**:

   ```typescript
   // Code example or command
   ```

3. **Step 3 - [Brief description]**:
   - Sub-step details
   - More details

### Testing Checklist

**Unit Tests:**

- [ ] Test case 1
- [ ] Test case 2

**Integration Tests:**

- [ ] Integration scenario 1
- [ ] Integration scenario 2

**Manual Testing:**

- [ ] Manual test 1
- [ ] Manual test 2
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test on mobile (responsive design)

**Production Verification (after deployment):**

- [ ] Production check 1
- [ ] Production check 2
- [ ] Monitor error logs for 24 hours

### Success Criteria

- ✅ Criterion 1
- ✅ Criterion 2
- ✅ Criterion 3
- ✅ TypeScript compilation passes (no errors)
- ✅ Build successful (`npm run build`)
- ✅ All tests passing

### Rollback Plan

If this task causes issues:

```bash
# Rollback to previous commit on milestone branch
cd /Users/don/Projects\ 2/GitHub/plixo-[web|api]
git checkout {developer}-MMDDYY-milestone-X-[web|api]
git revert [commit-hash]
git push origin {developer}-MMDDYY-milestone-X-[web|api]
```

---

## Task 2: [Another Task Name] (PRIORITY LEVEL)

[Follow same structure as Task 1]

---

## Testing Strategy

### Test Environments

**Development:**

- Local development servers (Vite dev server + Wrangler)
- Branch: `{developer}-MMDDYY-milestone-X-web`, `{developer}-MMDDYY-milestone-X-api`

**Staging (Cloudflare Pages Preview):**

- URL: Auto-generated preview URL from Cloudflare Pages
- Branch: Milestone feature branch
- Purpose: Test in production-like environment before main merge

**Production:**

- URL: https://plixo.com
- API: https://api.plixo.com (Cloudflare Pages Functions)

### Testing Phases

**Phase 1: Unit Testing**

- Run automated tests: `npm test` (if applicable)
- Coverage threshold: X%
- All tests must pass before moving to integration

**Phase 2: Build Verification**

- Run TypeScript build: `npm run build`
- Verify no TypeScript errors
- Check bundle size (target: < 1MB gzipped)
- Ensure no console errors in build output

**Phase 3: Integration Testing**

- Test interactions between components
- Verify API contract compliance
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile responsiveness testing

**Phase 4: Manual Testing**

- Complete testing checklist for each task
- User acceptance testing (UAT)
- Edge case testing
- Security testing (XSS, CSRF, input validation)

**Phase 5: Production Verification**

- Smoke tests after deployment
- Monitor error logs for 24 hours
- Performance benchmarking (Lighthouse)
- Analytics tracking verification

### Test Data

**Test Accounts:**

- Admin: `admin` / [from .env.development]
- User: `testuser` / [from .env.development]
- Guest: Turnstile CAPTCHA required

**Test Scenarios:**

- [Key scenario 1]
- [Key scenario 2]

---

## Deployment Plan

### Version Progression

This milestone includes X version bumps:

**Version 1.4.2 → 1.4.3** (Tasks 1-2)

- Task 1: [Task name]
- Task 2: [Task name]
- **Deployment Date:** YYYY-MM-DD
- **Branch:** `{developer}-MMDDYY-milestone-X-web`, `{developer}-MMDDYY-milestone-X-api`
- **Deployment Notes:** [Any special considerations]

**Version 1.4.3 → 1.4.4** (Task 3)

- Task 3: [Task name]
- **Deployment Date:** YYYY-MM-DD
- **Branch:** `{developer}-MMDDYY-milestone-X-web`, `{developer}-MMDDYY-milestone-X-api`
- **Deployment Notes:** [Any special considerations]

### Pre-Deployment Checklist

**Code Quality:**

- [ ] All tests passing (if applicable)
- [ ] TypeScript compilation successful (no errors)
- [ ] `npm run build` completes without errors
- [ ] Linting passes (no critical errors)
- [ ] No console.log statements in production code
- [ ] Code review completed

**Version Management:**

- [ ] package.json version updated in both repos
- [ ] Version numbers match deployment plan
- [ ] ARCHITECTURE.md updated (if structural changes)
- [ ] SECURITY_AUDIT.md updated (if security changes)

**Database Changes (if applicable):**

- [ ] Migration scripts tested locally
- [ ] Migration scripts tested on Cloudflare D1
- [ ] Rollback migrations prepared
- [ ] Data backup completed (if destructive changes)

**Documentation:**

- [ ] README.md updated (if needed)
- [ ] ARCHITECTURE.md updated (if structural changes)
- [ ] API documentation updated (if API changes)
- [ ] Milestone tasks marked as complete

**Security:**

- [ ] No secrets in code
- [ ] Environment variables configured in Cloudflare Pages
- [ ] Security headers verified (SECURITY_AUDIT.md M1)
- [ ] CSRF tokens functional (SECURITY_AUDIT.md M0) ⚠️ **CRITICAL**
- [ ] Input validation implemented
- [ ] XSS prevention verified

### Deployment Steps

**Step 1: Merge to Main**

```bash
# Web Repository
cd /Users/don/Projects\ 2/GitHub/plixo-web
git checkout main
git pull origin main
git merge {developer}-MMDDYY-milestone-X-web
git push origin main

# API Repository
cd /Users/don/Projects\ 2/GitHub/plixo-api
git checkout main
git pull origin main
git merge {developer}-MMDDYY-milestone-X-api
git push origin main
```

**Step 2: Tag Release**

```bash
# Web Repository
cd /Users/don/Projects\ 2/GitHub/plixo-web
git tag -a v1.4.3 -m "Milestone X: [Brief description]"
git push origin v1.4.3

# API Repository (if changed)
cd /Users/don/Projects\ 2/GitHub/plixo-api
git tag -a v1.4.1 -m "Milestone X: [Brief description]"
git push origin v1.4.1
```

**Step 3: Deploy**

```bash
# Cloudflare Pages deploys automatically on push to main
# API (Cloudflare Pages Functions) deploys automatically

# Verify deployments
curl https://api.plixo.com/health
# Open https://plixo.com in browser
```

**Step 4: Post-Deployment Verification**

- [ ] API health check passes
- [ ] Web loads without errors
- [ ] 3D spaceship renders correctly
- [ ] Analytics tracking functional
- [ ] Admin console accessible
- [ ] Authentication works (login/logout)
- [ ] Key features functional
- [ ] Monitor error logs for 1 hour
- [ ] No critical errors in production

### Post-Deployment

**Monitoring (first 24 hours):**

- Check Cloudflare Pages logs every 2 hours
- Monitor API response times
- Watch for user-reported issues
- Check analytics for errors/drop-offs

**Cleanup:**

- [ ] Archive milestone branches (optional - keep for reference)
- [ ] Update project tracking system
- [ ] Notify team of successful deployment

---

## Success Metrics

### Quantitative Metrics

- **Code Quality:**
  - Build time: X seconds → Y seconds
  - Bundle size: X MB → Y MB (target: < 1MB gzipped)
  - TypeScript errors: 0 (must maintain)

- **Performance:**
  - Page load time (LCP): X ms → Y ms (target: < 2.5s)
  - First Input Delay (FID): X ms → Y ms (target: < 100ms)
  - Cumulative Layout Shift (CLS): X → Y (target: < 0.1)
  - Lighthouse score: X → Y (target: 90+)

- **Security (if applicable):**
  - Vulnerabilities: X → 0
  - Security headers score: X% → 100%
  - CSRF protection: ❌ → ✅ (M0)

### Qualitative Metrics

- ✅ User feedback: [Expected outcome]
- ✅ Developer experience: [Expected outcome]
- ✅ System stability: [Expected outcome]

### Acceptance Criteria

- ✅ All tasks completed and deployed
- ✅ All tests passing
- ✅ No critical bugs in production
- ✅ Documentation updated
- ✅ Security requirements met (see SECURITY_AUDIT.md)

---

## Rollback Plan

### When to Rollback

Rollback if:

- Critical bug discovered in production
- Security vulnerability introduced
- Data loss or corruption occurs
- System becomes unstable
- Major feature broken
- 3D rendering crashes browser
- Authentication system fails

### Rollback Procedure

**Step 1: Stop Current Deployment**

```bash
# Check Cloudflare Pages dashboard
# Rollback to previous deployment via Cloudflare UI
```

**Step 2: Revert to Previous Release**

**Option A: Revert via Git** (preferred for clean rollback)

```bash
# Web Repository
cd /Users/don/Projects\ 2/GitHub/plixo-web
git checkout main
git revert [merge-commit-hash] --mainline 1
git push origin main

# API Repository
cd /Users/don/Projects\ 2/GitHub/plixo-api
git checkout main
git revert [merge-commit-hash] --mainline 1
git push origin main
```

**Option B: Reset to Previous Tag** (if revert fails)

```bash
# Web Repository
cd /Users/don/Projects\ 2/GitHub/plixo-web
git checkout main
git reset --hard v1.4.2  # Previous version
git push origin main --force

# API Repository
cd /Users/don/Projects\ 2/GitHub/plixo-api
git checkout main
git reset --hard v1.4.0  # Previous version
git push origin main --force
```

**Step 3: Database Rollback (if applicable)**

```bash
# Run rollback migrations if database changes were made
cd /Users/don/Projects\ 2/GitHub/plixo-api
wrangler d1 migrations apply plixo-api-db --local --remote
```

**Step 4: Verify Rollback**

- [ ] Check API health endpoint
- [ ] Verify web loads correctly
- [ ] Test critical user flows
- [ ] Confirm previous version deployed
- [ ] Check Cloudflare Pages deployment logs

**Step 5: Post-Rollback Actions**

1. Notify team of rollback
2. Document issue that caused rollback
3. Create hotfix plan
4. Schedule fix and redeployment

### Rollback Testing

**Test rollback procedure in staging:**

- [ ] Practice revert process
- [ ] Verify database rollback works (if applicable)
- [ ] Confirm Cloudflare Pages deployment reverts correctly

---

## Dependencies

### External Dependencies

**Required Before Starting:**

- ✅ Milestone X.X completed
- ⏳ Third-party service integration
- ⏳ Design assets finalized

**Required During Development:**

- Access to Cloudflare Pages dashboard
- Cloudflare D1 database permissions
- API keys for testing (Turnstile, Analytics)

### Internal Dependencies

**Blocks:**

- Milestone Y.Y cannot start until Task X complete
- Feature Z requires Task Y to be deployed

**Blocked By:**

- Waiting on design assets (Task 1)
- Waiting on API schema changes (Task 3)
- Waiting on SECURITY_AUDIT.md M0 (CSRF fix) ⚠️ **CRITICAL**

---

## Risk Assessment

### High Risk Changes

**[Change Name]:**

- **Risk:** [Description of risk]
- **Impact:** [What breaks if this fails]
- **Mitigation:** [How we reduce risk]
- **Contingency:** [What we do if it fails]

### Medium Risk Changes

**[Change Name]:**

- **Risk:** [Description]
- **Mitigation:** [How to reduce risk]

### Low Risk Changes

**[Change Name]:**

- **Risk:** [Minimal impact]
- **Mitigation:** [Standard testing]

### Risk Mitigation Strategies

1. **Comprehensive Testing:** All changes tested locally before Cloudflare deployment
2. **Gradual Rollout:** Deploy to Cloudflare preview first, monitor, then merge to main
3. **Feature Flags:** Critical features behind flags for quick disable (if applicable)
4. **Monitoring:** Enhanced logging during deployment window
5. **Rollback Ready:** Tested rollback procedure available
6. **Security First:** All SECURITY_AUDIT.md findings addressed before production

---

## Security Considerations

**Reference:** [docs/SECURITY_AUDIT.md](../docs/SECURITY_AUDIT.md)

### Critical Security Requirements

**Before Deploying to Production:**

- [ ] ⚠️ **M0: CSRF Protection Implemented** (CRITICAL - BLOCKING)
- [ ] M1: Security headers configured
- [ ] M2: Token blacklist implemented
- [ ] M3: Token persistence secured
- [ ] M4: Input validation comprehensive

### Security Testing

- [ ] XSS prevention verified (no `dangerouslySetInnerHTML` without sanitization)
- [ ] CSRF tokens functional (M0)
- [ ] SQL injection prevention verified (parameterized queries)
- [ ] Authentication flows tested
- [ ] Authorization checks verified (admin routes protected)
- [ ] Rate limiting functional (guest login)
- [ ] Input validation tested (malicious payloads rejected)

### Security Checklist

- [ ] No secrets committed to git
- [ ] Environment variables configured in Cloudflare
- [ ] HTTPS enforced (Cloudflare handles this)
- [ ] Security headers present (Content-Security-Policy, X-Frame-Options, etc.)
- [ ] Token expiration working (24h TTL)
- [ ] Password hashing verified (bcrypt, 10 rounds)
- [ ] CAPTCHA functional (Cloudflare Turnstile)

---

## Appendix A: Tools & Resources

### Development Tools

- **IDE:** VSCode / Cursor
- **API Testing:** Postman / curl / `test-*.sh` scripts
- **Database:** Cloudflare D1 (SQLite)
- **Build Tool:** Vite 7.1.7

### Testing Tools

- **TypeScript:** `npm run build` (tsc -b)
- **Linting:** `npm run lint` (ESLint)
- **Performance:** Lighthouse, Chrome DevTools
- **Security:** npm audit, SECURITY_AUDIT.md checklists

### Deployment Tools

- **Web:** Cloudflare Pages (auto-deploy from main branch)
- **API:** Cloudflare Pages Functions (auto-deploy from main branch)
- **Database:** Wrangler CLI (D1 migrations)

### Documentation

- **Project Docs:** [ARCHITECTURE.md](../ARCHITECTURE.md), [docs/SECURITY_AUDIT.md](../docs/SECURITY_AUDIT.md)
- **API Docs:** plixo-api repository
- **Design Docs:** [Link to Figma/design files if applicable]

### Monitoring & Debugging

- **Logs:** Cloudflare Pages dashboard
- **Error Tracking:** Browser console / server logs
- **Performance:** Lighthouse / Chrome DevTools
- **Analytics:** Insights page (`/insights`)

---

## Appendix B: Checklist for New Milestones

When creating a new milestone using this template:

**Setup:**

- [ ] Copy MilestoneTemplate.md to MilestoneX.X.md
- [ ] Update milestone number and title
- [ ] Fill in current version numbers from package.json
- [ ] Calculate target version numbers
- [ ] Set branch names ({developer}-MMDDYY-milestone-X-web, {developer}-MMDDYY-milestone-X-api)

**Planning:**

- [ ] Define objective and scope
- [ ] List all tasks with priorities
- [ ] Estimate effort for each task
- [ ] Identify dependencies
- [ ] Assess risks
- [ ] Review SECURITY_AUDIT.md for security requirements
- [ ] Plan version bumps (which tasks → which version)

**Execution:**

- [ ] Complete Task 0 (branch setup) - complete first
- [ ] Complete tasks in order
- [ ] Update progress summary as tasks complete
- [ ] Mark testing checkboxes as tests pass
- [ ] Document actual time spent
- [ ] Run `npm run build` after each task

**Completion:**

- [ ] All tasks complete and tested
- [ ] All version bumps completed
- [ ] Deployment successful
- [ ] Post-deployment verification passed
- [ ] ARCHITECTURE.md updated (if structural changes)
- [ ] SECURITY_AUDIT.md updated (if security changes)
- [ ] Milestone marked as Complete

---

## Appendix C: Version Numbering

**Semantic Versioning:** `MAJOR.MINOR.PATCH`

- **MAJOR (1):** Breaking changes, major releases
- **MINOR (4):** New features, backward compatible
- **PATCH (2+):** Bug fixes, small updates, incremental changes

**Version Bump Guidelines:**

- **PATCH increment (+0.0.1):** Each task completion (allows immediate Cloudflare deployment for testing)
- **MINOR increment (+0.1.0):** New milestone starts (resets PATCH to 0) OR major feature
- **MAJOR increment (+1.0.0):** Breaking changes or major release

**Example Progression Within a Milestone:**

- 1.4.2 → 1.4.3 (Task 1 complete, deployed to Cloudflare)
- 1.4.3 → 1.4.4 (Task 2 complete, deployed to Cloudflare)
- 1.4.4 → 1.4.5 (Task 3 complete, deployed to Cloudflare)

**Example Progression Between Milestones:**

- 1.4.N (Milestone 11 final) → 1.5.0 (Milestone 12 starts)
- 1.5.N (Milestone 12 final) → 1.6.0 (Milestone 13 starts)

---

## Appendix D: Plixo-Specific Patterns (OPTIONAL)

**Note:** This section is optional and project-specific. Use it to document common patterns, migration guides, or code examples relevant to this milestone.

### Pattern Example Template

**Pattern Name:**

```typescript
// BEFORE
const oldPattern = () => {
  // Old implementation
};

// AFTER
const newPattern = () => {
  // New implementation
};
```

**Key Changes:**

1. Change 1 description
2. Change 2 description
3. Change 3 description

**Usage Notes:**

- When to use this pattern
- Edge cases to consider
- Related patterns or alternatives

### Plixo-Specific Patterns

**API Client Pattern (Native Fetch):**
```typescript
// Use apiClient for all API calls
import { apiClient } from '@/services/api'

const { data } = await apiClient.get<ResponseType>('/endpoint')
```

**Component Structure (Atomic Design):**
```
atoms/ → molecules/ → organisms/ → pages/
Button → LoginForm → SpaceshipCanvas → Landing
```

**3D Component Pattern:**
```typescript
// Lazy load Three.js components
const SpaceshipCanvas = lazy(() =>
  import('./components/organisms/SpaceshipCanvas').then(m => ({
    default: m.SpaceshipCanvas
  }))
)
```

---

**End of Milestone X.X Specification**
