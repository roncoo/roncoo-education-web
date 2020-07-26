import VueCookie from 'vue-cookie'
import store from '../store/'
export default {
  //获取服务端cookie
  getInServer:function (req) {
    let service_cookie = {};
    req && req.headers.cookie && req.headers.cookie.split(';').forEach(function (val) {
      let parts = val.split('=');
      service_cookie[parts[0].trim()] = (parts[1] || '').trim();
    });
    return service_cookie;
  },
  //获取客户端cookie
  getInClient:function (key) {
    // let clent = store().state.clientData;
    // console.log(clent)
    let tokenInfo = VueCookie.get(key);
    return tokenInfo;
  },
  //获取客户端cookie
  setInClient:function ({key, val}) {
    let clent = store().state.clientData;
    VueCookie.set(key, val, {expires: 1, domain: clent.domain});
    // Cookie.set(key, val, {expires: 1, domain: clent.domain})
  },
  //删除客户端cookie
  delInClient:function (key) {
    // fix logout bug
    let clent = store().state.clientData;
    // console.log(clent)
    VueCookie.delete(key, {domain: clent.domain});
    // Cookie.remove(key)
  }
}