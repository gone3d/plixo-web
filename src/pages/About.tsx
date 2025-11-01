import { Icon } from '../components/atoms'
import packageJson from '../../package.json'

const About = () => {
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
                  This portfolio is built as a modern React single-page application with server-side
                  rendering considerations. The frontend is deployed to CloudFlare Pages with automatic
                  deployments from GitHub. The backend API (currently in development) will use CloudFlare
                  Pages Functions with D1 SQLite database, following the same architecture as the
                  tenebrae-api-cloudflare reference implementation.
                </p>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Tech Stack</h3>
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
                    <span className="text-sm">CloudFlare Pages</span>
                  </div>
                </div>
              </div>

              {/* GitHub Repository */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Repository</h3>
                <div className="space-y-3">
                  <a
                    href="https://github.com/gone3d/plixo-web"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Icon name="github" className="text-slate-300" />
                    <div className="flex-1">
                      <div className="font-medium">github.com/gone3d/plixo-web</div>
                      <div className="text-sm text-slate-400">Frontend Repository - Public</div>
                    </div>
                    <Icon name="external" size="sm" className="text-slate-400" />
                  </a>

                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-300">Current Version</span>
                    <span className="font-mono text-blue-400">v{packageJson.version}</span>
                  </div>

                  <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/30">
                    <p className="text-sm text-slate-400">
                      <Icon name="loading" size="sm" className="inline mr-2 text-blue-400/50 animate-pulse" />
                      Live GitHub stats (stars, commits, contributors) will be displayed once api.plixo.com is connected.
                    </p>
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
