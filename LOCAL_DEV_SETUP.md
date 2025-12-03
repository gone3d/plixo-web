# Local Development Setup - Quick Reference

**Last Updated:** December 2, 2025

## Current Configuration

```
Local Frontend (localhost:5173) → Production API (api.plixo.com) → Production Database
```

## Environment Settings

**File:** `.env.development`

```bash
VITE_API_URL=https://api.plixo.com
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

## Authentication

### Admin Login (Use this for local development)
```
Username: admin
Password: admin123
```

### Guest Login
**❌ DOES NOT WORK** when testing locally against production API
- Turnstile CAPTCHA validation fails (test tokens rejected by production)
- Use admin login instead for local development

## Quick Start

```bash
cd plixo-web
npm run dev
# Opens at http://localhost:5173
# Click "Login" and use admin credentials
```

## Why This Setup?

- ✅ Develop CMS features with real production data
- ✅ No need to recreate database content locally
- ✅ Test against actual production environment
- ✅ All changes ready for immediate deployment

## Switching to Local API

If you need to test against local API instead:

```bash
# Edit .env.development:
VITE_API_URL=http://localhost:8788

# Start local API in separate terminal:
cd plixo-api
npm run dev

# Guest login will work with local API
```

## What We're Building

Moving from static configuration files to database-driven CMS:
- Content management (About, Projects, etc.)
- System settings (already done with maintenance mode)
- Admin console UI for managing all content
- No more manual config file updates

See [ENV_SETUP.md](ENV_SETUP.md) for complete environment documentation.
