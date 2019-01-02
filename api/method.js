import * as axios from 'axios'
import cookie from '../utils/cookies'
import LRU from 'lru-cache'
import config from '../config'
// console.log(axios.defaults)
const createHttp = (token) => {

// console.log("api==============")

  let options = {
  }
  let head = {
    orgno: config.CLIENT.no
  }
  // 需要全路径才能工作
  if (process.server) {
    if (token) {
      head.token = token
    }
    options.baseURL = process.env._AXIOS_BASE_URL_
  }
  if (process.client) {
    // console.log(cookie.getInClient(config.CLIENT.tokenName));
    head.token = cookie.getInClient(config.CLIENT.tokenName)
  }
  
  options.headers = head;

  return axios.create(options)
}

export default createHttp