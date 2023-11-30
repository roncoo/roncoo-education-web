const result = {
  baseUrl: 'https://eduos.roncoo.net/gateway', // 接口地址，本地运行默认读取该配置
  tokenName: 'OSTK' // cookie名称
}
if (process.env.NODE_ENV === 'production') {
  // 生产运行默认读取该配置
  result.baseUrl = 'http://localhost:8180'
}

export default result
