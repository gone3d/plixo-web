# Milestone: Three.js Spaceship & Analytics Visualization

## Overview

Add an interactive Three.js canvas overlay to the home page featuring a 3D spaceship with real-time analytics tracking data visualization. The animation will serve as an engaging, futuristic background that visualizes visitor activity in 3D space.

## Current Status

**Completed:**
- ✅ Phase 1: Basic Setup (Three.js, R3F, canvas, z-index layering)
- ✅ Phase 2: Spaceship Model (LatheGeometry rocket hull with rotation)
- ✅ Phase 3: Star Field Background (1500 stars with rotation)
- ✅ Phase 5: Performance Optimization (code splitting, lazy loading, mobile detection)
- ✅ Phase 6: Polish & UX (splash screen, accessibility, Suspense)

**Next:**
- ⏳ Phase 4: Data Visualization (engine particles, targeting circle, data points)

## Objectives

- Create immersive 3D background animation for home page
- Visualize analytics data (visitors, locations, events) in 3D space
- Maintain performance across devices
- Provide smooth, non-intrusive user experience

---

## Technical Requirements

### 1. Dependencies

**Install Required Packages:**

```bash
npm install three @types/three
npm install @react-three/fiber @react-three/drei
```

**Why these packages:**

- `three` - Core Three.js library for 3D rendering
- `@types/three` - TypeScript definitions
- `@react-three/fiber` - React renderer for Three.js (declarative, performant)
- `@react-three/drei` - Helper components and utilities for R3F

### 2. Component Architecture

```
src/components/
├── organisms/
│   └── SpaceshipCanvas/
│       ├── SpaceshipCanvas.tsx       # Main canvas container
│       ├── Spaceship.tsx              # 3D spaceship model with engine particles
│       ├── TargetingCircle.tsx        # Doppler shift targeting ring
│       ├── DataPoints.tsx             # Simple x,y,z coordinate markers
│       ├── StarField.tsx              # Background stars
│       └── types.ts                   # TypeScript interfaces
└── pages/
    └── Home.tsx                       # Updated with canvas overlay
```

### 3. Features Breakdown

#### Phase 1: Basic Setup ✅

- ✅ Install dependencies (three, @types/three, @react-three/fiber, @react-three/drei)
- ✅ Create basic Three.js scene with React Three Fiber
- ✅ Add responsive canvas that covers viewport
- ✅ Implement proper z-index layering (z-index: 0, behind content)
- ✅ Add performance settings (dpr: [1, 2], antialias: false, high-performance)

#### Phase 2: Spaceship Model ✅

**Implemented: SVG LatheGeometry Approach**

- ✅ Create spaceship using LatheGeometry from SVG path (rocket hull)
- ✅ Add metallic/emissive materials with glow effect
- ✅ Implement rotation animation (rotation.y, rotation.z)
- ✅ Add lighting (ambient, directional, point light)
- [ ] Add engine trail particles (moved to Phase 4)

#### Phase 3: Star Field Background ✅

- ✅ Generate random star positions using BufferGeometry (1500 stars)
- ✅ Create point cloud with varying sizes (0.5 size)
- ✅ Add subtle rotation animation (rotation.y)
- [ ] Parallax effect based on mouse movement (optional - future enhancement)

#### Phase 4: Data Visualization

**Tracking Data Points:**

- [ ] Map data to 3D coordinates around spaceship - Data Animation
- [ ] Create particle system for engine exhaust

**Data Animation:**

- [ ] Animate data points floating around spaceship
- [ ] Start with x,y,z coordinates
- [ ] Put targeting circle around ship ( color does blue/red shift when coming towards/away from camera)

#### Phase 5: Performance Optimization

- ✅ Code splitting - Three.js lazy loaded (saves 300KB from initial bundle)
- ✅ Manual chunking in Vite (vendor-three chunk)
- ✅ Mobile detection (disabled Three.js on mobile via useGlobal state)
- ✅ Performance settings (dpr: [1, 2], antialias: false, powerPreference: high-performance)
- ✅ Transparent background (alpha: true, background: 'transparent')
- [ ] Implement object pooling for particles (future - when particles added)
- [ ] Use instanced meshes for repeated geometry (future optimization)
- [ ] Add level-of-detail (LOD) system (future optimization)
- [ ] Pause animation when tab is not visible (future enhancement)
- [ ] Use `useFrame` efficiently (avoid state updates) - currently efficient

#### Phase 6: Polish & UX

- ✅ Loading state while scene initializes (HTML splash screen with inline CSS)
- ✅ Accessibility: Skip animation for `prefers-reduced-motion`
- ✅ Pointer events disabled (pointer-events-none) to not block content
- ✅ Suspense fallback for lazy loaded components
- [ ] Fade-in animation on page load (future enhancement)
- [ ] Toggle button to enable/disable animation (settings) (future enhancement)
- [ ] Smooth transitions between states (future enhancement)

---

## Implementation Details

### Current Implementation

**Files Created:**
- ✅ `SpaceshipCanvas.tsx` - Main canvas container with transparent background
- ✅ `Spaceship.tsx` - LatheGeometry rocket hull with rotation animation
- ✅ `StarField.tsx` - 1500 stars with BufferGeometry and rotation
- ✅ `SpaceshipModal.tsx` - Detail modal for spaceship info
- ✅ `index.ts` - Component exports

**Files Planned:**
- ⏳ `TargetingCircle.tsx` - Doppler shift targeting ring
- ⏳ `DataPoints.tsx` - Simple x,y,z coordinate markers
- ⏳ `types.ts` - TypeScript interfaces for data points

### Canvas Overlay Structure

**Current (App.tsx):**
```tsx
{/* Three.js Spaceship Canvas - Lazy loaded (desktop only) */}
{!state.ui.isMobile && (
  <Suspense fallback={<SpaceshipLoader />}>
    <SpaceshipCanvas />
  </Suspense>
)}
```

**Planned Integration:**
```tsx
// Landing.tsx - will pass data points
<SpaceshipCanvas dataPoints={generateDataPoints(50)} />
```

### Data Flow

```
Home Page → SpaceshipCanvas → Spaceship (with engine particles)
                            → TargetingCircle (Doppler shift)
                            → DataPoints (simple x,y,z markers)
                            → StarField
```

### Performance Targets

- **Desktop:** 60 FPS with 50-100 engine particles + data points
- **Mobile:** 30 FPS with 20-50 engine particles
- **Initial load:** <100ms to first frame
- **Bundle size:** <200KB for Three.js code
- **Smooth Doppler shift:** No frame drops during color transitions

---

## Data Integration Options

### Simple Coordinate System

**Approach:** Static data points with x,y,z coordinates

```typescript
interface DataPoint {
  id: string;
  position: [number, number, number]; // x, y, z coordinates
  timestamp: number;
}

// Example: Random data points for testing
const generateDataPoints = (count: number): DataPoint[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `point-${i}`,
    position: [
      (Math.random() - 0.5) * 20, // x: -10 to 10
      (Math.random() - 0.5) * 20, // y: -10 to 10
      (Math.random() - 0.5) * 20, // z: -10 to 10
    ],
    timestamp: Date.now(),
  }));
};
```

---

## Technical Challenges & Solutions

### Challenge 1: Performance on Low-End Devices

**Solution:**

- Detect device capabilities using `navigator.hardwareConcurrency`
- Reduce particle count and disable effects on mobile
- Implement quality presets: Low, Medium, High

### Challenge 2: Canvas Blocking Interactions

**Solution:**

- Use `pointer-events-none` on canvas container
- Allow interactions through to underlying content
- Only enable pointer events for interactive 3D elements if needed

### Challenge 3: Scene Complexity

**Solution:**

- Start simple with geometric primitives
- Add complexity incrementally
- Profile performance at each step

### Challenge 4: Bundle Size

**Solution:**

- Use tree-shaking with R3F (only import what you need)
- Lazy load Three.js scene (load after initial page render)
- Consider code splitting for 3D components

---

## Alternative: Canvas.js / WebGL Fallback

If Three.js proves too heavy, consider simpler alternatives:

- **Canvas 2D API** - Draw simple spaceship sprite with particle effects
- **CSS 3D Transforms** - Use DOM elements with CSS animations
- **WebGL directly** - More control, but more complexity

---

## Mobile Considerations

### Responsive Design

- Reduce engine particles to 20-30 on mobile
- Disable targeting circle on mobile (optional)
- Simplify spaceship geometry
- Lower frame rate target (30fps)
- Limit data points to essential markers only

### Battery Impact

- Pause animation when page is not visible
- Add manual disable toggle in settings
- Consider battery API to auto-disable on low battery

---

## Accessibility

### Reduced Motion

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Show static spaceship image instead of animation
  return <StaticSpaceshipImage />;
}
```

### Screen Readers

- Canvas is decorative, use `aria-hidden="true"`
- Ensure all interactive content remains accessible
- Don't rely on canvas for critical information

---

## Testing Plan

### Visual Testing

- [ ] Test on different screen sizes (mobile, tablet, desktop)
- [ ] Verify z-index layering doesn't block content
- [ ] Check animation smoothness at different frame rates
- [ ] Test engine particle animation consistency
- [ ] Verify Doppler shift color transitions (blue/red shift)
- [ ] Test with various data point counts (0, 10, 50, 100 points)

### Performance Testing

- [ ] Measure FPS with Chrome DevTools
- [ ] Check memory usage over time (no leaks)
- [ ] Test on low-end devices (throttled CPU)
- [ ] Verify battery impact on mobile

### Browser Compatibility

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (WebGL quirks)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

---

## Implementation Timeline

### Week 1: Foundation

- Days 1-2: Install dependencies, basic R3F setup
- Days 3-4: Create geometric spaceship model
- Day 5: Add star field background

### Week 2: Data Visualization

- Days 1-2: Implement particle system for data points
- Days 3-4: Integrate with analytics API
- Day 5: Add animation and transitions

### Week 3: Polish & Optimization

- Days 1-2: Performance optimization (instancing, LOD)
- Days 3-4: Mobile optimization and responsive behavior
- Day 5: Testing and bug fixes

---

## Example Code Structure

### SpaceshipCanvas.tsx

```typescript
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Spaceship } from './Spaceship';
import { TargetingCircle } from './TargetingCircle';
import { DataPoints } from './DataPoints';
import { StarField } from './StarField';

interface SpaceshipCanvasProps {
  dataPoints?: Array<{ id: string; position: [number, number, number] }>;
}

export function SpaceshipCanvas({ dataPoints = [] }: SpaceshipCanvasProps) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 75 }}
      gl={{ antialias: false, alpha: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <StarField count={1500} />
        <Spaceship position={[0, 0, 0]} />
        <TargetingCircle />
        <DataPoints points={dataPoints} />
      </Suspense>
    </Canvas>
  );
}
```

### Spaceship.tsx (with Engine Particles)

```typescript
import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { Mesh, Points, BufferGeometry, BufferAttribute } from 'three';

export function Spaceship({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<Mesh>(null);
  const particlesRef = useRef<Points>(null);

  // Create engine exhaust particles
  const particles = useMemo(() => {
    const count = 50;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.3;     // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.3; // y
      positions[i * 3 + 2] = -1 - Math.random() * 2;      // z (behind ship)
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }

    // Animate exhaust particles
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] -= delta * 2; // Move particles backward
        if (positions[i + 2] < -3) {
          positions[i + 2] = -1; // Reset to engine position
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={position}>
      {/* Spaceship body */}
      <mesh ref={meshRef}>
        <coneGeometry args={[0.5, 2, 8]} />
        <meshStandardMaterial color="#4299e1" emissive="#2b6cb0" emissiveIntensity={0.5} />
      </mesh>

      {/* Engine exhaust particles */}
      <points ref={particlesRef} geometry={particles}>
        <pointsMaterial size={0.05} color="#f56565" transparent opacity={0.6} />
      </points>
    </group>
  );
}
```

### TargetingCircle.tsx (Doppler Shift Effect)

```typescript
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';

export function TargetingCircle() {
  const ringRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      // Calculate distance from camera
      const distanceZ = ringRef.current.position.z - state.camera.position.z;

      // Doppler shift: blue when approaching, red when receding
      const hue = distanceZ > 0 ? 0 : 240; // 0=red, 240=blue
      const color = `hsl(${hue}, 100%, 50%)`;

      (ringRef.current.material as any).color.setStyle(color);
    }
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[3, 0.05, 16, 100]} />
      <meshBasicMaterial color="#00ffff" transparent opacity={0.5} />
    </mesh>
  );
}
```

### DataPoints.tsx

```typescript
import { useMemo } from 'react';

interface DataPoint {
  id: string;
  position: [number, number, number];
}

export function DataPoints({ points }: { points: DataPoint[] }) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(points.length * 3);

    points.forEach((point, i) => {
      positions[i * 3] = point.position[0];
      positions[i * 3 + 1] = point.position[1];
      positions[i * 3 + 2] = point.position[2];
    });

    return positions;
  }, [points]);

  if (points.length === 0) return null;

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[geometry, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.2} color="#ffffff" transparent opacity={0.8} />
    </points>
  );
}
```

---

## Will This Work?

### ✅ YES - This Approach is Viable

**Pros:**

1. **React Three Fiber is production-ready** - Used by many large sites
2. **Performance is manageable** - With proper optimization
3. **Great visual impact** - Creates memorable user experience
4. **Flexible data integration** - Can visualize any analytics data
5. **Progressive enhancement** - Can gracefully degrade on low-end devices

**Cons:**

1. **Bundle size increase** - ~100-200KB for Three.js (acceptable)
2. **Learning curve** - Requires 3D graphics knowledge
3. **Testing complexity** - Need to test across many devices
4. **Battery consumption** - Need to monitor and optimize

### Recommended Approach

**Start Simple:**

1. Build geometric spaceship with engine particles (1 day)
2. Add targeting circle with Doppler shift (0.5 day)
3. Add simple data point markers (0.5 day)
4. Test performance extensively
5. Add complexity incrementally

**Iterate:**

- Launch with basic version
- Gather user feedback
- Monitor performance metrics
- Add advanced features based on data

---

## Success Metrics

**Achieved:**
- ✅ Canvas loads quickly (lazy loaded, only on desktop)
- ✅ Maintains smooth FPS on desktop (60 FPS with spaceship + stars)
- ✅ Mobile users not impacted (Three.js disabled on mobile)
- ✅ Initial bundle reduced from 561KB to 92KB gzipped (84% reduction)
- ✅ Three.js chunk lazy loaded (300KB gzipped)
- ✅ No blocking of user interactions (pointer-events-none)

**To Verify (Phase 4):**
- [ ] Maintains 60 FPS with engine particles + data points
- [ ] Doppler shift color transitions are smooth
- [ ] No memory leaks after 5 minutes with particles
- [ ] Positive user feedback on visual appeal

---

## Fallback Strategy

If performance is inadequate:

1. Reduce to 2D Canvas API animation
2. Use CSS animations with sprites
3. Show static animated GIF
4. Remove animation entirely (last resort)

---

## Next Steps

**Phase 4: Data Visualization Implementation**

1. **Engine Particles** (2-3 hours)
   - Create particle system for engine exhaust
   - Implement particle animation (moving backward from ship)
   - Test particle count for performance (50 desktop, 20-30 mobile)

2. **Targeting Circle** (2-3 hours)
   - Create torus geometry ring around spaceship
   - Implement Doppler shift color effect
   - Blue when approaching camera, red when receding
   - Test color transition smoothness

3. **Data Points** (2-3 hours)
   - Create simple point markers at x,y,z coordinates
   - Generate test data (random positions)
   - Implement BufferGeometry for efficient rendering
   - Test with varying point counts (0, 10, 50, 100)

4. **Integration & Testing** (2-3 hours)
   - Integrate all Phase 4 components
   - Performance testing (FPS, memory)
   - Visual testing (all effects working together)
   - Mobile testing (reduced particle counts)
