const title = '领课教育系统(开源版)-打造全行业都适用的在线教育系统'
const result = {
  title: title,
  baseUrl: 'http://127.0.0.1:5840', // java项目接口地址
  CLIENT: {
    no: 'lingke', // 接口需要的机构号
    id: 'lkb65617f842ad4c37895a733b8de43cbb', // 接口需要的clientId
    name: title, // 页面title
    domain: 'roncoos.com', // cookie作用域
    tokenName: 'OSTK', // cookie保存的名称
    mainUrl: 'https://eduos.roncoos.com' // 网站域名
  }
}
if (process.env.NODE_ENV === 'development') {
  result.baseUrl = 'https://eduos.roncoo.net/api/'
  result.CLIENT.domain = 'localhost'
  result.CLIENT.mainUrl = 'http://localhost:3001'
} else if (process.env.NODE_ENV === 'testing') {
  result.CLIENT.domain = 'roncoos.com'
} else {
  result.CLIENT.domain = 'roncoo.net'
  result.CLIENT.mainUrl = 'https://eduos.roncoo.net'
}

export default result
