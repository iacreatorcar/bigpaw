// file: web/vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3001,  // diverso dal backend
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})