import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createMockPlugin } from './mock/_createMockPlugin.js'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    createMockPlugin({ mockPath: 'mock' }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
