// https://nuxt.com/docs/api/configuration/nuxt-config
import config from './config/index'
// eslint-disable-next-line no-undef
export default defineNuxtConfig({
  experimental: {
    asyncContext: true
  },
  css: ['~/assets/styles/main.scss'],
  modules: ['@element-plus/nuxt', '@pinia/nuxt', '@vueuse/nuxt'],
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
  telemetry: false,
  devtools: { enabled: true }
})
