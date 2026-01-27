# Project Data Extraction Summary

## Overview
Extracted 9 projects from `/Users/don/Projects 2/GitHub/plixo-web/src/config/temp-data.ts` and generated curl commands to create them in the API.

## Script Location
**File**: `/Users/don/Projects 2/GitHub/plixo-web/create_projects.sh`

**Usage**:
```bash
# Make executable (already done)
chmod +x create_projects.sh

# Run the script
./create_projects.sh

# Or with bash directly
bash create_projects.sh
```

## Projects Extracted

### Featured Projects (7)

#### 1. Tenebrae - Encrypted Contact & Analytics Platform
- **Status**: Live
- **Priority**: 0 (highest)
- **Technologies**: React, TypeScript, Cloudflare Workers, Cloudflare D1, Vite, Tailwind CSS, ReCharts, Web Crypto API, Cloudflare Turnstile
- **URLs**:
  - Live: https://www.tenebrae.ai
  - GitHub: https://github.com/gone3d/tenebraeV2
  - Demo: https://tenebrae.plixo.com
- **Image**: /assets/work/tenebrae_1.jpg

#### 2. Hourlings - Collaborative Writers Portal
- **Status**: In Development
- **Priority**: 1
- **Technologies**: React, TypeScript, Cloudflare Workers, Cloudflare D1, Vite, Tailwind CSS, Quill Editor, Hono, React Markdown
- **URLs**:
  - Live: https://hourlings.plixo.com
  - GitHub: https://github.com/gone3d/hourlings-ui
  - Demo: https://hourlings.plixo.com
- **Image**: /assets/work/hourlings_1.jpg

#### 3. Plixo Portfolio Website
- **Status**: In Development
- **Priority**: 2
- **Technologies**: React, TypeScript, Tailwind CSS, Vite, Node.js, PostgreSQL, AES-256 Encryption, GDPR Compliance
- **URLs**:
  - Live: https://plixo.com
  - GitHub: https://github.com/gone3d/plixo-web
  - Demo: /work
- **Image**: /assets/work/plixo_web_1.jpg

#### 4. Capital One Developer Portal Transformation
- **Status**: Live
- **Priority**: 1
- **Technologies**: Angular, Node.js, AWS Lambda, S3, Jenkins, Docker, DataDog, Python
- **URLs**:
  - GitHub: https://github.com/capitalone
- **Image**: /assets/work/placeholder.jpg (needs replacement)

#### 5. HAARP Antenna Control System
- **Status**: Live
- **Priority**: 2
- **Technologies**: C++, Qt, Real-time Systems, Linux, Scientific Computing, Hardware Integration
- **URLs**: None (classified government work)
- **Image**: /assets/work/placeholder.jpg (needs replacement)

#### 6. U.S. State Department Training Platform Migration
- **Status**: Live
- **Priority**: 3
- **Technologies**: JavaScript, HTML5, CSS3, WebGL, Unity3D, Unreal Engine, VR/AR, Flash/ActionScript
- **URLs**: None (classified government work)
- **Image**: /assets/work/placeholder.jpg (needs replacement)

#### 7. AI-Integrated Application Platform
- **Status**: In Development
- **Priority**: 4
- **Technologies**: React, TypeScript, Node.js, Python, Ollama, Hugging Face, PostgreSQL, AWS, Docker
- **URLs**: None (private enterprise project)
- **Image**: /assets/work/placeholder.jpg (needs replacement)

### Non-Featured Projects (2)

#### 8. Echo360 Enterprise Video Platform
- **Status**: Archived
- **Priority**: 5
- **Technologies**: JavaScript, jQuery, HTML5, CSS3, Flash/ActionScript, Video Streaming, Responsive Design
- **URLs**:
  - Live: https://echo360.com
- **Image**: /assets/work/placeholder.jpg (needs replacement)
- **Featured**: false

#### 9. Grab Media Streaming Video Players
- **Status**: Archived
- **Priority**: 6
- **Technologies**: ActionScript 3, Flash, JavaScript, HTML, Ruby on Rails, Adobe Media Server, Video Streaming
- **URLs**: None (company no longer exists)
- **Image**: /assets/work/placeholder.jpg (needs replacement)
- **Featured**: false

## Data Mapping Notes

### Status Values
All projects use valid status values from the API schema:
- **Live** (4 projects): Production systems currently running
- **In Development** (2 projects): Active development
- **Archived** (2 projects): Completed but no longer maintained

### Image Handling
- **Existing images** (3 projects):
  - tenebrae_1.jpg
  - hourlings_1.jpg
  - plixo_web_1.jpg
- **Placeholders** (6 projects): Need professional screenshots or representative images

### URL Handling
- Empty URLs converted to empty strings (`""`) as required
- Some projects have no public URLs (government/classified work)
- Corporate URLs kept generic (e.g., https://github.com/capitalone)

### Featured Projects
7 of 9 projects marked as featured, matching the `portfolioOverview.featuredProjects` array:
- plixo-portfolio-website
- capital-one-developer-portal
- bae-haarp-control (HAARP)
- state-dept-training
- cig-ai-platform

### Display Order
Priority field from temp-data.ts mapped directly to display_order:
- 0-4: Featured projects (ordered by priority)
- 5-6: Non-featured projects

## Script Features

### Error Handling
- Uses 0.5 second delays between requests to avoid overwhelming the API
- Clear progress indicators for each project creation
- Summary statistics at the end

### Configuration
```bash
API_URL="http://localhost:8788"
AUTH_TOKEN="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbl9hY2NvdW50IiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NDcxODQ1MCwiZXhwIjoxNzY0ODA0ODUwfQ.R7HlqSjfbE56lzAfjuHLZvJ_5ulvb59-3hwxHLDPY6I"
```

### Output
- Progress indicator: `[1/9] Creating: Project Title`
- JSON responses from API
- Final summary with statistics

## Next Steps

### 1. Run the Script
```bash
cd "/Users/don/Projects 2/GitHub/plixo-web"
./create_projects.sh
```

### 2. Verify Projects Created
```bash
# Get all projects
curl http://localhost:8788/projects

# Get featured projects only
curl http://localhost:8788/projects?featured=true

# Get specific project
curl http://localhost:8788/projects/tenebrae-platform
```

### 3. Upload Project Images
Replace placeholder images for these 6 projects:
- Capital One Developer Portal
- HAARP Antenna Control System
- U.S. State Department Training Platform
- AI-Integrated Application Platform
- Echo360 Enterprise Video Platform
- Grab Media Streaming Video Players

### 4. Update API if Needed
If the auth token expires, generate a new one:
```bash
curl -X POST http://localhost:8788/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your_password"}'
```

## Database Schema Reference

The API expects this JSON structure for each project:

```json
{
  "title": "Project Title (required)",
  "description": "Short description (required)",
  "technologies": ["Array", "Of", "Strings"] (required),
  "status": "Live|Demo|In Development|Archived|Prototype (required)",
  "image": "/assets/work/image.jpg (required)",
  "live_url": "https://example.com or empty string",
  "github_url": "https://github.com/user/repo or empty string",
  "demo_url": "https://demo.example.com or empty string",
  "featured": true|false (required),
  "display_order": 0 (required, integer for sorting)
}
```

## Authentication Note

The provided JWT token has an expiration time. If you see authentication errors:
1. Generate a new admin login token
2. Update the `AUTH_TOKEN` variable in the script
3. Re-run the script

Token expiration from the provided token:
- **Issued**: 1764718450 (Unix timestamp)
- **Expires**: 1764804850 (Unix timestamp, 24 hours later)

## Additional Data in temp-data.ts

The temp-data.ts file contains more detailed information not included in the API creation:

### Additional Fields Per Project
- `longDescription`: Extended project description
- `category`: "personal", "fintech", "government", "enterprise"
- `metrics`: Performance, technical, impact, growth metrics
- `images.screenshots`: Array of screenshot URLs
- `dateCreated`: ISO date string
- `lastUpdated`: ISO date string
- `teamSize`: Number of team members
- `role`: Developer's role on the project
- `duration`: Project duration string
- `businessImpact`: Impact description
- `technicalChallenges`: Array of challenge descriptions
- `learningsAndGrowth`: Array of learning outcomes

These fields could be added to the API schema if you want to expand project detail pages.

## Summary Statistics

- **Total Projects**: 9
- **Featured**: 7 (77.8%)
- **Non-Featured**: 2 (22.2%)
- **Live**: 4 (44.4%)
- **In Development**: 2 (22.2%)
- **Archived**: 2 (22.2%)
- **With Live URLs**: 5
- **With GitHub URLs**: 4
- **With Demo URLs**: 3
- **Needing Images**: 6 (66.7%)

## Technology Breakdown

Most frequently used technologies across all projects:
1. **JavaScript/TypeScript**: 7 projects
2. **React**: 5 projects
3. **Node.js**: 3 projects
4. **Cloudflare Workers/D1**: 3 projects
5. **HTML5/CSS3**: 3 projects
6. **Vite**: 3 projects
7. **Tailwind CSS**: 3 projects

This demonstrates strong modern web development expertise with cloud-native serverless architecture.
