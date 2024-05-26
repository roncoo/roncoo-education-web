module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  extends: [
    '@nuxt/eslint-config',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
    'prettier' // eslint-config-prettier 的缩写
  ],
  plugins: [
    'vue', // eslint-plugin-vue
    'prettier' // eslint-plugin-prettier的缩写
  ],
  globals: {
    useNuxtApp: true,
    navigateTo: true,
    defineNuxtPlugin: true,
    defineNuxtRouteMiddleware: true
  },
  rules: {
    'space-before-function-paren': 0,
    'vue/no-multiple-template-root': 'off',
    'vue/multi-word-component-names': 'off'
  }
}
