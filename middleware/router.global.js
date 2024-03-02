export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/index') {
    return navigateTo('/')
  }
})
