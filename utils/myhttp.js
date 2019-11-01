// 处理token异常
export const myHttp = function ({method, params={}, confirm, cancel}) {
  return new Promise((resolve, reject) => {
    method(params).then(res => {
      let result = res.data
      if (result.code === 200) {
        resolve(result)
      } else {
        this.notdata = true
        if (result.code > 300 && result.code < 400) {
          this.$msgBox({
            content: '登录超时，请重新登录',
            isShowCancelBtn: false
          }).then(() => {
            this.$store.dispatch('REDIRECT_LOGIN', result.code)
          }).catch(() => {
            this.$store.dispatch('REDIRECT_LOGIN', result.code)
          })
        } else {
          this.$msgBox({
            content: result.msg,
            isShowCancelBtn: false
          }).then(() => {
            if (confirm) {
              confirm()
            }
          }).catch(() => {
            if (cancel) {
              cancel()
            }
          })
        }
      }
    }).catch(error => {
      this.notdata = true
      this.$msgBox({
        content: '系统繁忙，请稍后重试',
        isShowCancelBtn: false
      }).catch(() => {})
      reject(error)
    })
  })
}