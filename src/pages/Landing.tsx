import { useState, useEffect } from "react";
import packageJson from "../../package.json";
import { useAuth } from "../contexts/AuthContext";
import { TurnstileWidget, Button } from "../components/atoms";
import { MaintenanceBanner } from "../components/molecules";
import { maintenanceService } from "../services/maintenance";
import { toast } from "sonner";

const Landing = () => {
  const { guestLogin, isAuthenticated } = useAuth();
  const [showTurnstile, setShowTurnstile] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  // Check maintenance status on mount
  useEffect(() => {
    const checkMaintenanceStatus = async () => {
      const status = await maintenanceService.getStatus();
      setIsMaintenanceMode(status.enabled);
    };

    checkMaintenanceStatus();
  }, []);

  const handleGuestLoginClick = () => {
    setShowTurnstile(true);
  };

  const handleTurnstileSuccess = async (token: string) => {
    setIsLoggingIn(true);
    try {
      await guestLogin(token);
      toast.success("Welcome! You have guest access for 2 hours.");
      setShowTurnstile(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Guest login failed";
      toast.error(errorMessage);
      setShowTurnstile(false);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleTurnstileError = () => {
    toast.error("CAPTCHA verification failed. Please try again.");
    setShowTurnstile(false);
    setIsLoggingIn(false);
  };

  return (
    <div className="relative min-h-full overflow-hidden text-white">
      {/* Hero Section */}
      <section
        className="flex items-center justify-center min-h-screen px-4"
        style={{ minHeight: "calc(100vh - 4rem)" }}
      >
        <div className="text-center space-y-8 max-w-4xl">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
              Don Anderson
            </h1>
            <h2 className="text-lg md:text-xl text-white/90 font-light text-shadow-glow">
              Staff Frontend Engineer
            </h2>
          </div>

          {/* Work in Progress Notice */}
          <div className="mt-8">
            <p className="text-white/60 text-sm italic text-shadow-glow">
              A Continuously Evolving Work in Progress
            </p>
            <p className="text-white/40 text-xs mt-1 text-shadow-glow">
              v{packageJson.version}
            </p>
          </div>

          {/* Guest Login or Maintenance Banner - Only show if not authenticated */}
          {!isAuthenticated && (
            <div className="mt-8 min-h-[200px] flex flex-col items-center justify-center">
              {isMaintenanceMode ? (
                /* Show Maintenance Banner when maintenance mode is enabled */
                <MaintenanceBanner className="max-w-md" />
              ) : (
                /* Show normal guest login flow when not in maintenance */
                <>
                  {!showTurnstile ? (
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={handleGuestLoginClick}
                      className="bg-slate-800/40 backdrop-blur-sm border border-blue-500/50 hover:bg-slate-700/50 hover:border-blue-400/70 shadow-lg hover:shadow-blue-500/20 hover:shadow-xl transition-all"
                    >
                      Continue As Guest
                    </Button>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <p className="text-white/80 text-sm text-shadow-glow">
                        Please verify you're human
                      </p>
                      <TurnstileWidget
                        onSuccess={handleTurnstileSuccess}
                        onError={handleTurnstileError}
                      />
                      {isLoggingIn && (
                        <p className="text-white/60 text-sm animate-pulse text-shadow-glow">
                          Logging in...
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Landing;
