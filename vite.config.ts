import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk - React libraries (rarely change, better caching)
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],

          // UI libraries
          'vendor-ui': ['sonner', 'lucide-react', '@hookform/resolvers', 'react-hook-form', 'zod'],

          // Three.js - Heavy library, lazy loaded
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],

          // Charts and maps - Only used in Insights/Console pages
          'vendor-charts': ['recharts', 'react-simple-maps'],

          // Query library
          'vendor-query': ['@tanstack/react-query'],
        },
      },
    },
    // Increase chunk size warning limit (Three.js is large)
    chunkSizeWarningLimit: 800,
  },
})
