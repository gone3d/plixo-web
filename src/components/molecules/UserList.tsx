import { Icon, Button, LoadingSpinner } from '../atoms'

interface User {
  id: string
  username: string
  email: string
  role: 'guest' | 'user' | 'admin'
  is_active: boolean
  created_at: string
}

interface UserListProps {
  users: User[]
  loading: boolean
  error: string | null
  currentUserId?: string
  roleFilter: string
  statusFilter: string
  searchQuery: string
  onRoleFilterChange: (role: string) => void
  onStatusFilterChange: (status: string) => void
  onSearchQueryChange: (query: string) => void
  onCreateUser: () => void
  onViewUser: (userId: string) => void
  onEditUser: (user: User) => void
  onDeleteUser: (userId: string, username: string) => void
}

const UserList = ({
  users,
  loading,
  error,
  currentUserId,
  roleFilter,
  statusFilter,
  searchQuery,
  onRoleFilterChange,
  onStatusFilterChange,
  onSearchQueryChange,
  onCreateUser,
  onViewUser,
  onEditUser,
  onDeleteUser,
}: UserListProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <>
      {/* Filters and Actions */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Users</h2>
          <Button variant="primary" size="sm" onClick={onCreateUser}>
            <Icon name="plus" size="sm" />
            <span className="ml-2">Create User</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="bg-slate-800/60 border border-slate-700/40 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            className="bg-slate-800/60 border border-slate-700/40 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Roles</option>
            <option value="guest">Guest</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="bg-slate-800/60 border border-slate-700/40 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      {loading ? (
        <div className="text-center py-12">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-400">Loading users...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-400">{error}</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/40">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Username</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Email</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Role</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Created</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-700/20 hover:bg-slate-800/20 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span>{user.username}</span>
                      {user.id === currentUserId && (
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{user.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-400'
                          : user.role === 'user'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-slate-500/20 text-slate-400'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        user.is_active
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 text-sm">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewUser(user.id)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="View Details"
                      >
                        <Icon name="activity" size="sm" />
                      </button>
                      <button
                        onClick={() => onEditUser(user)}
                        className="text-slate-400 hover:text-white transition-colors"
                        title="Edit User"
                      >
                        <Icon name="edit" size="sm" />
                      </button>
                      <button
                        onClick={() => onDeleteUser(user.id, user.username)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Delete User"
                        disabled={user.id === currentUserId}
                      >
                        <Icon name="trash" size="sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default UserList
