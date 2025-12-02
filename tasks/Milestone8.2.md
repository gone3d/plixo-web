# Milestone 8.2: Admin Content Management System (CMS)

> **Status**: ⏳ PENDING
> **Duration**: 1-2 weeks (UI only)
> **Priority**: HIGH
> **Dependencies**: Milestone 8.1 (User Management UI), Milestone 8.2 API complete

---

## Goal

Build admin dashboard for managing portfolio content dynamically through the UI, eliminating the need to edit JSON files and redeploy. Move all portfolio content from static files to D1 database with full CRUD operations.

**Why This Matters**:
- Update portfolio instantly without code changes
- Demonstrates full-stack skills (React + API + Database)
- Professional content management workflow
- Portfolio piece itself ("I built my own CMS")

---

## Success Criteria

- [ ] Admin can log in to `/admin` dashboard
- [ ] View all projects in manageable list/table
- [ ] Create new project through form
- [ ] Edit existing project inline or in modal
- [ ] Delete project with confirmation
- [ ] Reorder projects (drag & drop or manual order)
- [ ] Toggle featured status
- [ ] Changes appear on Work page immediately
- [ ] All operations require admin authentication
- [ ] Optimistic UI updates for smooth UX

---

## UI/Frontend Requirements (plixo-web)

### 🎨 Phase 1: Admin Dashboard Layout

**Route**: `/admin` (protected - admin only)

#### 8.1 Admin Dashboard Page Structure
```
/admin
  ├── Header
  │   ├── Logo + "Portfolio Admin"
  │   ├── User info (name, role)
  │   └── Logout button
  │
  ├── Sidebar Navigation
  │   ├── 📊 Dashboard (overview stats)
  │   ├── 💼 Projects (manage work)
  │   ├── 📈 Analytics (link to /insights)
  │   └── ⚙️ Settings (future)
  │
  └── Main Content Area
      └── Dynamic content based on nav selection
```

**Components to Create**:
- `AdminLayout.tsx` - Overall admin page structure
- `AdminHeader.tsx` - Top navigation bar
- `AdminSidebar.tsx` - Left navigation menu
- `AdminRoute.tsx` - Protected route wrapper (checks admin role)

**Design**:
- Dark theme (professional, matches analytics)
- Sidebar collapsible on mobile
- Responsive grid layout
- Consistent with existing portfolio design system

---

### 💼 Phase 2: Projects Management UI

**Route**: `/admin/projects`

#### 8.2 Projects List View

**Layout**: Table/Card hybrid view

**Columns**:
1. **Thumbnail** - Small preview image (80x80px)
2. **Title** - Project name
3. **Status** - Badge (Live, In Development, etc.)
4. **Featured** - Toggle switch
5. **Technologies** - Chip list (first 3, +N more)
6. **Actions** - Edit, Delete, View Live

**Features**:
- **Search bar** - Filter by title
- **Status filter** - Dropdown (All, Live, In Development, etc.)
- **Sort options** - Manual order, created date, updated date, title
- **Add New button** - Opens create modal/form
- **Bulk actions** - Select multiple, delete, change status

**Visual Design**:
```
┌─────────────────────────────────────────────────────┐
│  Projects Management              [+ Add Project]    │
├─────────────────────────────────────────────────────┤
│  🔍 Search...   [Status: All ▼]  [Sort: Order ▼]   │
├─────────────────────────────────────────────────────┤
│                                                      │
│  [IMG] MarkdownViewer                    Featured ☑ │
│       In Development                                 │
│       React 18, TypeScript, Vite... +3               │
│       [Edit] [Delete] [🔗 View Live]                 │
│  ─────────────────────────────────────────────────  │
│  [IMG] Hourlings Portal                  Featured ☑ │
│       In Development                                 │
│       React, TypeScript, Cloudflare... +2            │
│       [Edit] [Delete] [🔗 View Live]                 │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Components**:
- `ProjectsList.tsx` - Main list container
- `ProjectRow.tsx` - Individual project row
- `ProjectFilters.tsx` - Search and filter controls
- `ProjectActions.tsx` - Edit/Delete action buttons

---

#### 8.3 Create/Edit Project Form

**Modal or Full Page**: Modal preferred (less context switching)

**Form Fields**:

**Basic Info**:
- **Title*** (text input)
- **Description*** (textarea, 2-3 lines)
- **Status*** (dropdown: Live, In Development, Demo, Archived, Prototype)

**URLs**:
- **Live URL** (text input, optional)
- **GitHub URL** (text input, optional)
- **Demo URL** (text input, optional)

**Visual**:
- **Image Path*** (text input + file browser button)
  - Preview thumbnail below input
  - Validation: must exist in `/assets/work/`

**Technologies**:
- **Tech Stack** (multi-select or tag input)
  - Common options: React, TypeScript, Node.js, etc.
  - Allow custom entries
  - Display as chips with X to remove

**Settings**:
- **Featured** (checkbox)
- **Display Order** (number input, 0-999)

**Form Actions**:
- [Cancel] - Closes modal, no changes
- [Save] - Validates + submits
- [Save & Add Another] - Saves + clears form

**Validation Rules**:
- Title: Required, 3-100 chars
- Description: Required, 10-500 chars
- Status: Required, must be valid enum
- URLs: Optional, valid URL format
- Image: Required, must start with `/assets/work/`
- Technologies: At least 1 required
- Display Order: 0-999

**Visual Design**:
```
┌─────────────────────────────────────────┐
│  Add New Project                    [X] │
├─────────────────────────────────────────┤
│                                          │
│  Title *                                 │
│  [___________________________________]   │
│                                          │
│  Description *                           │
│  [___________________________________]   │
│  [___________________________________]   │
│                                          │
│  Status *        Featured ☐              │
│  [In Development ▼]                      │
│                                          │
│  Technologies *                          │
│  [React 18 ×] [TypeScript ×] [+ Add]    │
│                                          │
│  URLs                                    │
│  Live:   [______________________]        │
│  GitHub: [______________________]        │
│  Demo:   [______________________]        │
│                                          │
│  Image Path *                            │
│  [/assets/work/________] [Browse...]     │
│  [Preview: 📷 thumbnail]                 │
│                                          │
│  Display Order: [__5__]                  │
│                                          │
│         [Cancel]  [Save Project]         │
└─────────────────────────────────────────┘
```

**Components**:
- `ProjectForm.tsx` - Main form container
- `ProjectFormFields.tsx` - Form field components
- `TechStackInput.tsx` - Multi-select tech input
- `ImagePreview.tsx` - Shows image thumbnail

---

#### 8.4 Delete Confirmation

**Modal**: Simple confirmation dialog

**Content**:
- Warning icon
- "Delete [Project Title]?"
- "This action cannot be undone."
- [Cancel] [Delete Project]

**Behavior**:
- Optimistic delete (remove from UI immediately)
- Show toast on success/error
- Undo option (5 second window)

---

#### 8.5 Reorder Projects

**UI Approach**: Drag & drop OR manual order numbers

**Option 1: Drag & Drop** (Better UX)
- Drag handle icon (≡) on left of each row
- Smooth animations
- Auto-save on drop
- Library: `@hello-pangea/dnd` or `react-beautiful-dnd`

**Option 2: Manual Order** (Simpler implementation)
- Number input in each row
- [Save Order] button
- Batch update on save

**Recommendation**: Start with Option 2, upgrade to Option 1 later

---

### 🎯 Phase 3: API Integration

#### 8.6 React Query Hooks

**Custom Hooks to Create**:

```typescript
// src/hooks/admin/useProjects.ts
export const useProjects = () => {
  // GET /api/projects
  // Returns: Project[]
}

export const useCreateProject = () => {
  // POST /api/projects
  // Invalidates project list
}

export const useUpdateProject = () => {
  // PUT /api/projects/:id
  // Optimistic update
}

export const useDeleteProject = () => {
  // DELETE /api/projects/:id
  // Optimistic delete
}

export const useReorderProjects = () => {
  // PATCH /api/projects/reorder
  // Batch update display_order
}
```

**Features**:
- Optimistic updates (instant UI feedback)
- Automatic retries on failure
- Cache invalidation
- Loading states
- Error handling with toast notifications

---

#### 8.7 Work Page Migration

**File**: `src/pages/Work.tsx`

**Changes**:
```diff
- const [projects, setProjects] = useState<WorkProject[]>([]);
- const response = await fetch("/config/work-projects.json");
+ const { data: projects, isLoading, error } = useProjects();
```

**Behavior**:
- Fetch from `/api/projects` instead of static JSON
- Remove local state management
- Use React Query caching
- Show loading skeleton
- Handle errors gracefully

---

### 🎨 Phase 4: UI Polish

#### 8.8 Empty States

**No Projects**:
- Icon: Empty folder
- Message: "No projects yet"
- Action: [Create Your First Project]

**No Search Results**:
- Icon: Magnifying glass
- Message: "No projects match your search"
- Action: [Clear Filters]

#### 8.9 Loading States

**List View**:
- Skeleton rows (3-5)
- Shimmer effect
- Preserve layout

**Form Submit**:
- Disable form
- Loading spinner on button
- "Saving..." text

#### 8.10 Success/Error Feedback

**Toast Notifications** (using `sonner`):
- ✅ "Project created successfully"
- ✅ "Project updated"
- ✅ "Project deleted"
- ❌ "Failed to save project. Please try again."
- ⚠️ "Image not found. Please check the path."

**Inline Validation**:
- Red border on invalid fields
- Error message below field
- Real-time validation as user types

---

### 🔒 Phase 5: Security & Access Control

#### 8.11 Protected Routes

**Implementation**:
```tsx
<Route path="/admin/*" element={
  <RequireAdmin>
    <AdminLayout />
  </RequireAdmin>
} />
```

**Behavior**:
- Check `user.role === 'admin'`
- Redirect to `/` if not admin
- Show toast: "Admin access required"

#### 8.12 Admin-Only UI Elements

**Hide from non-admins**:
- Admin link in navigation (if visible)
- Any edit/delete buttons on public pages

---

## Component Architecture

```
src/
├── pages/
│   └── admin/
│       ├── AdminDashboard.tsx      (main entry, /admin)
│       ├── ProjectsManagement.tsx  (/admin/projects)
│       └── AdminSettings.tsx       (/admin/settings - future)
│
├── components/
│   └── admin/
│       ├── layout/
│       │   ├── AdminLayout.tsx
│       │   ├── AdminHeader.tsx
│       │   └── AdminSidebar.tsx
│       │
│       ├── projects/
│       │   ├── ProjectsList.tsx
│       │   ├── ProjectRow.tsx
│       │   ├── ProjectForm.tsx
│       │   ├── ProjectFormFields.tsx
│       │   ├── ProjectFilters.tsx
│       │   ├── ProjectActions.tsx
│       │   ├── TechStackInput.tsx
│       │   └── ImagePreview.tsx
│       │
│       └── common/
│           ├── EmptyState.tsx
│           ├── DeleteConfirmation.tsx
│           └── AdminRoute.tsx (protected route wrapper)
│
├── hooks/
│   └── admin/
│       ├── useProjects.ts
│       ├── useCreateProject.ts
│       ├── useUpdateProject.ts
│       ├── useDeleteProject.ts
│       └── useReorderProjects.ts
│
└── types/
    └── admin.ts
        - ProjectFormData
        - ProjectFilters
        - ProjectSortOptions
```

---

## User Flows

### Flow 1: Create New Project
1. Admin logs in → navigates to `/admin/projects`
2. Clicks [+ Add Project]
3. Modal opens with empty form
4. Fills in required fields (title, description, status, tech, image)
5. Optionally adds URLs and sets featured
6. Clicks [Save Project]
7. Form validates → submits to API
8. Modal closes, new project appears in list
9. Toast: "Project created successfully"

### Flow 2: Edit Existing Project
1. Admin on `/admin/projects`
2. Finds project in list
3. Clicks [Edit] button
4. Modal opens pre-filled with project data
5. Makes changes
6. Clicks [Save]
7. Optimistic update (UI changes immediately)
8. API call in background
9. Toast: "Project updated"

### Flow 3: Delete Project
1. Admin clicks [Delete] on project
2. Confirmation modal appears
3. Clicks [Delete Project]
4. Optimistic delete (row disappears)
5. API call in background
6. Toast with undo option (5 seconds)
7. If undo clicked, project restored

### Flow 4: Reorder Projects
1. Admin changes display order numbers
2. Clicks [Save Order]
3. Optimistic reorder (list updates)
4. Batch API call
5. Toast: "Order saved"

---

## Acceptance Criteria

### Functionality
- [ ] Admin can create project with all fields
- [ ] Admin can edit any project
- [ ] Admin can delete project with confirmation
- [ ] Admin can reorder projects
- [ ] Admin can toggle featured status
- [ ] Changes reflect immediately on `/work` page
- [ ] Non-admins cannot access `/admin` routes
- [ ] Form validation works correctly
- [ ] Image paths validated (must exist)

### UX
- [ ] Optimistic updates feel instant
- [ ] Loading states show during operations
- [ ] Error messages clear and actionable
- [ ] Success feedback obvious but not intrusive
- [ ] Modal doesn't lose data on accidental close
- [ ] Mobile responsive (table → cards)
- [ ] Keyboard navigation works (Tab, Enter, Esc)

### Performance
- [ ] List loads in <500ms
- [ ] Form submits feel instant (<200ms perceived)
- [ ] No layout shift on load
- [ ] Images lazy loaded
- [ ] React Query caching prevents redundant requests

### Security
- [ ] All admin routes protected
- [ ] JWT token required for API calls
- [ ] API validates admin role server-side
- [ ] No sensitive data in client code
- [ ] CORS configured properly

---

## Technical Decisions

### Form Library
**Recommendation**: `react-hook-form` + `zod`
- Type-safe validation
- Excellent performance
- Built-in error handling
- Already used in contact form

### UI Components
**Recommendation**: Build custom with Tailwind
- Maintains consistent design
- No heavy library dependencies
- Full control over styling

**Optional**: `shadcn/ui` components
- Pre-built accessible components
- Copy/paste, fully customizable
- Uses Tailwind + Radix UI

### Drag & Drop (Phase 2)
**Recommendation**: Start without, add later
- Manual order numbers sufficient for MVP
- Can upgrade to `@hello-pangea/dnd` later

---

## Future Enhancements (Post-MVP)

- [ ] Bulk operations (multi-select)
- [ ] Duplicate project
- [ ] Project templates
- [ ] Draft/Published workflow
- [ ] Scheduled publishing
- [ ] Version history
- [ ] Image upload directly (vs file path)
- [ ] Rich text editor for description
- [ ] Preview before publishing
- [ ] Audit log (who changed what, when)

---

## Dependencies

**New Packages** (if needed):
```bash
npm install react-hook-form zod
npm install @hello-pangea/dnd  # Later, for drag & drop
```

**Existing Stack**:
- React Query (already installed)
- Axios (already configured)
- Sonner (toast notifications, already installed)
- Tailwind CSS

---

## Next Steps

1. **Review this milestone** - Validate UI requirements
2. **Create Milestone 8-API** - Define backend endpoints based on UI needs
3. **Implement API first** - Build endpoints with mock data
4. **Build UI incrementally** - Phase by phase
5. **Test end-to-end** - Verify all CRUD operations
6. **Deploy** - Production release

---

**Estimated Timeline**:
- **API**: 3-5 days
- **UI Phase 1-2**: 3-5 days (dashboard + list)
- **UI Phase 3**: 2-3 days (form + CRUD)
- **UI Phase 4-5**: 2-3 days (polish + security)
- **Testing**: 1-2 days
- **Total**: 2-3 weeks

**Ready to proceed?** Let me know if you want adjustments, then I'll create the API milestone.
