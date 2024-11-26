import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // Lauscht auf allen IP-Adressen, nicht nur localhost
    port: 5173,         // Der Port, den du für den Vite-Server verwendest
  }
})
