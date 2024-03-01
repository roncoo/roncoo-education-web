import Cookies from 'js-cookie'
import { TOKEN_KEY } from '@/utils/constants/system'

/**
 * 单位：天
 */
const TokenExpiresTime = 1

export function setToken(token) {
  return Cookies.set(TOKEN_KEY, token, {
    expires: TokenExpiresTime
  })
}

export function setTokenForServer(token, req) {
  const serviceCookie = {}
  req &&
    req.headers.cookie &&
    req.headers.cookie.split(';').forEach(function (val) {
      const parts = val.split('=')
      serviceCookie[parts[0].trim()] = decodeURIComponent((parts[1] || '').trim())
    })
  if (serviceCookie.constructor == Object) {
    let cssStr = ''
    for (const key in serviceCookie) {
      cssStr += key + '=' + serviceCookie[key] + ';'
    }
    req.headers.cookie = cssStr.slice(0, cssStr.length - 1)
    return cssStr.slice(0, cssStr.length - 1)
  }
}

export function getToken() {
  return Cookies.get(TOKEN_KEY)
}

export function getTokenForServer(req) {
  const serviceCookie = {}
  req &&
    req.headers.cookie &&
    req.headers.cookie.split(';').forEach(function (val) {
      const parts = val.split('=')
      serviceCookie[parts[0].trim()] = decodeURIComponent((parts[1] || '').trim())
    })
  return serviceCookie.get(TOKEN_KEY)
}

export function removeToken() {
  return Cookies.remove(TOKEN_KEY, {
    expires: 0
  })
}
