// https://nuxt.com/docs/api/configuration/nuxt-config
// eslint-disable-next-line no-undef
export default defineNuxtConfig({
  experimental: {
    asyncContext: true
  },
  css: ['~/assets/styles/main.scss'],
  modules: ['@element-plus/nuxt', '@vueuse/nuxt'],
  nitro: {
    devProxy: {
      '/gateway': {
        target: import.meta.env.VITE_BASE_URL,
        changeOrigin: true
      }
    }
  },
  vite: {
    build: {
      minify: 'terser',
      emptyOutDir: true,
      chunkSizeWarningLimit: 1500,
      terserOptions: {
        compress: {
          drop_console: import.meta.env.VITE_DROP_CONSOLE,
          drop_debugger: import.meta.env.VITE_DROP_DEBUGGER
        }
      }
    },
    optimizeDeps: {
      include: ['element-plus/es/components/**']
    }
  },
  telemetry: false
})
