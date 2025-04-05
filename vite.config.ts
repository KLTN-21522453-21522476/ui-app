import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all requests starting with /api to your backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // Optional: remove '/api' prefix when forwarding to the target
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
      // Specific endpoint proxy
      '/auth/login': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
