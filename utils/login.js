import { setToken, removeToken } from '@/utils/cookie'
import { setStorage, getStorage } from '@/utils/storage'

export const login = (token) => {
  setToken(token)
  const redirect = new URLSearchParams(window.location.search).get('redirect')
  const history = redirect?.startsWith('/') && !redirect.startsWith('//') ? window.location.origin + redirect : getStorage('history')
  if (history) {
    window.location.href = history
    setStorage('history', '')
  } else {
    window.location.href = '/'
  }
}

export const logout = () => {
  removeToken()
}
