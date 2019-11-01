// import {
//   fetchUser,
//   fetchItems,
//   fetchIdsByType
// } from '../api'
import axios from 'axios'
import {getUserInfo} from '../api/user'
import {serviceInfo, aboutList, getNav} from '~/api/main'
import LRU from 'lru-cache'
import config from '../config'
const CACHED = new LRU();
const ttl = 10 * 60 * 1000 //缓存时间

export default {
  async nuxtServerInit({ dispatch }, context) {
    await dispatch('GET_ABOUT')
    await dispatch('GET_NAV')
    const web = await dispatch('GET_WEBINFO')
  },
  GET_ABOUT (store) {// 获取关联信息
    let now = new Date();
    if (CACHED.has('aboutList')) {
      const data = CACHED.get('aboutList');
      const result = JSON.parse(data);
      // console.log(' 缓存命中1')
      // console.log(data)
      if (now.getTime() - result.time < ttl - 10000) {
        // 确保不超出缓存时间
        store.state.aboutList = result;
        return Promise.resolve(data)
      }
    }
    return new Promise((resolve, reject) => {
      aboutList().then(res => {
        if (res.data.code == 200) {
          let now = new Date();
          let data = {time: now.getTime(), list: res.data.data.websiteNavList};
          store.state.aboutList = data;
          CACHED.set('aboutList', JSON.stringify(data), ttl)
        }
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  GET_NAV (store) {// 获取导航信息
    let now = new Date();
    if (CACHED.has('navList')) {
      const data = CACHED.get('navList');
      const result = JSON.parse(data);
      // console.log(' 缓存命中2')
      // console.log(data)
      if (now.getTime() - result.time < ttl - 10000) {
        // 确保不超出缓存时间
        store.state.navList = result;
        return Promise.resolve(data)
      }
    }
    return new Promise((resolve, reject) => {
      getNav().then(res => {
        if (res.data.code == 200) {
          res.data.data.time = now.getTime();
          store.state.navList = res.data.data;
          CACHED.set('navList', JSON.stringify(res.data.data), ttl);
        }
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  GET_WEBINFO (store) {// 获取网站信息
    let now = new Date();
    if (CACHED.has('webInfo')) {
      const data = CACHED.get('webInfo');
      const result = JSON.parse(data);
      // console.log(' 缓存命中3')
      // console.log(result)
      if (now.getTime() - result.time < ttl - 10000) {
        // 确保不超出缓存时间
        store.state.webInfo = result;
        return Promise.resolve(data)
      }
    }
    return new Promise((resolve, reject) => {
      serviceInfo({moduleId: 3}).then(res => {
        if (res.data.code == 200) {
          res.data.data.time = now.getTime();
          store.state.webInfo = res.data.data;
          CACHED.set('webInfo', JSON.stringify(res.data.data), ttl)
        }
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  GET_USERINFO (store,cb) {
    // console.log('获取用户信息')
    getUserInfo({orgNo: store.state.clientData.no})
    .then(res => {
      // console.log(res)
      if (res.data.code == 200) {
        store.commit('SET_USER', res.data.data)
        if (cb) {
          cb(store);
        }
      } else if (res.data.code > 300 && res.data.code < 400) {
        store.commit('SIGN_OUT')
      }
    })
  },
  REDIRECT_LOGIN (store, codeNo) {
    store.commit('SET_TEMPORARYURL');
    store.commit('SIGN_OUT');
    this.$router.push({name: 'login'})
  }
}
