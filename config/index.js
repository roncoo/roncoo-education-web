const result = {
  baseUrl: '', // 接口地址
  CLIENT: {
    tokenName: 'OSTK', // cookie保存的名称
    domain: 'localhost' // cookie作用域
  }
}
if (process.env.NODE_ENV === 'development') {
  // 开发环境
  result.baseUrl = 'https://dev-os.roncoos.com/gateway'
  result.CLIENT.domain = 'localhost'
} else if (process.env.NODE_ENV === 'testing') {
  // 测试环境
  result.baseUrl = 'http://localhost:8180'
  result.CLIENT.domain = 'roncoos.com'
} else {
  // 生产环境
  result.baseUrl = 'http://localhost:8180'
  result.CLIENT.domain = 'roncoo.net'
}

export default result
