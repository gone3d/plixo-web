# Plixo Portfolio - CloudFlare Pages Deployment Guide

## Overview

Deploy the Plixo Portfolio frontend to CloudFlare Pages using Wrangler CLI, following the proven workflow from tenebraeV2 deployment.

**Benefits:**
- ✅ Free hosting with unlimited bandwidth
- ✅ Automatic HTTPS and global CDN
- ✅ SPA routing handled automatically with React Router
- ✅ Easy redeployments with single command
- ✅ Custom domain support (plixo.com)
- ✅ No server configuration needed
- ✅ Automatic SSL certificate provisioning

---

## Prerequisites

- ✅ CloudFlare account (free tier works - same account as Tenebrae)
- ✅ Wrangler CLI available via npm (installed as project devDependency)
- ✅ Production build verified (`npm run build` working)
- ✅ Domain registered: plixo.com
- ✅ **Existing CloudFlare Pages project**: `plixo-landing` (holding page currently deployed)

---

## Deployment Strategy: Connect GitHub Repository to Existing Project

**You already have `plixo-landing` Pages project with plixo.com configured!**

### **Recommended: Connect GitHub Repository** (Auto-deploy on merge to main)

**This is the best approach for your workflow because:**
- ✅ **Automatic deployments** when merging to `main` branch
- ✅ **Preview deployments** for pull requests (test before merging)
- ✅ **Full git history** visible in CloudFlare dashboard
- ✅ **No manual deployment** needed after setup
- ✅ **Keeps existing domain and SSL** - everything stays configured

**You can connect a GitHub repo to your existing `plixo-landing` project without deleting anything!**

---

## Connect GitHub Repository to Existing CloudFlare Pages Project

### Step 1: Access CloudFlare Pages Settings

1. Login to CloudFlare dashboard: https://dash.cloudflare.com
2. Navigate to **Workers & Pages** → **Overview**
3. Click on your **plixo-landing** project
4. Go to **Settings** tab
5. Scroll to **Build & deployments** section

### Step 2: Connect to Git

1. Look for **"Connect to Git"** or **"Source"** section
2. Click **"Connect to Git"** button
3. Select **GitHub** as your Git provider
4. Click **"Connect GitHub"**

### Step 3: Authorize GitHub Access

1. CloudFlare will open GitHub authorization page
2. Choose **"gone3d"** GitHub account (your account)
3. Select repository access:
   - **Option A**: Grant access to all repositories
   - **Option B**: Select only `plixo-web` repository (recommended)
4. Click **"Install & Authorize"**

### Step 4: Select Repository and Configure Build

**Repository Selection:**
- **GitHub account**: `gone3d`
- **Repository**: `plixo-web`
- **Production branch**: `main`

**Build Configuration:**
```
Build command: npm run build
Build output directory: dist
Root directory: / (leave blank)
Node.js version: 18 (or latest)
```

**Environment Variables** (leave empty for now):
- No environment variables needed yet
- Will add `VITE_API_URL` later when plixo-api is ready

### Step 5: Save and Deploy

1. Click **"Save and Deploy"**
2. CloudFlare will immediately trigger first build from GitHub
3. Watch the build logs in real-time

**Expected build output:**
```
Cloning repository...
Installing dependencies... (npm install)
Running build command... (npm run build)
Build completed successfully!
Deploying to CloudFlare Pages...
✅ Deployment successful!
```

### Step 6: Verify Automatic Deployment Works

**Test the automatic deployment:**

```bash
# 1. Make a small change to your code
echo "# Test auto-deploy" >> README.md

# 2. Commit and push to main
git add README.md
git commit -m "Test: Verify automatic CloudFlare deployment"
git push origin main

# 3. Watch CloudFlare dashboard
# Go to: Pages → plixo-landing → Deployments
# You should see a new build triggered automatically
```

**Wait 2-3 minutes for build to complete, then test:**
```bash
open https://plixo.com
```

---

## How Automatic Deployment Works

### On Merge to Main Branch

```
1. You merge PR to main (or push directly to main)
   ↓
2. GitHub webhook notifies CloudFlare
   ↓
3. CloudFlare automatically:
   - Clones latest code from main branch
   - Runs: npm install
   - Runs: npm run build
   - Deploys dist/ to CloudFlare Pages
   ↓
4. New version live at plixo.com (2-3 minutes)
```

### Preview Deployments (Pull Requests)

When you open a PR, CloudFlare automatically creates a **preview deployment**:

```
1. Open PR from feature branch → main
   ↓
2. CloudFlare builds the PR branch
   ↓
3. Creates unique preview URL:
   https://abc123.plixo-landing.pages.dev
   ↓
4. You test the preview before merging
   ↓
5. Merge PR → production deployment to plixo.com
```

**View preview deployments:**
- Go to CloudFlare Pages → plixo-landing → Deployments
- Look for deployments tagged with PR number
- Click to get preview URL

---

## Alternative: Direct Upload (For Manual Control)

If you prefer manual deployments (not recommended for your workflow):

**Workflow:**
```bash
npm run build
npx wrangler pages deploy dist --project-name=plixo-landing
```

**Note:** Once you connect Git, direct uploads are disabled. You can disconnect Git later if you want to switch back to manual uploads.

---

## Post-Connection: Verify Production Deployment

After connecting GitHub and completing the first automatic deployment:

### Test All Pages

Visit your live site and verify all features work:

```bash
# Test production site
open https://plixo.com
open https://plixo.com/work
open https://plixo.com/about
open https://plixo.com/insights
open https://plixo.com/connect
```

**Verify:**
- ✅ Landing page loads correctly
- ✅ Navigation between all 5 pages works smoothly
- ✅ Background slideshow animates at 60fps
- ✅ Project cards display with SlideInImage functionality
- ✅ Responsive design works on mobile/tablet/desktop
- ✅ No 404 errors on page refresh (SPA routing)
- ✅ HTTPS enabled with valid SSL certificate

### Check CloudFlare Deployment Dashboard

1. Go to CloudFlare Pages → plixo-landing → **Deployments** tab
2. See your deployment from the `main` branch
3. View build logs and deployment URL
4. Verify custom domain (plixo.com) is active

---

## Custom Domain Verification (Already Configured)

**plixo.com is already configured on your `plixo-landing` project!**

After deployment, verify the domain is working correctly:

```bash
# Test HTTPS
curl -I https://plixo.com

# Verify all pages
open https://plixo.com
open https://plixo.com/work
open https://plixo.com/about
open https://plixo.com/insights
open https://plixo.com/connect
```

**Verify:**
- ✅ HTTPS enabled (SSL certificate working)
- ✅ All pages load correctly
- ✅ No mixed content warnings
- ✅ React Router navigation works
- ✅ Page refresh doesn't cause 404 errors

### Optional: Add www Subdomain

If you want `www.plixo.com` to also work:

1. Go to CloudFlare dashboard → Pages → `plixo-landing` → Custom domains
2. Click "Set up a custom domain"
3. Enter: `www.plixo.com`
4. CloudFlare automatically redirects `www` → `plixo.com`

### If You Created a New Project Instead

If you used a new project name (like `plixo-portfolio`), transfer the domain:

1. **Remove from old project:**
   - Pages → `plixo-landing` → Custom domains
   - Click ⋮ next to plixo.com → Remove

2. **Add to new project:**
   - Pages → `plixo-portfolio` → Custom domains
   - Click "Set up a custom domain"
   - Enter: `plixo.com`
   - SSL auto-provisions (2-5 minutes)

---

## Redeployment Process

### Quick Redeployment (After Code Changes)

```bash
# 1. Build latest changes
npm run build

# 2. Deploy to CloudFlare Pages
npx wrangler pages deploy dist --project-name=plixo-landing --branch=main
```

**That's it!** New deployment URL generated, plixo.com automatically updated with new version.

### Rollback to Previous Deployment

1. Go to CloudFlare Pages dashboard
2. Navigate to **plixo-landing** project
3. Click **Deployments** tab
4. Find previous successful deployment
5. Click **⋮** (three dots) → **Rollback to this deployment**

---

## Environment Variables (Future API Integration)

When connecting to plixo-api backend:

### Step 1: Add Environment Variables

```bash
# Via Wrangler CLI
npx wrangler pages secret put VITE_API_URL

# Or via CloudFlare Dashboard:
# Pages → plixo-portfolio → Settings → Environment variables
```

### Step 2: Create Environment-Specific Variables

**Production:**
```
VITE_API_URL=https://api.plixo.com
```

**Preview (for testing):**
```
VITE_API_URL=https://api-preview.plixo.com
```

### Step 3: Access in React Code

```typescript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787'
```

**Important:** Vite requires `VITE_` prefix for environment variables to be exposed to client-side code.

---

## Performance Optimization

### Enable CloudFlare Performance Features

1. Go to CloudFlare dashboard → Pages → plixo-portfolio
2. Navigate to **Settings** → **Functions**

**Recommended Settings:**
- ✅ **Automatic minification**: Enabled (HTML, CSS, JS)
- ✅ **Brotli compression**: Enabled (better than gzip)
- ✅ **HTTP/3**: Enabled (QUIC protocol)
- ✅ **0-RTT Connection**: Enabled (faster reconnections)

### Verify Performance

```bash
# Run Lighthouse audit
npx lighthouse https://plixo.com --view

# Or use web.dev/measure
```

**Target Metrics:**
- Performance: 90+ (excellent)
- Accessibility: 95+ (near perfect)
- Best Practices: 95+
- SEO: 95+

---

## Monitoring & Analytics

### CloudFlare Web Analytics (Privacy-Friendly)

1. Go to CloudFlare dashboard → **Analytics & Logs** → **Web Analytics**
2. Add site: `plixo.com`
3. Copy analytics snippet (optional - CloudFlare auto-tracks for Pages)

**No cookies, no fingerprinting - GDPR compliant by default**

### Available Metrics
- Page views and unique visitors
- Geographic distribution (country-level)
- Browser and device types
- Page load performance (Core Web Vitals)
- Traffic sources and referrers

---

## Troubleshooting

### Issue: Page Refresh Returns 404

**Cause:** SPA routing not configured correctly

**Solution:** CloudFlare Pages automatically handles this for React Router, but verify:

1. Check `dist/index.html` exists
2. Verify React Router uses `BrowserRouter` (not `HashRouter`)
3. Clear CloudFlare cache if issue persists

### Issue: Styles Not Loading

**Cause:** Asset paths might be incorrect

**Solution:**

1. Verify `base` in `vite.config.ts` is `/` or omitted
2. Check `dist/assets/` contains CSS files
3. Rebuild and redeploy: `npm run build && npx wrangler pages deploy dist`

### Issue: Build Fails

**Cause:** Dependencies or build configuration issue

**Solution:**

```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Verify build locally
npm run build

# Check for TypeScript errors
npm run build 2>&1 | grep error
```

### Issue: Custom Domain Not Working

**Cause:** DNS propagation delay or configuration error

**Solution:**

1. Verify DNS records in CloudFlare dashboard
2. Wait 5-10 minutes for DNS propagation
3. Clear browser cache and try incognito mode
4. Check DNS propagation: `dig plixo.com` or https://dnschecker.org

---

## Quick Reference Commands

### Development Workflow

```bash
# Local development
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to CloudFlare Pages
npx wrangler pages deploy dist --project-name=plixo-portfolio
```

### CloudFlare Management

```bash
# Login to CloudFlare
npx wrangler login

# Check login status
npx wrangler whoami

# List all Pages projects
npx wrangler pages project list

# View deployment history
npx wrangler pages deployment list --project-name=plixo-landing
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] All code changes committed to git
- [ ] `npm run build` succeeds locally
- [ ] Local preview tested (`npm run preview`)
- [ ] No console errors in browser dev tools
- [ ] All 5 pages tested manually

### Deployment
- [ ] Logged into CloudFlare via Wrangler
- [ ] Production build created
- [ ] Deployed to CloudFlare Pages
- [ ] Deployment URL tested

### Post-Deployment
- [ ] Custom domain configured (plixo.com)
- [ ] SSL certificate active
- [ ] All pages accessible via custom domain
- [ ] Responsive design verified (mobile/tablet/desktop)
- [ ] Background slideshow working
- [ ] Project cards and interactions functional
- [ ] Navigation between pages working
- [ ] Lighthouse audit run (score > 90)

### Optional
- [ ] CloudFlare Web Analytics configured
- [ ] Performance monitoring set up
- [ ] Social media preview meta tags verified
- [ ] Google Search Console submitted

---

## Next Steps After Deployment

1. **Share Portfolio**: Update LinkedIn, resume, GitHub profile with https://plixo.com
2. **Monitor Performance**: Check CloudFlare analytics weekly
3. **API Integration**: Begin plixo-api development (Phase 2)
4. **Content Updates**: Add more projects and refine copy as needed
5. **SEO Optimization**: Submit sitemap, optimize meta descriptions

---

## Support & Resources

- **CloudFlare Pages Docs**: https://developers.cloudflare.com/pages/
- **Wrangler CLI Docs**: https://developers.cloudflare.com/workers/wrangler/
- **Tenebrae Reference**: See `../tenebraeV2/CLOUDFLARE_PAGES_DEPLOYMENT.md`
- **CloudFlare Dashboard**: https://dash.cloudflare.com

---

**Deployment Status**: Ready for production deployment ✅

**Estimated Time**: 30-45 minutes for initial deployment
**Redeployment Time**: 2-3 minutes

**Last Updated**: 2025-11-01
