import { useState, useEffect } from 'react'
import { LoadingSpinner } from '../atoms'
import { authService } from '../../services/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8788'

interface City {
  city: string
  region: string
  country: string
  count: number
}

interface CitiesListProps {
  locationCode: string
  timeRange: string
}

export const CitiesList = ({ locationCode, timeRange }: CitiesListProps) => {
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCities()
  }, [locationCode, timeRange])

  const fetchCities = async () => {
    setLoading(true)
    setError(null)

    try {
      // Calculate date range from timeRange string
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

      const token = authService.getToken()
      if (!token) {
        setError('Authentication required')
        setLoading(false)
        return
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/analytics/cities?country=US&state=${locationCode}&since=${since}&until=${until}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch city data')
      }

      if (data.success) {
        setCities(data.data || [])
      } else {
        setError(data.error || 'Failed to load cities')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner variant="primary" size="md" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  if (cities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 text-sm italic">No city data available for this location</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {cities.map((city, idx) => (
        <div
          key={`${city.city}-${city.region}`}
          className="flex justify-between items-center p-3 bg-slate-900/40 rounded-lg hover:bg-slate-900/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-mono text-sm w-8">#{idx + 1}</span>
            <div>
              <div className="text-white font-medium">{city.city}</div>
              <div className="text-slate-400 text-xs">{city.region}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white font-semibold">{city.count}</div>
            <div className="text-slate-500 text-xs">
              {city.count === 1 ? 'visit' : 'visits'}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
