import http from './method.js'

// 上传图片
export const uploadPic = (params = {}, cb) => {
  return createUpload('/system/auth/upload/pic', params, cb)
}

const createUpload = (url, params = {}, cb) => {
  const config = {
    onUploadProgress: progressEvent => {
      var complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
      if (cb) {
        cb(complete)
      }
    },
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 1000 * 60 * 30
  }
  return new Promise((resolve, reject) => {
    http().post(url, params, config).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}
