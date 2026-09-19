import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://biswajit1999.github.io',
  base: '/AstroBis',
  integrations: [react()],
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
    build: {
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('/node_modules/three/')) return 'three-core';
            if (id.includes('/node_modules/@react-three/')) return 'r3f';
            if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/')) return 'react-vendor';
            return undefined;
          },
        },
      },
    },
  },
});
