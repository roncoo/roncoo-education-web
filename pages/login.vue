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
                <el-input v-model="loginForm.mobile" placeholder="用户名" autofocus />
              </el-form-item>
              <el-form-item class="form-group" prop="password">
                <el-input v-model="loginForm.password" placeholder="密码" type="password" show-password />
              </el-form-item>
              <el-button v-loading="loading" class="login-button" type="primary" @click="handleLogin"> 登 录 </el-button>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
<script setup>
  import { loginApi } from '~/api/login.js'
  import CommonHeader from '~/components/Common/Header.vue'
  import CommonFooter from '~/components/Common/Footer.vue'
  import { useUserStore } from '~/store/modules/user.js'

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
      useUserStore().login(res.token)
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
