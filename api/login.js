import http from './method'

// 用户登录
export const userLogin = (params = {}) => {
  return http().post('/user/api/users/login', params)
}
// 发送注册验证码
export const getMobileCode = (params) => {
  return http().post('/user/api/users/send/code', params)
}
// 用户注册
export const register = (params = {}) => {
  return http().post('/user/api/users/register', params)
}
// 用户信息
export const getUserInfo = () => {
  return http().get('/user/auth/users/view')
}

// 课程详情
export const userCourseDetail = (params = {}) => {
  return http().post('/course/auth/course/audit/view', params)
}
// 申请讲师
export const teacherEnter = (params = {}) => {
  return http().post('/user/auth/lecturer/audit/save', params)
}
