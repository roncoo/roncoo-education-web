<script setup>
  import { loginApi } from '~/api/login'
  import { login } from '~/utils/login'
  import { getOsInfo, getBrowserInfo } from '~/utils/base'
  const { data: website } = useWebsite()
  const route = useRoute()
  const active = ref(false),
    binding = ref(false),
    url = ref(''),
    busy = ref(false),
    error = ref(''),
    mobile = ref(''),
    code = ref(''),
    identity = ref({}),
    countdown = ref(0)
  let timer
  async function open() {
    active.value = true
    busy.value = true
    error.value = ''
    try {
      url.value = await loginApi.wxLogin({ loginAuthType: 1, redirectUrl: website.value.websiteDomain + 'login' })
    } catch {
      error.value = '微信登录暂时不可用，请重试或使用账号登录。'
    } finally {
      busy.value = false
    }
  }
  async function sendCode() {
    if (busy.value || countdown.value) return
    if (!/^1[3-9]\d{9}$/.test(mobile.value)) {
      error.value = '请输入正确的手机号'
      return
    }
    busy.value = true
    try {
      await loginApi.getMobileCode({ mobile: mobile.value })
      countdown.value = 60
      timer = setInterval(() => {
        if (--countdown.value <= 0) clearInterval(timer)
      }, 1000)
    } catch {
      error.value = '验证码发送失败，请重试'
    } finally {
      busy.value = false
    }
  }
  async function bind() {
    if (busy.value) return
    if (!/^1[3-9]\d{9}$/.test(mobile.value) || !code.value) {
      error.value = '请填写正确的手机号和验证码'
      return
    }
    busy.value = true
    try {
      const res = await loginApi.wxBinding({ ...identity.value, mobile: mobile.value, code: code.value, isAgreement: true })
      login(res.token)
    } catch {
      error.value = '绑定失败，请检查验证码后重试'
    } finally {
      busy.value = false
    }
  }
  onMounted(async () => {
    if (!route.query.code) return
    active.value = true
    busy.value = true
    try {
      const res = await loginApi.wxCode({ code: route.query.code, loginAuthType: 1, clientType: 1, os: getOsInfo(), browser: getBrowserInfo().name })
      if (res.bindingStatus) login(res.token)
      else {
        binding.value = true
        identity.value = { unionId: res.userInfo.unionId, openId: res.userInfo.openid }
      }
    } catch {
      error.value = '授权未完成，请重新扫码或使用账号登录。'
    } finally {
      busy.value = false
    }
  })
  onUnmounted(() => clearInterval(timer))
</script>
<template>
  <div v-if="website?.wxPcLoginEnable === '1'" class="wechat-entry">
    <ElButton v-if="!active" link type="primary" @click="open">微信扫码登录</ElButton>
    <template v-else>
      <ElAlert v-if="error" :title="error" type="error" :closable="false" />
      <ElSkeleton v-if="busy && !binding" :rows="3" animated />
      <iframe v-if="url && !binding" :src="url" title="微信扫码登录" class="wechat-frame" />
      <form v-if="binding" class="binding-form" @submit.prevent="bind">
        <h3>绑定手机号</h3>
        <label for="wx-mobile">手机号</label>
        <ElInput id="wx-mobile" v-model="mobile" type="tel" autocomplete="tel" placeholder="请输入手机号…" />
        <label for="wx-code">短信验证码</label>
        <ElInput id="wx-code" v-model="code" autocomplete="one-time-code" placeholder="请输入验证码…">
          <template #suffix>
            <ElButton link :disabled="busy || countdown > 0" @click="sendCode">{{ countdown ? countdown + ' 秒' : '获取验证码' }}</ElButton>
          </template>
        </ElInput>
        <p>未注册的手机号将自动创建账号。</p>
        <ElButton native-type="submit" type="primary" :loading="busy">绑定并登录</ElButton>
      </form>
      <ElButton v-if="!binding" link type="primary" @click="open">重新获取二维码</ElButton>
      <ElButton link @click="active = false">收起微信登录</ElButton>
    </template>
  </div>
</template>
<style scoped>
  .wechat-entry {
    margin-top: 24px;
    border-top: 1px solid var(--line);
    padding-top: 20px;
    text-align: center;
  }
  .wechat-frame {
    border: 0;
    width: 100%;
    height: 340px;
  }
  .binding-form {
    text-align: left;
    padding-top: 16px;
  }
  .binding-form label {
    display: block;
    margin: 12px 0 6px;
  }
  .binding-form p {
    color: var(--muted);
    font-size: 12px;
    margin-top: 12px;
  }
</style>
