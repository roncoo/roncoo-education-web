import { getToken } from '~/utils/cookie'
import { setStorage } from '~/utils/storage'
export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/index') return navigateTo('/')
  if (to.matched.length === 0) return navigateTo('/404')
  if ((to.path.startsWith('/account/') || to.path === '/course/study') && !getToken()) {
    if (import.meta.client) setStorage('history', window.location.origin + to.fullPath, 5)
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})
