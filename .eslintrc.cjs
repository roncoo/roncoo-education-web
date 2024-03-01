module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    'vue/setup-compiler-macros': true
  },
  globals: {
    ref: true,
    useHead: true,
    computed: true,
    reactive: true,
    useRoute: true,
    useRouter: true,
    onBeforeMount:true,
    onMounted: true,
    onUnmounted: true,
    useNuxtApp: true,
    useAsyncData: true,
    useAppConfig: true,
    defineNuxtPlugin: true,
    defineNuxtConfig: true,
    process: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['vue'],
  extends: [ 'plugin:vue/base', 'plugin:vue/vue3-essential', 'eslint:recommended'],
  rules: {
    'vue/multi-word-component-names':'off'
  }
}
