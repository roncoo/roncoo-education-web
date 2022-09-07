export default function({ route, req, res, store, next }) {
  if (process.client) {
    store.commit('INIT_WEB')
  }
  if (process.server) {
    store.commit('GET_TOKEN_SERVER', req)
  }
}
