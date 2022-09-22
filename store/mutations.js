import cookie from '../utils/cookies'
import { getSession, getStore, removeStore, setSession, setStore } from '../utils/storage'
// import axios from '~/api/main.js'

export default {
  // 初始化站点
  INIT_WEB: (state) => {
    const token = cookie.getInClient(state.tokenName)
    if (token) {
      const userInfo = JSON.parse(getStore('OcUserInfo'))
      state.tokenInfo = token
      state.userInfo = userInfo
    } else {
      state.userInfo = ''
      removeStore('OcUserInfo')
      removeStore('tokenInfo')
    }
  },
  // 记录token
  SET_TOKEN: (state, token) => {
    // 此处必须加path，否则在某些浏览器无法通过js移除
    cookie.setInClient({ key: state.tokenName, val: token })
    state.tokenInfo = token
    setStore('tokenInfo', token)
  },
  // 记录用户信息
  SET_USER: (state, data) => {
    state.tokenInfo = getStore('tokenInfo')
    state.userInfo = data
    setStore('OcUserInfo', data)
  },
  // 记录当前url
  SET_TEMPORARYURL: (state, data) => {
    const uri = window.location.href
    setSession('temporaryUrl', uri)
  },
  // 获取临时url
  GET_TEMPORARYURL(state) {
    const uri = getSession('temporaryUrl')
    if (uri) {
      state.temporaryUrl = uri
    }
  },
  // 服务端获取token
  GET_TOKEN_SERVER: (state, req) => {
    const cook = cookie.getInServer(req)
    state.tokenInfo = cook[state.tokenName]
  },
  // 退出登录
  SIGN_OUT: (state) => {
    state.tokenInfo = ''
    state.userInfo = ''
    // 移除document.cookie
    document.cookie = state.tokenName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
    cookie.delInClient(state.tokenName)
    removeStore('OcUserInfo')
    removeStore('tokenInfo')
  },
  SET_ITEMS: (state, { key, value }) => {
    state[key] = value
  }
}
