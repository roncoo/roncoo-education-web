import { loginApi } from '~/api/login'
import { encrypt, getBrowserInfo, getOsInfo } from '~/utils/base'
import { login } from '~/utils/login'
export function useAccessForm(mode, website) {
  const form = reactive({ mobile: '', password: '', repeat: '', code: '', agreement: false })
  const errors = reactive({}),
    busy = ref(false),
    message = ref(''),
    captcha = ref(''),
    verToken = ref(''),
    countdown = ref(0)
  let timer
  function validate(field) {
    const rules = {
      mobile: () => (/^1[3-9]\d{9}$/.test(form.mobile) ? '' : '请输入正确的 11 位手机号'),
      password: () => (!form.password ? '请输入密码' : mode === 'login' || /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/.test(form.password) ? '' : '密码需为 6–20 位字母和数字'),
      repeat: () => (form.repeat === form.password ? '' : '两次密码输入不一致'),
      code: () => (form.code.trim() ? '' : '请输入验证码'),
      agreement: () => (form.agreement ? '' : '请先阅读并同意协议和隐私政策')
    }
    errors[field] = rules[field]?.() || ''
    return !errors[field]
  }
  async function loadCaptcha() {
    try {
      const res = await loginApi.getCodeImg()
      captcha.value = res.img
      verToken.value = res.verToken
    } catch {
      message.value = '验证码加载失败，请点击刷新重试。'
    }
  }
  async function sendCode() {
    if (countdown.value || busy.value || !validate('mobile')) return
    busy.value = true
    message.value = ''
    try {
      await loginApi.getMobileCode({ mobile: form.mobile })
      countdown.value = 60
      timer = setInterval(() => {
        if (--countdown.value <= 0) clearInterval(timer)
      }, 1000)
      ElMessage.success('验证码已发送')
    } catch {
      message.value = '发送失败，请稍后重试。'
    } finally {
      busy.value = false
    }
  }
  async function submit() {
    if (busy.value) return
    const fields = mode === 'login' ? ['mobile', 'password', 'code', 'agreement'] : ['mobile', 'code', 'password', 'repeat']
    fields.forEach(validate)
    const first = fields.find((field) => errors[field])
    if (first) {
      document.getElementById('access-' + first)?.focus()
      return
    }
    if (!website.value?.rsaLoginPublicKey) {
      message.value = '站点配置暂未加载，请稍后重试。'
      return
    }
    busy.value = true
    message.value = ''
    try {
      const params = { mobile: form.mobile, mobilePwdEncrypt: encrypt(form.password, website.value.rsaLoginPublicKey) }
      if (mode === 'login') {
        const res = await loginApi.userLogin({ ...params, verCode: form.code, verToken: verToken.value, isAgreement: form.agreement, os: getOsInfo(), browser: getBrowserInfo().name })
        login(res.token)
      } else if (mode === 'register') {
        await loginApi.register({ ...params, code: form.code })
        ElMessage.success('注册成功，请登录')
        await navigateTo('/login')
      } else {
        await loginApi.updatePassword({ ...params, verificationCode: form.code })
        ElMessage.success('密码已重置，请重新登录')
        await navigateTo('/login')
      }
    } catch {
      message.value = mode === 'login' ? '登录未完成，请检查账号、密码和验证码后重试。' : '提交失败，请检查验证码后重试。'
      if (mode === 'login') await loadCaptcha()
    } finally {
      busy.value = false
    }
  }
  onMounted(() => {
    if (mode === 'login') loadCaptcha()
  })
  onUnmounted(() => clearInterval(timer))
  return { form, errors, busy, message, captcha, countdown, validate, loadCaptcha, sendCode, submit }
}
