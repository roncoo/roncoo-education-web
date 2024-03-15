import Cookies from 'js-cookie'

/**
 * token的key
 */
const TOKEN_KEY = 'EDU_OS_TOKEN'
/**
 * 单位：天
 */
const TokenExpiresTime = 1

export function setToken(token) {
  return Cookies.set(TOKEN_KEY, token, {
    expires: TokenExpiresTime
  })
}

export function getToken() {
  if (process.server) {
    const nuxtApp = useNuxtApp()
    return getTokenForServer(nuxtApp.ssrContext.event.node.req)
  }
  return Cookies.get(TOKEN_KEY)
}

export function removeToken() {
  return Cookies.remove(TOKEN_KEY, {
    expires: 0
  })
}

function getTokenForServer(req) {
  const serviceCookie = {}
  req &&
    req.headers.cookie &&
    req.headers.cookie.split(';').forEach(function (val) {
      const parts = val.split('=')
      serviceCookie[parts[0].trim()] = decodeURIComponent((parts[1] || '').trim())
    })
  return serviceCookie.EDU_OS_TOKEN
}
