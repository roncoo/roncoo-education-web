// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import { codeInspectorPlugin } from 'code-inspector-plugin'

export default defineNuxtConfig({
  experimental: {
    asyncContext: true
  },
  css: ['~/assets/styles/main.scss'],
  modules: ['@element-plus/nuxt', '@vueuse/nuxt'],
  nitro: {
    devProxy: {
      '/gateway': {
        target: process.env.VITE_BASE_URL,
        changeOrigin: true
      }
    }
  },
  vite: {
    plugins: process.env.NODE_ENV === 'development'
      ? [
          codeInspectorPlugin({
            bundler: 'vite',
            editor: 'webstorm'
          })
        ]
      : [],
    build: {
      minify: 'terser',
      emptyOutDir: true,
      chunkSizeWarningLimit: 1500,
      terserOptions: {
        compress: {
          drop_console: process.env.VITE_DROP_CONSOLE,
          drop_debugger: process.env.VITE_DROP_DEBUGGER
        }
      }
    }
  },
  sourcemap: {
    server: process.env.NODE_ENV === 'development',
    client: process.env.NODE_ENV === 'development'
  },
  telemetry: true,
  compatibilityDate: '2026-11-06'
})
