import http from '../method.js'
// 课程审核列表
export const lecturerCourseList = (params={}) => {
  return http().post('/auth/course/api/course/audit/list', params)
}
// 课程上下架
export const coursePutaway = (params={}) => {
  return http().post('/auth/course/api/course/audit/stand', params)
}
// 删除课程
export const deleteCourse = (params={}) => {
  return http().post('/auth/course/api/course/audit/delete', params)
}