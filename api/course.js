import http from './method.js'

// 课程列表
export const courseList = (params={}) => {
  return http().post('/course/api/course/list', params)
}
// 课程分类
export const courseClass = (params={}) => {
  return http().post('/course/api/course/category/list', params)
}
// 课程详情(未登录)
export const courseDetail = (params={}) => {
  return http().post('/course/api/course/view', params)
}
// 课程详情(登录后)
export const userCourseDetail = (params={}, token) => {
  return http(token).post('/course/auth/course/view', params)
}
// 获取播放sign
export const chapterSign = (params={}, token) => {
  return http(token).post('/course/auth/course/sign', params)
}