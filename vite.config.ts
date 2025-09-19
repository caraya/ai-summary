import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/AiSummary.ts',
      formats: ['es']
    }
  }
})