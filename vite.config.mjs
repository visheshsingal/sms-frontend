import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
  ,
  build: {
    // increase the warning threshold to avoid noise for slightly large bundles
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Split large vendor libraries into separate chunks to improve caching
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor.react'
            if (id.includes('react-dom')) return 'vendor.react-dom'
            if (id.includes('react-leaflet') || id.includes('leaflet')) return 'vendor.leaflet'
            if (id.includes('html5-qrcode')) return 'vendor.html5-qrcode'
            if (id.includes('framer-motion')) return 'vendor.framer'
            if (id.includes('lucide-react')) return 'vendor.icons'
            if (id.includes('axios')) return 'vendor.axios'
            if (id.includes('date-fns')) return 'vendor.datefns'
            return 'vendor'
          }
        }
      }
    }
  }
})
