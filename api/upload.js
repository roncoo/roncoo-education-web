import * as axios from 'axios'

const createUpload = (url, params = {}, cb) => {
    let config = {
      onUploadProgress: progressEvent => {
        var complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
        // console.log(complete)
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
      axios.post(url, params, config).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  }
// 上传图片
export const uploadPic = (params={},cb) => {
  return createUpload('/course/api/upload/pic', params, cb)
}
// 上传文档
export const uploadDoc = (params={}, cb) => {
  return createUpload('/course/api/upload/doc', params, cb)
}
// 上传视频
export const uploadResVideo = (params={},cb) => {
  return createUpload('/course/api/upload/video', params, cb)
}