import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // Lauscht auf allen IP-Adressen, nicht nur localhost
    port: 5173,         // Der Port, den du für den Vite-Server verwendest
    proxy: {
      // Anfragen an /api an den Flask-Server weiterleiten
      '/api': {
        target: 'http://127.0.0.1:5000', // Die Adresse deines lokalen Flask-Servers
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  }
})
