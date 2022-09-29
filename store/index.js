import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import config from '../config'

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      tokenName: config.tokenName,
      tokenInfo: '', // token信息
      temporaryUrl: '', // 临时url
      websiteInfo: null // 站点信息
    }),
    mutations: mutations,
    actions: actions
  })
}

export default createStore
