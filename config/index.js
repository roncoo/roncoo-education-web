const title = '领课教育系统(开源版)-打造全行业都适用的在线教育系统'
const result = {
  title: title,
  baseUrl: '', // 接口地址
  CLIENT: {
    domain: 'roncoos.com', // cookie作用域
    tokenName: 'OSTK', // cookie保存的名称
    mainUrl: 'https://eduos.roncoos.com' // 网站域名
  }
}
if (process.env.NODE_ENV === 'development') {
  // 开发环境
  result.baseUrl = 'https://dev-os.roncoos.com/gateway'
  // result.baseUrl = 'https://eduos.roncoo.net/api/'
  result.CLIENT.domain = 'localhost'
  result.CLIENT.mainUrl = 'http://localhost:3001'
} else if (process.env.NODE_ENV === 'testing') {
  // 测试环境
  result.CLIENT.domain = 'roncoos.com'
  result.CLIENT.mainUrl = 'https://eduos.roncoos.com'
} else {
  // 生产环境
  result.CLIENT.domain = 'roncoo.net'
  result.CLIENT.mainUrl = 'https://eduos.roncoo.net'
}

export default result
