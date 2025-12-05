import { Icon, Button } from '../atoms'

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

interface UserDetailProps {
  userDetail: UserDetailData
  loading: boolean
  onBack: () => void
  onEdit: (user: User) => void
  onDelete: (userId: string, username: string) => void
}

const UserDetail = ({
  userDetail,
  onBack,
  onEdit,
  onDelete,
}: UserDetailProps) => {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString()
  }

  const { user, loginHistory } = userDetail

  return (
    <>
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <Icon name="arrow-left" size="sm" />
          <span className="ml-2">Back to List</span>
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">User Details</h2>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => onEdit(user)}>
              <Icon name="edit" size="sm" />
              <span className="ml-2">Edit</span>
            </Button>
            {user.username !== 'admin' && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(user.id, user.username)}
              >
                <Icon name="trash" size="sm" />
                <span className="ml-2">Delete</span>
              </Button>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="bg-slate-900/40 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-sm mb-1">Username</label>
              <p className="text-white">{user.username}</p>
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Email</label>
              <p className="text-white">{user.email}</p>
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Role</label>
              <span
                className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                  user.role === 'admin'
                    ? 'bg-purple-500/20 text-purple-400'
                    : user.role === 'user'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-slate-500/20 text-slate-400'
                }`}
              >
                {user.role}
              </span>
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Status</label>
              <span
                className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                  user.is_active
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {user.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Created At</label>
              <p className="text-white">{formatDate(user.created_at)}</p>
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">User ID</label>
              <p className="text-slate-300 text-sm font-mono">{user.id}</p>
            </div>
          </div>
        </div>

        {/* Login History */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Login History</h3>
          {loginHistory.length === 0 ? (
            <div className="bg-slate-900/40 rounded-lg p-6 text-center">
              <p className="text-slate-400">No login history available</p>
            </div>
          ) : (
            <div className="bg-slate-900/40 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/40">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        Date & Time
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        IP Address
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        User Agent
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginHistory.map((entry) => (
                      <tr
                        key={entry.id}
                        className="border-b border-slate-700/20 hover:bg-slate-800/20 transition-colors"
                      >
                        <td className="py-3 px-4 text-white">
                          {formatDate(entry.created_at)}
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-mono text-sm">
                          {entry.ip_address || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-slate-300 text-sm max-w-xs truncate">
                          {entry.user_agent || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              entry.login_success
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {entry.login_success ? 'Success' : 'Failed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default UserDetail
