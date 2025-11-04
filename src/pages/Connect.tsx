import { Icon } from "../components/atoms";
import packageJson from "../../package.json";

const Connect = () => {
  return (
    <div className="relative min-h-full text-white overflow-y-auto">
      <div className="relative z-10 max-w-4xl mx-auto py-20 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Let's Connect
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Looking for a Staff/Principal Engineer who combines deep technical
            expertise with leadership experience? Let's discuss how I can help
            your team succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Messaging Status */}
          <div className="bg-slate-800/40 rounded-xl p-8 border border-slate-700/40">
            <div className="text-center py-12">
              <Icon
                name="loading"
                size="xl"
                className="text-blue-400/50 mx-auto mb-6 animate-pulse"
              />

              <h2 className="text-2xl font-semibold text-white mb-4">
                Messaging Offline
              </h2>

              <div className="space-y-3 text-slate-300 mb-8">
                <p className="text-base">
                  Contact form will be available once{" "}
                  <span className="text-white font-mono">api.plixo.com</span>{" "}
                  adds messaging (~v1.3.0).
                </p>
                <p className="text-sm text-slate-400">
                  Version {packageJson.version}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-700/40">
                <p className="text-sm text-slate-400 mb-4">
                  In the meantime, reach out via:
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 p-3 rounded-lg bg-slate-800/70 hover:bg-slate-800 transition-colors"
                  >
                    <Icon name="linkedin" className="text-blue-400" />
                    <span>LinkedIn</span>
                    <Icon
                      name="external"
                      size="sm"
                      className="text-slate-400 ml-auto"
                    />
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 p-3 rounded-lg bg-slate-800/70 hover:bg-slate-800 transition-colors"
                  >
                    <Icon name="github" className="text-slate-300" />
                    <span>GitHub</span>
                    <Icon
                      name="external"
                      size="sm"
                      className="text-slate-400 ml-auto"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info & Status */}
          <div className="space-y-8">
            {/* Availability Status */}
            <div className="bg-slate-800/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon name="check" className="text-green-400" />
                Current Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Availability</span>
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-sm">
                    Open to Opportunities
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Response Time</span>
                  <span className="text-slate-300">24-48 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Location</span>
                  <span className="text-slate-300">Remote / Hybrid</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Focus</span>
                  <span className="text-slate-300">
                    Staff/Principal Engineer roles
                  </span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-slate-800/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Find Me Online</h3>
              <div className="space-y-3">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                >
                  <Icon name="linkedin" className="text-blue-400" />
                  <span>LinkedIn</span>
                  <Icon
                    name="external"
                    size="sm"
                    className="text-slate-400 ml-auto"
                  />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                >
                  <Icon name="github" className="text-slate-300" />
                  <span>GitHub</span>
                  <Icon
                    name="external"
                    size="sm"
                    className="text-slate-400 ml-auto"
                  />
                </a>
              </div>
            </div>

            {/* What I'm Looking For */}
            <div className="bg-slate-800/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">
                What I'm Looking For
              </h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <Icon
                    name="check"
                    size="sm"
                    className="text-green-400 mt-0.5"
                  />
                  <span>Staff/Principal Engineer positions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon
                    name="check"
                    size="sm"
                    className="text-green-400 mt-0.5"
                  />
                  <span>Technical leadership opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon
                    name="check"
                    size="sm"
                    className="text-green-400 mt-0.5"
                  />
                  <span>Architecture and system design roles</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon
                    name="check"
                    size="sm"
                    className="text-green-400 mt-0.5"
                  />
                  <span>Mentorship and team development</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon
                    name="check"
                    size="sm"
                    className="text-green-400 mt-0.5"
                  />
                  <span>Modern tech stack environments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect;
