import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  base: process.env.NODE_ENV === 'production'
    ? '/brain/' // 例如 '/my-vue3-demo/'
    : '/',
  resolve: {
    alias: {
      '@': '/src',  // 确保这个别名指向正确的路径
    },
  },
})
