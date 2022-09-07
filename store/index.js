import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import config from '../config'

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      tokenName: config.CLIENT.tokenName,
      mainUrl: config.CLIENT.mainUrl,
      tokenInfo: '', // token信息
      websiteInfo: null, // 站点信息
      temporaryUrl: '' // 临时url
    }),
    mutations: mutations,
    actions: actions
  })
}

export default createStore
