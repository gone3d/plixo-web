import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import Modal from './Modal'
import { Button, Input } from '../atoms'
import { useAuth } from '../../contexts/AuthContext'

// Validation schema
const loginSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export interface LoginFormProps {
  isOpen: boolean
  onClose: () => void
}

const LoginForm = ({ isOpen, onClose }: LoginFormProps) => {
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.username, data.password)

      // Success! Close modal and stay on current page
      toast.success('Login successful!')
      reset()
      onClose()
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please try again.')
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Login to Plixo.com"
      size="sm"
      closeOnBackdropClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Username Field */}
        <Input
          label="Username"
          type="text"
          placeholder="Enter your username"
          error={errors.username?.message}
          disabled={isSubmitting}
          {...register('username')}
        />

        {/* Password Field */}
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          disabled={isSubmitting}
          {...register('password')}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="ghost"
          className="w-full bg-white/10 backdrop-blur-sm border border-blue-400/40 hover:bg-white/20 hover:border-blue-400/60"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </Modal>
  )
}

export default LoginForm
