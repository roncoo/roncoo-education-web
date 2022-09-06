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
  const http = axios.create(options)
  let serverUrl = ''
  http.interceptors.request.use(function(config) {
    serverUrl = config.url
    if (process.server) {
      console.info('request to: ' + serverUrl)
    }
    return config
  }, function(error) {
    // 对请求错误做些什么
    console.warn(error)
    if (process.client) {
      return Promise.reject(error)
    }
  })

  http.interceptors.response.use(function(response) {
    // 对响应数据做点什么
    if (response.data.code === 200) {
      return Promise.resolve(response.data)
    } else {
      console.info('request to: ' + serverUrl)
      console.warn(JSON.stringify(response.data))
      try {
        const d = JSON.parse(response.config.data || response.config.params || {})
        if (d._No_dispose) {
          return Promise.resolve(response.data)
        }
      } catch (error) { console.log(error) }
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
            }
            return Promise.reject(response.data)
          } else {
            return Promise.resolve(response.data)
          }
        } catch (error) {
          console.log(response.data)
          return Promise.resolve(response.data)
        }
      } else {
        return Promise.resolve(response.data)
      }
    }
  }, function(error) {
    // 对响应错误做点什么
    if (process.client) {
      return Promise.reject(error)
    } else {
      console.info('request to: ' + serverUrl)
      console.info(JSON.stringify(error))
      return Promise.resolve(error.response.data)
    }
  })

  return http
}

export default createHttp
