import http from './method.js'

// 课程列表
export const courseList = (params={}) => {
  return http().post('/course/api/course/list', params)
}
// 课程分类
export const courseClass = (params={}) => {
  return http().post('/course/api/course/category/list', params)
}