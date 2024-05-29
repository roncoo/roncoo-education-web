import { setToken, removeToken } from '@/utils/cookie'
import { setStorage, getStorage } from '@/utils/storage'

export const login = (token) => {
  setToken(token)
  const history = getStorage('history')
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
