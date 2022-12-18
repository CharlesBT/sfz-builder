import { mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'

import vitetestBaseConfig from '../vitest.config'

export default mergeConfig(
  vitetestBaseConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
    },
  }),
)
