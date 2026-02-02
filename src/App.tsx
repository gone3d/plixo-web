import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useState } from "react";
import { Toaster } from "sonner";
import { Navigation, BackgroundSlideshow, BackgroundController } from "./components/molecules";
import { GlobalProvider } from "./contexts/GlobalContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { usePageViewTracking } from "./hooks/usePageViewTracking";
import "./App.css";

// ✅ EAGER: Landing page (critical, load immediately)
import { Landing } from "./pages";

// 🔄 LAZY: All other routes (load on-demand)
const Work = lazy(() => import("./pages/Work"));
const About = lazy(() => import("./pages/About"));
const Insights = lazy(() => import("./pages/Insights"));
const Console = lazy(() => import("./pages/Console"));
const Connect = lazy(() => import("./pages/Connect"));

// 🔄 LAZY: Heavy components (Three.js)
const SpaceshipCanvas = lazy(() => import("./components/organisms/SpaceshipCanvas").then(m => ({ default: m.SpaceshipCanvas })));
const SpaceshipModal = lazy(() => import("./components/organisms/SpaceshipCanvas").then(m => ({ default: m.SpaceshipModal })));

// Loading fallback component for route transitions
function RouteLoader() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

// Spaceship loading fallback (minimal, non-intrusive)
function SpaceshipLoader() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute bottom-4 right-4 text-slate-500 text-xs">
        Loading 3D...
      </div>
    </div>
  );
}

// AppContent component to use tracking hook inside Router
function AppContent() {
  const [isSpaceshipModalOpen, setIsSpaceshipModalOpen] = useState(false);

  // Enable automatic page view tracking
  usePageViewTracking();

  return (
    <>
      {/* Toast notifications */}
      <Toaster
        position="top-center"
        theme="dark"
        toastOptions={{
          style: {
            background: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#fff",
          },
        }}
      />

      <div
        className="min-h-screen w-screen overflow-x-hidden bg-black/20"
        style={{ margin: 0, padding: 0 }}
      >
        {/* Global Background Slideshow */}
        <BackgroundSlideshow
          transitionTime={18000}
          maxSpeedPxPerSec={30}
        />

        {/* Three.js Spaceship Canvas - Lazy loaded */}
        <Suspense fallback={<SpaceshipLoader />}>
          <SpaceshipCanvas />
        </Suspense>

        {/* Background Controller with Spaceship button */}
        <BackgroundController onSpaceshipClick={() => setIsSpaceshipModalOpen(true)} />

        <Navigation />

        {/* Main content - full height minus nav */}
        <main
          className="w-full overflow-x-hidden"
          style={{
            minHeight: "calc(100vh - 4rem)",
            paddingTop: "4rem",
            margin: 0,
            padding: 0,
          }}
        >
          {/* Wrap routes with Suspense for lazy-loaded pages */}
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              {/* Public route - no authentication required */}
              <Route path="/" element={<Landing />} />

              {/* Protected routes - require authentication (user or admin role) */}
              <Route
                path="/work"
                element={
                  <ProtectedRoute>
                    <Work />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <ProtectedRoute>
                    <About />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/insights"
                element={
                  <ProtectedRoute>
                    <Insights />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/console"
                element={
                  <ProtectedRoute excludeRoles={['guest']}>
                    <Console />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/connect"
                element={
                  <ProtectedRoute>
                    <Connect />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all route for 404 */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold mb-4">
                        Page Not Found
                      </h1>
                      <p className="text-slate-400 mb-8">
                        The page you're looking for doesn't exist.
                      </p>
                      <a
                        href="/"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Go Home
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </main>
      </div>

      {/* Spaceship Detail Modal - lazy loaded */}
      {/* Mobile enabled with preloading */}
      {/* {!state.ui.isMobile && ( */}
        <Suspense fallback={null}>
          <SpaceshipModal
            isOpen={isSpaceshipModalOpen}
            onClose={() => setIsSpaceshipModalOpen(false)}
          />
        </Suspense>
      {/* )} */}
    </>
  );
}

function App() {
  return (
    <GlobalProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </GlobalProvider>
  );
}

export default App;
