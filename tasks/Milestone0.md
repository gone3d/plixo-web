# Milestone 0: Production Deployment

> **Status**: 🚧 IN PROGRESS
> **Duration**: 1-2 hours
> **Priority**: CRITICAL
> **Dependencies**: Milestone 1 (Foundation) complete
> **Blocks**: All API integration and advanced features

---

## Goal

Deploy plixo-web to CloudFlare Pages with automatic GitHub deployment pipeline and live at plixo.com.

**Why This Matters**: Gets the portfolio live and accessible, enables automatic deployments on every commit to main, and establishes production environment for future API integration.

---

## Success Criteria

- ✅ GitHub repository connected to CloudFlare Pages
- ✅ Automatic deployment triggered on push to `main` branch
- ✅ Live site accessible at https://plixo.com
- ✅ All 5 pages working correctly in production
- ✅ Responsive design functional across devices
- ✅ Background slideshow performing smoothly
- ✅ Interactive project cards working
- ✅ Version number displaying correctly (v1.0.3)
- ✅ Preview deployments available for pull requests

---

## Tasks

### 0.1 Pre-Deployment Verification

**Effort**: ⏱️ XS (15-30 minutes)
**Priority**: 🔴 CRITICAL

#### Verification Tasks

- [ ] **Test all pages locally**
  - Landing page with version display
  - Work page with project cards and SlideInImage
  - About page with tech stack and GitHub link
  - Insights page with API awaiting message
  - Connect page with messaging offline notice

- [ ] **Verify build succeeds**
  ```bash
  npm run build
  # Should complete without errors
  # Bundle: ~100KB gzipped
  ```

- [ ] **Check critical files**
  - `public/_redirects` exists (for SPA routing)
  - `public/g3dlogo.svg` exists (favicon)
  - All background images in `public/assets/`

**Acceptance Criteria**:
- ✅ All pages render correctly
- ✅ No console errors
- ✅ Build completes successfully
- ✅ All assets present

---

### 0.2 CloudFlare Pages Setup

**Effort**: ⏱️ S (30-45 minutes)
**Priority**: 🔴 CRITICAL

#### Setup Tasks

- [ ] **Connect GitHub repository**
  1. Login to CloudFlare Dashboard
  2. Navigate to Workers & Pages → plixo-web project
  3. Go to Settings → Builds & deployments
  4. Click "Connect to Git"
  5. Authorize GitHub access (gone3d account)
  6. Select repository: `gone3d/plixo-web`

- [ ] **Configure build settings**
  - Production branch: `main`
  - Build command: `npm run build`
  - Build output directory: `dist`
  - Node version: 18 or later

- [ ] **Set environment variables** (none required yet)
  - API_URL will be added when api.plixo.com is ready

- [ ] **Save and deploy**
  - Click "Save and Deploy"
  - Watch first deployment complete
  - Verify deployment succeeds

**Acceptance Criteria**:
- ✅ GitHub connection established
- ✅ First deployment completes successfully
- ✅ Site accessible at cloudflare.pages.dev URL

---

### 0.3 Domain Configuration

**Effort**: ⏱️ S (15-30 minutes)
**Priority**: 🔴 CRITICAL

#### Domain Tasks

- [ ] **Transfer plixo.com domain**
  1. Go to old plixo-landing project settings
  2. Remove plixo.com custom domain
  3. Go to new plixo-web project settings
  4. Add custom domain: plixo.com
  5. Wait for SSL certificate provisioning (2-5 minutes)

- [ ] **Transfer www.plixo.com domain**
  1. Remove www.plixo.com from old project
  2. Add www.plixo.com to new project
  3. Verify SSL certificate provisioned

- [ ] **Verify both domains work**
  - Test https://plixo.com
  - Test https://www.plixo.com
  - Verify SSL certificates valid
  - Check redirects working

**Acceptance Criteria**:
- ✅ plixo.com points to new deployment
- ✅ www.plixo.com points to new deployment
- ✅ HTTPS working for both domains
- ✅ No certificate warnings

---

### 0.4 Production Testing

**Effort**: ⏱️ S (30-45 minutes)
**Priority**: 🟡 HIGH

#### Testing Tasks

- [ ] **Functional testing**
  - Navigate all 5 pages
  - Test mobile responsive design
  - Verify background slideshow transitions
  - Test project card hover states
  - Click SlideInImage previews
  - Test navigation menu (desktop + mobile)
  - Verify all external links work

- [ ] **Performance testing**
  - Run Lighthouse audit
  - Check Core Web Vitals
  - Verify load time < 3 seconds
  - Test on slow 3G connection
  - Check bundle size in production

- [ ] **Cross-browser testing**
  - Chrome/Arc
  - Safari
  - Firefox
  - Edge (if available)

**Acceptance Criteria**:
- ✅ All features working in production
- ✅ Lighthouse score > 90
- ✅ No console errors
- ✅ Responsive design working on mobile/tablet/desktop

---

### 0.5 Cleanup & Documentation

**Effort**: ⏱️ XS (15 minutes)
**Priority**: 🟢 MEDIUM

#### Cleanup Tasks

- [ ] **Commit final changes**
  ```bash
  git add .
  git commit -m "Production deployment v1.0.3 - Updated favicon and build"
  git push origin main
  ```

- [ ] **Delete old plixo-landing project**
  - Verify new deployment working for 24 hours
  - Confirm both domains pointing to new project
  - Delete old plixo-landing CloudFlare project

- [ ] **Update DEPLOYMENT.md**
  - Document actual deployment process
  - Add troubleshooting notes
  - Update with final URLs

**Acceptance Criteria**:
- ✅ Changes committed and pushed
- ✅ Old project safely deleted
- ✅ Documentation updated

---

## Post-Deployment Workflow

**Standard Development Process**:

```bash
# 1. Create feature branch
git checkout -b feature/new-updates

# 2. Make changes and commit
git add .
git commit -m "Update: description of changes"

# 3. Push and create PR
git push origin feature/new-updates

# 4. CloudFlare creates preview deployment
# Preview URL: https://abc123.plixo-web.pages.dev

# 5. Review preview, test changes

# 6. Merge PR to main
# Automatic production deployment to plixo.com

# 7. Wait 2-3 minutes for deployment
# New version live at https://plixo.com
```

---

## Blockers & Dependencies

### Completed Dependencies
- ✅ Milestone 1 (Foundation) - All pages, components, routing complete
- ✅ Build system working and optimized
- ✅ Content finalized and professional
- ✅ Background slideshow system implemented

### Current Blockers
- None - ready to deploy

### Risks
- **Low Risk**: Deployment process is straightforward
- **Mitigation**: Can revert to old plixo-landing if issues arise

---

## Timeline

| Task | Duration | Status |
|------|----------|--------|
| 0.1 Pre-Deployment Verification | 15-30 min | ⏳ Pending |
| 0.2 CloudFlare Pages Setup | 30-45 min | ⏳ Pending |
| 0.3 Domain Configuration | 15-30 min | ⏳ Pending |
| 0.4 Production Testing | 30-45 min | ⏳ Pending |
| 0.5 Cleanup & Documentation | 15 min | ⏳ Pending |

**Total Estimated Time**: 1.75 - 2.75 hours

---

## Notes

- CloudFlare Pages provides automatic HTTPS certificates
- Preview deployments available for all pull requests
- Can rollback to previous deployment from CloudFlare dashboard
- Production builds are cached for fast rebuilds
- No downtime during deployments (atomic deploys)

---

**Next Milestone**: Milestone 2 - API/Backend Foundation (plixo-api repository)
