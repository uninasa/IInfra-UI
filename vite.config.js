import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createMockPlugin } from './mock/_createMockPlugin.js'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    createMockPlugin({ mockPath: 'mock' }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar',
          ],
        },
      ],
    }),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // 所有 /api 请求，如果 Mock 没拦截，就转发到后端
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // 不重写路径，保持 /api 前缀
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
})
