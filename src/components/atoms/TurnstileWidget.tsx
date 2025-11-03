import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { useRef, useState } from 'react';

export interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError?: (error: string) => void;
  onExpire?: () => void;
  className?: string;
}

const TurnstileWidget = ({
  onSuccess,
  onError,
  onExpire,
  className = ''
}: TurnstileWidgetProps) => {
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [isLoading, setIsLoading] = useState(true);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  if (!siteKey || siteKey === 'your_site_key_here') {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
        ⚠️ Turnstile site key not configured. Please add VITE_TURNSTILE_SITE_KEY to your .env file.
      </div>
    );
  }

  const handleSuccess = (token: string) => {
    setIsLoading(false);
    onSuccess(token);
  };

  const handleError = () => {
    setIsLoading(false);
    const errorMessage = 'CAPTCHA verification failed. Please try again.';
    if (onError) {
      onError(errorMessage);
    }
  };

  const handleExpire = () => {
    setIsLoading(false);
    if (onExpire) {
      onExpire();
    } else {
      // Auto-reset the widget when token expires
      turnstileRef.current?.reset();
      setIsLoading(true);
    }
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {isLoading && (
        <div className="text-sm text-slate-400 animate-pulse">
          Loading security verification...
        </div>
      )}
      <Turnstile
        ref={turnstileRef}
        siteKey={siteKey}
        onSuccess={handleSuccess}
        onError={handleError}
        onExpire={handleExpire}
        options={{
          theme: 'dark',
          size: 'normal',
        }}
      />
    </div>
  );
};

export default TurnstileWidget;
