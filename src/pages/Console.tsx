import { useState, useEffect } from 'react'
import { Icon, Button, LoadingSpinner } from '../components/atoms'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'

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
  const { user: currentUser, isLoading: authLoading } = useAuth()
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    password: '',
    role: 'user' as 'user' | 'admin',
    is_active: true
  })

  useEffect(() => {
    if (viewMode === 'list') {
      fetchUsers()
    }
  }, [viewMode, roleFilter, statusFilter, searchQuery])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (roleFilter) params.append('role', roleFilter)
      if (statusFilter) params.append('status', statusFilter)
      if (searchQuery) params.append('search', searchQuery)

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8788'
      const response = await fetch(`${apiUrl}/admin/users?${params}`, {
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setUsers(data.users)
      } else {
        setError(data.error || 'Failed to fetch users')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserDetail = async (userId: string) => {
    setLoading(true)
    setError(null)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8788'
      const response = await fetch(`${apiUrl}/admin/users/${userId}`, {
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSelectedUser(data)
        setViewMode('detail')
      } else {
        setError(data.error || 'Failed to fetch user details')
        toast.error(data.error || 'Failed to fetch user details')
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async () => {
    setLoading(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8788'
      const response = await fetch(`${apiUrl}/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('User created successfully')
        setFormData({ username: '', email: '', password: '', role: 'user', is_active: true })
        setViewMode('list')
      } else {
        toast.error(data.error || 'Failed to create user')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUser = async (userId: string) => {
    setLoading(true)

    try {
      const updateData: any = {
        role: formData.role,
        is_active: formData.is_active
      }

      // Only include password if it's been changed
      if (formData.password) {
        updateData.password = formData.password
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8788'
      const response = await fetch(`${apiUrl}/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updateData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('User updated successfully')
        setFormData({ username: '', email: '', password: '', role: 'user', is_active: true })
        setViewMode('list')
      } else {
        toast.error(data.error || 'Failed to update user')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unknown error')
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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8788'
      const response = await fetch(`${apiUrl}/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('User deleted successfully')
        setViewMode('list')
      } else {
        toast.error(data.error || 'Failed to delete user')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (user: User) => {
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role === 'admin' ? 'admin' : 'user',
      is_active: user.is_active
    })
    setSelectedUser({ user, loginHistory: [] })
    setViewMode('edit')
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString()
  }

  // Check if current user is admin
  const isAdmin = currentUser?.role === 'admin'

  // Show loading spinner while checking authentication
  if (authLoading) {
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
            <p className="mt-4 text-slate-400">Verifying authentication...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="relative min-h-full text-white overflow-y-auto">
        <div className="relative z-10 max-w-7xl mx-auto py-20 px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Console
            </h1>
            <p className="text-slate-300 text-lg">
              Admin access required
            </p>
          </div>

          <div className="bg-slate-800/40 rounded-xl p-12 border border-slate-700/40 text-center">
            <Icon name="warning" size="xl" className="text-yellow-400 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">
              You must be an administrator to access this area.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-full text-white overflow-y-auto">
      <div className="relative z-10 max-w-7xl mx-auto py-20 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Console
          </h1>
          <p className="text-slate-300 text-lg">
            User Management
          </p>
        </div>

        {/* Main Panel */}
        <div className="bg-slate-800/40 rounded-xl p-8 border border-slate-700/40">
          {/* View: User List */}
          {viewMode === 'list' && (
            <>
              {/* Filters and Actions */}
              <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Users</h2>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setFormData({ username: '', email: '', password: '', role: 'user', is_active: true })
                      setViewMode('create')
                    }}
                  >
                    <Icon name="plus" size="sm" />
                    <span className="ml-2">Create User</span>
                  </Button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Role</label>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="w-full bg-slate-900/40 border border-slate-700/40 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                      <option value="guest">Guest</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full bg-slate-900/40 border border-slate-700/40 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Search</label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Username or email..."
                      className="w-full bg-slate-900/40 border border-slate-700/40 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 placeholder-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-12">
                  <LoadingSpinner size="lg" />
                  <p className="mt-4 text-slate-400">Loading users...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
                  <Icon name="warning" size="lg" className="text-red-400 mx-auto mb-2" />
                  <p className="text-red-200">{error}</p>
                </div>
              )}

              {/* Users Table */}
              {!loading && !error && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/40">
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Username</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Role</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Last Login</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-slate-700/20 hover:bg-slate-700/20 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <button
                              onClick={() => fetchUserDetail(user.id)}
                              className="text-blue-400 hover:text-blue-300 font-medium"
                            >
                              {user.username}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-slate-300">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                              user.role === 'admin' ? 'bg-purple-500/20 text-purple-300' :
                              user.role === 'user' ? 'bg-blue-500/20 text-blue-300' :
                              'bg-slate-500/20 text-slate-300'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                              user.is_active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                            }`}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400 text-sm">
                            {formatDate(user.last_login)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEdit(user)}
                                title="Edit user"
                              >
                                <Icon name="edit" size="sm" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUser(user.id, user.username)}
                                disabled={user.id === currentUser?.id}
                                title={user.id === currentUser?.id ? "Cannot delete yourself" : "Delete user"}
                              >
                                <Icon name="trash" size="sm" className={user.id === currentUser?.id ? 'text-slate-600' : 'text-red-400'} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {users.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-slate-400">No users found</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* View: User Detail */}
          {viewMode === 'detail' && selectedUser && (
            <>
              <div className="mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <Icon name="arrow-left" size="sm" />
                  <span className="ml-2">Back to List</span>
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">User Details</h2>

                  <div className="bg-slate-900/40 rounded-lg p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-400 text-sm">Username</label>
                        <p className="text-white font-medium">{selectedUser.user.username}</p>
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">Email</label>
                        <p className="text-white font-medium">{selectedUser.user.email}</p>
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">Role</label>
                        <p className="text-white font-medium capitalize">{selectedUser.user.role}</p>
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">Status</label>
                        <p className="text-white font-medium">{selectedUser.user.is_active ? 'Active' : 'Inactive'}</p>
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">Created</label>
                        <p className="text-white font-medium">{formatDate(selectedUser.user.created_at)}</p>
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">Last Login</label>
                        <p className="text-white font-medium">{formatDate(selectedUser.user.last_login)}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700/40 flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => startEdit(selectedUser.user)}
                      >
                        <Icon name="edit" size="sm" />
                        <span className="ml-2">Edit User</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(selectedUser.user.id, selectedUser.user.username)}
                        disabled={selectedUser.user.id === currentUser?.id}
                      >
                        <Icon name="trash" size="sm" className="text-red-400" />
                        <span className="ml-2">Delete User</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Login History */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Login History</h3>

                  {selectedUser.loginHistory.length > 0 ? (
                    <div className="bg-slate-900/40 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-700/40">
                            <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Date</th>
                            <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Status</th>
                            <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">IP Address</th>
                            <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">User Agent</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedUser.loginHistory.map((entry) => (
                            <tr key={entry.id} className="border-b border-slate-700/20">
                              <td className="py-3 px-4 text-sm text-slate-300">{formatDate(entry.created_at)}</td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                                  entry.login_success ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                                }`}>
                                  {entry.login_success ? 'Success' : 'Failed'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm text-slate-400">{entry.ip_address || 'N/A'}</td>
                              <td className="py-3 px-4 text-sm text-slate-400 truncate max-w-xs" title={entry.user_agent || 'N/A'}>
                                {entry.user_agent || 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-slate-900/40 rounded-lg p-6 text-center">
                      <p className="text-slate-400">No login history available</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* View: Create User */}
          {viewMode === 'create' && (
            <>
              <div className="mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <Icon name="arrow-left" size="sm" />
                  <span className="ml-2">Back to List</span>
                </Button>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-6">Create New User</h2>

                <div className="bg-slate-900/40 rounded-lg p-6 space-y-4 max-w-2xl">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Username *</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="Enter username"
                      className="w-full bg-slate-800/60 border border-slate-700/40 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email"
                      className="w-full bg-slate-800/60 border border-slate-700/40 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Password *</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter password"
                      className="w-full bg-slate-800/60 border border-slate-700/40 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Must be at least 8 characters with uppercase, lowercase, and number
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Role *</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'admin' })}
                      className="w-full bg-slate-800/60 border border-slate-700/40 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="is_active" className="text-slate-400 text-sm">Active</label>
                  </div>

                  <div className="pt-4 border-t border-slate-700/40 flex gap-2">
                    <Button
                      variant="primary"
                      onClick={handleCreateUser}
                      disabled={loading || !formData.username || !formData.email || !formData.password}
                    >
                      {loading ? <LoadingSpinner size="sm" /> : <Icon name="plus" size="sm" />}
                      <span className="ml-2">Create User</span>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setViewMode('list')}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* View: Edit User */}
          {viewMode === 'edit' && selectedUser && (
            <>
              <div className="mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <Icon name="arrow-left" size="sm" />
                  <span className="ml-2">Back to List</span>
                </Button>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-6">Edit User</h2>

                <div className="bg-slate-900/40 rounded-lg p-6 space-y-4 max-w-2xl">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Username</label>
                    <input
                      type="text"
                      value={formData.username}
                      disabled
                      className="w-full bg-slate-800/30 border border-slate-700/40 text-slate-500 rounded-lg px-4 py-2 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full bg-slate-800/30 border border-slate-700/40 text-slate-500 rounded-lg px-4 py-2 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm mb-2">New Password (optional)</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Leave blank to keep current password"
                      className="w-full bg-slate-800/60 border border-slate-700/40 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Must be at least 8 characters with uppercase, lowercase, and number
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'admin' })}
                      disabled={selectedUser.user.id === currentUser?.id}
                      className="w-full bg-slate-800/60 border border-slate-700/40 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 disabled:bg-slate-800/30 disabled:text-slate-500 disabled:cursor-not-allowed"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    {selectedUser.user.id === currentUser?.id && (
                      <p className="text-xs text-slate-500 mt-1">Cannot modify your own role</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active_edit"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      disabled={selectedUser.user.id === currentUser?.id}
                      className="rounded"
                    />
                    <label htmlFor="is_active_edit" className="text-slate-400 text-sm">Active</label>
                    {selectedUser.user.id === currentUser?.id && (
                      <span className="text-xs text-slate-500">(Cannot deactivate yourself)</span>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-700/40 flex gap-2">
                    <Button
                      variant="primary"
                      onClick={() => handleUpdateUser(selectedUser.user.id)}
                      disabled={loading}
                    >
                      {loading ? <LoadingSpinner size="sm" /> : <Icon name="save" size="sm" />}
                      <span className="ml-2">Save Changes</span>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setViewMode('list')}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Console
