import http from './method.js'

// 课程列表
export const courseList = (params = {}) => {
  return http().post('/course/api/course/search', params)
}
// 课程详情
export const courseDetail = (params = {}) => {
  return http().post('/course/api/course/view', params)
}

// 课程详情(登录后)
export const userCourseDetail = (params = {}, token) => {
  return http(token).post('/course/auth/course/view', params)
}
// 获取播放sign
export const chapterSign = (params = {}, token) => {
  return http(token).post('/course/auth/course/sign', params)
}

// 课程搜索列表(未登录)
export function getSearchCourseList(params = {}, page = 1, size = 10) {
  return http().post('/course/api/course/search/list', { pageCurrent: page, pageSize: size, ...params })
}
