import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../services/api'

interface HealthResponse {
  status: string
  version: string
  timestamp: string
  database: string
}

/**
 * Hook to check API health status
 * Useful for verifying API connectivity and displaying version info
 */
export const useHealth = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const { data } = await apiClient.get<HealthResponse>('/health')
      return data
    },
    staleTime: 30 * 1000, // Refresh every 30 seconds
    retry: 3, // Retry 3 times for health checks
  })
}
