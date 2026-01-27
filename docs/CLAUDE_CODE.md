# Claude Code Project Management Guide - Plixo Portfolio Website

## Project Overview

Plixo Portfolio Website is a cutting-edge portfolio showcase that positions you as a forward-thinking Director of Technology. This multi-page application combines modern technical excellence with interactive storytelling and real-time data integration.

### Current Architecture

- **React 18 application** built with Vite and TypeScript
- **Modern Tech Stack**: Tailwind CSS, Headless UI, Zustand state management
- **Advanced Features**: 3D integration (Spline + Three.js), real-time analytics, external app integration
- **Five main sections**: Landing, Work Showcase, About/Journey, Analytics Dashboard, Contact/Connect

### Project Goals

Creating a next-generation portfolio that demonstrates technical leadership and innovation:

1. **Landing Page (`/`)**:

   - 3D Spline background with animated geometric shapes
   - Dynamic text animations and particle effects
   - Interactive skills constellation showing tech stack relationships
   - Live metrics dashboard with real-time visitor data and GitHub integration

2. **Work Showcase (`/work`)**:

   - Masonry layout project gallery with animated previews
   - Featured applications including roguelike game and web apps
   - Deep-dive case studies with interactive code snippets
   - Legacy projects section with technology evolution timeline

3. **About/Journey (`/about`)**:
   - Interactive career timeline with technology evolution
   - Personal philosophy and leadership insights
   - Gaming heritage integration and 3D art gallery
   - "From Nethack to Full Stack" narrative

4. **Analytics Dashboard (`/insights`)**:
   - Real-time visitor analytics and geographic visualization
   - GitHub integration with live commit activity
   - Performance metrics and engagement tracking

5. **Contact/Connect (`/connect`)**:
   - Smart contact form with dynamic fields
   - Calendar integration and availability status
   - Social integration and response time expectations

### Technical Foundation

- **Frontend**: React 18, Vite, TypeScript (strict mode), Tailwind CSS v3.4+
- **UI Components**: Headless UI + custom components
- **3D & Animation**: Spline embeds, Three.js, Framer Motion, GSAP
- **Charts & Visualization**: Recharts, D3.js for advanced visualizations
- **State Management**: Zustand (lightweight, modern)
- **Routing**: React Router v6
- **Data Integration**: Plixo API, WebSocket for real-time features
- **Analytics**: Custom event tracking, Web Vitals monitoring

### Key Features

- Real-time visitor analytics and GitHub activity integration
- 3D interactive elements and skill visualizations
- External application integration with deep linking
- Gaming heritage easter eggs and Konami code unlocks
- Progressive Web App capabilities
- Dark-mode-first design with neon accents

## Philosophy & Approach

The portfolio showcases "where seasoned leadership meets cutting-edge innovation" - demonstrating that experience + innovation = unstoppable. Focus on creating wow moments while maintaining professional credibility and accessibility.

## Core Project Files Structure

All files are maintained in the project root directory and should be referenced in every Claude Code session:

### 1. CLAUDE.md - Session Guide & History

**Purpose**: Central command file that guides all Claude Code interactions
**Creation Prompt**:

```
Read CLAUDE_CODE.md and generate a CLAUDE.md file following the Must Include requirements in Core Project Files Structure, part 1
```

**Must Include**:

- Portfolio project overview and current status
- Session history and major development decisions
- Key architectural patterns for modern React applications
- Current development context and next priorities
- Links to other management files

### 2. PLANNING.md - Technical Architecture

**Purpose**: Comprehensive technical roadmap and architecture documentation for the portfolio website
**Creation Prompt**:

```
Read CLAUDE_CODE.md and create a PLANNING.md file following the Must Include requirements in Core Project Files Structure, part 2
```

**Must Include**:

- Portfolio vision: showcasing technical leadership and innovation
- Modern React application architecture with 3D integration
- Technology stack: React 18, Vite, TypeScript, Tailwind CSS, Spline, Three.js
- Required development tools and external integrations (GitHub API, Plixo API)
- Real-time features and WebSocket integration
- Performance considerations for 3D elements and animations

### 3. TASKS.md - Development Roadmap

**Purpose**: Living task management with milestone tracking for portfolio development
**Creation Prompt**:

```
Read CLAUDE_CODE.md and create a TASKS.md file following the Must Include requirements in Core Project Files Structure, part 3
```

**Must Include**:

- Tasks organized by development phases (Foundation, Core Features, Advanced Features, Polish)
- Clear acceptance criteria for each page and feature
- Dependencies between 3D elements, API integrations, and animations
- Complexity indicators for interactive features
- Priority focus on landing page and work showcase
- Immediate next actions highlighted
- Estimated effort indicators for each milestone

### 4. DECISIONS.md - Architecture Decision Record (ADR)

**Purpose**: Track major technical decisions and their rationale for the portfolio project
**Creation Prompt**:

```
Read CLAUDE_CODE.md and create a DECISIONS.md file following the Must Include requirements in Core Project Files Structure, part 4
```

**Must Include**:

- Decision title and date
- Context and problem statement for portfolio requirements
- Options considered (framework choices, 3D libraries, state management)
- Decision made and rationale (performance, scalability, user experience)
- Consequences and trade-offs for portfolio functionality
- Impact on development workflow and future maintenance
- References to relevant CLAUDE_CODE.md sections

## Session Management Workflow

### Starting a New Session

**Primary Prompt** (Shift-Tab-Tab for planning mode):

```
Please read PLANNING.md, CLAUDE.md, DECISIONS.md, and TASKS.md to understand the portfolio project context. Then complete the next priority task from TASKS.md or continue where we left off. Update the relevant files as work progresses.
```

### During Development

- Mark completed tasks immediately in TASKS.md
- Add newly discovered tasks with appropriate priority
- Update CLAUDE.md with significant progress or decisions
- Document any architectural decisions in DECISIONS.md
- Maintain high-quality code demonstrating technical leadership
- Test 3D elements and animations across different devices

### Session Reset/Summary

**When Context Needs Refreshing**:

```
Please add a session summary to CLAUDE.md summarizing what we've accomplished on the portfolio, current status, any blockers encountered, and the next recommended actions. Also update TASKS.md to reflect completed milestones and current priorities.
```

## Development Standards & Principles

### Code Quality Expectations

- Portfolio-quality code that showcases technical excellence
- Comprehensive error handling and graceful degradation for 3D elements
- Performance optimizations for animations and real-time features
- Accessibility considerations throughout (WCAG 2.1 AA compliance)
- Mobile-responsive design with touch-optimized interactions

### Technology Approach

- Modern React patterns demonstrating current best practices
- Efficient state management with Zustand
- Optimized 3D rendering and animation performance
- Progressive enhancement for external app integrations
- SEO-friendly routing and meta tag management

### Portfolio-Specific Standards

- Sub-3-second load times with 60fps animations
- Graceful fallbacks when external APIs are unavailable
- Privacy-compliant analytics implementation
- Cross-browser compatibility testing
- Progressive Web App functionality

## File Maintenance Rules

1. **Always read all management files at session start**
2. **Update files immediately when portfolio features are implemented**
3. **Keep TASKS.md current with real development progress**
4. **Document decisions when they're made, especially for 3D and performance choices**
5. **Maintain session continuity through CLAUDE.md updates**

## API Integration Points

### Plixo API Endpoints
- `/api/analytics/visitors` - Real-time visitor tracking
- `/api/analytics/popular-content` - Content engagement metrics
- `/api/projects/featured` - Dynamic project showcase
- `/api/github/activity` - Live GitHub integration
- `/api/contact/submit` - Contact form submissions
- `/api/availability/status` - Current availability status

### External Integrations
- GitHub API for live commit activity and repository data
- WebSocket connections for real-time visitor metrics
- Spline API for 3D scene management
- Calendar integration for meeting scheduling

## Performance Targets

- **Load Time**: < 3 seconds first contentful paint
- **Animation**: Consistent 60fps for all animations
- **3D Rendering**: Smooth performance across devices
- **Mobile Optimization**: Touch-friendly interactions
- **Accessibility**: WCAG 2.1 AA compliance
- **SEO**: Optimized meta tags and structured data
