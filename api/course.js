import http from './method.js'

// 课程列表(搜索)
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
export const playSign = (params = {}, token) => {
  return http(token).post('/course/auth/course/sign', params)
}

// 创建订单
export const createOrder = (params = {}) => {
  return http().post('/user/auth/order/pay/create', params)
}

// 订单信息
export const orderInfoView = (orderNo) => {
  return http().get('/user/auth/order/info/view?orderNo=' + orderNo)
}
