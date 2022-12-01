const result = {
  baseUrl: '', // 接口地址
  tokenName: 'OSTK' // cookie名称
}
if (process.env.NODE_ENV === 'development') {
  // 开发环境
  result.baseUrl = 'http://localhost:8180'
  //result.baseUrl = 'https://dev-os.roncoos.com/gateway'
} else if (process.env.NODE_ENV === 'testing') {
  // 测试环境
  result.baseUrl = 'http://localhost:8180'
} else {
  // 生产环境
  result.baseUrl = 'http://localhost:8180'
}

export default result
