import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/react/template/', // 👈 This ensures correct asset loading path
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, 'src/core'),
      '@feature': path.resolve(__dirname, 'src/feature-module'),
    }
  }
})
