const result = {
  baseUrl: 'http://localhost:8180', // 接口地址，生产环境
  tokenName: 'OSTK' // cookie保存的名称
}
if (process.env.NODE_ENV === 'development') {
  // 开发环境
  result.baseUrl = 'https://eduos.roncoo.net/gateway'
} else if (process.env.NODE_ENV === 'testing') {
  // 测试环境
  result.baseUrl = 'http://localhost:8180'
}

export default result
