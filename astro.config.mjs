import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://biswajit1999.github.io',
  base: '/AstroBis',
  integrations: [react(), tailwind()],
  output: 'static',
  vite: {
    build: {
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks: {
            'three-core':   ['three'],
            'r3f':          ['@react-three/fiber', '@react-three/drei'],
            'react-vendor': ['react', 'react-dom'],
          },
        },
      },
    },
  },
});
