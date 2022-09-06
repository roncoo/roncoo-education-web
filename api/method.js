import * as axios from 'axios'
import cookie from '../utils/cookies'
import config from '../config'

const createHttp = (token) => {
  const options = {}
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
    head.token = cookie.getInClient(config.CLIENT.tokenName)
  }

  options.headers = head
  const http = axios.create(options)
  http.interceptors.request.use(function(config) {
    return config
  }, function(error) {
    console.warn(error)
    if (process.client) {
      return Promise.reject(error)
    }
  })

  http.interceptors.response.use(function(response) {
    const res = response.data
    if (res.code === 200) {
      return Promise.resolve(res.data)
    } else {
      return Promise.resolve(res.data)
    }
  }, function(error) {
    if (process.client) {
      return Promise.reject(error)
    } else {
      console.error(JSON.stringify(error))
      return Promise.resolve(error.response.data)
    }
  })

  return http
}

export default createHttp
