import { defineStore } from 'pinia'
import { setToken, removeToken } from '@/utils/cookie'
import { userApi } from '~/api/user.js'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    info: null,
    historyUrl: ''
  }),
  getters: {
    getInfo() {
      return this.info
    },
    getHistoryUrl() {
      return this.historyUrl
    }
  },
  actions: {
    // 登录操作
    login(token) {
      // 获取用户信息
      userApi.getUserInfo().then((res) => {
        this.info = res
      })
      setToken(token)
    },

    // logout
    logout() {
      removeToken()
      this.info = null
    },

    // 保存历史访问路径
    saveHistoryUrl(url) {
      this.historyUrl = url
    }
  }
})
