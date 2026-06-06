import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
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
