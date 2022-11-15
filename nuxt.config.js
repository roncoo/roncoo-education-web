const pkg = require('./package')
const config = require('./config').default
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
export default {
  mode: 'universal',
  telemetry: false,
  server: {
    port: 3000, // default: 3000
    host: '0.0.0.0' // default: 127.0.0.1
  },
  head: {
    title: '首页',
    htmlAttrs: {
      lang: 'zh-g'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'renderer', content: 'webkit' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { 'http-equiv': 'content-type', content: 'text/html;charset=utf-8' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '' }
    ]
  },
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/assets/css/main.scss'
  ],
  router: {
    middleware: ['checkuser'],
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'custom',
        path: '*',
        component: resolve(__dirname, 'pages/index.vue')
      })
    }
  },
  plugins: [
    '~/plugins/message.js',
    '~/plugins/dragging.js'
  ],
  modules: [
    '@nuxtjs/proxy'
  ],
  axios: {
    proxy: true
  },
  proxy: {
    '/gateway': {
      target: config.baseUrl,
      ws: false,
      pathRewrite: {
        '^/gateway': '' // 重写接口
      }
    }
  },
  env: {
    NODE_ENV: process.env.NODE_ENV || 'production'
  },
  build: {
    postcss: null,
    parallel: true,
    transpile: [/^element-ui/],
    extractCSS: process.env.NODE_ENV === 'production' ? { ignoreOrder: true } : false,
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    // 过滤日志
    plugins: process.env.ONLINE === 'true' ? [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false,
            pure_funcs: ['console.log']
          }
        }
      })
    ] : []
  }
}
