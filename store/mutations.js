import Vue from 'vue'
import cookie from '../utils/cookies'
import { setStore, getStore, removeStore, setSession, getSession } from '../utils/storage'
// import axios from '~/api/main.js'

export default {
  INIT_WEB: (state) => {
    let token = cookie.getInClient(state.clientData.tokenName);
    if (token) {
      let userInfo = JSON.parse(getStore('OcUserInfo'));
      state.tokenInfo = token;
      state.userInfo = userInfo;
    }else {
      state.userInfo = '';
      removeStore('OcUserInfo')
    }
  },
  SET_ITEMS: (state,  {key, value}) => {
    state[key] = value;
    // setStore(key, value);
  },
  SET_ADV: (state,  item) => {
    state.advData = item
  },
  // 记录token
  SET_TOKEN: (state,  token) => {
    state.tokenInfo = token
    //此处必须加path，否则在某些浏览器无法通过js移除
    document.cookie = "OSTK=" + token + "; path=/";
    cookie.setInClient({key: state.clientData.tokenName, val: token})
    // setStore('tokenInfo', info.info)
  },
  // 服务端获取token
  GET_TOKEN_SERVER: (state,  req) => {
    let cook = cookie.getInServer(req);
    state.tokenInfo = cook[state.clientData.tokenName];
  },
  // 退出登录
  SIGN_OUT: (state) => {
    state.tokenInfo = ''
    state.userInfo = ''
    //移除document.cookie
    document.cookie = "OSTK=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    cookie.delInClient(state.clientData.tokenName)
    removeStore('OcUserInfo')
    // setStore('tokenInfo', info.info)
  },
  // 记录用户信息
  SET_USER: (state, data) => {
    data.token = state.tokenInfo
    state.userInfo = data;
    setStore('OcUserInfo', data)
    // Vue.set(state.users, id, user || false) /* false means user not found */
  },
  // 记录当前url
  SET_TEMPORARYURL: (state, data) => {
    let uri = window.location.href;
    setSession('temporaryUrl', uri);
  },
  // 获取临时url
  GET_TEMPORARYURL (state) {
    let uri = getSession('temporaryUrl');
    if (uri) {
      state.temporaryUrl = uri;
    }
  },
  // 隐藏二维码
  HIDE_EWM (state) {
    state.changeEwm = Math.random()
  }
}
