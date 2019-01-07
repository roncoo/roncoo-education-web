import Cookie from 'js-cookie'
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
    return Cookie.get(key) ? Cookie.get(key) : ''
  },
  //获取客户端cookie
  setInClient:function ({key, val}) {
    let clent = store().state.clientData;
    // console.log(clent)
    Cookie.set(key, val, {expires: 1, domain: clent.domain})
  },
  //删除客户端cookie
  delInClient:function (key) {
    // console.log(clent)
    Cookie.remove(key)
  }
}