import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Force direct resolution so @mui/styled-engine's optional-peer-dep
    // detection doesn't fall back to its (broken) virtual module lookup.
    alias: {
      '@emotion/styled': fileURLToPath(new URL('./node_modules/@emotion/styled', import.meta.url)),
      '@emotion/react': fileURLToPath(new URL('./node_modules/@emotion/react', import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ['@emotion/react', '@emotion/styled'],
  },
})
