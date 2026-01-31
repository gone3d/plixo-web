import { Icon } from '../components/atoms'
import { useGlobal } from '../contexts/GlobalContext'
import packageJson from '../../package.json'
import { analyticsClient } from '../services/analyticsClient'

const About = () => {
  const { state } = useGlobal()

  // Track external link clicks
  const handleExternalLinkClick = (destination: string, linkText: string) => {
    analyticsClient.trackExternalLink(destination, linkText)
  }

  return (
    <div className="relative min-h-full text-white overflow-y-auto">
      <div className="relative z-10 max-w-4xl mx-auto py-20 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            About
          </h1>
        </div>

        <div className="space-y-12">
          {/* About Me Section */}
          <div className="bg-black/40 p-6 backdrop-blur-sm rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Icon name="user" className="text-blue-400" />
              About Me
            </h2>
            <div className="space-y-6 text-slate-300 leading-relaxed">
              <p>
                My career has spanned research laboratories, defense contractors,
                and enterprise technology leadership. With a Computer Science
                foundation in 3D animation and visualization, I started with
                satellite image processing at NASA's Jet Propulsion Laboratory,
                then advanced to BAE Systems where I architected everything from
                HAARP antenna control systems to hyperspectral imaging tools and
                directed energy platforms.
              </p>
              <p>
                The transition to enterprise software brought leadership roles in
                interactive media and streaming video platforms, culminating in
                engineering management at Capital One where I led teams through
                complex migrations from legacy systems to modern cloud
                architectures. Today, I architect AI-integrated applications and
                develop frameworks for LLM-augmented development workflows.
              </p>
              <p>
                Throughout this progression, the pattern has remained consistent:
                identify emerging technologies, extract practical value, and build
                solutions that engineering teams can maintain and extend. Whether
                migrating government training systems from Flash to VR, deploying
                custom AI models, or architecting streaming platforms, the focus
                stays on sustainable, scalable implementations.
              </p>
              <p>
                These days I focus on building systems that scale gracefully and
                teams that ship consistently. The technology changes, but good
                engineering principles endure.
              </p>
            </div>
          </div>

          {/* About This App Section */}
          <div className="bg-black/40 p-6 backdrop-blur-sm rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Icon name="work" className="text-purple-400" />
              About This App
            </h2>

            <div className="space-y-6 text-slate-300">
              {/* Architecture */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Architecture</h3>
                <p className="leading-relaxed mb-3">
                  This portfolio is built as a modern React single-page application deployed to CloudFlare
                  Pages with automatic deployments from GitHub. The backend API (api.plixo.com) is deployed
                  using CloudFlare Pages Functions with D1 SQLite database, providing secure, scalable data
                  management with global edge distribution.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <div className="p-3 bg-slate-800/30 rounded-lg border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="work" size="sm" className="text-blue-400" />
                      <span className="font-semibold text-white">Frontend</span>
                    </div>
                    <p className="text-sm text-slate-400">plixo.com - CloudFlare Pages</p>
                    <p className="text-xs text-slate-500 mt-1">React SPA with glassmorphism UI</p>
                  </div>
                  <div className="p-3 bg-slate-800/30 rounded-lg border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="chart" size="sm" className="text-purple-400" />
                      <span className="font-semibold text-white">Backend API</span>
                    </div>
                    <p className="text-sm text-slate-400">api.plixo.com - Pages Functions</p>
                    <p className="text-xs text-slate-500 mt-1">D1 database with encrypted data</p>
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Tech Stack</h3>

                {/* Frontend Technologies */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide">Frontend</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded">
                      <Icon name="check" size="sm" className="text-blue-400" />
                      <span className="text-sm">React {packageJson.dependencies.react.replace('^', '')}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded">
                      <Icon name="check" size="sm" className="text-cyan-400" />
                      <span className="text-sm">TypeScript (Strict Mode)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded">
                      <Icon name="check" size="sm" className="text-purple-400" />
                      <span className="text-sm">Vite {packageJson.devDependencies.vite.replace('^', '')}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded">
                      <Icon name="check" size="sm" className="text-blue-400" />
                      <span className="text-sm">Tailwind CSS v4</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded">
                      <Icon name="check" size="sm" className="text-orange-400" />
                      <span className="text-sm">React Router v7</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded">
                      <Icon name="check" size="sm" className="text-green-400" />
                      <span className="text-sm">TanStack React Query</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded">
                      <Icon name="check" size="sm" className="text-emerald-400" />
                      <span className="text-sm">Three.js / React Three Fiber</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded">
                      <Icon name="check" size="sm" className="text-pink-400" />
                      <span className="text-sm">React Hook Form + Zod</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded">
                      <Icon name="check" size="sm" className="text-yellow-400" />
                      <span className="text-sm">Cloudflare Turnstile</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded">
                      <Icon name="check" size="sm" className="text-indigo-400" />
                      <span className="text-sm">Recharts + React Simple Maps</span>
                    </div>
                  </div>
                </div>

                {/* Backend Technologies */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide">Backend API</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded">
                      <Icon name="check" size="sm" className="text-purple-400" />
                      <span className="text-sm">CloudFlare Pages Functions</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded">
                      <Icon name="check" size="sm" className="text-orange-400" />
                      <span className="text-sm">Hono Web Framework</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded">
                      <Icon name="check" size="sm" className="text-cyan-400" />
                      <span className="text-sm">D1 Database (SQLite)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded">
                      <Icon name="check" size="sm" className="text-yellow-400" />
                      <span className="text-sm">Jose (JWT Authentication)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded">
                      <Icon name="check" size="sm" className="text-red-400" />
                      <span className="text-sm">bcrypt Password Hashing</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded">
                      <Icon name="check" size="sm" className="text-pink-400" />
                      <span className="text-sm">AES-256 Encryption</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded">
                      <Icon name="check" size="sm" className="text-green-400" />
                      <span className="text-sm">GDPR Compliant Analytics</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded">
                      <Icon name="check" size="sm" className="text-blue-400" />
                      <span className="text-sm">RESTful API Design</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* GitHub Repository */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Repositories</h3>
                <div className="space-y-3">
                  <a
                    href="https://github.com/gone3d/plixo-web"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleExternalLinkClick('https://github.com/gone3d/plixo-web', 'GitHub - plixo-web')}
                    className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Icon name="github" className="text-slate-300" />
                    <div className="flex-1">
                      <div className="font-medium">github.com/gone3d/plixo-web</div>
                      <div className="text-sm text-slate-400">Frontend Repository - React/TypeScript SPA</div>
                    </div>
                    <Icon name="external" size="sm" className="text-slate-400" />
                  </a>

                  <a
                    href="https://github.com/gone3d/plixo-api"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleExternalLinkClick('https://github.com/gone3d/plixo-api', 'GitHub - plixo-api')}
                    className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Icon name="github" className="text-slate-300" />
                    <div className="flex-1">
                      <div className="font-medium">github.com/gone3d/plixo-api</div>
                      <div className="text-sm text-slate-400">Backend API - CloudFlare Functions/D1</div>
                    </div>
                    <Icon name="external" size="sm" className="text-slate-400" />
                  </a>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-300">Frontend Version</span>
                      <span className="font-mono text-blue-400">v{packageJson.version}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-300">API Version</span>
                      <span className="font-mono text-purple-400">
                        {state.api.version ? `v${state.api.version}` : '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-300">API Status</span>
                      <span className="flex items-center gap-2">
                        {state.api.status === 'online' && (
                          <>
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-green-400 text-sm">Live</span>
                          </>
                        )}
                        {state.api.status === 'offline' && (
                          <>
                            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                            <span className="text-red-400 text-sm">Offline</span>
                          </>
                        )}
                        {state.api.status === 'checking' && (
                          <>
                            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                            <span className="text-yellow-400 text-sm">Checking...</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
