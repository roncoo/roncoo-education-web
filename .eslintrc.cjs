module.exports = {
  root: true,
  extends: ['@nuxt/eslint-config'],
  globals: {
    'useNuxtApp': true,
    'navigateTo': true,
    'defineNuxtRouteMiddleware': true
  },
  rules: {
    "vue/no-multiple-template-root":'off',
    "space-before-function-paren": 0
  }
}
