import { getUserInfo } from '../api/user'
import { navList, websiteInfo } from '~/api/main'

export default {
  async nuxtServerInit({ dispatch }) {
    await dispatch('GET_NAV')
    await dispatch('GET_WEBSITE')
  },
  GET_NAV(store) { // 获取导航信息
    return new Promise((resolve, reject) => {
      navList().then(res => {
        if (res) {
          store.state.navList = res
        }
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  GET_WEBSITE(store) { // 获取网站信息`
    return new Promise((resolve, reject) => {
      websiteInfo().then(res => {
        if (res) {
          store.state.websiteInfo = res
        }
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  GET_USERINFO(store, cb) {
    getUserInfo({ orgNo: store.state.clientData.no })
      .then(res => {
        if (res) {
          store.commit('SET_USER', res)
          if (cb) {
            cb(store)
          }
        } else if (res.code > 300 && res.code < 400) {
          store.commit('SIGN_OUT')
        }
      })
  },
  REDIRECT_LOGIN(store, codeNo) {
    store.commit('SET_TEMPORARYURL')
    store.commit('SIGN_OUT')
    this.$router.push({ name: 'login' })
  }
}
