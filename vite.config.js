// @ts-check
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx'],
      thresholds: {
        global: {
          lines: 80,
          statements: 80,
          functions: 80,
          branches: 70
        },
        'src/lib/**': {
          lines: 90,
          statements: 90,
          functions: 90,
          branches: 85
        }
      }
    }
  }
})
