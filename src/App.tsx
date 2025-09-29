import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/molecules";
import { Landing, Work, About, Insights, Connect } from "./pages";
import { PortfolioProvider } from "./contexts/PortfolioContext";
import "./App.css";

function App() {
  return (
    <PortfolioProvider>
      <Router>
        <div className="h-screen w-screen overflow-hidden bg-black/20" style={{ margin: 0, padding: 0 }}>
          <Navigation />

          {/* Main content - full height minus nav */}
          <main className="h-full w-full" style={{ height: 'calc(100vh - 4rem)', margin: 0, padding: 0 }}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/work" element={<Work />} />
              <Route path="/about" element={<About />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/connect" element={<Connect />} />

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
    </PortfolioProvider>
  );
}

export default App;
