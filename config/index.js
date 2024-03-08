const result = {
  baseUrl: 'https://dev-os.roncoos.com/gateway' // 接口地址，本地运行默认读取该配置
  //baseUrl: 'https://eduos.roncoo.net/gateway' // 接口地址，本地运行默认读取该配置
}
if (process.env.NODE_ENV === 'production') {
  // 生产运行默认读取该配置
  result.baseUrl = 'http://localhost/gateway'
}

export default result
