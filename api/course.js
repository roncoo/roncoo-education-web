import http from './method.js'

// 课程列表
export const courseList = (params={}) => {
  return http().post('/course/api/course/list', params)
}
// 课程分类
export const courseClass = (params={}) => {
  return http().post('/course/api/course/category/list', params)
}
// 课程详情
export const courseDetail = (params={}) => {
  return http().post('/course/api/course/view', params)
}
// 上传图片
export const uploadPic = (params={}) => {
  return http(null, 'isUpload').post('/course/api/upload/pic', params)
}
// 上传文档
export const uploadDoc = (params={}) => {
  return http(null, 'isUpload').post('/course/api/upload/doc/' + params.periodId, params)
}
// 上传视频
export const uploadResVideo = (params={}) => {
  return http(null, 'isUpload').post('/course/api/upload/video', params)
}