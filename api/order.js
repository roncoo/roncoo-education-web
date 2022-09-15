import http from './method.js'

// 创建订单
export const createOrder = (params = {}) => {
  return http().post('/user/auth/order/pay/create', params)
}

// 继续支付
export const continueOrder = (params = {}) => {
  return http().post('/user/auth/order/pay/continue', params)
}

// 订单信息
export const orderInfoView = (orderNo) => {
  return http().get('/user/auth/order/info/view?orderNo=' + orderNo)
}
