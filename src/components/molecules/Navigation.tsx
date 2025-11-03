import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Icon, LoginPrompt } from "../atoms";
import { LoginModal } from "../molecules";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "../../utils/cn";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { path: "/", label: "Home", icon: "home" as const },
    { path: "/work", label: "Work", icon: "work" as const },
    { path: "/about", label: "About", icon: "user" as const },
    { path: "/insights", label: "Insights", icon: "chart" as const },
    { path: "/connect", label: "Connect", icon: "contact" as const },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-md border-b border-black/20">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold text-white">
              plixo.com
            </Link>

            {isAuthenticated ? (
              <>
                {/* Desktop Navigation - Authenticated */}
                <div className="hidden md:flex items-center space-x-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                        isActive(item.path)
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:text-white hover:bg-slate-800"
                      )}
                    >
                      <Icon name={item.icon} size="sm" />
                      {item.label}
                    </Link>
                  ))}

                  {/* User Info & Logout */}
                  <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-700">
                    <span className="text-sm text-slate-400">
                      {user?.username}
                      <span className="ml-1 text-xs text-blue-400">({user?.role})</span>
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                    >
                      <Icon name="close" size="sm" />
                    </Button>
                  </div>
                </div>

                {/* Mobile Menu Button - Authenticated */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden flex items-center gap-1"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {!isMenuOpen && <span className="text-sm font-medium">Menu</span>}
                  <Icon name={isMenuOpen ? "close" : "menu"} />
                </Button>
              </>
            ) : (
              <>
                {/* Desktop Login Button - Not Authenticated */}
                <div className="hidden md:flex items-center gap-3">
                  <LoginPrompt />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLoginOpen(true)}
                    className="bg-white/10 backdrop-blur-sm border border-blue-400/40 hover:bg-white/20 hover:border-blue-400/60"
                  >
                    Login
                  </Button>
                </div>

                {/* Mobile Login Button - Not Authenticated */}
                <div className="md:hidden flex items-center gap-2">
                  {/* Big arrow prompt for mobile */}
                  <Icon name="menu" size="lg" className="text-cyan-400 animate-pulse" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLoginOpen(true)}
                    className="bg-white/10 backdrop-blur-sm border border-blue-400/40 hover:bg-white/20 hover:border-blue-400/60"
                  >
                    Login
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Navigation - Only show when authenticated */}
          {isAuthenticated && isMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-800">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200",
                      isActive(item.path)
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:text-white hover:bg-slate-800"
                    )}
                  >
                    <Icon name={item.icon} size="sm" />
                    {item.label}
                  </Link>
                ))}

                {/* Mobile Logout */}
                <div className="pt-4 border-t border-slate-700">
                  <div className="px-4 py-2 text-sm text-slate-400 mb-2">
                    {user?.username}
                    <span className="ml-1 text-xs text-blue-400">({user?.role})</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start"
                  >
                    <Icon name="close" size="sm" />
                    <span className="ml-2">Logout</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Navigation;
