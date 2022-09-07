import http from './method.js'

// 订单分页
export const orderPage = (params = {}) => {
  return http().post('/user/auth/order/info/page', params)
}
