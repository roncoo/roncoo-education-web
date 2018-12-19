
if (process.env.NODE_ENV == 'development') {
  const devEnv = require('./dev.env')
  result = devEnv
}else {
  const prodEnv = require('./prod.env')
  result = prodEnv
}

module.exports = result