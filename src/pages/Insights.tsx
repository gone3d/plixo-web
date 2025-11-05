import { useState, useEffect } from 'react'
import { Icon, Button, LoadingSpinner } from '../components/atoms'
import {
  GeographicMap,
  MapTabs,
  ChartToggle,
  BarChartComponent,
  PieChartComponent,
  type ChartType,
  type MapView,
} from '../components/molecules'

interface WebAnalytics {
  pageViews: number
  uniqueVisitors: number
  bandwidth: number
  requests: number
  topPages: Array<{ path: string; views: number }>
}

interface CustomAnalytics {
  totalEvents: number
  pageViews: number
  projectViews: number
  externalLinks: number
  contactForms: number
  eventsByType: Array<{ eventType: string; count: number }>
  eventsByPage: Array<{ page: string; count: number }>
  eventsByCountry: Array<{ country: string; countryName: string; count: number }>
  eventsByDevice: Array<{ deviceType: string; count: number }>
  eventsByBrowser: Array<{ browserFamily: string; count: number }>
  eventsByUSState: Array<{ state: string; stateName: string; count: number }>
}

interface AnalyticsData {
  webAnalytics: WebAnalytics | null
  customAnalytics: CustomAnalytics | null
  timeRange: {
    since: string
    until: string
  }
}

const Insights = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<'hour_1' | 'hour_12' | '1' | '7' | '30'>('30')

  // Chart type toggles for each section
  const [eventTypeChart, setEventTypeChart] = useState<ChartType>('bar')
  const [pageChart, setPageChart] = useState<ChartType>('bar')
  const [deviceChart, setDeviceChart] = useState<ChartType>('pie')
  const [browserChart, setBrowserChart] = useState<ChartType>('pie')

  // Map view toggle (world vs USA)
  const [mapView, setMapView] = useState<MapView>('world')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    setError(null)

    try {
      // Build API URL based on time range type
      let apiUrl: string

      if (timeRange.startsWith('hour_')) {
        // Hour-based range: use ?hours=X parameter
        const hours = timeRange.replace('hour_', '')
        apiUrl = `https://api.plixo.com/api/analytics/overview?hours=${hours}`
      } else {
        // Day-based range: calculate date range
        const now = new Date()
        const daysAgo = new Date(now.getTime() - parseInt(timeRange) * 24 * 60 * 60 * 1000)

        const formatDate = (date: Date): string => {
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          return `${year}-${month}-${day}`
        }

        const since = formatDate(daysAgo)
        const until = formatDate(now)

        apiUrl = `https://api.plixo.com/api/analytics/overview?since=${since}&until=${until}`
      }

      const response = await fetch(apiUrl)
      const data = await response.json()

      if (response.ok && data.success) {
        setAnalyticsData(data)
      } else {
        setError(data.error || 'Failed to fetch analytics')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  // Format large numbers with commas
  const formatNumber = (num: number) => new Intl.NumberFormat().format(num)

  // Format bytes to human readable
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="relative min-h-full text-white overflow-y-auto">
      <div className="relative z-10 max-w-7xl mx-auto py-20 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Analytics & Insights
          </h1>
          <p className="text-slate-300 mb-6">
            Comparing CloudFlare Web Analytics vs Custom Event Tracking
          </p>

          {/* Time Range Selector */}
          <div className="flex justify-center items-center gap-3">
            <span className="text-slate-400 text-sm">Time Range:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as 'hour_1' | 'hour_12' | '1' | '7' | '30')}
              className="bg-slate-800/60 border border-slate-700/40 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 hover:bg-slate-800/80 transition-colors"
            >
              <option value="hour_1">Last 1 Hour</option>
              <option value="hour_12">Last 12 Hours</option>
              <option value="1">Last 24 Hours</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-slate-400">Loading analytics data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center">
            <Icon name="warning" size="xl" className="text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-red-300 mb-2">Error Loading Analytics</h2>
            <p className="text-red-200">{error}</p>
            <Button onClick={fetchAnalytics} variant="primary" className="mt-6">
              Retry
            </Button>
          </div>
        )}

        {/* Analytics Dashboard */}
        {!loading && !error && analyticsData && (
          <div className="space-y-8">
            {/* Time Range */}
            <div className="text-center text-slate-400 text-sm">
              Showing data from{' '}
              {new Date(analyticsData.timeRange.since).toLocaleDateString()} to{' '}
              {new Date(analyticsData.timeRange.until).toLocaleDateString()}
            </div>

            {/* Two Column Comparison */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* CloudFlare Web Analytics */}
              <div className="bg-slate-800/40 rounded-xl p-8 border border-slate-700/40">
                <div className="flex items-center gap-3 mb-6">
                  <Icon name="chart" size="lg" className="text-blue-400" />
                  <h2 className="text-2xl font-semibold">CloudFlare Analytics</h2>
                </div>
                <p className="text-slate-400 text-sm mb-6">
                  Built-in historical data ({
                    timeRange === 'hour_1' ? 'last 1 hour' :
                    timeRange === 'hour_12' ? 'last 12 hours' :
                    timeRange === '1' ? 'last 24 hours' :
                    timeRange === '7' ? 'last 7 days' :
                    'last 30 days'
                  })
                </p>

                {analyticsData.webAnalytics ? (
                  <div className="space-y-4">
                    <MetricCard
                      label="Page Views"
                      value={formatNumber(analyticsData.webAnalytics.pageViews)}
                      icon="chart"
                    />
                    <MetricCard
                      label="Unique Visitors"
                      value={formatNumber(analyticsData.webAnalytics.uniqueVisitors)}
                      icon="user"
                    />
                    <MetricCard
                      label="Total Requests"
                      value={formatNumber(analyticsData.webAnalytics.requests)}
                      icon="external"
                    />
                    <MetricCard
                      label="Bandwidth Used"
                      value={formatBytes(analyticsData.webAnalytics.bandwidth)}
                      icon="external"
                    />

                    {/* Top Pages */}
                    {analyticsData.webAnalytics.topPages.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-slate-700/40">
                        <h3 className="text-lg font-semibold mb-4 text-slate-300">Top Pages</h3>
                        <div className="space-y-2">
                          {analyticsData.webAnalytics.topPages.slice(0, 5).map((page, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-slate-400 truncate">{page.path}</span>
                              <span className="text-white font-mono ml-2">{formatNumber(page.views)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No data available</p>
                )}
              </div>

              {/* Custom Analytics Engine */}
              <div className="bg-slate-800/40 rounded-xl p-8 border border-slate-700/40">
                <div className="flex items-center gap-3 mb-6">
                  <Icon name="chart" size="lg" className="text-purple-400" />
                  <h2 className="text-2xl font-semibold">Custom Tracking</h2>
                </div>
                <p className="text-slate-400 text-sm mb-6">Analytics Engine event data (going forward)</p>

                {analyticsData.customAnalytics ? (
                  <div className="space-y-4">
                    <MetricCard
                      label="Total Events"
                      value={formatNumber(analyticsData.customAnalytics.totalEvents)}
                      icon="chart"
                    />
                    <MetricCard
                      label="Page Views"
                      value={formatNumber(analyticsData.customAnalytics.pageViews)}
                      icon="chart"
                    />
                    <MetricCard
                      label="Project Views"
                      value={formatNumber(analyticsData.customAnalytics.projectViews)}
                      icon="work"
                    />
                    <MetricCard
                      label="External Links"
                      value={formatNumber(analyticsData.customAnalytics.externalLinks)}
                      icon="external"
                    />
                    <MetricCard
                      label="Contact Forms"
                      value={formatNumber(analyticsData.customAnalytics.contactForms)}
                      icon="contact"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-slate-500 italic">No custom events yet</p>
                    <p className="text-sm text-slate-600">
                      Custom event tracking starts from deployment. Visit pages and interact with the site to generate events.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Analytics - Only show if custom analytics has data */}
            {analyticsData.customAnalytics && analyticsData.customAnalytics.totalEvents > 0 && (
              <>
                {/* Event Type Breakdown */}
                {analyticsData.customAnalytics.eventsByType.length > 0 && (
                  <div className="bg-slate-800/40 rounded-xl p-8 border border-slate-700/40">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Icon name="chart" size="lg" className="text-green-400" />
                        <h2 className="text-2xl font-semibold">Event Types</h2>
                      </div>
                      <ChartToggle activeChart={eventTypeChart} onToggle={setEventTypeChart} />
                    </div>

                    {eventTypeChart === 'bar' ? (
                      <BarChartComponent
                        data={analyticsData.customAnalytics.eventsByType.map(e => ({
                          name: e.eventType.replace('_', ' '),
                          value: e.count,
                        }))}
                      />
                    ) : (
                      <PieChartComponent
                        data={analyticsData.customAnalytics.eventsByType.map(e => ({
                          name: e.eventType.replace('_', ' '),
                          value: e.count,
                        }))}
                        showPercentage={true}
                      />
                    )}
                  </div>
                )}

                {/* Page Analytics */}
                {analyticsData.customAnalytics.eventsByPage.length > 0 && (
                  <div className="bg-slate-800/40 rounded-xl p-8 border border-slate-700/40">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Icon name="chart" size="lg" className="text-blue-400" />
                        <h2 className="text-2xl font-semibold">Top Pages</h2>
                      </div>
                      <ChartToggle activeChart={pageChart} onToggle={setPageChart} />
                    </div>

                    {pageChart === 'bar' ? (
                      <BarChartComponent
                        data={analyticsData.customAnalytics.eventsByPage.map(p => ({
                          name: p.page || '/',
                          value: p.count,
                        }))}
                      />
                    ) : (
                      <PieChartComponent
                        data={analyticsData.customAnalytics.eventsByPage.map(p => ({
                          name: p.page || '/',
                          value: p.count,
                        }))}
                        showPercentage={true}
                      />
                    )}
                  </div>
                )}

                {/* Geographic Distribution */}
                {analyticsData.customAnalytics.eventsByCountry.length > 0 && (
                  <div className="bg-slate-800/40 rounded-xl p-8 border border-slate-700/40">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Icon name="globe" size="lg" className="text-yellow-400" />
                        <h2 className="text-2xl font-semibold">Geographic Distribution</h2>
                      </div>
                      <MapTabs
                        activeView={mapView}
                        onViewChange={setMapView}
                        worldCount={analyticsData.customAnalytics.eventsByCountry.reduce((sum, c) => sum + c.count, 0)}
                        usaCount={(analyticsData.customAnalytics.eventsByUSState || []).reduce((sum, s) => sum + s.count, 0)}
                      />
                    </div>

                    <GeographicMap
                      activeView={mapView}
                      worldData={analyticsData.customAnalytics.eventsByCountry}
                      usaData={analyticsData.customAnalytics.eventsByUSState || []}
                    />
                  </div>
                )}

                {/* Device & Browser Breakdown */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Device Types */}
                  {analyticsData.customAnalytics.eventsByDevice.length > 0 && (
                    <div className="bg-slate-800/40 rounded-xl p-8 border border-slate-700/40">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <Icon name="monitor-smartphone" size="lg" className="text-cyan-400" />
                          <h2 className="text-2xl font-semibold">Devices</h2>
                        </div>
                        <ChartToggle activeChart={deviceChart} onToggle={setDeviceChart} />
                      </div>

                      {deviceChart === 'bar' ? (
                        <BarChartComponent
                          data={analyticsData.customAnalytics.eventsByDevice.map(d => ({
                            name: d.deviceType,
                            value: d.count,
                          }))}
                        />
                      ) : (
                        <PieChartComponent
                          data={analyticsData.customAnalytics.eventsByDevice.map(d => ({
                            name: d.deviceType,
                            value: d.count,
                          }))}
                          showPercentage={true}
                        />
                      )}
                    </div>
                  )}

                  {/* Browser Types */}
                  {analyticsData.customAnalytics.eventsByBrowser.length > 0 && (
                    <div className="bg-slate-800/40 rounded-xl p-8 border border-slate-700/40">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <Icon name="monitor" size="lg" className="text-orange-400" />
                          <h2 className="text-2xl font-semibold">Browsers</h2>
                        </div>
                        <ChartToggle activeChart={browserChart} onToggle={setBrowserChart} />
                      </div>

                      {browserChart === 'bar' ? (
                        <BarChartComponent
                          data={analyticsData.customAnalytics.eventsByBrowser.map(b => ({
                            name: b.browserFamily,
                            value: b.count,
                          }))}
                        />
                      ) : (
                        <PieChartComponent
                          data={analyticsData.customAnalytics.eventsByBrowser.map(b => ({
                            name: b.browserFamily,
                            value: b.count,
                          }))}
                          showPercentage={true}
                        />
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Metric Card Component
const MetricCard = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-lg">
    <div className="flex items-center gap-3">
      <Icon name={icon as any} className="text-slate-500" />
      <span className="text-slate-400">{label}</span>
    </div>
    <span className="text-white font-semibold text-lg">{value}</span>
  </div>
)

export default Insights