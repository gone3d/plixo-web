import { Icon, Button, LoadingSpinner, Input } from '../atoms'

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

interface EditUserFormData {
  username: string
  email: string
  currentPassword: string
  password: string
  confirmPassword: string
  role: 'user' | 'admin'
  is_active: boolean
}

interface EditUserProps {
  user: User
  formData: EditUserFormData
  loading: boolean
  isEditingSelf: boolean
  isAdmin?: boolean
  onChange: (data: Partial<EditUserFormData>) => void
  onSubmit: () => void
  onCancel: () => void
}

const EditUser = ({
  formData,
  loading,
  isEditingSelf,
  isAdmin = false,
  onChange,
  onSubmit,
  onCancel,
}: EditUserProps) => {
  return (
    <>
      {isAdmin && (
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={loading}>
            <Icon name="arrow-left" size="sm" />
            <span className="ml-2">Back to List</span>
          </Button>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-6">{isAdmin ? 'Edit User' : 'Profile Settings'}</h2>

        <div className="bg-slate-900/40 rounded-lg p-6 space-y-3 max-w-4xl">
          <Input
            label="Username"
            type="text"
            value={formData.username}
            disabled
            helpText={!isAdmin ? 'Username cannot be changed' : undefined}
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => onChange({ email: e.target.value })}
            disabled={!isEditingSelf}
            helpText={isEditingSelf ? undefined : 'Only the user can change their email'}
          />

          {isEditingSelf && (
            <Input
              label="Current Password (required to change password)"
              type="password"
              value={formData.currentPassword}
              onChange={(e) => onChange({ currentPassword: e.target.value })}
              placeholder="Enter current password"
            />
          )}

          <Input
            label="New Password (optional)"
            type="password"
            value={formData.password}
            onChange={(e) => onChange({ password: e.target.value })}
            placeholder="Leave blank to keep current password"
            helpText="Must be at least 8 characters with uppercase, lowercase, and number"
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => onChange({ confirmPassword: e.target.value })}
            placeholder="Confirm new password"
          />

          {isAdmin && (
            <>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    onChange({ role: e.target.value as 'user' | 'admin' })
                  }
                  disabled={isEditingSelf}
                  className="w-full bg-slate-800/60 border border-slate-700/40 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 disabled:bg-slate-800/30 disabled:text-slate-500 disabled:cursor-not-allowed"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {isEditingSelf && (
                  <p className="text-xs text-slate-500 mt-1">
                    You cannot change your own role
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active_edit"
                  checked={formData.is_active}
                  onChange={(e) => onChange({ is_active: e.target.checked })}
                  disabled={isEditingSelf}
                  className="w-4 h-4 bg-slate-800/60 border border-slate-700/40 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label
                  htmlFor="is_active_edit"
                  className={`text-slate-400 text-sm ${
                    isEditingSelf ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Active
                </label>
              </div>
              {isEditingSelf && (
                <p className="text-xs text-slate-500">
                  You cannot deactivate your own account
                </p>
              )}
            </>
          )}

          <div className="pt-4 border-t border-slate-700/40 flex gap-2">
            <Button variant="primary" onClick={onSubmit} disabled={loading}>
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Icon name="save" size="sm" />
              )}
              <span className="ml-2">Save Changes</span>
            </Button>
            {isAdmin && (
              <Button variant="ghost" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default EditUser
