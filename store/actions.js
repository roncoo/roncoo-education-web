// import {
//   fetchUser,
//   fetchItems,
//   fetchIdsByType
// } from '../api'
import { getUserInfo } from '../api/user'
import { navList, websiteInfo } from '~/api/main'
import LRU from 'lru-cache'

const CACHED = new LRU()
const ttl = 10 * 60 * 1000 // 缓存时间

export default {
  async nuxtServerInit({ dispatch }) {
    // await dispatch('GET_ABOUT')
    await dispatch('GET_NAV')
    await dispatch('GET_WEBSITE')
  },
  // GET_ABOUT(store) { // 获取关联信息
  //   const now = new Date()
  //   if (CACHED.has('aboutList')) {
  //     const data = CACHED.get('aboutList')
  //     const result = JSON.parse(data)
  //     if (now.getTime() - result.time < ttl - 10000) {
  //       // 确保不超出缓存时间
  //       store.state.aboutList = result
  //       return Promise.resolve(data)
  //     }
  //   }
  //   return new Promise((resolve, reject) => {
  //     aboutList().then(res => {
  //       if (res.code === 200) {
  //         const now = new Date()
  //         const data = { time: now.getTime(), list: res.data.websiteNavList }
  //         store.state.aboutList = data
  //         CACHED.set('aboutList', JSON.stringify(data), ttl)
  //       }
  //       resolve(res.data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },
  GET_NAV(store) { // 获取导航信息
    const now = new Date()
    if (CACHED.has('navList')) {
      const data = CACHED.get('navList')
      const result = JSON.parse(data)
      // console.log(' 缓存命中2')
      // console.log(data)
      if (now.getTime() - result.time < ttl - 10000) {
        // 确保不超出缓存时间
        store.state.navList = result
        return Promise.resolve(data)
      }
    }
    return new Promise((resolve, reject) => {
      navList().then(res => {
        if (res.code === 200) {
          res.data.time = now.getTime()
          store.state.navList = res.data
          CACHED.set('navList', JSON.stringify(res.data), ttl)
        }
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  GET_WEBSITE(store) { // 获取网站信息
    const now = new Date()
    if (CACHED.has('websiteInfo')) {
      const data = CACHED.get('websiteInfo')
      const result = JSON.parse(data)
      if (now.getTime() - result.time < ttl - 10000) {
        store.state.websiteInfo = result
        return Promise.resolve(data)
      }
    }
    return new Promise((resolve, reject) => {
      websiteInfo().then(res => {
        if (res.code === 200) {
          res.data.time = now.getTime()
          store.state.websiteInfo = res.data
          CACHED.set('websiteInfo', JSON.stringify(res.data), ttl)
        }
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  GET_USERINFO(store, cb) {
    // console.log('获取用户信息')
    getUserInfo({ orgNo: store.state.clientData.no })
      .then(res => {
        if (res.code === 200) {
          store.commit('SET_USER', res.data)
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
