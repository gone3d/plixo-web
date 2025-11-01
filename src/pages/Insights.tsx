import { Icon } from '../components/atoms'
import packageJson from '../../package.json'

const Insights = () => {
  return (
    <div className="relative min-h-full text-white overflow-y-auto">
      <div className="relative z-10 max-w-4xl mx-auto py-20 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Analytics & Insights
          </h1>
        </div>

        {/* API Integration Notice */}
        <div className="bg-slate-800/40 rounded-xl p-12 text-center border border-slate-700/40">
          <Icon name="loading" size="xl" className="text-blue-400/50 mx-auto mb-8 animate-pulse" />

          <h2 className="text-3xl font-semibold text-white mb-6">
            Awaiting API Integration
          </h2>

          <div className="space-y-2 text-slate-300">
            <p className="text-lg">
              Version {packageJson.version} of <span className="text-white font-mono">plixo.com</span> is not currently connected to{' '}
              <span className="text-white font-mono">api.plixo.com</span>
            </p>
            <p className="text-base mt-4">
              Come back soon for updates...
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-700/40">
            <p className="text-sm text-slate-400">
              Real-time analytics, GitHub integration, and visitor metrics will be available once the backend API is deployed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Insights