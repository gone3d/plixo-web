import { Icon, Skeleton, BackgroundSlideshow } from '../components/atoms'

const backgroundImages = [
  { filename: 'astronomyBG1.jpg' },
  { filename: 'astronomyBG2.jpg' }
]

const Insights = () => {
  // Mock data for demonstration
  const stats = {
    visitors: 1247,
    pageViews: 3891,
    avgSession: '3:24',
    bounceRate: '28%'
  }

  const topPages = [
    { path: '/', views: 1547, percentage: 45 },
    { path: '/work', views: 892, percentage: 26 },
    { path: '/about', views: 634, percentage: 18 },
    { path: '/insights', views: 318, percentage: 9 },
    { path: '/connect', views: 123, percentage: 4 }
  ]

  const techStack = [
    { name: 'TypeScript', percentage: 45, color: 'bg-blue-500' },
    { name: 'JavaScript', percentage: 30, color: 'bg-yellow-500' },
    { name: 'Python', percentage: 15, color: 'bg-green-500' },
    { name: 'Go', percentage: 8, color: 'bg-cyan-500' },
    { name: 'Other', percentage: 2, color: 'bg-slate-500' }
  ]

  return (
    <div className="relative h-full text-white overflow-y-auto">
      <BackgroundSlideshow
        images={backgroundImages}
        transitionTime={22000}
        showOverlay={true}
        displayMode="slide"
      />
      <div className="relative z-10 max-w-6xl mx-auto py-20 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Analytics & Insights
          </h1>
          <p className="text-xl text-slate-300">
            Real-time portfolio metrics and technical activity
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 text-center">
            <Icon name="user" size="lg" className="text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{stats.visitors.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Total Visitors</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 text-center">
            <Icon name="chart" size="lg" className="text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{stats.pageViews.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Page Views</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 text-center">
            <Icon name="loading" size="lg" className="text-cyan-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{stats.avgSession}</div>
            <div className="text-sm text-slate-400">Avg Session</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 text-center">
            <Icon name="check" size="lg" className="text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{stats.bounceRate}</div>
            <div className="text-sm text-slate-400">Bounce Rate</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Popular Pages */}
          <div className="bg-slate-800/30 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Icon name="chart" className="text-blue-400" />
              Popular Pages
            </h2>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-sm w-6">{index + 1}</span>
                    <span className="font-medium">{page.path}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${page.percentage}%` }}
                      />
                    </div>
                    <span className="text-slate-400 text-sm w-12">{page.views}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub Activity */}
          <div className="bg-slate-800/30 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Icon name="github" className="text-purple-400" />
              GitHub Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <span>Latest Commit</span>
                <span className="text-green-400 text-sm">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <span>Active Repositories</span>
                <span className="text-blue-400 font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <span>Contribution Streak</span>
                <span className="text-cyan-400 font-semibold">47 days</span>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <div className="text-sm text-slate-400 mb-2">Language Distribution</div>
                <div className="space-y-2">
                  {techStack.map((tech, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${tech.color}`} />
                      <span className="flex-1 text-sm">{tech.name}</span>
                      <span className="text-slate-400 text-sm">{tech.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Features Demo */}
        <div className="bg-slate-800/30 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Icon name="loading" className="text-cyan-400" />
            Real-time Data Integration (Coming Soon)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="text-sm text-slate-400">Visitor Map</div>
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-3">
              <div className="text-sm text-slate-400">Live GitHub Feed</div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-sm text-slate-400">Performance Metrics</div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-6 w-4/5" />
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              WebSocket integration and live data feeds will be implemented in Phase 3
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Insights