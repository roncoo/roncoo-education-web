<template>
  <NuxtLayout>
    <div class="login_body">
      <div class="login_box">
        <div class="login_logo">
          <img src="../assets/image/common_login.png" />
        </div>
        <div class="login_content">
          <!-- 账号登录 -->
          <img v-if="isPwdLogin && websiteInfo?.wxPcLoginEnable === '1'" src="../assets/image/common_login_app.png" class="login_ico" @click="switchLogin" />
          <!-- 扫码登录 -->
          <img v-if="!isPwdLogin && websiteInfo?.wxPcLoginEnable === '1'" src="../assets/image/common_login_pc.png" class="login_ico" @click="switchLogin" />
          <div v-if="isPwdLogin" class="login_pc">
            <div class="login_form">
              <div class="login_title">账号登录</div>
              <el-form v-loading="loading" :model="loginForm" @keyup.enter="handleLogin()">
                <el-form-item class="form-group" prop="mobile">
                  <el-input v-model="loginForm.mobile" placeholder="手机号" autofocus />
                </el-form-item>
                <el-form-item class="form-group" prop="password">
                  <el-input v-model="mobilePwd" placeholder="密码" type="password" show-password />
                </el-form-item>
                <el-form-item class="form-group" prop="verCode">
                  <el-input v-model="loginForm.verCode" class="var-input" placeholder="验证码" />
                  <img class="var-img" :src="verImg" @click="getCaptcha" />
                </el-form-item>
                <div class="login-info">
                  <el-checkbox v-model="loginForm.isAgreement" size="default"> 登录即同意<span class="blue_text" @click="loginForm.visible = true">《隐私政策》</span> </el-checkbox>
                  <nuxt-link :to="{ name: 'reset' }">
                    <div class="login-info-reset">忘记密码？</div>
                  </nuxt-link>
                </div>
                <el-button class="login-button" type="primary" size="large" @click="handleLogin()"> 马上登录 </el-button>
              </el-form>
              <div class="login_other">
                <nuxt-link :to="{ name: 'register' }"> 没有账号，我要注册 </nuxt-link>
              </div>
            </div>
          </div>
          <div v-if="!isPwdLogin" class="login_app">
            <iframe v-if="!binding" :src="wxLoginUrl" class="login_iframe" />
            <div v-if="binding" class="login_form">
              <div class="login_title">账号绑定</div>
              <el-form v-loading="loading" :model="bindingForm" @keyup.enter="handleBinding()">
                <el-form-item class="form-group" prop="mobile">
                  <el-input v-model="bindingForm.mobile" placeholder="手机号" autofocus />
                </el-form-item>
                <el-form-item prop="code">
                  <el-input v-model="bindingForm.code" placeholder="验证码">
                    <template #suffix>
                      <el-button link type="primary" @click="getCode"> 获取验证码 </el-button>
                    </template>
                  </el-input>
                </el-form-item>
                <div style="color: #999; margin-bottom: 74px">若手机号没注册，则会自动注册</div>
                <el-button class="login-button" type="primary" size="large" @click="handleBinding()"> 绑定登录 </el-button>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
<script setup>
  import { loginApi } from '~/api/login.js'
  import { encrypt, getBrowserInfo, getOsInfo } from '~/utils/base'
  import { indexApi } from '~/api/index'
  import { login } from '~/utils/login'

  const router = useRouter()
  const route = useRoute()
  const loading = ref(false)
  const binding = ref(false)

  // 是否为密码登录
  const isPwdLogin = ref(true)
  // 密码
  const mobilePwd = ref('')

  // 登录信息
  const loginForm = reactive({
    verCode: '',
    isAgreement: true
  })
  // 绑定信息
  const bindingForm = reactive({
    isAgreement: true
  })

  const wxLoginUrl = ref('')

  const { data: websiteInfo } = await useAsyncData('website', async () => {
    return indexApi.websiteInfo()
  })

  useHead({
    title: '用户登录',
    meta: [
      { hid: 'keywords', name: 'keywords', content: '领课网络、在线教育系统、开源教育系统、roncoo-education' },
      { hid: 'description', name: 'description', content: websiteInfo.value?.websiteDesc }
    ]
  })

  onMounted(async () => {
    if (route.query.code) {
      // 微信登录
      isPwdLogin.value = false
      // 根据授权码获取用户信息
      try {
        const res = await loginApi.wxCode({ code: route.query.code, loginAuthType: 1, clientType: 1 })
        if (res.bindingStatus) {
          // 已经绑定直接登录
          login(res.token)
        } else {
          // 进行绑定
          binding.value = true
          bindingForm.unionId = res.userInfo.unionId
          bindingForm.openId = res.userInfo.openid
        }
      } catch (e) {
        isPwdLogin.value = true
        // 重新扫码
        switchLogin()
      }
    }

    if (isPwdLogin.value) {
      // 密码登录，获取验证码
      await getCaptcha()
    }
  })

  // 切换登录方式
  const switchLogin = () => {
    isPwdLogin.value = !isPwdLogin.value
    if (!isPwdLogin.value) {
      const redirectUrl = websiteInfo.value.websiteDomain + 'login'
      loginApi.wxLogin({ loginAuthType: 1, redirectUrl: redirectUrl }).then((res) => {
        wxLoginUrl.value = res
      })
    }

    if (isPwdLogin.value) {
      // 密码登录，获取验证码
      getCaptcha()
    }
  }

  // 获取图形验证码
  const verImg = ref()
  async function getCaptcha() {
    try {
      const res = await loginApi.getCodeImg()
      loginForm.verToken = res.verToken
      verImg.value = res.img
    } catch (error) {
      console.error(error)
    }
  }

  // 获取手机验证码
  async function getCode() {
    if (!bindingForm.mobile) {
      ElMessage.error('请输入手机号')
      return
    }
    if (!/^1[3456789]\d{9}$/.test(bindingForm.mobile)) {
      ElMessage.error('请输入正确的手机号')
      return
    }
    loading.value = true
    try {
      const res = await loginApi.getMobileCode({ mobile: bindingForm.mobile })
      ElMessage.success(res)
    } finally {
      loading.value = false
    }
  }

  async function handleBinding() {
    if (!bindingForm.mobile) {
      ElMessage.error('请输入手机号')
      return
    }
    if (!/^1[3456789]\d{9}$/.test(bindingForm.mobile)) {
      ElMessage.error('请输入正确的手机号')
      return
    }
    loading.value = true
    try {
      // 绑定
      const res = await loginApi.wxBinding(bindingForm)
      login(res.token)
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  async function handleLogin() {
    if (!mobilePwd) {
      ElMessage.warning('请输入密码')
      return
    }
    if (!loginForm.verCode) {
      ElMessage.warning('请填写验证码')
      return
    }
    if (!loginForm.isAgreement) {
      ElMessage.warning('请阅读并同意用户协议')
      return
    }
    loading.value = true
    try {
      // 密码加密
      loginForm.mobilePwdEncrypt = encrypt(mobilePwd.value, websiteInfo.value.rsaLoginPublicKey)
      loginForm.os = getOsInfo()
      loginForm.browser = getBrowserInfo().name
      const res = await loginApi.userLogin(loginForm)
      login(res.token)
    } catch (error) {
      console.error(error)
      await getCaptcha()
    } finally {
      loading.value = false
    }
  }
</script>
<style lang="scss" scoped>
  .login_body {
    background-color: #2256f7;
    height: calc(100vh - 130px);
    .login_box {
      width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
    .login_logo {
      float: left;
      width: 40%;
      margin-right: 10%;
    }
    .login_content {
      float: right;
      width: 400px;
      height: 480px;
      background-color: #fff;
      border-radius: 10px;
      .login_pc {
        padding: 0 40px;
      }
      .login_app {
        height: 100%;
        padding: 0 40px;
        .login_iframe {
          border: none;
          width: 100%;
          height: 100%;
        }
      }
    }

    .login_ico {
      float: right;
    }
    .login_title {
      color: #2256f6;
      font-size: 24px;
      margin: 20px auto;
      text-align: center;
    }
    .login-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .login-info-reset {
        color: #2256f6;
      }
    }
    .login-button {
      margin-top: 100px;
    }
    .login_other {
      color: #2256f6;
      font-size: 14px;
      overflow: hidden;
      text-align: center;
      margin-bottom: 20px;
    }
  }
  .var-input {
    width: 220px;
  }
  .var-img {
    margin-left: 20px;
    width: 80px;
  }
  .el-input {
    height: 40px;
    line-height: 40px;
  }
  .el-button {
    width: 100%;
    margin: 20px 0;
  }
</style>
