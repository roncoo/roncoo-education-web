export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vue:error', (err) => {
    console.error(err)
    // 这里可以记录错误日志
  })
})
