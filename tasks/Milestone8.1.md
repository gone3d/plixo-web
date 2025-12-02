# Milestone 8.1: Admin User Management

> **Status**: ⏳ PENDING
> **Duration**: 3-5 days
> **Priority**: HIGH
> **Dependencies**: Milestone 8.1 API complete

---

## Goal

Add user management capabilities to the admin dashboard, allowing admins to create, view, edit, and delete user accounts.

**Why This Matters**:
- Manage admin access without database manipulation
- Add new admins or regular users through UI
- View user activity and login history
- Demonstrates complete CRUD patterns and RBAC

---

## Success Criteria

- [ ] Admin can view all users in a table
- [ ] Admin can create new users (admin, user roles)
- [ ] Admin can edit existing users (username, email, role, active status)
- [ ] Admin can delete users with confirmation
- [ ] Admin can view user login history
- [ ] Form validation prevents duplicate usernames/emails
- [ ] Password requirements enforced (min 8 chars, complexity)
- [ ] Cannot delete own admin account
- [ ] All operations require admin authentication

---

## UI Requirements

### 9.1 User Management Page

**Route**: `/admin/users`

**Layout**: Table view with filters and actions

**Columns**:
1. **Username** - User's login name
2. **Email** - User's email address
3. **Role** - Badge (Guest, User, Admin)
4. **Status** - Active/Inactive toggle
5. **Last Login** - Timestamp of last successful login
6. **Created** - Account creation date
7. **Actions** - View, Edit, Delete buttons

**Features**:
- **Search bar** - Filter by username or email
- **Role filter** - Dropdown (All, Admin, User, Guest)
- **Status filter** - Active, Inactive, All
- **Add User button** - Opens create modal
- **Pagination** - If user count > 50

**Visual Design**:
```
┌─────────────────────────────────────────────────────┐
│  User Management                   [+ Add User]      │
├─────────────────────────────────────────────────────┤
│  🔍 Search...   [Role: All ▼]  [Status: All ▼]     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Username    Email           Role    Status   Last  │
│  ─────────────────────────────────────────────────  │
│  admin       admin@plixo.com  Admin   Active   Now  │
│                               [View] [Edit] [Del]   │
│                                                      │
│  john_doe    john@example.com User    Active   2h   │
│                               [View] [Edit] [Del]   │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

### 9.2 Create/Edit User Form

**Modal**: Create New User / Edit User

**Form Fields**:

**Basic Info**:
- **Username*** (text input, 3-30 chars, alphanumeric + underscore)
- **Email*** (email input, valid format)
- **Password*** (password input, min 8 chars - Create only)
- **Confirm Password*** (password input - Create only)

**Permissions**:
- **Role*** (dropdown: User, Admin)
  - Note: "Guest" role is auto-assigned via CAPTCHA, not manually created
- **Active Status** (toggle, default: true)

**Form Actions**:
- [Cancel] - Closes modal, no changes
- [Create User] / [Update User] - Validates + submits

**Validation Rules**:
- Username: Required, 3-30 chars, alphanumeric + underscore, unique
- Email: Required, valid format, unique
- Password (create): Required, min 8 chars, must include uppercase, lowercase, number
- Confirm Password: Must match password
- Role: Required, must be "user" or "admin"

**Visual Design**:
```
┌─────────────────────────────────────────┐
│  Create New User                    [X] │
├─────────────────────────────────────────┤
│                                          │
│  Username *                              │
│  [___________________________________]   │
│                                          │
│  Email *                                 │
│  [___________________________________]   │
│                                          │
│  Password *                              │
│  [___________________________________]   │
│  Min 8 chars, upper/lower/number         │
│                                          │
│  Confirm Password *                      │
│  [___________________________________]   │
│                                          │
│  Role *           Active ☑               │
│  [Admin ▼]                               │
│                                          │
│         [Cancel]  [Create User]          │
└─────────────────────────────────────────┘
```

**Edit Mode Differences**:
- Password fields optional (only shown if "Change Password" clicked)
- Cannot change own role (prevent accidental lockout)
- Cannot deactivate own account

---

### 9.3 User Details View

**Modal**: User Details

**Sections**:

**Account Information**:
- Username
- Email
- Role (badge)
- Status (Active/Inactive badge)
- Created date
- Last updated date

**Login History** (last 10 logins):
- Timestamp
- IP address (hashed for privacy)
- Location (country, region, city)
- User agent
- Success/Failure status

**Actions**:
- [Edit User] - Opens edit modal
- [Delete User] - Opens delete confirmation
- [Close]

---

### 9.4 Delete Confirmation

**Modal**: Delete User

**Content**:
- Warning icon
- "Delete user [username]?"
- "This action cannot be undone. The user will immediately lose access."
- [Cancel] [Delete User]

**Protection**:
- Cannot delete own account (show error message)
- Cannot delete last admin (show error message)

---

## API Requirements (plixo-api)

### 9.5 User Management Endpoints

**All endpoints require admin authentication**

#### GET /admin/users
Returns all users with optional filtering

**Query Parameters**:
- `role` - Filter by role (admin, user, guest)
- `status` - Filter by active status (active, inactive, all)
- `search` - Search username or email
- `limit` - Pagination limit (default 50)
- `offset` - Pagination offset (default 0)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "user-123",
      "username": "admin",
      "email": "admin@plixo.com",
      "role": "admin",
      "is_active": 1,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-15T12:00:00Z",
      "last_login": "2025-01-20T10:30:00Z"
    }
  ],
  "total": 15,
  "limit": 50,
  "offset": 0
}
```

#### GET /admin/users/:id
Get single user details with login history

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "username": "admin",
    "email": "admin@plixo.com",
    "role": "admin",
    "is_active": 1,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-15T12:00:00Z",
    "login_history": [
      {
        "timestamp": "2025-01-20T10:30:00Z",
        "ip_address": "192.168.1.1",
        "country_code": "US",
        "region_code": "CA",
        "city": "San Francisco",
        "user_agent": "Mozilla/5.0...",
        "login_success": true
      }
    ]
  }
}
```

#### POST /admin/users
Create a new user

**Request Body**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "user",
  "is_active": true
}
```

**Response**: Returns created user (without password)

#### PUT /admin/users/:id
Update existing user

**Request Body**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "NewPassword123", // Optional
  "role": "admin",
  "is_active": false
}
```

**Validation**:
- Cannot change own role (403 Forbidden)
- Cannot deactivate own account (403 Forbidden)
- Cannot change role of last admin (403 Forbidden)

#### DELETE /admin/users/:id
Delete a user

**Protection**:
- Cannot delete own account (403 Forbidden)
- Cannot delete last admin (403 Forbidden)

**Response**:
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Implementation Plan

### Phase 1: API Layer (2 days)

1. Create user validation schemas (Zod)
2. Extend user repository with new methods
3. Create user management service
4. Implement all 5 endpoints
5. Add self-action protection middleware

### Phase 2: UI Components (2 days)

1. Create users list page
2. Build create/edit user modal
3. Build user details view
4. Add delete confirmation
5. Implement search and filters

### Phase 3: Integration & Testing (1 day)

1. Connect UI to API endpoints
2. Add optimistic updates
3. Test all CRUD operations
4. Test protection rules (can't delete self, etc.)
5. Test validation

---

## Component Architecture

```
src/
├── pages/
│   └── admin/
│       └── UsersManagement.tsx        (/admin/users)
│
├── components/
│   └── admin/
│       └── users/
│           ├── UsersList.tsx
│           ├── UserRow.tsx
│           ├── UserForm.tsx           (Create/Edit)
│           ├── UserDetails.tsx        (View modal)
│           ├── UserFilters.tsx
│           ├── UserActions.tsx
│           └── DeleteUserConfirmation.tsx
│
└── hooks/
    └── admin/
        ├── useUsers.ts
        ├── useUser.ts
        ├── useCreateUser.ts
        ├── useUpdateUser.ts
        └── useDeleteUser.ts
```

---

## Security Considerations

1. **Password Hashing**: Use bcrypt with salt rounds = 10
2. **Self-Action Prevention**: Cannot edit own role or delete own account
3. **Last Admin Protection**: Cannot delete or demote last admin
4. **Input Sanitization**: Validate all input fields
5. **Audit Logging**: Log all user management actions to login_audit table
6. **Session Invalidation**: When user deleted, invalidate all their sessions

---

## Acceptance Criteria

### Functionality
- [ ] Admin can view all users in paginated table
- [ ] Admin can create new users with validated credentials
- [ ] Admin can edit user details (except own role)
- [ ] Admin can toggle user active status
- [ ] Admin can delete users (except self and last admin)
- [ ] Admin can view user login history
- [ ] Search and filters work correctly
- [ ] Password complexity requirements enforced

### Security
- [ ] All endpoints require admin authentication
- [ ] Cannot delete own account
- [ ] Cannot delete last admin
- [ ] Cannot change own role
- [ ] Passwords hashed with bcrypt
- [ ] Input validation prevents SQL injection
- [ ] XSS protection on all text inputs

### UX
- [ ] Form validation shows clear error messages
- [ ] Optimistic updates for instant feedback
- [ ] Confirmation modals prevent accidental deletions
- [ ] Loading states during API calls
- [ ] Success/error toast notifications
- [ ] Keyboard navigation works (Tab, Enter, Esc)

---

## Future Enhancements (Post-MVP)

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Multi-factor authentication (MFA)
- [ ] Password expiration policies
- [ ] Account lockout after failed attempts
- [ ] Bulk user operations (import CSV, bulk delete)
- [ ] User groups/teams
- [ ] Granular permissions beyond role
- [ ] Activity audit trail per user
- [ ] Export user list to CSV

---

## Next Steps

After completion:
→ Deploy admin panel to production
→ Consider Milestone 10: Email notifications
