import { useState, useEffect } from 'react'
import { Icon, LoadingSpinner } from '../components/atoms'
import { useGlobal } from '../contexts/GlobalContext'
import packageJson from '../../package.json'
import { analyticsClient } from '../services/analyticsClient'
import { apiClient } from '../services/api'
import { MarkdownRenderer } from '../utils/MarkdownRenderer'

interface AboutSection {
  title: string
  content: string
  order: number
}

const About = () => {
  const { state } = useGlobal()
  const [sections, setSections] = useState<AboutSection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch About content from API
  useEffect(() => {
    fetchAboutContent()
  }, [])

  const fetchAboutContent = async () => {
    try {
      const { data } = await apiClient.get('/about')
      if (data.success && data.data?.sections) {
        // Sort sections by order field
        const sortedSections = [...data.data.sections].sort((a, b) => a.order - b.order)
        setSections(sortedSections)
      } else {
        setError('Failed to load About content')
      }
    } catch (err: any) {
      console.error('Error fetching About content:', err)
      setError(err.response?.data?.error || 'Error loading About content')
    } finally {
      setLoading(false)
    }
  }

  // Get icon for section based on title
  const getSectionIcon = (title: string): string => {
    if (title.toLowerCase().includes('about me')) return 'user'
    if (title.toLowerCase().includes('tech stack')) return 'check'
    if (title.toLowerCase().includes('repositories')) return 'github'
    if (title.toLowerCase().includes('[todo]')) return 'list'
    return 'work'
  }

  // Get icon color for section
  const getSectionIconColor = (title: string): string => {
    if (title.toLowerCase().includes('about me')) return 'text-blue-400'
    if (title.toLowerCase().includes('tech stack')) return 'text-green-400'
    if (title.toLowerCase().includes('repositories')) return 'text-slate-300'
    if (title.toLowerCase().includes('[todo]')) return 'text-yellow-400'
    return 'text-purple-400'
  }

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
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-900/20 border border-red-500/40 rounded-lg p-6 text-center">
              <p className="text-red-300 mb-2">{error}</p>
              <button
                onClick={fetchAboutContent}
                className="text-sm text-red-400 hover:text-red-300 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* API-driven sections */}
          {!loading && !error && sections.map((section) => (
            <div key={section.order} className="bg-black/40 p-6 backdrop-blur-sm rounded-lg">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Icon name={getSectionIcon(section.title)} className={getSectionIconColor(section.title)} />
                {section.title}
              </h2>
              <div className="prose prose-invert prose-slate max-w-none text-slate-300">
                <MarkdownRenderer
                  content={section.content}
                  onLinkClick={handleExternalLinkClick}
                />
              </div>
            </div>
          ))}

          {/* Version Info - Dynamic (not from database) */}
          {!loading && !error && (
            <div className="bg-black/40 p-6 backdrop-blur-sm rounded-lg">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Icon name="chart" className="text-cyan-400" />
                Version Info
              </h2>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
