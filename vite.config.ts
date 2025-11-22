import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      'localhost',
      '.railway.app', // Allow all Railway domains
      'voicexfront-production.up.railway.app',
    ],
  },
  preview: {
    host: true,
    port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
    allowedHosts: [
      'localhost',
      '.railway.app', // Allow all Railway domains
      'voicexfront-production.up.railway.app',
    ],
  },
})
