// https://nuxt.com/docs/api/configuration/nuxt-config
import config from './config/index'
// eslint-disable-next-line no-undef
export default defineNuxtConfig({
  css: ['~/assets/styles/main.scss'],
  modules: ['@element-plus/nuxt', '@vueuse/nuxt', '@pinia/nuxt'],
  nitro: {
    devProxy: {
      '/gateway': {
        target: config.baseUrl,
        changeOrigin: true
      }
    }
  },
  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    }
  },
  devtools: { enabled: true }
})
