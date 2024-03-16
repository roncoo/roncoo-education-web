module.exports = {
  root: true,
  extends: ['@nuxt/eslint-config'],
  globals: {
    'useNuxtApp': true,
    'navigateTo': true,
    'defineNuxtPlugin': true,
    'defineNuxtRouteMiddleware': true
  },
  rules: {
    "space-before-function-paren": 0,
    "vue/no-multiple-template-root":'off',
    "vue/max-attributes-per-line":[ 'error', { singleline: 12, multiline: {max: 13}}],
  }
}
