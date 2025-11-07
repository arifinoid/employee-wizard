import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['happydom.ts', 'src/vitest.setup.ts'],
    css: true,
  },
})
