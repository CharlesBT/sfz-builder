import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    // reporters: ['verbose'],
    passWithNoTests: true,
    coverage: {
      reportsDirectory: './test/coverage',
    },
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
  resolve: {
    alias: {},
  },
})
