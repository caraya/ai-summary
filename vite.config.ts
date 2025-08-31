import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/ai-summary.ts',
      formats: ['es']
    }
  }
})