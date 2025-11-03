import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, TurnstileWidget } from '../atoms';
import Modal from './Modal';
import { toast } from 'sonner';

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const { login, guestLogin, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showGuestLogin, setShowGuestLogin] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      await login(username, password);
      toast.success('Successfully logged in');
      onClose();
      // Reset form
      setUsername('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      toast.error(err.message || 'Login failed');
    }
  };

  const handleGuestLogin = () => {
    setError('');
    setShowGuestLogin(true);
  };

  const handleTurnstileSuccess = async (token: string) => {
    try {
      await guestLogin(token);
      toast.success('Welcome! You have guest access for 2 hours.');
      onClose();
      // Reset state
      setShowGuestLogin(false);
    } catch (err: any) {
      setError(err.message || 'Guest login failed');
      toast.error(err.message || 'Guest login failed');
      // Reset Turnstile on error
      setShowGuestLogin(false);
    }
  };

  const handleTurnstileError = (errorMessage: string) => {
    setError(errorMessage);
    toast.error(errorMessage);
  };

  const handleModalClose = () => {
    setError('');
    setShowGuestLogin(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Welcome"
      size="sm"
    >
      <div className="space-y-4">
        {!showGuestLogin ? (
          <>
            {/* Regular Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                disabled={isLoading}
                autoFocus
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
              />

              {error && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded px-3 py-2">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900/40 text-slate-400">
                  or
                </span>
              </div>
            </div>

            {/* Guest Login Button */}
            <Button
              onClick={handleGuestLogin}
              variant="secondary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              Continue as Guest
            </Button>

            <p className="text-xs text-slate-400 text-center">
              Guest access expires after 2 hours and requires human verification.
            </p>
          </>
        ) : (
          <>
            {/* Turnstile CAPTCHA Widget */}
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-white">
                  Human Verification Required
                </h3>
                <p className="text-sm text-slate-400">
                  Please complete the security check below to continue as a guest.
                </p>
              </div>

              <div className="flex justify-center py-4">
                <TurnstileWidget
                  onSuccess={handleTurnstileSuccess}
                  onError={handleTurnstileError}
                />
              </div>

              {error && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded px-3 py-2">
                  {error}
                </div>
              )}

              <Button
                onClick={() => setShowGuestLogin(false)}
                variant="ghost"
                size="md"
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default LoginModal;
