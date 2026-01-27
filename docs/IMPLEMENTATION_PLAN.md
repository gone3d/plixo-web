# Projects API Implementation Plan - Quick Reference

## Your Questions Answered

### 1. Should we create the API first, then build out projects using Admin Console?

**YES - This is the recommended approach.**

**Flow**:
```
1. Build API endpoints (local)
2. Deploy API to production
3. Build Admin Console UI (local)
4. Deploy Admin Console (production)
5. You create ONE project via UI (verify it works)
6. I use curl commands to populate the rest
```

**Why this order**:
- ✅ API is foundation - needs to exist before UI can use it
- ✅ Admin Console UI provides a user-friendly way to create/manage projects
- ✅ You test the UI flow with one project (validates the whole system)
- ✅ curl commands are faster for bulk operations (I'll handle the rest)

---

### 2. Do we need to jump to local for the API refactor?

**YES - Strongly recommended.**

**Reasons**:
1. **Safety** - Don't break production while iterating
2. **Speed** - Faster iteration without deployment delays
3. **Testing** - Can test full flow locally: API → Admin Console → Work page
4. **Debugging** - Easier to debug with local logs
5. **Confidence** - Once working locally, deploy to production in one go

**Local Setup**:
```bash
# Terminal 1 - API (in api directory)
npm run dev              # Runs on http://localhost:8787
npx wrangler d1 execute plixo-db --local --file=./src/db/migrations/000X_create_projects_table.sql

# Terminal 2 - Frontend (in plixo-web directory)
# Temporarily update .env.development:
VITE_API_URL=http://localhost:8787
npm run dev              # Runs on http://localhost:5173
```

**When to switch back to production**:
- After Phase 1 complete (API works locally)
- After Phase 3 complete (Admin Console works locally)
- After Phase 5 complete (Work page works locally)
- Then deploy everything to production

---

## Recommended Implementation Order

### Phase 1: API Development (LOCAL - 2-3 days)

**Location**: Work in `api` directory locally

1. Create migration file: `src/db/migrations/000X_create_projects_table.sql`
2. Create type definitions: `src/types/projects.ts`
3. Create routes:
   - `src/routes/projects.ts` (public endpoints)
   - `src/routes/admin/projects.ts` (admin endpoints)
4. Create database queries: `src/db/queries/projects.ts`
5. Add Zod validation schemas
6. Test locally with curl:
   ```bash
   # Create project
   curl -X POST http://localhost:8787/admin/projects \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title":"Test","description":"Test project",...}'

   # Get all projects
   curl http://localhost:8787/projects
   ```

**Deliverable**: API working locally, tested with curl

---

### Phase 2: Deploy API (PRODUCTION - 1 day)

**Location**: Deploy to Cloudflare

1. Deploy API to production: `npm run deploy`
2. Run migration on production D1:
   ```bash
   npx wrangler d1 execute plixo-db --remote --file=./src/db/migrations/000X_create_projects_table.sql
   ```
3. Verify endpoints work:
   ```bash
   curl https://api.plixo.com/projects
   ```

**Deliverable**: API live in production, empty database

---

### Phase 3: Admin Console UI (LOCAL → PRODUCTION - 2-3 days)

**Location**: Work in `plixo-web` directory locally, then deploy

1. **Local Development**:
   - Create `src/components/admin/ProjectsManager.tsx`
   - Add to `src/pages/Console.tsx`
   - Update `.env.development` to `VITE_API_URL=http://localhost:8787`
   - Test creating/editing projects against local API

2. **Deploy to Production**:
   - Revert `.env.development` to `VITE_API_URL=https://api.plixo.com`
   - Deploy frontend: `npm run build && npm run deploy`

3. **Validation**:
   - You log in to production Console
   - You create ONE project via the UI
   - Verify it appears in the database
   - Verify it appears on Work page (if Work page is updated)

**Deliverable**: Admin Console with projects management, you created one test project

---

### Phase 4: Data Population (PRODUCTION - 1 hour)

**Location**: curl commands against production API

1. **I'll create a script** that:
   - Reads `/config/work-projects.json`
   - Transforms each WorkProject → Project format
   - Generates curl commands for each project

2. **You run the script** (or I'll provide individual curl commands)

3. **Example curl command**:
   ```bash
   curl -X POST https://api.plixo.com/admin/projects \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Analytics Dashboard",
       "description": "Real-time analytics platform with D1 backend",
       "technologies": ["React", "TypeScript", "D1", "Cloudflare Workers"],
       "status": "Live",
       "image": "/assets/projects/analytics.jpg",
       "live_url": "https://analytics.plixo.com",
       "github_url": "https://github.com/user/analytics",
       "featured": true,
       "priority": 1
     }'
   ```

4. **Verify**: Check Admin Console to see all projects listed

**Deliverable**: All projects in production database

---

### Phase 5: Frontend Integration (LOCAL → PRODUCTION - 1 day)

**Location**: Work in `plixo-web` directory locally, then deploy

1. **Local Development**:
   - Update `src/pages/Work.tsx` to fetch from API
   - Update `src/components/molecules/ProjectCard.tsx` (field names: liveUrl → live_url)
   - Update `src/types/` if needed
   - Test locally with local API

2. **Deploy to Production**:
   - Deploy frontend
   - Verify Work page displays all projects

3. **Cleanup**:
   - Remove `/config/work-projects.json`
   - Remove projects from `temp-data.ts` if not used elsewhere
   - Deploy final cleanup

**Deliverable**: Work page loading from API, static JSON removed

---

## Working with Production API

### Getting Your Admin Token

You'll need your admin JWT token for curl commands. Get it from browser:

```javascript
// In browser console while logged in as admin
localStorage.getItem('token')
// or
sessionStorage.getItem('token')
```

### Example curl Commands

**Create Project**:
```bash
TOKEN="your_admin_jwt_token_here"

curl -X POST https://api.plixo.com/admin/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Project Name",
    "description": "Short description",
    "technologies": ["React", "TypeScript"],
    "status": "Live",
    "image": "/assets/projects/image.jpg",
    "live_url": "https://example.com",
    "github_url": "https://github.com/user/repo",
    "demo_url": "https://demo.example.com",
    "featured": true,
    "priority": 1
  }'
```

**Get All Projects**:
```bash
curl https://api.plixo.com/projects
```

**Update Project**:
```bash
curl -X PUT https://api.plixo.com/admin/projects/PROJECT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'
```

**Delete Project**:
```bash
curl -X DELETE https://api.plixo.com/admin/projects/PROJECT_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## Decision Summary

### ✅ What We Agreed On

1. **Simplified data model** - 13 fields, no nested objects (see DATA_STRUCTURE_MAP.md)
2. **API-first approach** - Build API before UI
3. **Work locally** - Develop and test locally before production deployment
4. **Admin Console entry** - You create one project via UI, I bulk-create rest with curl
5. **No backwards compatibility** - Dev mode, we're making breaking changes
6. **Field name changes** - camelCase → snake_case (liveUrl → live_url, etc.)

### 📋 Next Steps

**Immediate next action**:
- Start Phase 1 - API Development (local)
- Create migration file and API endpoints
- Test locally with curl

**Your role**:
- Review this plan
- Confirm approach
- Test creating one project via Admin Console UI when it's ready

**My role**:
- Build the API endpoints (Phase 1)
- Build the Admin Console UI (Phase 3)
- Create bulk curl scripts for data population (Phase 4)
- Update Work.tsx to use API (Phase 5)

---

## Files to Reference

- **DATA_STRUCTURE_MAP.md** - Detailed comparison of data structures
- **PROJECTS_UPDATE.md** - Full migration plan with all technical details
- **This file (IMPLEMENTATION_PLAN.md)** - Quick reference for implementation order

Ready to start Phase 1 when you give the go-ahead! 🚀
