import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import App from './App.tsx'

// Create React Query client with optimized caching strategy
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Cache data for 10 minutes (formerly cacheTime)
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: true, // Refetch when reconnecting
    },
    mutations: {
      retry: 0, // Don't retry mutations by default
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* React Query DevTools - only visible in development */}
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
    </QueryClientProvider>
  </StrictMode>,
)
