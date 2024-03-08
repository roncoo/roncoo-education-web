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
            <el-form :model="loginForm" label-position="left" @keyup.enter="handleLogin()">
              <el-form-item class="form-group" prop="mobile">
                <el-input v-model="loginForm.mobile" placeholder="用户名" />
              </el-form-item>
              <el-form-item class="form-group" prop="mobilePwd">
                <el-input v-model="loginForm.mobilePwd" placeholder="密码" type="password" show-password />
              </el-form-item>
              <el-form-item class="form-group" prop="verCode">
                <el-input class="var-input" v-model="loginForm.verCode" placeholder="验证码" />
                <img class="var-img" :src="verImg" @click="getCaptcha" />
              </el-form-item>
              <el-button v-loading="loading" class="login-button" type="primary" @click="handleLogin">登 录</el-button>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
<script setup>
  import { loginApi } from '~/api/login.js'

  const loading = ref(false)
  const verImg = ref()

  // 站点信息
  onMounted(() => {
    // 验证码
    getCaptcha()
  })

  // 登录
  const loginForm = reactive({
    mobile: '18800000000',
    mobilePwd: '123456'
  })

  // 获取验证码
  async function getCaptcha() {
    try {
      const res = await loginApi.getCodeImg()
      loginForm.verToken = res.verToken
      verImg.value = res.img
    } catch (error) {
      console.error(error)
    }
  }

  async function handleLogin() {
    loading.value = true
    try {
      const res = await loginApi.userLogin(loginForm)
      console.log(res)
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
    height: calc(100vh - 150px);
    .login_box {
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
      width: 400px;
      background-color: #fff;
      padding: 40px;
      border: 5px solid #2256f7;

      .login_title {
        font-size: 24px;
        margin: 10px auto;
        text-align: center;
      }
    }
  }
</style>
