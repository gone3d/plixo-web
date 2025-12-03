import { useState, useEffect } from 'react'
import { LoadingSpinner } from '../components/atoms'
import { UserList, UserDetail, CreateUser, EditUser } from '../components/molecules'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'
import { apiClient } from '../services/api'

interface User {
  id: string
  username: string
  email: string
  role: 'guest' | 'user' | 'admin'
  is_active: boolean
  created_at: string
  updated_at: string
  last_login?: string | null
}

interface LoginHistoryEntry {
  id: string
  login_success: boolean
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

interface UserDetailData {
  user: User
  loginHistory: LoginHistoryEntry[]
}

type ViewMode = 'list' | 'detail' | 'create' | 'edit'

const Console = () => {
  const { user: currentUser, isLoading: authLoading, verifyRole } = useAuth()
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVerifyingAccess, setIsVerifyingAccess] = useState(true)
  const [hasAdminAccess, setHasAdminAccess] = useState(false)

  // Filters
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Selected user for detail/edit
  const [selectedUser, setSelectedUser] = useState<UserDetailData | null>(null)

  // Form state for create/edit
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'user' | 'admin',
    is_active: true
  })

  // Server-side role verification on mount
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (authLoading) return

      if (!currentUser) {
        setHasAdminAccess(false)
        setIsVerifyingAccess(false)
        return
      }

      // Block guest users from accessing Console
      if (currentUser.role === 'guest') {
        setHasAdminAccess(false)
        setIsVerifyingAccess(false)
        return
      }

      try {
        const isAdmin = await verifyRole('admin')
        setHasAdminAccess(isAdmin)

        // If not admin, redirect to edit own profile
        if (!isAdmin && currentUser) {
          setFormData({
            username: currentUser.username,
            email: currentUser.email || '',
            currentPassword: '',
            password: '',
            confirmPassword: '',
            role: currentUser.role === 'admin' ? 'admin' : 'user',
            is_active: true
          })
          setSelectedUser({
            user: currentUser as User,
            loginHistory: []
          })
          setViewMode('edit')
        }
      } catch (error) {
        console.error('Failed to verify admin access:', error)
        setHasAdminAccess(false)
      } finally {
        setIsVerifyingAccess(false)
      }
    }

    checkAdminAccess()
  }, [currentUser, authLoading, verifyRole])

  useEffect(() => {
    if (viewMode === 'list' && hasAdminAccess) {
      fetchUsers()
    }
  }, [viewMode, roleFilter, statusFilter, searchQuery, hasAdminAccess])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (roleFilter) params.append('role', roleFilter)
      if (statusFilter) params.append('status', statusFilter)
      if (searchQuery) params.append('search', searchQuery)

      const { data } = await apiClient.get(`/admin/users?${params}`)

      if (data.success && data.data) {
        setUsers(data.data.users)
      } else {
        setError(data.error || 'Failed to fetch users')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserDetail = async (userId: string) => {
    setLoading(true)
    setError(null)

    try {
      const { data } = await apiClient.get(`/admin/users/${userId}`)

      if (data.success) {
        setSelectedUser(data)
        setViewMode('detail')
      } else {
        setError(data.error || 'Failed to fetch user details')
        toast.error(data.error || 'Failed to fetch user details')
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Unknown error'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async () => {
    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const { data } = await apiClient.post('/admin/users', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        is_active: formData.is_active
      })

      if (data.success) {
        toast.success('User created successfully')
        setFormData({
          username: '',
          email: '',
          currentPassword: '',
          password: '',
          confirmPassword: '',
          role: 'user',
          is_active: true
        })
        setViewMode('list')
      } else {
        toast.error(data.error || 'Failed to create user')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUser = async (userId: string) => {
    // Validation for password change
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match')
        return
      }

      // Non-admin users must provide current password
      const isEditingSelf = userId === currentUser?.id

      if (isEditingSelf && !formData.currentPassword) {
        toast.error('Current password required to change password')
        return
      }
    }

    setLoading(true)

    try {
      const isEditingSelf = userId === currentUser?.id
      const updateData: any = {}

      // Only include role and is_active when admin is editing OTHER users
      if (hasAdminAccess && !isEditingSelf) {
        updateData.role = formData.role
        updateData.is_active = formData.is_active
      }

      // Include email if changed (only when editing self)
      if (isEditingSelf && formData.email !== selectedUser?.user.email) {
        updateData.email = formData.email
      }

      // Only include password fields if changing password
      if (formData.password) {
        updateData.password = formData.password
        if (formData.currentPassword) {
          updateData.currentPassword = formData.currentPassword
        }
      }

      const { data } = await apiClient.put(`/admin/users/${userId}`, updateData)

      if (data.success) {
        toast.success('User updated successfully')

        // Clear password fields only
        setFormData({
          ...formData,
          currentPassword: '',
          password: '',
          confirmPassword: ''
        })

        // If admin, go back to list, otherwise stay on profile
        if (hasAdminAccess) {
          setFormData({
            username: '',
            email: '',
            currentPassword: '',
            password: '',
            confirmPassword: '',
            role: 'user',
            is_active: true
          })
          setViewMode('list')
        }
      } else {
        toast.error(data.error || 'Failed to update user')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      return
    }

    setLoading(true)

    try {
      const { data } = await apiClient.delete(`/admin/users/${userId}`)

      if (data.success) {
        toast.success('User deleted successfully')
        setViewMode('list')
      } else {
        toast.error(data.error || 'Failed to delete user')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (user: User) => {
    setFormData({
      username: user.username,
      email: user.email,
      currentPassword: '',
      password: '',
      confirmPassword: '',
      role: user.role === 'admin' ? 'admin' : 'user',
      is_active: user.is_active
    })
    setSelectedUser({ user, loginHistory: [] })
    setViewMode('edit')
  }


  // Show loading spinner while checking authentication and authorization
  if (authLoading || isVerifyingAccess) {
    return (
      <div className="relative min-h-full text-white overflow-y-auto">
        <div className="relative z-10 max-w-7xl mx-auto py-20 px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Console
            </h1>
          </div>

          <div className="bg-slate-800/40 rounded-xl p-12 border border-slate-700/40 text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-slate-400">Verifying access...</p>
          </div>
        </div>
      </div>
    )
  }

  // If not authenticated or guest user, show access denied message
  if (!currentUser || currentUser.role === 'guest') {
    return (
      <div className="relative min-h-full text-white overflow-y-auto">
        <div className="relative z-10 max-w-7xl mx-auto py-20 px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Console
            </h1>
            <p className="text-slate-300 text-lg">
              {!currentUser ? 'Login required' : 'Access restricted'}
            </p>
          </div>

          <div className="bg-slate-800/40 rounded-xl p-12 border border-slate-700/40 text-center">
            <p className="text-slate-400 text-lg">
              {!currentUser
                ? 'You must be logged in to access this area.'
                : 'Guest accounts do not have access to the Console. Please contact an administrator for a user account.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-full text-white overflow-y-auto">
      <div className="relative z-10 max-w-6xl mx-auto py-20 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {hasAdminAccess ? 'Console' : 'Profile Settings'}
          </h1>
          <p className="text-slate-300">
            {hasAdminAccess ? 'User Management' : 'Manage your account'}
          </p>
        </div>

        {/* Main Panel */}
        <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/40">
          {/* View: User List */}
          {viewMode === 'list' && (
            <UserList
              users={users}
              loading={loading}
              error={error}
              currentUserId={currentUser?.id}
              roleFilter={roleFilter}
              statusFilter={statusFilter}
              searchQuery={searchQuery}
              onRoleFilterChange={setRoleFilter}
              onStatusFilterChange={setStatusFilter}
              onSearchQueryChange={setSearchQuery}
              onCreateUser={() => {
                setFormData({
                  username: '',
                  email: '',
                  currentPassword: '',
                  password: '',
                  confirmPassword: '',
                  role: 'user',
                  is_active: true
                })
                setViewMode('create')
              }}
              onViewUser={fetchUserDetail}
              onEditUser={startEdit}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {/* View: User Detail */}
          {viewMode === 'detail' && selectedUser && (
            <UserDetail
              userDetail={selectedUser}
              loading={loading}
              onBack={() => setViewMode('list')}
              onEdit={startEdit}
              onDelete={handleDeleteUser}
            />
          )}

          {/* View: Create User */}
          {viewMode === 'create' && (
            <CreateUser
              formData={formData}
              loading={loading}
              onChange={(data) => setFormData({ ...formData, ...data })}
              onSubmit={handleCreateUser}
              onCancel={() => setViewMode('list')}
            />
          )}

          {/* View: Edit User */}
          {viewMode === 'edit' && selectedUser && (
            <EditUser
              user={selectedUser.user}
              formData={formData}
              loading={loading}
              isEditingSelf={selectedUser.user.id === currentUser?.id}
              isAdmin={hasAdminAccess}
              onChange={(data) => setFormData({ ...formData, ...data })}
              onSubmit={() => handleUpdateUser(selectedUser.user.id)}
              onCancel={() => setViewMode('list')}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Console
