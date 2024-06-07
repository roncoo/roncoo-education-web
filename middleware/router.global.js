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
      const isRouterMobile = /h5/i.test(to.fullPath)
      if (!isRouterMobile) {
        let path = '/h5' + to.fullPath.slice(0, to.fullPath.length - 1)
        return navigateTo(path)
      }
    }
  }
})
