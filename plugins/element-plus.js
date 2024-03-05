import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.js'
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ElementPlus, { locale: zhCn })
})
