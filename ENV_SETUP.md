# Environment Configuration

## Quick Reference

### Default Setup (No changes needed)

```bash
npm run dev    # Uses local API (localhost:8788)
npm run build  # Uses production API (api.plixo.com)
```

### Testing Local App Against Production API

When you want to test your local development app against the production API:

```bash
# 1. Create the local override file
cp .env.development.local.example .env.development.local

# 2. Run dev server (now points to api.plixo.com)
npm run dev

# 3. To go back to local API, just delete the file
rm .env.development.local
```

## Environment Files

| File | Committed | Purpose |
|------|-----------|---------|
| `.env.development` | ✅ Yes | Default local dev → local API |
| `.env.production` | ✅ Yes | Production builds → production API |
| `.env.development.local` | ❌ No (gitignored) | Override for local dev → production API |
| `.env.development.local.example` | ✅ Yes | Template for creating .local file |

## Environment Variables

- **VITE_API_URL**: Backend API endpoint
  - Local: `http://localhost:8788`
  - Production: `https://api.plixo.com`

## CloudFlare Pages Deployment

CloudFlare Pages does **not** use `.env` files. Environment variables are configured in the dashboard:

**Pages** → **plixo-web** → **Settings** → **Environment Variables**

Set `VITE_API_URL=https://api.plixo.com` for production environment.

## Notes

- Vite requires `VITE_` prefix for client-side environment variables
- Changes require rebuild (`npm run build`)
- Never commit `.env.development.local` (already in .gitignore)
- Never put secrets in VITE_ variables (they're embedded in the client bundle)
