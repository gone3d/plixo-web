import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Navigation, BackgroundSlideshow } from "./components/molecules";
import { BackgroundSpeedDebug } from "./components/atoms";
import { Landing, Work, About, Insights, Connect } from "./pages";
import { GlobalProvider } from "./contexts/GlobalContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { backgroundImages } from "./config/temp-data";
import "./App.css";

function App() {
  return (
    <GlobalProvider>
      <AuthProvider>
        <Router>
          {/* Toast notifications */}
          <Toaster
            position="top-center"
            theme="dark"
            toastOptions={{
              style: {
                background: 'rgba(15, 23, 42, 0.4)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
              },
            }}
          />

          <div className="min-h-screen w-screen overflow-x-hidden bg-black/20" style={{ margin: 0, padding: 0 }}>
            {/* Global Background Slideshow */}
            <BackgroundSlideshow
              images={backgroundImages}
              transitionTime={18000}
              displayMode="slide"
              maxSpeedPxPerSec={15}
            />

            {/* Background Speed Debug Display */}
            <BackgroundSpeedDebug />

            <Navigation />

            {/* Main content - full height minus nav */}
            <main className="w-full" style={{ minHeight: 'calc(100vh - 4rem)', paddingTop: '4rem', margin: 0, padding: 0 }}>
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
                        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
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
            </main>
          </div>
        </Router>
      </AuthProvider>
    </GlobalProvider>
  );
}

export default App;
