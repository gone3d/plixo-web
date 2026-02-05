# Milestone 9: About Content Integration (CMS Frontend)

> **Status**: ⏳ PENDING
> **Duration**: 2-3 hours
> **Priority**: HIGH
> **Dependencies**: Milestone 9 (plixo-api) - About Content API ⏳ PENDING
> **Blocks**: None (completes About page dynamic content)

---

## Goal

Integrate the About page with the flat JSON API, replacing hardcoded static content with dynamically loaded data. This demonstrates clean data consumption from a simple, flat API structure (contrast to nested Projects API).

**Design Philosophy**:
- **Client-side parsing**: Frontend determines rendering logic
- **No type checking**: Parser infers from content format
- **Simple data flow**: API → Hook → Component
- **Fallback content**: Graceful degradation if API unavailable

---

## Success Criteria

- ✅ About page loads content from API
- ✅ Parser correctly renders paragraphs vs lists
- ✅ Loading states professional
- ✅ Error handling graceful
- ✅ Performance: First paint <1s
- ✅ Maintains existing design/animations

---

## Current vs New Architecture

### Current (Static)
```
About.tsx
  ├─ Hardcoded JSX
  ├─ Static text in component
  └─ No API calls
```

### New (Dynamic)
```
About.tsx
  ├─ useAbout() hook
  │   └─ React Query
  │       └─ GET /about
  ├─ Content parser
  │   ├─ detectContentType()
  │   ├─ renderParagraph()
  │   └─ renderList()
  └─ Section components
      ├─ AboutSection
      └─ Loading/Error states
```

---

## API Response Structure

```json
{
  "sections": [
    {
      "title": "About Me",
      "content": "Paragraph text...",
      "order": 1
    },
    {
      "title": "Frontend Technologies",
      "content": "React 19.1.1\nTypeScript 5.8.3\nVite 7.1.12",
      "order": 2
    }
  ]
}
```

**Parser Rules**:
- Content with `\n` → Render as `<ul><li>` list
- Content without `\n` → Render as `<p>` paragraph
- Title → Always `<h2>`

---

## Implementation Tasks

### 9.1 TypeScript Types

**File**: `src/types/about.ts` (NEW)

```typescript
/**
 * About Content Types
 * Matches API response structure
 */

export interface AboutSection {
  title: string;
  content: string;
  order: number;
}

export interface AboutContent {
  sections: AboutSection[];
}

// Content type detection
export type ContentType = 'paragraph' | 'list';
```

**Estimated Time**: 5 minutes

---

### 9.2 API Service Method

**File**: `src/services/api.ts` (UPDATE)

Add About API call:

```typescript
/**
 * Get About page content
 * Public endpoint - no auth required
 */
export const getAboutContent = async (): Promise<AboutContent> => {
  const response = await apiClient.get('/about');
  return response.data;
};
```

**Features**:
- No auth required (public endpoint)
- Simple GET request
- Type-safe return

**Estimated Time**: 10 minutes

---

### 9.3 React Query Hook

**File**: `src/hooks/useAbout.ts` (NEW)

```typescript
import { useQuery } from '@tanstack/react-query';
import { getAboutContent } from '../services/api';
import type { AboutContent } from '../types/about';

/**
 * React Query hook for About content
 *
 * Features:
 * - Automatic caching (5 minutes)
 * - Background refetch on window focus
 * - Retry on failure (3 attempts)
 */
export function useAbout() {
  return useQuery<AboutContent>({
    queryKey: ['about'],
    queryFn: getAboutContent,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
```

**Features**:
- Automatic caching
- Background updates
- Retry logic
- Type-safe

**Estimated Time**: 15 minutes

---

### 9.4 Content Parser Utility

**File**: `src/utils/contentParser.ts` (NEW)

```typescript
import type { ContentType } from '../types/about';

/**
 * Detect content type from string
 */
export function detectContentType(content: string): ContentType {
  return content.includes('\n') ? 'list' : 'paragraph';
}

/**
 * Parse list content into array
 */
export function parseListContent(content: string): string[] {
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

/**
 * Parse paragraph content (identity function, but explicit)
 */
export function parseParagraphContent(content: string): string {
  return content.trim();
}
```

**Simple parsing rules**:
- Has newlines? → List
- No newlines? → Paragraph

**Estimated Time**: 10 minutes

---

### 9.5 About Section Component

**File**: `src/components/molecules/AboutSection.tsx` (NEW)

```typescript
import { detectContentType, parseListContent, parseParagraphContent } from '../../utils/contentParser';
import type { AboutSection as AboutSectionType } from '../../types/about';

interface AboutSectionProps {
  section: AboutSectionType;
  className?: string;
}

/**
 * Renders a single About section
 * Automatically determines paragraph vs list rendering
 */
export function AboutSection({ section, className = '' }: AboutSectionProps) {
  const contentType = detectContentType(section.content);

  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-2xl font-bold text-white mb-4">
        {section.title}
      </h2>

      {contentType === 'paragraph' ? (
        <p className="text-slate-300 leading-relaxed">
          {parseParagraphContent(section.content)}
        </p>
      ) : (
        <ul className="space-y-2">
          {parseListContent(section.content).map((item, index) => (
            <li key={index} className="text-slate-300 flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

**Features**:
- Auto-detects content type
- Renders accordingly
- Maintains design system
- Accessible markup

**Estimated Time**: 20 minutes

---

### 9.6 Loading Skeleton Component

**File**: `src/components/atoms/AboutSkeleton.tsx` (NEW)

```typescript
/**
 * Loading skeleton for About page sections
 */
export function AboutSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-4">
          {/* Title skeleton */}
          <div className="h-8 bg-slate-700/40 rounded w-1/3" />

          {/* Content skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-slate-700/30 rounded w-full" />
            <div className="h-4 bg-slate-700/30 rounded w-5/6" />
            <div className="h-4 bg-slate-700/30 rounded w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Features**:
- Matches section layout
- Smooth animation
- Design system colors

**Estimated Time**: 10 minutes

---

### 9.7 Refactor About.tsx

**File**: `src/pages/About.tsx` (MAJOR UPDATE)

Replace hardcoded content with API data:

```typescript
import { useAbout } from '../hooks/useAbout';
import { AboutSection } from '../components/molecules/AboutSection';
import { AboutSkeleton } from '../components/atoms/AboutSkeleton';
import { Icon } from '../components/atoms/Icon';
import { useGlobal } from '../contexts/GlobalContext';
import { analyticsClient } from '../services/analyticsClient';

export function About() {
  const { data: aboutContent, isLoading, error } = useAbout();
  const { state } = useGlobal();

  // Track analytics on mount
  React.useEffect(() => {
    analyticsClient.trackPageView('/about', 'About');
  }, []);

  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-12">
          <Icon name="user" size="xl" className="text-blue-400" />
          <h1 className="text-4xl font-bold text-white">About</h1>
        </div>

        {/* Loading State */}
        {isLoading && <AboutSkeleton />}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6">
            <p className="text-red-400">
              Failed to load About content. Please try again later.
            </p>
          </div>
        )}

        {/* Content */}
        {aboutContent && !isLoading && !error && (
          <div className="space-y-12">
            {aboutContent.sections.map((section, index) => (
              <AboutSection
                key={`${section.title}-${index}`}
                section={section}
              />
            ))}
          </div>
        )}

        {/* Static Footer - Version Info (Keep as-is) */}
        <div className="mt-16 pt-8 border-t border-slate-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Repository Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Source Code
              </h3>
              <div className="space-y-2">
                <a
                  href="https://github.com/yourusername/plixo-web"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => analyticsClient.trackExternalLink('github-web')}
                  className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
                >
                  <Icon name="github" size="sm" />
                  <span>plixo-web (Frontend)</span>
                </a>
                <a
                  href="https://github.com/yourusername/plixo-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => analyticsClient.trackExternalLink('github-api')}
                  className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
                >
                  <Icon name="github" size="sm" />
                  <span>plixo-api (Backend)</span>
                </a>
              </div>
            </div>

            {/* Version Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Version Information
              </h3>
              <div className="text-slate-400 space-y-1 text-sm">
                <p>Web: v{state.version || '1.0.0'}</p>
                <p>API: {state.apiHealthy ? '✓ Online' : '✗ Offline'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Key Changes**:
1. Remove all hardcoded content
2. Use `useAbout()` hook
3. Add loading skeleton
4. Add error handling
5. Map sections dynamically
6. Keep static footer (version info)

**Estimated Time**: 30 minutes

---

### 9.8 Update Barrel Exports

**File**: `src/components/molecules/index.ts` (UPDATE)

```typescript
export { AboutSection } from './AboutSection';
// ... existing exports
```

**File**: `src/components/atoms/index.ts` (UPDATE)

```typescript
export { AboutSkeleton } from './AboutSkeleton';
// ... existing exports
```

**Estimated Time**: 5 minutes

---

## Testing Checklist

### Functionality Tests
- [ ] About page loads without errors
- [ ] Sections render from API data
- [ ] Paragraphs render correctly
- [ ] Lists render with bullets
- [ ] Loading skeleton displays during fetch
- [ ] Error message shows on API failure
- [ ] Static footer still present
- [ ] Analytics tracking works

### Visual Tests
- [ ] Design matches previous static page
- [ ] Spacing consistent
- [ ] Colors match design system
- [ ] Responsive on mobile/tablet/desktop
- [ ] Animations smooth
- [ ] Loading skeleton matches layout

### Performance Tests
- [ ] First paint <1s
- [ ] No layout shifts
- [ ] Smooth scrolling
- [ ] React Query caching works
- [ ] No unnecessary re-renders

### Edge Cases
- [ ] Empty sections array handled
- [ ] Missing API handled gracefully
- [ ] Very long content doesn't break layout
- [ ] Special characters render correctly
- [ ] Unicode content displays properly

---

## File Structure

```
plixo-web/
├── src/
│   ├── types/
│   │   └── about.ts (NEW)
│   ├── hooks/
│   │   └── useAbout.ts (NEW)
│   ├── utils/
│   │   └── contentParser.ts (NEW)
│   ├── components/
│   │   ├── atoms/
│   │   │   └── AboutSkeleton.tsx (NEW)
│   │   └── molecules/
│   │       └── AboutSection.tsx (NEW)
│   ├── services/
│   │   └── api.ts (UPDATE)
│   └── pages/
│       └── About.tsx (MAJOR UPDATE)
```

---

## Comparison: Flat vs Nested API

### About API (This Milestone)
```json
{
  "sections": [
    {
      "title": "About Me",
      "content": "Text...",
      "order": 1
    }
  ]
}
```

**Characteristics**:
- Flat structure (1 level)
- No type field (parser infers)
- Simple iteration
- Frontend controls rendering

### Projects API (Previous)
```json
{
  "projects": [
    {
      "id": "123",
      "title": "Project",
      "technologies": ["React", "Node"],
      "links": [
        { "type": "github", "url": "..." }
      ]
    }
  ]
}
```

**Characteristics**:
- Nested structure (2-3 levels)
- Type fields explicit
- Complex mapping
- API controls structure

**Lesson**: Both approaches have merits. Flat for simple content, nested for complex data.

---

## Estimated Timeline

| Task | Duration |
|------|----------|
| 9.1 Types | 5 min |
| 9.2 API Service | 10 min |
| 9.3 React Query Hook | 15 min |
| 9.4 Content Parser | 10 min |
| 9.5 AboutSection Component | 20 min |
| 9.6 Loading Skeleton | 10 min |
| 9.7 Refactor About.tsx | 30 min |
| 9.8 Barrel Exports | 5 min |
| Testing | 20 min |
| Bug Fixes | 15 min |
| **Total** | **~2.5 hours** |

---

## Deployment Steps

1. Ensure API (Milestone 9 plixo-api) is deployed first
2. Create all files listed above
3. Update About.tsx with dynamic content
4. Test locally: `npm run dev`
5. Verify API connection works
6. Build: `npm run build`
7. Test production build: `npm run preview`
8. Deploy to Cloudflare Pages (auto-deploy via GitHub)
9. Verify production site works
10. Check analytics tracking

---

## Rollback Plan

If issues occur:
1. Keep About.tsx changes (they improve code)
2. Add fallback static content in error state
3. Temporarily return hardcoded content if API unavailable
4. Monitor error rates in analytics
5. Fix API issues in backend repo

**Low Risk**: Graceful degradation ensures page always works

---

## Success Metrics

- ✅ About page loads in <1s (First Paint)
- ✅ Content updates without code deploy
- ✅ Zero layout shifts during load
- ✅ Error rate <1%
- ✅ Mobile experience identical to desktop
- ✅ Lighthouse score >90

---

## Resume Value Delivered

**Skills Demonstrated**:
- React Query for data fetching
- Content parsing algorithms
- Loading state UX patterns
- Error boundary best practices
- API integration (flat JSON)
- TypeScript type safety
- Component composition
- Performance optimization

---

**Next Steps**: Once complete, About page is fully dynamic and can be managed via Admin Console (future: Milestone 8.2 CMS UI)

**Blocks**: Nothing (completes About page modernization)
