import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getToken, getTokenForServer, removeToken } from '@/utils/cookie.js'
import { setStorage } from '@/utils/storage.js'
import config from '@/config/index'

// create an axios instance
const request = axios.create({
  baseURL: process.client ? '/gateway' : config.baseUrl,
  timeout: 60000 // request timeout
})

// request interceptor
request.interceptors.request.use(
  (config) => {
    let token = null
    if (process.client) {
      // 获取浏览器token
      token = getToken()
    }
    if (process.server) {
      // 获取服务端token
      const nuxtApp = useNuxtApp()
      token = getTokenForServer(nuxtApp.ssrContext.event.node.req)
    }
    if (config.url.indexOf('/auth') != -1 && !token) {
      // 登录拦截
      ElMessageBox.confirm('请先登录', '提示', {
        confirmButtonText: '立即登录',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        window.location.href = '/login'
      })
      setStorage('history', window.location.href, 5)
      return Promise.reject(config)
    }
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  (error) => {
    console.error(error)
    return Promise.reject(error)
  }
)

// response interceptor
request.interceptors.response.use(
  (response) => {
    const res = response.data
    // console.log(res)
    if (res.code && res.code !== 200) {
      if (res.code === 99 || res.code === 301) {
        // 301=token过期
        removeToken()
        return Promise.reject(response)
      }
      if (res.code === 304) {
        // 异地登录
        ElMessageBox.confirm('异地登录', '确定登出', {
          confirmButtonText: '重新登录',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          removeToken()
          location.reload()
        })
        return Promise.reject(response)
      }
      // 其他异常
      console.error(res)
      ElMessage({ message: res.msg, type: 'error', duration: 5 * 1000 })
      return Promise.reject(response)
    }
    // 返回数据
    return Promise.resolve(res.data)
  },
  (error) => {
    if (error.response && error.response.status === 500) {
      if (error.config.url.indexOf('/course/api/user/study/progress') != -1) {
        // 进度保存接口，特殊处理：不进行提示
      } else {
        ElMessage({ message: error.response.data.msg, type: 'error', duration: 5 * 1000 })
      }
      return Promise.reject(error)
    }
    if (error.response && error.response.data && error.response.data.code === 301) {
      // 301=token过期
      removeToken()
      return Promise.reject(error.response)
    }
    if (error.response && error.response.data && error.response.data.message) {
      ElMessage({ message: error.response.data.message, type: 'error', duration: 5 * 1000 })
      return Promise.reject(error)
    }
    return Promise.reject(error)
  }
)

/**
 * post请求
 */
export const postRequest = (url, data = {}) => {
  return request({ url: url, data: data ? data : {}, method: 'post' })
}

/**
 * get请求
 */
export const getRequest = (url) => {
  return request({ url: url, method: 'get' })
}

/**
 * put请求
 */
export const putRequest = (url, data = {}) => {
  return request({ url: url, data: data ? data : {}, method: 'put' })
}

/**
 * delete请求
 */
export const deleteRequest = (url) => {
  return request({ url: url, method: 'delete' })
}

export const upload = (url, file, fileName, cb, cancelFun) => {
  const formData = new FormData()
  formData.append(fileName, file)
  const config = {
    onUploadProgress: (progressEvent) => {
      const percent = Number(((progressEvent.loaded / progressEvent.total) * 100).toFixed(2))
      // 计算上传进度
      if (cb) {
        cb(percent)
      }
    }
  }
  if (cancelFun) {
    config.cancelToken = new axios.CancelToken(function excutor(c) {
      cancelFun.cancel = c
    })
  }

  return request.post(url, formData, config)
}
