import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // La landing page è ora index.html
        main: resolve(__dirname, 'index.html'),
        // La dashboard è dashboard.html
        dashboard: resolve(__dirname, 'dashboard.html'),
        // Le altre pagine
        map: resolve(__dirname, 'map.html'),
        about: resolve(__dirname, 'about.html'),
        struttura: resolve(__dirname, 'struttura.html'),
      },
    },
  },
});