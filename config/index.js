const result = {
  baseUrl: 'http://localhost:8180', // 接口地址
  tokenName: 'OSTK' // cookie名称
}
if (process.env.NODE_ENV === 'production') {
  // 生产环境
  result.baseUrl = 'http://localhost:8180'
}

export default result
