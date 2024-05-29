/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    // environment: 'jsdom',
    setupFiles: './testSetup.ts',
    // you might want to disable it, if you don't have tests that rely on CSS
    // since parsing CSS is slow
    css: false,
    coverage: {
      provider: 'v8'
    },
    reporters: ['html', 'verbose'],
    outputFile: {
      junit: './junit-report.html'
    },
    exclude: ['./server/**', './node_modules/**']
  },
})
