import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: [
      { find: '@core', replacement: fileURLToPath(new URL('./src/core', import.meta.url)) },
      { find: '@feature', replacement: fileURLToPath(new URL('./src/feature-module', import.meta.url)) },
      { find: /^react-router$/, replacement: 'react-router-dom' }
    ]
  }
})
