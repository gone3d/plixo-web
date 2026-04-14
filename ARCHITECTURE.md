# Plixo Web - Architecture Guide

**Version:** 1.4.2
**Last Updated:** 2026-04-02
**Status:** Living Document

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Component Architecture](#component-architecture)
4. [State Management](#state-management)
5. [Routing & Navigation](#routing--navigation)
6. [API Integration](#api-integration)
7. [Styling & Design System](#styling--design-system)
8. [3D Graphics & Animation](#3d-graphics--animation)
9. [Security Architecture](#security-architecture)
10. [Performance Optimization](#performance-optimization)
11. [Analytics & Monitoring](#analytics--monitoring)
12. [Best Practices](#best-practices)

---

## Project Overview

**Plixo Web** is a modern, interactive portfolio website showcasing technical leadership and innovation. Built as a cutting-edge single-page application with immersive 3D elements, real-time analytics, and dynamic content management.

### Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | 19.1.1 | UI framework |
| **Build Tool** | Vite | 7.1.7 | Fast dev server & bundler |
| **Language** | TypeScript | 5.8.3 | Type safety |
| **Styling** | Tailwind CSS | 4.1.13 | Utility-first CSS |
| **Routing** | React Router | 7.9.3 | Client-side routing |
| **3D Graphics** | Three.js + R3F | 0.182.0 + 9.5.0 | 3D rendering |
| **State Management** | React Context | - | Global state |
| **API Client** | Native Fetch | - | HTTP requests (axios removed) |
| **Forms** | React Hook Form | 7.66.0 | Form validation |
| **Charts** | Recharts | 3.3.0 | Data visualization |
| **Icons** | Lucide React | 0.552.0 | Icon library |
| **Notifications** | Sonner | 2.0.7 | Toast notifications |
| **CAPTCHA** | Cloudflare Turnstile | 1.3.1 | Bot protection |

### Architecture Principles

1. **🎯 Component-Driven** - Modular, reusable components using Atomic Design
2. **🔒 Security-First** - CSRF protection, input validation, XSS prevention
3. **⚡ Performance** - Code splitting, lazy loading, optimized 3D rendering
4. **♿ Accessible** - WCAG 2.1 AA compliance, semantic HTML
5. **📱 Responsive** - Mobile-first design, adaptive layouts
6. **🎨 Design System** - Consistent theming via CSS custom properties
7. **📊 Data-Driven** - Real-time analytics, dynamic content from API

---

## Project Structure

```
plixo-web/
├── public/                  # Static assets
│   ├── images/             # Image assets
│   └── data/               # Static data files
├── src/
│   ├── components/         # React components (Atomic Design)
│   │   ├── atoms/          # Basic building blocks
│   │   ├── molecules/      # Compound components
│   │   ├── organisms/      # Complex sections
│   │   ├── admin/          # Admin-specific components
│   │   └── auth/           # Auth-specific components
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.tsx       # Authentication state
│   │   └── GlobalContext.tsx     # Global UI state
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components (routes)
│   │   ├── Landing.tsx           # Home page
│   │   ├── Work.tsx              # Portfolio projects
│   │   ├── About.tsx             # About/bio page
│   │   ├── Insights.tsx          # Analytics dashboard
│   │   ├── Console.tsx           # Admin console
│   │   └── Connect.tsx           # Contact page
│   ├── services/           # API service layer
│   │   ├── api.ts                # Base API client (native fetch)
│   │   ├── auth.ts               # Authentication service
│   │   ├── maintenance.ts        # Maintenance mode service
│   │   ├── tokenStorage.ts       # Token management
│   │   └── analyticsClient.ts    # Analytics tracking
│   ├── types/              # TypeScript definitions
│   ├── utils/              # Utility functions
│   ├── config/             # Configuration files
│   ├── App.tsx             # Root component
│   ├── main.tsx            # App entry point
│   └── App.css             # Global styles
├── docs/                   # Documentation
│   ├── SECURITY_AUDIT.md   # Security findings & remediation
│   └── CLAUDE_CODE.md      # Development guide
├── tasks/                  # Milestone tracking
│   └── AxiosRemoval.md     # Completed security task
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── tailwind.config.js      # Tailwind CSS config
├── vite.config.ts          # Vite build config
└── ARCHITECTURE.md         # This file
```

### Component Organization (Atomic Design)

**Atoms** (`src/components/atoms/`)
Basic building blocks - buttons, inputs, icons, images, spinners
- `Button.tsx` - Primary UI button
- `Input.tsx` - Text input field
- `Icon.tsx` - Icon component (Lucide React wrapper)
- `IconButton.tsx` - Icon-only button
- `LoadingSpinner.tsx` - Loading indicator
- `UIImage.tsx` - Optimized image component
- `SlideInImage.tsx` - Animated image entrance
- `TurnstileWidget.tsx` - Cloudflare CAPTCHA

**Molecules** (`src/components/molecules/`)
Compound components - forms, cards, modals, navigation
- `Navigation.tsx` - Main nav bar
- `LoginForm.tsx` - Login form with CAPTCHA
- `LoginModal.tsx` - Login modal overlay
- `Modal.tsx` - Generic modal wrapper
- `ConfirmDialog.tsx` - Confirmation dialog
- `ProjectCard.tsx` - Project showcase card
- `MetricCard.tsx` - Analytics metric display
- `TechScroller.tsx` - Scrolling tech stack
- `MaintenanceBanner.tsx` - Maintenance mode alert
- `BackgroundSlideshow.tsx` - Animated background images
- `BackgroundController.tsx` - Background animation controls
- `GeographicMap.tsx` - Interactive map wrapper
- `WorldMap.tsx` - World map visualization
- `USAMap.tsx` - US map visualization
- `charts/*.tsx` - Chart components (Bar, Pie, Area, Line)

**Organisms** (`src/components/organisms/`)
Complex, self-contained sections
- `SpaceshipCanvas/` - Three.js 3D spaceship scene
  - `SpaceshipCanvas.tsx` - Main canvas component
  - `Spaceship.tsx` - Spaceship 3D object
  - `models/*.tsx` - 3D model parts (rocket body, fins, nose, exhaust)
  - `StarField.tsx` - Animated starfield background
  - `PathFollower.tsx` - Animation path logic
  - `WarpFlash.tsx` - Warp effect animation
  - `TriangleTrail.tsx` - Motion trail effect
  - `TargetingCircle.tsx` - UI targeting reticle
  - `SpaceshipModal.tsx` - 3D modal overlay

**Admin** (`src/components/admin/`)
Admin console components
- `AboutManager.tsx` - About content editor
- `AboutSectionEditModal.tsx` - About section modal
- `ProjectsManager.tsx` - Project CRUD interface

**Auth** (`src/components/auth/`)
Authentication components
- `ProtectedRoute.tsx` - Route guard for authenticated pages

---

## Component Architecture

### Atomic Design Methodology

Plixo Web follows **Atomic Design** principles for scalable component architecture:

1. **Atoms** - Smallest, indivisible components (Button, Input, Icon)
2. **Molecules** - Groups of atoms functioning together (LoginForm, ProjectCard)
3. **Organisms** - Complex UI sections (SpaceshipCanvas, Navigation)
4. **Pages** - Complete views composed of organisms (Landing, Work, About)

### Component Patterns

#### Standard Component Structure

```tsx
import { useState } from 'react'
import { Icon } from '@/components/atoms'

interface MyComponentProps {
  title: string
  onAction?: () => void
  variant?: 'primary' | 'secondary'
}

export function MyComponent({
  title,
  onAction,
  variant = 'primary'
}: MyComponentProps) {
  const [state, setState] = useState<string>('')

  const handleClick = () => {
    // Logic here
    onAction?.()
  }

  return (
    <div className="p-4 bg-slate-800 rounded-lg">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {/* Component JSX */}
    </div>
  )
}
```

#### Props Interface Convention

```tsx
// ✅ GOOD - Named interface
interface ComponentNameProps {
  // Props here
}

// ❌ BAD - Inline type
export function Component({ title }: { title: string }) { }
```

#### Export Convention

```tsx
// Named exports (preferred)
export function MyComponent() { }

// Index re-exports for cleaner imports
// src/components/atoms/index.ts
export { Button } from './Button'
export { Icon } from './Icon'
export { LoadingSpinner } from './LoadingSpinner'

// Usage
import { Button, Icon } from '@/components/atoms'
```

---

## State Management

### Context Providers

Plixo Web uses **React Context API** for global state management. No external state library (Redux, Zustand) to minimize dependencies.

#### AuthContext

**Location:** `src/contexts/AuthContext.tsx`
**Purpose:** User authentication state and auth operations

```tsx
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const {
    user,          // Current user object
    token,         // JWT token
    isAuthenticated, // Auth status
    login,         // Login function
    logout,        // Logout function
    loading        // Auth check in progress
  } = useAuth()

  if (loading) return <LoadingSpinner />
  if (!isAuthenticated) return <LoginPrompt />

  return <ProtectedContent user={user} />
}
```

**Auth Flow:**
1. User submits credentials via `LoginForm`
2. `authService.login()` calls `/auth/login` endpoint
3. Backend validates and returns JWT token
4. Token stored in memory (`tokenStorage.ts`)
5. `AuthContext` updates with user data
6. Token sent in `Authorization: Bearer <token>` header

**Important:** Tokens are **memory-only** (cleared on page reload). See [Security Architecture](#security-architecture) for CSRF protection details.

#### GlobalContext

**Location:** `src/contexts/GlobalContext.tsx`
**Purpose:** Global UI state, configuration, and data

```tsx
import { useGlobal } from '@/contexts/GlobalContext'

function MyComponent() {
  const { state, actions, selectors } = useGlobal()

  // State access
  const {
    data,           // Portfolio data (projects, skills, experiences)
    loading,        // Loading states
    ui,             // UI state (theme, modals)
    api,            // API health status
    backgroundAnimation // Background animation config
  } = state

  // Actions
  actions.loadProjects()
  actions.setTheme('dark')
  actions.checkApiHealth()

  // Selectors (computed values)
  const featuredProjects = selectors.getFeaturedProjects()

  return <div>{/* Component JSX */}</div>
}
```

**Global State Shape:**
```tsx
interface GlobalState {
  // Data loading states
  loading: {
    portfolio: boolean
    projects: boolean
    experiences: boolean
    skills: boolean
    config: boolean
  }

  // Error states
  errors: {
    portfolio?: string
    projects?: string
    // ...
  }

  // Core data
  data: {
    portfolioOverview?: PortfolioOverview
    projects: Project[]
    experiences: Experience[]
    skills: Skill[]
    backgroundImages: BackgroundImage[]
    appConfig?: AppConfig
  }

  // UI state
  ui: {
    theme: 'light' | 'dark' | 'system'
    sidebarOpen: boolean
    currentPage: string
    filters: { /* ... */ }
  }

  // Analytics state
  analytics: {
    sessionId?: string
    pageViews: number
    startTime: number
    interactions: number
  }

  // API health
  api: {
    status: 'online' | 'offline' | 'checking'
    version?: string
    lastChecked?: number
  }

  // Background animation
  backgroundAnimation: {
    speedPxPerSec: number
    panDistancePx: number
    direction: 'horizontal' | 'vertical' | 'none'
  }
}
```

### Custom Hooks

#### usePortfolioData

**Location:** `src/hooks/usePortfolioData.ts`
**Purpose:** Fetch and manage portfolio data

```tsx
import { usePortfolioData } from '@/hooks/usePortfolioData'

function MyComponent() {
  const {
    projects,
    loading,
    error,
    refetch
  } = usePortfolioData()

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />

  return <ProjectList projects={projects} />
}
```

#### usePageViewTracking

**Location:** `src/hooks/usePageViewTracking.ts`
**Purpose:** Automatic page view analytics

```tsx
// Automatically tracks page views on route changes
// No manual usage required - enabled in App.tsx
function AppContent() {
  usePageViewTracking() // Tracks all route changes

  return <Routes>{/* routes */}</Routes>
}
```

---

## Routing & Navigation

### React Router v7

**Location:** `src/App.tsx`

Plixo Web uses **React Router v7** for client-side routing with code splitting via lazy loading.

#### Route Configuration

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Eager load (critical path)
import { Landing } from './pages'

// Lazy load (on-demand)
const Work = lazy(() => import('./pages/Work'))
const About = lazy(() => import('./pages/About'))
const Insights = lazy(() => import('./pages/Insights'))
const Console = lazy(() => import('./pages/Console'))
const Connect = lazy(() => import('./pages/Connect'))

function App() {
  return (
    <Router>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/work" element={<Work />} />
          <Route path="/about" element={<About />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/connect" element={<Connect />} />

          {/* Protected route */}
          <Route
            path="/console"
            element={
              <ProtectedRoute requiredRole="admin">
                <Console />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  )
}
```

#### Navigation Patterns

**Programmatic Navigation:**
```tsx
import { useNavigate } from 'react-router-dom'

function MyComponent() {
  const navigate = useNavigate()

  function handleNavigate() {
    navigate('/work')
  }

  function goBack() {
    navigate(-1)
  }

  return <button onClick={handleNavigate}>View Projects</button>
}
```

**Declarative Navigation:**
```tsx
import { Link, NavLink } from 'react-router-dom'

// Basic link
<Link to="/about">About Me</Link>

// NavLink with active state
<NavLink
  to="/work"
  className={({ isActive }) =>
    isActive ? 'text-blue-400' : 'text-white'
  }
>
  Portfolio
</NavLink>
```

#### Protected Routes

**Location:** `src/components/auth/ProtectedRoute.tsx`

```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

// Require authentication
<Route
  path="/console"
  element={
    <ProtectedRoute requiredRole="admin">
      <Console />
    </ProtectedRoute>
  }
/>

// ProtectedRoute logic:
// 1. Check AuthContext for authenticated user
// 2. Verify user role matches requiredRole
// 3. If authorized: render children
// 4. If not authenticated: redirect to home + show login modal
// 5. If insufficient permissions: show access denied
```

---

## API Integration

### API Client Architecture

**Location:** `src/services/api.ts`

Plixo Web uses a **custom native fetch wrapper** (axios removed for security - see [docs/tasks/AxiosRemoval.md](tasks/AxiosRemoval.md)).

#### ApiClient Class

```tsx
// src/services/api.ts
class ApiClient {
  private baseURL: string
  private defaultTimeout: number

  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>
  async post<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>
  async put<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>
  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>
  async patch<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>
}

export const apiClient = new ApiClient(API_URL, 10000)
```

**Features:**
- ✅ Automatic JWT token injection
- ✅ 10-second timeout via AbortController
- ✅ Global error handling
- ✅ Automatic 401 token clearing
- ✅ TypeScript generic types
- ✅ CORS credential support

#### Making API Requests

```tsx
import { apiClient } from '@/services/api'

// GET request
const { data } = await apiClient.get<Project[]>('/projects')

// POST request with payload
const { data } = await apiClient.post<ProjectResponse>('/projects', {
  title: 'New Project',
  description: 'Project description'
})

// Authenticated requests (automatic)
// Token from tokenStorage automatically added to Authorization header
const { data } = await apiClient.get<User>('/auth/me')
```

#### Error Handling Pattern

```tsx
import { apiClient, type ApiError } from '@/services/api'

async function fetchProjects() {
  try {
    const { data } = await apiClient.get<ProjectsResponse>('/projects')
    return data.data.projects
  } catch (error) {
    const apiError = error as ApiError

    if (apiError.response?.status === 401) {
      // Unauthorized - token expired
      console.error('Session expired')
      // Token automatically cleared by apiClient
    } else if (apiError.response?.status === 404) {
      console.error('Resource not found')
    } else {
      console.error('API error:', apiError.message)
    }

    throw error
  }
}
```

### Service Layer

#### AuthService

**Location:** `src/services/auth.ts`

```tsx
import { authService } from '@/services/auth'

// Login
const { token, user } = await authService.login(username, password)

// Guest login (with CAPTCHA)
const { token, user } = await authService.guestLogin(captchaToken)

// Logout
await authService.logout()

// Get current user
const user = await authService.getCurrentUser()

// Refresh token
const newToken = await authService.refreshToken()

// Verify role
const { hasRole } = await authService.verifyRole('admin')
```

#### MaintenanceService

**Location:** `src/services/maintenance.ts`

```tsx
import { maintenanceService } from '@/services/maintenance'

// Check maintenance status (public)
const status = await maintenanceService.getStatus()

// Get admin maintenance details
const details = await maintenanceService.getAdminStatus()

// Enable maintenance mode (admin only)
await maintenanceService.enable('Scheduled maintenance', '2026-04-03T00:00:00Z')

// Disable maintenance mode
await maintenanceService.disable()
```

#### AnalyticsClient

**Location:** `src/services/analyticsClient.ts`

```tsx
import { trackPageView, trackEvent } from '@/services/analyticsClient'

// Track page view (automatic via usePageViewTracking)
await trackPageView('/work')

// Track custom event
await trackEvent('button_click', {
  button_id: 'contact_cta',
  page: '/work'
})
```

### Token Management

**Location:** `src/services/tokenStorage.ts`

```tsx
class TokenStorage {
  private token: string | null = null  // Memory-only storage

  setToken(token: string): void
  getToken(): string | null
  removeToken(): void
}

export const tokenStorage = new TokenStorage()
```

**Security Note:** Tokens are stored **in-memory only** (not localStorage/sessionStorage) to reduce XSS risk. Tokens cleared on page reload. See [Security Architecture](#security-architecture) for CSRF implementation requirements.

---

## Styling & Design System

### Tailwind CSS

Plixo Web uses **Tailwind CSS v4** for utility-first styling with custom design tokens.

#### Tailwind Configuration

**Location:** `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
      },
    },
  },
  plugins: [],
}
```

### Color System

**Primary Colors:**
- `slate-900` - Background
- `blue-400` - Primary accent
- `cyan-400` - Secondary accent
- `emerald-400` - Success
- `amber-400` - Warning
- `red-400` - Error

**Usage:**
```tsx
// ✅ GOOD - Using Tailwind utilities
<div className="bg-slate-900 text-white p-4 rounded-lg border border-blue-400/30">
  <h2 className="text-2xl font-bold text-blue-400">Title</h2>
  <p className="text-slate-300">Description</p>
</div>

// ❌ BAD - Inline styles
<div style={{ backgroundColor: '#1e293b', color: '#fff', padding: '16px' }}>
```

### Responsive Design

**Tailwind Breakpoints:**
```tsx
// Mobile-first approach
<div className="
  p-4              /* mobile: 16px padding */
  md:p-6           /* tablet: 24px padding */
  lg:p-8           /* desktop: 32px padding */
  xl:p-12          /* large desktop: 48px padding */
">
```

**Standard Breakpoints:**
- `sm` - 640px
- `md` - 768px
- `lg` - 1024px
- `xl` - 1280px
- `2xl` - 1536px

### Component Styling Patterns

#### Utility Classes

```tsx
// Layout
className="flex items-center justify-between gap-4"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// Typography
className="text-xl font-bold text-white"
className="text-sm text-slate-400 italic"

// Spacing
className="px-4 py-2"  // padding horizontal/vertical
className="mt-8 mb-4"  // margin top/bottom
className="space-y-4"  // vertical spacing between children

// Effects
className="rounded-lg shadow-xl"
className="backdrop-blur-md bg-white/10"
className="transition-all duration-300 hover:scale-105"
```

#### CSS Utility Function

**Location:** `src/utils/cn.ts`

```tsx
import { cn } from '@/utils/cn'

// Conditionally merge classes
<div className={cn(
  'base-class',
  isActive && 'active-class',
  variant === 'primary' && 'primary-variant'
)}>
```

---

## 3D Graphics & Animation

### Three.js + React Three Fiber

**Package:** `@react-three/fiber` + `@react-three/drei`

#### SpaceshipCanvas Component

**Location:** `src/components/organisms/SpaceshipCanvas/`

Complex 3D scene with animated spaceship, starfield, and particle effects.

**Structure:**
```
SpaceshipCanvas/
├── SpaceshipCanvas.tsx      # Main canvas wrapper
├── Spaceship.tsx             # Spaceship 3D model container
├── SpaceshipObject.tsx       # Spaceship geometry
├── models/
│   ├── RocketBody.tsx        # Main rocket body mesh
│   ├── RocketNose.tsx        # Nose cone mesh
│   ├── RocketFins.tsx        # Fin meshes
│   ├── RocketExhaust.tsx     # Exhaust particles
│   └── RocketHullLathe.tsx   # Lathe geometry for hull
├── StarField.tsx             # Animated stars background
├── PathFollower.tsx          # Camera animation path logic
├── WarpFlash.tsx             # Warp effect overlay
├── TriangleTrail.tsx         # Motion trail particles
├── TargetingCircle.tsx       # UI targeting reticle
└── SpaceshipModal.tsx        # Modal overlay for 3D scene
```

#### Basic Three.js Setup

```tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'

export function SpaceshipCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{ antialias: true, alpha: true }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <OrbitControls enableZoom={false} enablePan={false} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* 3D Objects */}
      <Spaceship />
      <StarField />
    </Canvas>
  )
}
```

#### Performance Optimization

**Lazy Loading:**
```tsx
// Lazy load heavy 3D components
const SpaceshipCanvas = lazy(() =>
  import('./components/organisms/SpaceshipCanvas').then(m => ({
    default: m.SpaceshipCanvas
  }))
)

<Suspense fallback={<SpaceshipLoader />}>
  <SpaceshipCanvas />
</Suspense>
```

**Three.js Best Practices:**
- ✅ Dispose geometries and materials on unmount
- ✅ Use `useFrame` sparingly (runs every frame)
- ✅ Implement LOD (Level of Detail) for complex models
- ✅ Reuse geometries and materials
- ✅ Limit particle counts (< 1000 for mobile)

```tsx
import { useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

function AnimatedMesh() {
  const meshRef = useRef()

  useFrame((state, delta) => {
    // Animation logic (runs every frame)
    meshRef.current.rotation.y += delta
  })

  useEffect(() => {
    // Cleanup
    return () => {
      meshRef.current.geometry.dispose()
      meshRef.current.material.dispose()
    }
  }, [])

  return <mesh ref={meshRef}>{/* geometry */}</mesh>
}
```

### Background Animations

#### BackgroundSlideshow

**Location:** `src/components/molecules/BackgroundSlideshow.tsx`

Animated background image slideshow with panning effect.

```tsx
<BackgroundSlideshow
  transitionTime={18000}     // 18 seconds per image
  maxSpeedPxPerSec={30}      // Max pan speed
/>
```

**Features:**
- Smooth crossfade transitions
- Configurable pan direction (horizontal/vertical/none)
- Responsive image sizing
- Global state integration via GlobalContext

---

## Security Architecture

### 🔴 CRITICAL: CSRF Protection Required

**Status:** ⚠️ **NOT YET IMPLEMENTED** - See [docs/SECURITY_AUDIT.md](docs/SECURITY_AUDIT.md) Section 3

**Current Vulnerability:**
- JWT tokens in Authorization header (no CSRF protection)
- State-changing operations (POST/PUT/DELETE) vulnerable
- MUST implement CSRF tokens before production

**Required Implementation:**
1. Generate CSRF token on login (separate from JWT)
2. Store CSRF token hash in backend session table
3. Send CSRF token in `X-CSRF-Token` header for state-changing requests
4. Validate CSRF token on backend for POST/PUT/DELETE operations

**See [docs/SECURITY_AUDIT.md - Milestone M0](docs/SECURITY_AUDIT.md#milestone-0-critical-csrf-fix)** for complete implementation guide.

### Authentication Flow

1. **Login:** User submits credentials → backend validates → returns JWT
2. **Token Storage:** JWT stored in memory-only (`tokenStorage`)
3. **Authenticated Requests:** JWT sent in `Authorization: Bearer <token>` header
4. **Token Refresh:** Automatic refresh before expiration (24h TTL)
5. **Logout:** Client clears token + backend invalidates session

### Input Validation & Sanitization

**Client-Side Validation:**
```tsx
import { z } from 'zod'

const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  captchaToken: z.string().optional()
})

// Validate form data
const validated = loginSchema.parse(formData)
```

**XSS Prevention:**
- ✅ React automatically escapes JSX content
- ✅ Markdown sanitized via `react-markdown` + `rehype-sanitize` (TODO: verify)
- ❌ NEVER use `dangerouslySetInnerHTML` without sanitization

**SQL Injection Prevention:**
- ✅ Backend uses D1 parameterized queries (Cloudflare Pages Functions)
- ❌ Frontend has no direct database access

### Security Headers

**Required (Backend - plixo-api):**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: [see SECURITY_AUDIT.md]
```

**Status:** ⚠️ Not yet implemented - See [SECURITY_AUDIT.md - Milestone M1](docs/SECURITY_AUDIT.md#milestone-1-critical-security-configuration)

### Environment Variables

**Required Environment Variables:**
```bash
# API Configuration
VITE_API_URL=https://api.plixo.com

# Cloudflare Turnstile CAPTCHA
VITE_TURNSTILE_SITE_KEY=<site-key>

# Analytics (optional)
VITE_ANALYTICS_ENABLED=true
```

**Security Rules:**
- ✅ All secrets in `.env` (gitignored)
- ✅ Use `VITE_` prefix for client-side variables
- ❌ NEVER commit `.env` files to git
- ❌ NEVER expose API secrets client-side

---

## Performance Optimization

### Code Splitting

**Lazy Loading Routes:**
```tsx
// Eager: Landing page (critical path)
import { Landing } from './pages'

// Lazy: All other routes
const Work = lazy(() => import('./pages/Work'))
const About = lazy(() => import('./pages/About'))
const Insights = lazy(() => import('./pages/Insights'))
```

**Lazy Loading Heavy Components:**
```tsx
// Lazy load Three.js canvas
const SpaceshipCanvas = lazy(() =>
  import('./components/organisms/SpaceshipCanvas').then(m => ({
    default: m.SpaceshipCanvas
  }))
)
```

### Bundle Analysis

**Run Build:**
```bash
npm run build

# Analyze bundle (add to vite.config.ts)
vite-bundle-visualizer
```

**Target Bundle Sizes:**
- Initial load: < 200KB (gzipped)
- Route chunks: < 100KB (gzipped)
- 3D assets: Lazy loaded, < 500KB total

### Image Optimization

```tsx
import { UIImage } from '@/components/atoms'

// Optimized image with lazy loading
<UIImage
  src="/images/project.jpg"
  alt="Project showcase"
  loading="lazy"
  width={800}
  height={600}
/>
```

**Best Practices:**
- Use WebP format for images
- Serve responsive sizes via `srcset`
- Lazy load below-the-fold images
- Compress images (< 100KB per image)

### Performance Monitoring

**Web Vitals Tracking:**
```tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getLCP(console.log)
```

**Target Metrics:**
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **FCP (First Contentful Paint):** < 1.8s
- **TTFB (Time to First Byte):** < 600ms

---

## Analytics & Monitoring

### Analytics Client

**Location:** `src/services/analyticsClient.ts`

```tsx
import { trackPageView, trackEvent } from '@/services/analyticsClient'

// Automatic page view tracking
usePageViewTracking() // Hook in App.tsx

// Manual event tracking
await trackEvent('button_click', {
  button_id: 'contact_form_submit',
  page: '/connect'
})
```

### Analytics Dashboard

**Page:** `/insights`

Real-time analytics visualization:
- 📊 Visitor metrics (unique, returning, total)
- 🗺️ Geographic distribution (world map + USA map)
- 📈 Temporal trends (hourly, daily, weekly)
- 🏙️ Top cities by visitors
- 📉 Event tracking and conversions

**Charts:**
- Bar charts (`BarChartComponent.tsx`)
- Pie charts (`PieChartComponent.tsx`)
- Area charts (`AreaChartComponent.tsx`)
- Line charts (temporal trends)
- Geographic maps (via `react-simple-maps`)

### Error Tracking

**Toast Notifications:**
```tsx
import { toast } from 'sonner'

try {
  await apiClient.post('/endpoint', data)
  toast.success('Success!')
} catch (error) {
  toast.error('Failed to save changes')
}
```

**Console Integration:**
Admin console (`/console`) provides:
- User management
- Content management (About page, Projects)
- System health monitoring
- Maintenance mode controls

---

## Best Practices

### DO ✅

**Components:**
- Use Atomic Design structure (atoms → molecules → organisms)
- Named exports for components
- TypeScript interfaces for all props
- Lazy load heavy components (3D, charts)

**State Management:**
- Use Context for global state
- Custom hooks for reusable logic
- Local state for component-specific data

**Styling:**
- Tailwind utility classes (no inline styles)
- Mobile-first responsive design
- Consistent spacing/colors from design system

**API Calls:**
- Use `apiClient` for all HTTP requests
- Handle errors with try/catch
- Show loading states
- Validate responses with TypeScript types

**Security:**
- Sanitize user input
- Validate forms client-side + server-side
- Use HTTPS only
- Implement CSRF tokens (TODO - M0)

**Performance:**
- Lazy load routes and heavy components
- Code split by route
- Optimize images (WebP, lazy loading)
- Debounce search inputs

### DON'T ❌

**Components:**
- Create deeply nested component hierarchies (max 3-4 levels)
- Use default exports (use named exports)
- Mix business logic with presentation

**State Management:**
- Store sensitive data in localStorage/sessionStorage
- Mutate state directly (use setState/dispatch)
- Create Context for component-local state

**Styling:**
- Use inline styles (use Tailwind classes)
- Hardcode colors/spacing (use design tokens)
- Ignore responsive breakpoints

**API Calls:**
- Call API directly from components (use service layer)
- Ignore error states
- Skip loading indicators
- Trust client-side validation only

**Security:**
- Commit `.env` files or secrets
- Use `dangerouslySetInnerHTML` without sanitization
- Store JWT in localStorage (memory-only)
- Skip CSRF protection (CRITICAL - implement M0)

**Performance:**
- Import entire libraries (use tree-shaking)
- Load heavy assets on initial render
- Skip lazy loading for non-critical routes
- Ignore bundle size

---

## Related Documentation

- **[docs/SECURITY_AUDIT.md](docs/SECURITY_AUDIT.md)** - ⭐ Security findings & remediation roadmap
- **[docs/CLAUDE_CODE.md](docs/CLAUDE_CODE.md)** - Development guide & session history
- **[tasks/AxiosRemoval.md](tasks/AxiosRemoval.md)** - Completed security improvement (axios → native fetch)
- **[package.json](package.json)** - Dependencies and scripts
- **[tsconfig.json](tsconfig.json)** - TypeScript configuration
- **[vite.config.ts](vite.config.ts)** - Vite build configuration

---

## Migration Notes

### Recent Changes

**v1.4.2 (2026-04-02):**
- ✅ Removed axios dependency (security vulnerability)
- ✅ Implemented native fetch API client
- ✅ Completed comprehensive security audit
- ⚠️ CSRF protection identified as critical gap (M0 milestone)

**Next Steps:**
1. **M0 - CSRF Protection** (CRITICAL - blocking production deploy)
2. **M1 - Security Headers** (HIGH - deploy immediately)
3. **M2 - Token Security** (HIGH - token blacklist, session timeout)

See [SECURITY_AUDIT.md](docs/SECURITY_AUDIT.md) for complete remediation roadmap.

---

**Last Updated:** 2026-04-02
**Maintained By:** Development Team
**Status:** ✅ Active
**Next Review:** After M0 (CSRF) milestone completion
