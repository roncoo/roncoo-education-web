export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/index') {
    return navigateTo('/')
  }

  // 404页面
  if (to.matched.length === 0) {
    return navigateTo('/404')
  }
})
