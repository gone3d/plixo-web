# Claude Session Guide - Plixo Portfolio Website

## Project Overview

**Mission**: Create a cutting-edge portfolio website that positions you as a forward-thinking Director of Technology, combining deep technical expertise with modern sensibilities to prove that experience + innovation = unstoppable.

**Core Philosophy**: "Where seasoned leadership meets cutting-edge innovation" - showcase technical excellence while maintaining professional credibility and accessibility.

## Current Project Status

**Phase**: Initial setup and planning
**Next Priority**: Foundation development (React 18, Vite, TypeScript setup)
**Architecture**: Multi-page React application with 3D integration and real-time features

## Project Goals & Page Structure

### 1. Landing Page (`/`)
**Priority**: HIGH - First impression showcase

**Features to Implement**:
- 3D Spline background with animated geometric shapes
- Dynamic text animations and particle effects responding to mouse movement
- Interactive skills constellation showing tech stack relationships
- Live metrics dashboard with real-time visitor data and GitHub integration
- Call-to-action that morphs based on visitor behavior

**Success Criteria**:
- Sub-3-second load time with smooth 60fps animations
- Mobile-responsive with touch-optimized interactions
- Progressive enhancement for 3D elements

### 2. Work Showcase (`/work`)
**Priority**: HIGH - Core portfolio content

**Features to Implement**:
- Masonry layout project gallery with animated previews
- Featured applications including roguelike game and web apps
- Deep-dive case studies with interactive code snippets
- Legacy projects section with technology evolution timeline
- External app launch buttons with loading states

**Success Criteria**:
- Seamless integration with external applications
- Performance-optimized image loading and animations
- Clear project impact metrics and technology showcases

### 3. About/Journey (`/about`)
**Priority**: MEDIUM - Personal narrative

**Features to Implement**:
- Interactive career timeline with technology evolution visualization
- Personal philosophy and leadership insights sections
- Gaming heritage integration and 3D art gallery
- "From Nethack to Full Stack" narrative storytelling
- Preview and launch link to standalone roguelike game

**Success Criteria**:
- Engaging storytelling with interactive elements
- Professional yet personal tone
- Gaming references that add character without compromising credibility

### 4. Analytics Dashboard (`/insights`)
**Priority**: MEDIUM - Technical demonstration

**Features to Implement**:
- Real-time visitor analytics with geographic visualization
- GitHub integration showing live commit activity and language usage
- Performance metrics visualization with Web Vitals tracking
- Anonymized engagement data with privacy compliance

**Success Criteria**:
- GDPR-compliant data collection
- Real-time updates without performance impact
- Meaningful insights for visitors

### 5. Contact/Connect (`/connect`)
**Priority**: MEDIUM - Conversion focused

**Features to Implement**:
- Smart contact form with dynamic fields based on visitor behavior
- Calendar integration for meeting scheduling
- Availability status with response time expectations
- LinkedIn/GitHub integration and social proof

**Success Criteria**:
- High conversion rate (>5% target)
- Seamless scheduling integration
- Professional contact management

## Technical Architecture

### Core Stack
- **Frontend**: React 18, Vite, TypeScript (strict mode)
- **Styling**: Tailwind CSS v3.4+, Headless UI components
- **3D/Animation**: Spline embeds, Three.js, Framer Motion, GSAP
- **State**: Zustand (lightweight, modern)
- **Routing**: React Router v6
- **Data**: Recharts, D3.js for visualizations

### Integration Points
- **APIs**: Plixo API, GitHub API, WebSocket for real-time features
- **External Apps**: Deep linking, SSO integration, health monitoring
- **Analytics**: Custom event tracking, Web Vitals, A/B testing capability

## Key Development Principles

### Performance Targets
- **Load Time**: < 3 seconds first contentful paint
- **Animation**: Consistent 60fps across all interactions
- **3D Rendering**: Smooth performance on mobile devices
- **Accessibility**: WCAG 2.1 AA compliance throughout

### Code Quality Standards
- Portfolio-quality code demonstrating technical leadership
- Comprehensive error handling with graceful degradation
- Mobile-first responsive design with progressive enhancement
- SEO-optimized with structured data and meta tags

### Gaming Heritage Integration
- **Subtle References**: Tasteful nods to classic gaming in UI
- **Easter Eggs**: Konami code unlocks special content
- **Achievement System**: Unlock indicators for exploring sections
- **Retro Elements**: Brief arcade-style loading animations

## Session Workflow

### Starting Each Session
1. Read this CLAUDE.md for current context
2. Check PLANNING.md for technical architecture
3. Review TASKS.md for current priorities
4. Continue development from last checkpoint

### During Development
- Focus on one page/feature at a time
- Test 3D elements and animations immediately
- Maintain performance benchmarks throughout
- Document architectural decisions in DECISIONS.md

### Session Completion
- Update TASKS.md with completed items
- Note any blockers or technical discoveries
- Update this file with significant progress or changes

## Session History & Major Development Decisions

### Session 1 (2025-09-28)
**Accomplished**:
- Updated CLAUDE_CODE.md from Tenebrae template to portfolio project specifications
- Created initial CLAUDE.md session guide with comprehensive project overview
- Established project goals and technical architecture foundation

**Key Decisions Made**:
- Confirmed React 18 + Vite + TypeScript as core stack
- Prioritized Landing and Work Showcase pages for initial development
- Decided on Spline + Three.js for 3D integration approach
- Established performance targets (sub-3s load, 60fps animations)

**Next Session Priorities**:
- Create PLANNING.md with detailed technical architecture
- Create TASKS.md with development milestones
- Begin project structure setup

## Current Development Context

**Immediate Next Steps**:
1. Set up React/Vite/TypeScript project structure
2. Implement responsive layout system with Tailwind
3. Create component library and design system
4. Set up routing and basic page structure

**Key Dependencies to Establish**:
- Spline account and 3D scene creation
- GitHub API integration setup
- Plixo API endpoint planning
- Real-time features architecture planning

## Links to Other Management Files

- **CLAUDE_CODE.md**: Comprehensive project management guide
- **PLANNING.md**: Technical architecture and roadmap *(to be created)*
- **TASKS.md**: Development milestone tracking *(to be created)*
- **DECISIONS.md**: Architecture decision records *(to be created)*

---

**Remember**: This portfolio demonstrates that seasoned experience combined with cutting-edge innovation creates unstoppable technical leadership. Every feature should reinforce this narrative while maintaining the highest standards of performance and accessibility.