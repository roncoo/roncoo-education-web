<template>
  <NuxtLayout>
    <div class="login_body">
      <div class="login_box">
        <div class="login_logo">
          <img src="../assets/image/common_login.png" />
        </div>
        <div class="login_content">
          <div class="login_title">账号登录</div>
          <div class="login_form">
            <el-form :model="loginForm" @keyup.enter="handleLogin()">
              <el-form-item class="form-group" prop="mobile">
                <el-input v-model="loginForm.mobile" placeholder="用户名" autofocus />
              </el-form-item>
              <el-form-item class="form-group" prop="password">
                <el-input v-model="loginForm.password" placeholder="密码" type="password" show-password />
              </el-form-item>
              <div class="login-info">
                <el-checkbox v-model="loginForm.isAgreement" size="default"> 我已阅读并同意<span class="blue_text" @click="loginForm.visible = true">《用户协议》</span> </el-checkbox>
                <nuxt-link :to="{ name: 'resetpw' }">
                  <div class="login-info-reset">忘记密码？</div>
                </nuxt-link>
              </div>
              <el-button v-loading="loading" class="login-button" type="primary" size="large" @click="handleLogin"> 登 录 </el-button>
            </el-form>
            <div class="login_other">
              <nuxt-link :to="{ name: 'register' }"> 没有账号，我要注册 </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
<script setup>
  import { loginApi } from '~/api/login.js'

  const router = useRouter()
  const loading = ref(false)

  // 登录
  const loginForm = reactive({
    mobile: '18800000000',
    mobilePwd: '123456'
  })

  async function handleLogin() {
    loading.value = true
    try {
      const res = await loginApi.userLogin(loginForm)
      setToken(res.token)

      const history = getStorage('history')
      if (history) {
        window.location.href = history
        setStorage('history', '')
      } else {
        await router.replace({ path: '/' })
      }
    } catch (error) {
      console.error(error)
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
      width: 50%;
    }
    .login_content {
      float: right;
      width: 350px;
      background-color: #fff;
      padding: 0 40px;
      border-radius: 10px;

      .login_title {
        color: #2256f6;
        font-size: 24px;
        margin: 20px auto;
        text-align: center;
      }
      .el-input {
        height: 50px;
      }
      .el-button {
        width: 100%;
        margin: 20px 0;
      }

      .login-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .login-info-reset {
          color: #2256f6;
        }
      }

      .login_other {
        color: #2256f6;
        font-size: 14px;
        overflow: hidden;
        text-align: center;
        margin-bottom: 20px;
      }
    }
  }
</style>
