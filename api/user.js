import { getRequest, postRequest, putRequest } from '@/utils/request'

export const userApi = {
  // 我的课程
  userCoursePage: (params = {}) => {
    return postRequest('/course/auth/user/course/page', params)
  },

  // 我的订单
  orderPage: (params = {}) => {
    return postRequest('/user/auth/order/info/page', params)
  },

  // 继续支付
  continuePay: (params = {}) => {
    return postRequest('/user/auth/order/pay/continue', params)
  },

  // 取消支付
  cancelOrder: (params = {}) => {
    return putRequest('/user/auth/order/pay/cancel', params)
  },

  // 用户信息修改
  usersUpdata: (params = {}) => {
    return postRequest('/user/auth/users/edit', params)
  },

  // 用户信息
  getUserInfo: () => {
    return getRequest('/user/auth/users/view')
  },

  // 用户绑定微信
  userBinding: (params = {}) => {
    return postRequest('/user/auth/users/binding', params)
  },

  // 用户解绑微信
  userUnbind: (params = {}) => {
    return postRequest('/user/auth/users/unbind', params)
  },

  // 课程收藏列出
  userCourseCollectPage: (params = {}) => {
    return postRequest('/course/auth/user/course/collect/page', params)
  }
}
