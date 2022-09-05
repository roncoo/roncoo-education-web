import * as axios from 'axios'
import cookie from '../utils/cookies'
import config from '../config'
// console.log(axios.defaults)
const createHttp = (token) => {
  const options = {
  }
  const head = {
    orgno: config.CLIENT.no
  }
  // 需要全路径才能工作
  if (process.server) {
    if (token) {
      head.token = token
    }
    options.baseURL = config.baseUrl
  } else {
    options.baseURL = '/gateway/'
  }

  if (process.client) {
    // console.log(cookie.getInClient(config.CLIENT.tokenName));
    head.token = cookie.getInClient(config.CLIENT.tokenName)
  }

  options.headers = head

  return axios.create(options)
}

export default createHttp
