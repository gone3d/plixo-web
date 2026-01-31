# Milestone: Three.js Spaceship & Analytics Visualization

## Overview
Add an interactive Three.js canvas overlay to the home page featuring a 3D spaceship with real-time analytics tracking data visualization. The animation will serve as an engaging, futuristic background that visualizes visitor activity in 3D space.

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
│       ├── Spaceship.tsx              # 3D spaceship model
│       ├── DataParticles.tsx          # Analytics data visualization
│       ├── StarField.tsx              # Background stars
│       ├── TrackingBeam.tsx           # Connection lines to data points
│       └── types.ts                   # TypeScript interfaces
└── pages/
    └── Home.tsx                       # Updated with canvas overlay
```

### 3. Features Breakdown

#### Phase 1: Basic Setup ✓
- [ ] Install dependencies
- [ ] Create basic Three.js scene with React Three Fiber
- [ ] Add responsive canvas that covers viewport
- [ ] Implement proper z-index layering (behind content)
- [ ] Add FPS limiter for performance (30-60fps)

#### Phase 2: Spaceship Model ✓
**Option A: Simple Geometric Spaceship**
- [ ] Create spaceship using Three.js primitives (cones, cylinders, spheres)
- [ ] Add metallic/emissive materials with glow effect
- [ ] Implement rotation animation
- [ ] Add engine trail particles

**Option B: GLTF Model (More Advanced)**
- [ ] Find/create GLTF spaceship model
- [ ] Load model using useGLTF hook
- [ ] Optimize model size (<500KB)
- [ ] Add lighting and shadows

**Recommendation: Start with Option A for faster implementation**

#### Phase 3: Star Field Background ✓
- [ ] Generate random star positions using BufferGeometry
- [ ] Create point cloud with varying sizes and brightness
- [ ] Add subtle twinkling animation
- [ ] Parallax effect based on mouse movement (optional)

#### Phase 4: Data Visualization ✓
**Tracking Data Points:**
- [ ] Fetch real-time analytics data (visitors, events, locations)
- [ ] Map data to 3D coordinates around spaceship
- [ ] Create particle system for data points
- [ ] Color-code by data type:
  - Blue: Page views
  - Green: Project views
  - Orange: External links
  - Purple: Form submissions
  - Red: Geographic locations

**Data Animation:**
- [ ] Animate data points floating toward spaceship
- [ ] Fade in new data points as they arrive
- [ ] Remove old data points after X seconds
- [ ] Add connection beams from spaceship to active data points

#### Phase 5: Camera & Controls ✓
- [ ] Position camera for optimal view
- [ ] Smooth orbital camera movement
- [ ] Optional: Mouse-based camera orbit
- [ ] Mobile: Auto-orbit without interaction

#### Phase 6: Performance Optimization ✓
- [ ] Implement object pooling for particles
- [ ] Use instanced meshes for repeated geometry
- [ ] Add level-of-detail (LOD) system
- [ ] Pause animation when tab is not visible
- [ ] Reduce particle count on mobile devices
- [ ] Use `useFrame` efficiently (avoid state updates)

#### Phase 7: Polish & UX ✓
- [ ] Fade-in animation on page load
- [ ] Loading state while scene initializes
- [ ] Toggle button to enable/disable animation (settings)
- [ ] Smooth transitions between states
- [ ] Accessibility: Skip animation for `prefers-reduced-motion`

---

## Implementation Details

### Canvas Overlay Structure
```tsx
// Home.tsx
<div className="relative min-h-screen">
  {/* Three.js Canvas - Fixed background */}
  <div className="fixed inset-0 z-0 pointer-events-none">
    <SpaceshipCanvas analyticsData={analyticsData} />
  </div>

  {/* Existing content - Above canvas */}
  <div className="relative z-10">
    <Navigation />
    <HeroSection />
    {/* ... rest of content ... */}
  </div>
</div>
```

### Data Flow
```
Analytics API → Home Page → SpaceshipCanvas → DataParticles
                                           → Spaceship (updates based on activity)
```

### Performance Targets
- **Desktop:** 60 FPS with 500+ particles
- **Mobile:** 30 FPS with 200 particles
- **Initial load:** <100ms to first frame
- **Bundle size:** <200KB for Three.js code

---

## Data Integration Options

### Real-Time Data (Live Updates)
**Approach:** WebSocket or polling
```typescript
// Fetch new events every 5 seconds
useEffect(() => {
  const interval = setInterval(async () => {
    const newEvents = await fetchRecentEvents({ seconds: 5 });
    setDataPoints(prev => [...prev, ...newEvents].slice(-100)); // Keep last 100
  }, 5000);

  return () => clearInterval(interval);
}, []);
```

### Aggregate Data (Static Visualization)
**Approach:** Show current session data as floating orbs
```typescript
interface DataPoint {
  id: string;
  type: 'pageview' | 'project' | 'external' | 'form' | 'location';
  position: [number, number, number]; // x, y, z
  value: number; // Size/intensity
  timestamp: number;
}
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
- Reduce particle count to 50-100 on mobile
- Disable expensive effects (shadows, post-processing)
- Simplify spaceship geometry
- Lower frame rate target (30fps)

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
- [ ] Test with various data volumes (0, 10, 100, 1000 points)

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
import { DataParticles } from './DataParticles';
import { StarField } from './StarField';

interface SpaceshipCanvasProps {
  analyticsData?: {
    recentEvents: Array<{ type: string; timestamp: number }>;
  };
}

export function SpaceshipCanvas({ analyticsData }: SpaceshipCanvasProps) {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return null; // Or static image
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 75 }}
      gl={{ antialias: false }} // Disable AA for performance
      dpr={[1, 2]} // Limit pixel ratio
      frameloop="demand" // Only render when needed
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />

        <StarField count={1000} />
        <Spaceship position={[0, 0, 0]} />
        <DataParticles events={analyticsData?.recentEvents || []} />
      </Suspense>
    </Canvas>
  );
}
```

### Spaceship.tsx (Simple Geometric Version)
```typescript
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';

export function Spaceship({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<Mesh>(null);

  // Rotate spaceship slowly
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Main body - Cone */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <coneGeometry args={[0.5, 2, 8]} />
        <meshStandardMaterial color="#4299e1" emissive="#2b6cb0" emissiveIntensity={0.5} />
      </mesh>

      {/* Wings - Boxes */}
      <mesh position={[-0.7, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.3, 0.1, 1]} />
        <meshStandardMaterial color="#3182ce" />
      </mesh>
      <mesh position={[0.7, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.3, 0.1, 1]} />
        <meshStandardMaterial color="#3182ce" />
      </mesh>

      {/* Engine glow - Small sphere */}
      <mesh position={[0, 0, -1]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#f56565" emissive="#e53e3e" emissiveIntensity={2} />
      </mesh>
    </group>
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
1. Build geometric spaceship first (1-2 days)
2. Add basic particle system (1 day)
3. Test performance extensively
4. Add complexity incrementally

**Iterate:**
- Launch with basic version
- Gather user feedback
- Monitor performance metrics
- Add advanced features based on data

---

## Success Metrics

- [ ] Canvas loads in <500ms
- [ ] Maintains 30+ FPS on mobile
- [ ] Maintains 60 FPS on desktop
- [ ] No memory leaks after 5 minutes
- [ ] No user complaints about performance
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

1. **Create proof-of-concept** (4 hours)
   - Install R3F, create basic scene
   - Add simple geometric spaceship
   - Test performance

2. **Decision point:**
   - If POC performs well → Continue to Phase 2
   - If POC has issues → Consider simpler approach

3. **Full implementation** (1-2 weeks)
   - Follow milestone phases
   - Test continuously
   - Optimize aggressively
