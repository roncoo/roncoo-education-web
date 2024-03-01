import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getToken, getTokenForServer, removeToken } from '@/utils/cookie.js'
import config from '@/config/index'

const pending = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const CancelToken = axios.CancelToken

// create an axios instance
const request = axios.create({
  baseURL: process.client ? '/gateway' : config.baseUrl,
  timeout: 60000 // request timeout
})

// request interceptor
request.interceptors.request.use(
  (config) => {
    removePending(config, true) // 在一个ajax发送前执行一下取消操作

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

    if (token) {
      config.headers['token'] = token
    }
    config.cancelToken = new CancelToken((c) => {
      // 这里的ajax标识用：请求地址&请求方式拼接的字符串
      pending.push({ u: config.url + '&' + config.method, f: c })
    })
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
    // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
    removePending(
      {
        url: response.config.url,
        method: response.config.method
      },
      false
    )
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
          location.reload() // 重新实例化vue-router对象
        })
        return Promise.reject(response)
      }
      if (res.code === 306) {
        return Promise.reject(response)
      }
      if (res.code === 999) {
        ElMessage.error(response.data.msg)
        return Promise.reject(response)
      }

      // 其他异常
      ElMessage({ message: res.msg, type: 'error', duration: 5 * 1000 })
      return Promise.reject(response)
    }
    return Promise.resolve(res.data)
  },
  (error) => {
    if (error.response && error.response.status === 500) {
      ElMessage({ message: error.response.data.msg, type: 'error', duration: 5 * 1000 })
    }
    if (error.response && error.response.data && error.response.data.code === 301) {
      // 301=token过期
      removeToken()

      return Promise.reject(error.response)
    }
    if (error.response && error.response.data && error.response.data.message) {
      ElMessage({ message: error.response.data.message, type: 'error', duration: 5 * 1000 })
    }
    return Promise.reject(error)
  }
)

const removePending = (config, isCancel) => {
  for (const p in pending) {
    // 枚举不处理
    if (config.url.indexOf('enum') === -1) {
      if (pending[p].u === config.url + '&' + config.method) {
        // 当前请求在数组中存在时执行函数体
        if (isCancel) {
          pending[p].f() // 执行取消操作
        }
        pending.splice(Number(p), 1) // 把这条记录从数组中移除
      }
    }
  }
}
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
