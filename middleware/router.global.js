export default defineNuxtRouteMiddleware((to) => {
  // 首页重定向
  if (to.path === '/index') {
    return navigateTo('/')
  }

  // 404页面
  if (to.matched.length === 0) {
    return navigateTo('/404')
  }
})
