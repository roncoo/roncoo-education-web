
export default function ({route, req, res, store, next}) {
  if (process.server) {
    store.commit('GET_TOKEN_SERVER', req);
  }
  if (process.client) {
    store.commit('INIT_WEB');
    // 如果token不一致,以cookie为准
    // if (store.state.tokenInfo != store.state.userInfo.token) {
    //   store.dispatch('GET_USERINFO');
    // }
  }
  
}