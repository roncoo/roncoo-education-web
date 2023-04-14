import http from './method.js'

// 我的课程
export const userCoursePage = (params = {}) => {
  return http().post('/course/auth/user/course/page', params)
}

// 我的订单
export const orderPage = (params = {}) => {
  return http().post('/user/auth/order/info/page', params)
}

// 继续支付
export const continuePay = (params = {}) => {
  return http().post('/user/auth/order/pay/continue', params)
}

// 取消支付
export const cancelOrder = (params = {}) => {
  return http().put('/user/auth/order/pay/cancel', params)
}

// 用户信息修改
export const usersUpdata = (params = {}) => {
  return http().post('/user/auth/users/edit', params)
}

// 用户信息
export const getUserInfo = () => {
  return http().get('/user/auth/users/view')
}

// 课程收藏列出
export const userCourseCollectPage = (params = {}) => {
  return http().post('/course/auth/user/course/collect/page', params)
}
