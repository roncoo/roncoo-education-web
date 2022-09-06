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
    console.log(response)
    if (response.code === 200) {
      // console.log(response.data)
      return Promise.resolve(response.data)
    } else {
      console.warn(JSON.stringify(response.data))

      console.error(response.data)
      return Promise.resolve(response.data)
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
