import { defineStore } from 'pinia'
import { removeToken } from '@/utils/cookie'
import { userApi } from '~/api/user.js'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    info: null
  }),
  getters: {
    getInfo() {
      return this.info
    }
  },
  actions: {
    // 登录操作
    login() {
      if (!this.info) {
        console.log('login', this.info)
        // 获取用户信息
        userApi.getUserInfo().then((res) => {
          this.info = res
        })
      }
    },

    // 退出登录
    logout() {
      removeToken()
      this.info = null
    }
  }
})
