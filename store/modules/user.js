import { defineStore } from 'pinia'
import { setToken, removeToken } from '@/utils/cookie'
import { setStorage, getStorage } from '@/utils/storage'
import { userApi } from '~/api/user.js'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    info: null
  }),
  actions: {
    // 刷新
    async refresh() {
      if (!this.info) {
        // 获取用户信息
        const res = await userApi.getUserInfo()
        this.info = res
      }
    },

    // 登录操作
    login(token) {
      setToken(token)
      const history = getStorage('history')
      if (history) {
        window.location.href = history
        setStorage('history', '')
      } else {
        window.location.href = '/'
      }
    },

    // 退出登录
    logout() {
      removeToken()
      this.info = null
    }
  }
})
