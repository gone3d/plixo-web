# Plixo Portfolio Website

A cutting-edge portfolio website showcasing technical leadership and innovation through modern web technologies.

**Mission**: Demonstrate that experience + innovation = unstoppable technical leadership.

**Live Site**: [https://plixo.com](https://plixo.com)

---

## Tech Stack

- **Frontend**: React 19 + TypeScript (strict mode)
- **Build Tool**: Vite 7.1.12
- **Styling**: Tailwind CSS v4.1.16
- **Routing**: React Router v7.9.5
- **Deployment**: CloudFlare Pages (automatic deployment from `main` branch)
- **API** (future): CloudFlare Pages Functions + D1 database

---

## Features

- ✅ **5 Core Pages**: Landing, Work, About, Insights, Connect
- ✅ **Interactive UI**: Background slideshow, project cards with image previews
- ✅ **Atomic Design**: Reusable component library (atoms, molecules)
- ✅ **Responsive**: Mobile-first design with perfect scrolling
- ✅ **Performance**: 101 KB gzipped bundle, sub-3-second load times
- ✅ **Type Safety**: 100% TypeScript strict mode compliance

---

## Development

### Prerequisites

- Node.js 18+ and npm
- Git

### Setup

```bash
# Clone repository
git clone https://github.com/gone3d/plixo-web.git
cd plixo-web

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:5173 to see the site locally.

### Available Scripts

```bash
npm run dev       # Start development server with hot reload
npm run build     # Build for production (outputs to dist/)
npm run preview   # Preview production build locally
npm run lint      # Run ESLint for code quality checks
```

---

## Deployment

### Automatic Deployment (Production)

This repository is connected to CloudFlare Pages:
- **Automatic deployment** on merge to `main` branch
- **Preview deployments** for all pull requests
- **Custom domain**: [plixo.com](https://plixo.com)

**Workflow:**
1. Create feature branch: `git checkout -b feature/my-update`
2. Make changes and commit
3. Push and create pull request
4. CloudFlare creates preview deployment (test before merging)
5. Merge PR → Automatic production deployment to plixo.com

### Manual Deployment (If Needed)

```bash
# Build production bundle
npm run build

# Deploy via Wrangler CLI
npx wrangler pages deploy dist --project-name=plixo-landing --branch=main
```

### Build Configuration

- **Build command**: `npm run build`
- **Build output**: `dist/`
- **Production branch**: `main`
- **Node.js version**: 18+

---

## Project Structure

```
plixo-web/
├── public/              # Static assets
│   ├── assets/         # Images and backgrounds
│   └── _redirects      # CloudFlare Pages SPA routing
├── src/
│   ├── components/
│   │   ├── atoms/      # Button, Input, Icon, LoadingSpinner, etc.
│   │   └── molecules/  # Navigation, ProjectCard, BackgroundSlideshow, etc.
│   ├── pages/          # Landing, Work, About, Insights, Connect
│   ├── types/          # TypeScript interfaces (portfolio, analytics)
│   ├── config/         # Temp data and configuration
│   ├── contexts/       # React Context providers
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── DEPLOYMENT.md       # Complete CloudFlare Pages deployment guide
├── PLANNING.md         # Technical architecture documentation
├── TASKS.md            # Development roadmap and milestones
└── DECISIONS.md        # Architectural decision records
```

---

## Architecture

### Frontend (Current Repository)
- **Repository**: [github.com/gone3d/plixo-web](https://github.com/gone3d/plixo-web)
- **Deployment**: CloudFlare Pages at plixo.com
- **Status**: ✅ Production-ready

### Backend (Future Development)
- **Repository**: [github.com/gone3d/plixo-api](https://github.com/gone3d/plixo-api)
- **Architecture**: CloudFlare Pages Functions + D1 database
- **Reference**: tenebrae-api-cloudflare (proven architecture)
- **Status**: 📋 Planned for Phase 2

---

## Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide with Git integration
- **[PLANNING.md](./PLANNING.md)** - Technical architecture and component patterns
- **[TASKS.md](./TASKS.md)** - Development roadmap and current priorities
- **[DECISIONS.md](./DECISIONS.md)** - Architectural decision records
- **[CLAUDE.md](./CLAUDE.md)** - Session history and development context

---

## Performance Metrics

- **Bundle Size**: 101.13 KB gzipped (excellent)
- **Build Time**: ~700ms (fast iteration)
- **Target Performance**:
  - Load time: < 3 seconds
  - Lighthouse score: > 90
  - Animations: 60fps

---

## Contributing

This is a personal portfolio project. If you have suggestions or find issues:

1. Create an issue in GitHub
2. Fork the repository
3. Create a feature branch
4. Submit a pull request

---

## License

MIT License - See [LICENSE](./LICENSE) for details

---

## Contact

- **Portfolio**: [plixo.com](https://plixo.com)
- **GitHub**: [@gone3d](https://github.com/gone3d)

---

**Built with** ❤️ **using React, TypeScript, and CloudFlare Pages**
