# Milestone 11.3: Loading Performance Optimization

> **Status**: ⏳ PENDING
> **Duration**: 4-6 hours
> **Priority**: MEDIUM-HIGH
> **Dependencies**: None (standalone performance optimization)

---

## Goal

Reduce initial page load time from 2-10 seconds to under 2 seconds by implementing HTML splash screen and code splitting. Improve user experience by eliminating blank white screen during bundle download.

**Why This Matters**:
- Professional first impression (no blank screen)
- 50-60% reduction in initial bundle size (561 KB → ~200-250 KB)
- Faster time-to-interactive on slow connections
- Better SEO and Core Web Vitals scores
- Demonstrates performance optimization skills

**Current State**:
- Bundle size: 1,955 KB (561 KB gzipped)
- Blank white screen for 2-10 seconds on 3G/4G
- All routes and components loaded eagerly
- Three.js (150+ KB) loaded upfront even if not used
- No visual feedback during initial load

**Target State**:
- Instant splash screen (<100ms)
- Initial bundle: ~200-250 KB gzipped
- Landing page interactive in 1-3 seconds
- Progressive loading with visual feedback

---

## Success Criteria

- [ ] Users see branded loading screen instantly (no blank screen)
- [ ] Initial bundle size reduced by 50%+
- [ ] Landing page loads and is interactive in <2 seconds on 4G
- [ ] Route components load on-demand with loading states
- [ ] Three.js spaceship loads only when needed
- [ ] Build succeeds with no errors
- [ ] All routes still work correctly after code splitting
- [ ] Mobile and desktop experience both improved

---

## Phase 1: HTML Splash Screen (Layer 1)

### 🎨 1.1 Inline Loading Screen

**File**: `/index.html`

**Goal**: Show instant visual feedback while JS bundle downloads

**Implementation**:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/g3dlogo.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Plixo</title>

    <!-- Inline critical CSS for splash screen (no external file delay) -->
    <style>
      /* Splash screen styles */
      #splash-screen {
        position: fixed;
        inset: 0;
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease-out;
      }

      #splash-screen.fade-out {
        opacity: 0;
        pointer-events: none;
      }

      .splash-content {
        text-align: center;
        color: #94a3b8;
      }

      .splash-logo {
        width: 80px;
        height: 80px;
        margin: 0 auto 24px;
        opacity: 0.9;
      }

      .splash-text {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 14px;
        margin-bottom: 16px;
        color: #94a3b8;
      }

      .splash-progress {
        width: 200px;
        height: 3px;
        background: rgba(148, 163, 184, 0.2);
        margin: 0 auto;
        border-radius: 2px;
        overflow: hidden;
      }

      .splash-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        animation: progress 2s ease-in-out infinite;
      }

      @keyframes progress {
        0% { width: 0%; transform: translateX(0); }
        50% { width: 70%; transform: translateX(0); }
        100% { width: 70%; transform: translateX(200px); }
      }

      /* Hide splash when React takes over */
      body.app-loaded #splash-screen {
        display: none;
      }
    </style>
  </head>
  <body>
    <!-- React mount point -->
    <div id="root"></div>

    <!-- Splash screen - shows immediately -->
    <div id="splash-screen">
      <div class="splash-content">
        <!-- SVG Logo (inline for instant display) -->
        <svg class="splash-logo" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke="url(#grad1)" stroke-width="3"/>
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
            </linearGradient>
          </defs>
          <text x="50" y="58" font-family="Arial" font-size="24" font-weight="bold"
                fill="#94a3b8" text-anchor="middle">P</text>
        </svg>

        <div class="splash-text">Loading Portfolio...</div>

        <div class="splash-progress">
          <div class="splash-progress-bar"></div>
        </div>
      </div>
    </div>

    <!-- Remove splash when React loads -->
    <script type="module">
      // Hide splash when React mounts
      window.addEventListener('load', () => {
        setTimeout(() => {
          const splash = document.getElementById('splash-screen');
          if (splash) {
            splash.classList.add('fade-out');
            setTimeout(() => splash.remove(), 500);
          }
        }, 100);
      });
    </script>

    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Features**:
- **Instant display** - No network delay, inline CSS
- **Branded design** - Matches portfolio gradient theme
- **Animated progress bar** - Visual feedback during load
- **Smooth fade-out** - Transitions to app when ready
- **Fallback removal** - Auto-removes if React takes over
- **Minimal overhead** - ~1.5 KB total

**Behavior**:
1. User hits plixo.com
2. Splash screen appears instantly (0ms)
3. Browser downloads JS in background
4. Progress bar animates continuously
5. React mounts and renders
6. Splash fades out after 100ms
7. User sees content

---

## Phase 2: Code Splitting (Layer 3)

### 📦 2.1 Route-Based Code Splitting

**File**: `/src/App.tsx`

**Goal**: Split each route into separate chunks, loaded on-demand

**Changes**:
```tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useState } from "react";
import { Toaster } from "sonner";
import { Navigation, BackgroundSlideshow, BackgroundController } from "./components/molecules";
import { GlobalProvider, useGlobal } from "./contexts/GlobalContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { usePageViewTracking } from "./hooks/usePageViewTracking";
import "./App.css";

// ✅ EAGER: Landing page (critical, load immediately)
import { Landing } from "./pages";

// 🔄 LAZY: All other routes (load on-demand)
const Work = lazy(() => import("./pages/Work"));
const About = lazy(() => import("./pages/About"));
const Insights = lazy(() => import("./pages/Insights"));
const Console = lazy(() => import("./pages/Console"));
const Connect = lazy(() => import("./pages/Connect"));

// 🔄 LAZY: Heavy components (Three.js)
const SpaceshipCanvas = lazy(() => import("./components/organisms/SpaceshipCanvas").then(m => ({ default: m.SpaceshipCanvas })));
const SpaceshipModal = lazy(() => import("./components/organisms/SpaceshipCanvas").then(m => ({ default: m.SpaceshipModal })));

// Loading fallback component
function RouteLoader() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

// Spaceship loading fallback (smaller, less intrusive)
function SpaceshipLoader() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute bottom-4 right-4 text-slate-500 text-xs">
        Loading 3D...
      </div>
    </div>
  );
}

function AppContent() {
  const [isSpaceshipModalOpen, setIsSpaceshipModalOpen] = useState(false);
  const { state } = useGlobal();

  usePageViewTracking();

  return (
    <>
      <Toaster {...} />

      <div className="min-h-screen w-screen overflow-x-hidden bg-black/20">
        <BackgroundSlideshow transitionTime={18000} maxSpeedPxPerSec={30} />

        {/* Lazy load spaceship canvas */}
        {!state.ui.isMobile && (
          <Suspense fallback={<SpaceshipLoader />}>
            <SpaceshipCanvas />
          </Suspense>
        )}

        <BackgroundController onSpaceshipClick={() => setIsSpaceshipModalOpen(true)} />
        <Navigation />

        <main {...}>
          {/* Wrap routes with Suspense for loading states */}
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              {/* Landing - eager loaded */}
              <Route path="/" element={<Landing />} />

              {/* All other routes - lazy loaded */}
              <Route path="/work" element={
                <ProtectedRoute>
                  <Work />
                </ProtectedRoute>
              } />

              <Route path="/about" element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              } />

              <Route path="/insights" element={
                <ProtectedRoute>
                  <Insights />
                </ProtectedRoute>
              } />

              <Route path="/console" element={
                <ProtectedRoute excludeRoles={['guest']}>
                  <Console />
                </ProtectedRoute>
              } />

              <Route path="/connect" element={
                <ProtectedRoute>
                  <Connect />
                </ProtectedRoute>
              } />

              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
          </Suspense>
        </main>
      </div>

      {/* Lazy load spaceship modal */}
      {!state.ui.isMobile && (
        <Suspense fallback={null}>
          <SpaceshipModal
            isOpen={isSpaceshipModalOpen}
            onClose={() => setIsSpaceshipModalOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
}

export default function App() {
  return (
    <GlobalProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </GlobalProvider>
  );
}
```

**Key Changes**:
- Landing page: **Eager** (immediate)
- All other pages: **Lazy** (on-demand)
- Spaceship components: **Lazy** (heavy Three.js)
- Suspense boundaries: Loading states for chunks
- Mobile check: Prevent loading Three.js on mobile

---

### 📦 2.2 Update Page Exports for Default Exports

**Files**: Update all lazy-loaded pages to use default exports

**Required Changes**:

**`/src/pages/Work.tsx`**:
```tsx
// Change from: export { Work };
// To:
export default Work;
```

**`/src/pages/About.tsx`**:
```tsx
export default About;
```

**`/src/pages/Insights.tsx`**:
```tsx
export default Insights;
```

**`/src/pages/Console.tsx`**:
```tsx
export default Console;
```

**`/src/pages/Connect.tsx`**:
```tsx
export default Connect;
```

**`/src/pages/index.ts`** (barrel export file):
```tsx
// Keep Landing as named export (eager)
export { default as Landing } from "./Landing";

// Remove other exports since they're now lazy-loaded directly
// export { Work } from "./Work";  // DELETE
// export { About } from "./About";  // DELETE
// etc.
```

**Why**: `lazy()` requires default exports. Named exports won't work.

---

### ⚙️ 2.3 Vite Build Configuration

**File**: `/vite.config.ts`

**Goal**: Optimize chunk splitting for better caching

**Add Manual Chunking** (optional but recommended):
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk - libraries rarely change
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['sonner', 'lucide-react'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-charts': ['recharts', 'react-simple-maps'],

          // Analytics stays together
          'analytics': [
            './src/services/analyticsClient.ts',
            './src/hooks/usePageViewTracking.ts'
          ],
        },
      },
    },
    // Increase chunk size warning (Three.js is large)
    chunkSizeWarningLimit: 800,
  },
})
```

**Benefits**:
- Better browser caching (vendor libs change rarely)
- Parallel downloads (multiple chunks load simultaneously)
- Smaller individual chunks
- Three.js isolated (only loads when needed)

---

## Expected Bundle Size Impact

### Before:
```
dist/assets/index.js     1,955 KB  (561 KB gzipped)
dist/assets/index.css       68 KB   (10 KB gzipped)
```

### After:
```
dist/assets/index.js         ~80 KB   (25 KB gzipped)  ← Entry point
dist/assets/Landing.js      ~120 KB   (35 KB gzipped)  ← Critical path
dist/assets/vendor-react.js ~200 KB   (60 KB gzipped)  ← Shared libs
dist/assets/vendor-three.js ~400 KB  (120 KB gzipped)  ← Lazy loaded
dist/assets/Work.js          ~80 KB   (25 KB gzipped)  ← Lazy loaded
dist/assets/About.js         ~60 KB   (18 KB gzipped)  ← Lazy loaded
dist/assets/Insights.js     ~300 KB   (90 KB gzipped)  ← Lazy loaded (charts)
dist/assets/Console.js      ~250 KB   (75 KB gzipped)  ← Lazy loaded (charts)
dist/assets/Connect.js       ~40 KB   (12 KB gzipped)  ← Lazy loaded
```

**Initial Load (Landing page)**:
- Before: 561 KB gzipped
- After: ~120 KB gzipped (80% reduction!)

**Time-to-Interactive**:
- Before: 2-10 seconds on 4G
- After: 1-3 seconds on 4G (70% improvement)

---

## Testing Checklist

### Functionality Tests
- [ ] All routes still load correctly
- [ ] Navigation between pages works
- [ ] Protected routes still enforce auth
- [ ] Spaceship modal loads on desktop
- [ ] Spaceship hidden on mobile
- [ ] 404 page works
- [ ] Background slideshow loads
- [ ] Analytics tracking works

### Performance Tests
- [ ] Splash screen appears instantly (<100ms)
- [ ] Landing page interactive in <2s on 4G
- [ ] Route transitions show loading state
- [ ] No blank screens during navigation
- [ ] Three.js only loads when needed
- [ ] Charts only load on Insights/Console pages
- [ ] Browser back/forward works smoothly

### Build Tests
- [ ] `npm run build` succeeds with no errors
- [ ] Bundle sizes match expectations
- [ ] All chunks generated correctly
- [ ] No missing dependencies warnings
- [ ] Source maps generated (for debugging)

### Browser Tests
- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Chrome (mobile)
- [ ] Safari (iOS)

### Network Tests
- [ ] Fast 3G - Landing loads in <3s
- [ ] 4G - Landing loads in <2s
- [ ] Good connection - All pages instant
- [ ] Throttled - Splash screen prevents frustration

---

## Implementation Steps

### Step 1: HTML Splash Screen
1. Update `/index.html` with splash screen markup
2. Add inline CSS and animations
3. Add fade-out script
4. Test instant display

### Step 2: Update Page Exports
1. Change all page components to default exports
2. Update `/src/pages/index.ts` barrel export
3. Verify imports still work

### Step 3: Add Code Splitting
1. Import `lazy` and `Suspense` from React
2. Convert routes to lazy imports
3. Wrap routes with `<Suspense>` boundaries
4. Create loading fallback components
5. Lazy load Spaceship components

### Step 4: Build Configuration
1. Update `/vite.config.ts` with manual chunks
2. Adjust chunk size warning limit
3. Run build and verify chunk sizes

### Step 5: Testing
1. Test in dev mode (`npm run dev`)
2. Build production (`npm run build`)
3. Preview production (`npm run preview`)
4. Test all routes and lazy loading
5. Verify network tab shows chunks loading on-demand
6. Test on slow 3G connection

### Step 6: Deployment
1. Commit changes
2. Push to GitHub
3. CloudFlare Pages auto-deploys
4. Test production site
5. Verify performance improvements in Lighthouse

---

## Rollback Plan

If issues arise:
1. Keep splash screen (no dependencies on code splitting)
2. Revert code splitting by removing `lazy()` imports
3. Restore eager imports in `App.tsx`
4. Redeploy previous version

Low risk - code splitting is well-supported in Vite/React.

---

## Future Enhancements

### Phase 3: Progressive Enhancement (Future)
- [ ] Defer background slideshow (load after 1s)
- [ ] Preload critical route chunks on hover
- [ ] Service worker for offline support
- [ ] Intersection observer lazy loading for images

### Phase 4: Advanced Optimization (Future)
- [ ] Image optimization (WebP, AVIF)
- [ ] Font subsetting
- [ ] Critical CSS extraction
- [ ] HTTP/2 server push

---

## Dependencies

**No new packages required** - Uses built-in React features:
- `React.lazy()` - Dynamic imports
- `<Suspense>` - Loading boundaries
- Vite code splitting - Built-in

**Existing dependencies**:
- React 19
- Vite 7
- React Router 7

---

## Acceptance Criteria

### Visual Experience
- [ ] No blank white screen on any load
- [ ] Smooth splash → content transition
- [ ] Loading states visible during route changes
- [ ] Professional, branded loading experience

### Performance Metrics
- [ ] Initial bundle <300 KB gzipped
- [ ] Time-to-interactive <2s on 4G
- [ ] Lighthouse Performance score >90
- [ ] First Contentful Paint <1.5s
- [ ] Largest Contentful Paint <2.5s

### User Experience
- [ ] Navigation feels instant on good connections
- [ ] Slow connections show clear loading feedback
- [ ] No layout shifts during lazy loads
- [ ] All features work identically to before

---

## Estimated Timeline

- **HTML Splash Screen**: 30 minutes
  - Update index.html
  - Test across browsers

- **Code Splitting Setup**: 1.5 hours
  - Update page exports
  - Add lazy imports
  - Add Suspense boundaries
  - Create loading components

- **Build Configuration**: 30 minutes
  - Update vite.config.ts
  - Test chunk splitting

- **Testing**: 1-2 hours
  - Test all routes
  - Network throttling tests
  - Cross-browser testing
  - Production build verification

- **Deployment & Verification**: 30 minutes
  - Deploy to CloudFlare
  - Production testing
  - Lighthouse audit

**Total: 4-6 hours**

---

## Success Metrics (Post-Deployment)

Track these in CloudFlare Analytics:
- Average page load time
- Time to first byte (TTFB)
- First contentful paint (FCP)
- Largest contentful paint (LCP)
- Cumulative layout shift (CLS)

**Target Improvements**:
- 50-70% reduction in initial load time
- 90+ Lighthouse Performance score
- <2s time-to-interactive on 4G

---

**Ready to implement?** This milestone can be completed in a single session (4-6 hours) and provides immediate, measurable performance improvements.
