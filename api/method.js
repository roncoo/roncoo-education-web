import * as axios from 'axios'
import { Message } from 'element-ui'
import cookie from '../utils/cookies'
import config from '../config'

const createHttp = (token) => {
  const options = {}
  const head = {}
  if (process.server) {
    if (token) {
      head.token = token
    }
    options.baseURL = config.baseUrl
  } else {
    options.baseURL = '/gateway/'
  }
  if (process.client) {
    head.token = cookie.getInClient(config.tokenName)
  }
  options.headers = head
  const http = axios.create(options)
  http.interceptors.request.use(function(config) {
    return config
  }, function(error) {
    console.error(error)
    if (process.client) {
      return Promise.reject(error)
    }
  })

  http.interceptors.response.use(function(response) {
    const res = response.data
    if (res.code === 200) {
      return Promise.resolve(res.data)
    }
    if (response.data.code >= 300 && response.data.code <= 400) {
      if (process.client) { // 客户端请求接口token 过期让他重新登录
        if (window.location.href.indexOf('/login') === -1 && window.location.href.indexOf('/agreement') === -1) {
          window.location.href = '/login?t=login'
          return
        }
      }
    }
    if (process.client) {
      try {
        const d = JSON.parse(response.config.data || response.config.params || {})
        if (d.isShowErrTip !== false) {
          // 过滤同时多个接口报token错误 会出现多个提示bug
          const title = localStorage.getItem('___errmsg')
          const time = localStorage.getItem('___errmsgTime')
          const newtime = (new Date()).getTime()
          if (title !== response.data.msg || (newtime - time) > 2000) {
            localStorage.setItem('___errmsg', response.data.msg)
            localStorage.setItem('___errmsgTime', newtime)
            Message.error(response.data.msg)
          }
          return Promise.reject(response.data)
        } else {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        console.error(response.data)
        return Promise.resolve(response.data)
      }
    } else {
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
