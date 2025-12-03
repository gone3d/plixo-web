# Environment Configuration

## Quick Reference

### Current Setup (Local Dev → Production API)

```bash
npm run dev    # Uses PRODUCTION API (api.plixo.com) with production database
npm run build  # Uses production API (api.plixo.com)
```

**⚠️ IMPORTANT: Guest login does not work when testing locally against production API**
- Turnstile CAPTCHA validation fails (test tokens don't work with production secret)
- **Solution**: Use admin login credentials instead
  - Username: `admin`
  - Password: `admin123`

### Switching Between Local/Production API

**Currently configured:** Local frontend → Production API

```bash
# Current .env.development setting:
VITE_API_URL=https://api.plixo.com
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA  # Test key for localhost
```

**To use local API instead:**

```bash
# Edit .env.development:
VITE_API_URL=http://localhost:8788
# (Keep same Turnstile test key)
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
  - Local API: `http://localhost:8788`
  - Production API: `https://api.plixo.com` (current setting)

- **VITE_TURNSTILE_SITE_KEY**: Cloudflare Turnstile CAPTCHA key
  - Test key (localhost): `1x00000000000000000000AA` (current setting)
  - Production key: `0x4AAAAAAB40kAELVx8gHpRd`
  - **Note**: Test key only works with local API, not production API

## CloudFlare Pages Deployment

CloudFlare Pages does **not** use `.env` files. Environment variables are configured in the dashboard:

**Pages** → **plixo-web** → **Settings** → **Environment Variables**

Set `VITE_API_URL=https://api.plixo.com` for production environment.

## Notes

- Vite requires `VITE_` prefix for client-side environment variables
- Changes require rebuild (`npm run build`)
- Never commit `.env.development.local` (already in .gitignore)
- Never put secrets in VITE_ variables (they're embedded in the client bundle)
