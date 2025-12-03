import { Icon, Button, LoadingSpinner, Input } from '../atoms'

interface CreateUserFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  role: 'user' | 'admin'
  is_active: boolean
}

interface CreateUserProps {
  formData: CreateUserFormData
  loading: boolean
  onChange: (data: Partial<CreateUserFormData>) => void
  onSubmit: () => void
  onCancel: () => void
}

const CreateUser = ({
  formData,
  loading,
  onChange,
  onSubmit,
  onCancel,
}: CreateUserProps) => {
  const isFormValid =
    formData.username &&
    formData.email &&
    formData.password &&
    formData.confirmPassword

  return (
    <>
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={loading}>
          <Icon name="arrow-left" size="sm" />
          <span className="ml-2">Back to List</span>
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">Create New User</h2>

        <div className="bg-slate-900/40 rounded-lg p-6 space-y-3 max-w-4xl">
          <Input
            label="Username *"
            type="text"
            value={formData.username}
            onChange={(e) => onChange({ username: e.target.value })}
            placeholder="Enter username"
          />

          <Input
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="Enter email"
          />

          <Input
            label="Password *"
            type="password"
            value={formData.password}
            onChange={(e) => onChange({ password: e.target.value })}
            placeholder="Enter password"
            helpText="Must be at least 8 characters with uppercase, lowercase, and number"
          />

          <Input
            label="Confirm Password *"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => onChange({ confirmPassword: e.target.value })}
            placeholder="Confirm password"
          />

          <div>
            <label className="block text-slate-400 text-sm mb-2">Role *</label>
            <select
              value={formData.role}
              onChange={(e) =>
                onChange({ role: e.target.value as 'user' | 'admin' })
              }
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
              onChange={(e) => onChange({ is_active: e.target.checked })}
              className="w-4 h-4 bg-slate-800/60 border border-slate-700/40 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-slate-400 text-sm">
              Active
            </label>
          </div>

          <div className="pt-4 border-t border-slate-700/40 flex gap-2">
            <Button
              variant="primary"
              onClick={onSubmit}
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Icon name="plus" size="sm" />
              )}
              <span className="ml-2">Create User</span>
            </Button>
            <Button variant="ghost" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateUser
