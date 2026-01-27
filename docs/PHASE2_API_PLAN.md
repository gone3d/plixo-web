# PHASE 2: API/Backend Foundation - Strategic Plan

## Overview & Philosophy
**Strategy**: Build comprehensive data architecture before advanced features
- Temp config data structure → Local API service → Database integration → Insights tracking
- Security-first approach with encryption and privacy compliance
- Scalable foundation for real-time features and analytics

---

## Phase 2 Roadmap (3-4 weeks)

### **PRIORITY 1: Data Structure Design** 🗂️
*Complexity: Medium* | *Timeline: 1 week*

#### Portfolio Content Schema
- **Projects Data Structure**
  ```typescript
  interface Project {
    id: string
    title: string
    description: string
    longDescription?: string
    technologies: string[]
    status: 'Live' | 'Demo' | 'In Development' | 'Archived'
    metrics?: {
      users: string
      performance: string
      impact: string
    }
    urls: {
      live?: string
      demo?: string
      github?: string
    }
    images: {
      thumbnail: string
      screenshots: string[]
    }
    featured: boolean
    dateCreated: string
    lastUpdated: string
  }
  ```

- **Experience/Career Data**
  ```typescript
  interface Experience {
    id: string
    company: string
    role: string
    startDate: string
    endDate?: string
    description: string
    achievements: string[]
    technologies: string[]
    clearanceLevel?: string
    category: 'professional' | 'consulting' | 'research'
  }
  ```

- **Skills & Learning Data**
  ```typescript
  interface Skill {
    id: string
    name: string
    category: 'frontend' | 'backend' | 'cloud' | 'ai' | 'specialized'
    proficiency: 1 | 2 | 3 | 4 | 5
    learning: boolean
    projects: string[] // Project IDs using this skill
  }
  ```

#### Analytics Schema Design
- **Visitor Tracking (Privacy-Compliant)**
  ```typescript
  interface VisitorSession {
    sessionId: string // Anonymous hash
    pages: PageView[]
    startTime: string
    endTime?: string
    country?: string // Country-level only for privacy
    device: 'mobile' | 'tablet' | 'desktop'
    referrer?: string
  }

  interface PageView {
    page: string
    timestamp: string
    timeOnPage?: number
    scrollDepth?: number
    interactions?: string[]
  }
  ```

- **GitHub Integration Data**
  ```typescript
  interface GitHubData {
    commits: CommitActivity[]
    languages: LanguageStats
    repositories: RepoSummary[]
    contributions: ContributionGraph
    lastUpdated: string
  }
  ```

### **PRIORITY 2: Local API Service Setup** ⚙️
*Complexity: Medium* | *Timeline: 1 week*

#### Express.js API Architecture
```
/api
├── /portfolio      # GET - Portfolio overview
├── /projects       # GET/POST - Project CRUD
├── /experience     # GET - Career timeline
├── /skills         # GET - Skills with proficiency
├── /analytics      # POST events, GET dashboard data
├── /github         # GET - Live GitHub activity
├── /config         # GET - App configuration
└── /insights       # GET/POST - Insights dashboard
```

#### API Endpoint Specifications
- **Authentication**: JWT tokens for admin operations
- **Rate Limiting**: 100 requests/minute per IP
- **CORS**: Configured for development/production domains
- **Validation**: Joi schema validation on all inputs
- **Error Handling**: Consistent error response format

#### Mock Data Service (Development Phase)
- JSON file-based data store
- Hot reload for data changes during development
- Validation layer ensuring data integrity
- Response caching for performance

### **PRIORITY 3: Database Schema & Security** 🔐
*Complexity: High* | *Timeline: 1 week*

#### Database Design (PostgreSQL)
```sql
-- Core portfolio data
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  data JSONB, -- Encrypted project details
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Analytics (anonymized)
CREATE TABLE visitor_sessions (
  session_hash VARCHAR(64) PRIMARY KEY, -- SHA-256 of anonymous ID
  data JSONB, -- Encrypted session data
  created_at TIMESTAMP DEFAULT NOW()
);

-- GitHub integration cache
CREATE TABLE github_data (
  id SERIAL PRIMARY KEY,
  data_type VARCHAR(50),
  data JSONB,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Security Implementation
- **Encryption**: AES-256 encryption for sensitive data at rest
- **API Security**: JWT tokens, rate limiting, input sanitization
- **Privacy Compliance**: GDPR-compliant visitor tracking
- **Database Security**: Connection pooling, prepared statements

### **PRIORITY 4: Frontend Integration** 🔌
*Complexity: Medium* | *Timeline: 0.5 weeks*

#### React Query Integration
```typescript
// API client setup
const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => apiClient.get('/api/projects'),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

const useAnalytics = () => {
  return useMutation({
    mutationFn: (event: AnalyticsEvent) =>
      apiClient.post('/api/analytics', event)
  })
}
```

#### Environment Configuration
```typescript
// config/environment.ts
export const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://api.plixo.com'
    : 'http://localhost:3001',
  enableAnalytics: process.env.NODE_ENV === 'production',
  githubToken: process.env.GITHUB_TOKEN
}
```

### **PRIORITY 5: Insights Dashboard Implementation** 📊
*Complexity: High* | *Timeline: 0.5 weeks*

#### Real-time Analytics Features
- **Page Views**: Track visits per page with time-based graphs
- **Geographic Distribution**: Country-level visitor map (privacy-compliant)
- **Device Analytics**: Mobile vs desktop usage patterns
- **GitHub Activity**: Live commit graphs and language statistics
- **Performance Metrics**: Page load times, Core Web Vitals

#### Privacy-First Implementation
- No personal data collection
- Anonymous session tracking only
- Cookie consent management
- Data retention policies (30 days max)

---

## Development Timeline

### Week 1: Data Architecture
- [ ] Design and document all data schemas
- [ ] Create TypeScript interfaces
- [ ] Build temp config JSON files
- [ ] Validate data structure with frontend components

### Week 2: API Development
- [ ] Set up Express.js server with endpoints
- [ ] Implement mock data service
- [ ] Add authentication and security middleware
- [ ] Create API documentation (Swagger)

### Week 3: Database & Security
- [ ] Set up PostgreSQL with encryption
- [ ] Implement migration scripts
- [ ] Add security layers (JWT, rate limiting)
- [ ] Privacy compliance implementation

### Week 4: Integration & Testing
- [ ] Frontend API integration with React Query
- [ ] Insights dashboard implementation
- [ ] End-to-end testing
- [ ] Performance optimization

---

## Success Criteria

### Technical Milestones
- [ ] All portfolio content served via secure API
- [ ] Real-time insights dashboard functional
- [ ] Privacy-compliant analytics tracking
- [ ] Sub-500ms API response times
- [ ] Encrypted data storage operational

### Business Value
- [ ] Portfolio content easily maintainable via API
- [ ] Visitor insights inform UX improvements
- [ ] GitHub integration showcases live activity
- [ ] Foundation ready for advanced features
- [ ] Professional-grade security implementation

---

## Risk Assessment & Mitigation

**High Risk**: Database security and privacy compliance
- *Mitigation*: Security audit, GDPR compliance review

**Medium Risk**: API performance with real-time features
- *Mitigation*: Caching strategy, database optimization

**Low Risk**: Frontend integration complexity
- *Mitigation*: Incremental implementation, fallback strategies

---

## Next Phase Preparation

After Phase 2 completion, Phase 3 will focus on:
- 3D integration with Spline/Three.js
- Advanced interactive components
- Performance optimization
- A/B testing infrastructure

**Dependencies**: Phase 2 provides the data foundation required for all advanced features in Phase 3+