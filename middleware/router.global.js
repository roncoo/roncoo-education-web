export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/index') {
    return navigateTo('/')
  }

  // 404页面
  if (to.matched.length === 0) {
    return navigateTo('/404')
  }

  // 判断若是手机端，则跳转手机端路由
  if (process.client) {
    const isMobile = /(Android|webOS|iPhone|iPod|tablet|BlackBerry|Mobile)/i.test(navigator.userAgent)
    if (isMobile) {
      return navigateTo('/h5' + to.fullPath.slice(0, to.fullPath.length - 1))
    }
  }
})
