<template>
  <NuxtLayout name="account">
    <el-tabs v-model="activeName">
      <el-tab-pane :name="1" label="基本资料">
        <el-form :model="userInfo" label-width="60px" style="max-width: 600px">
          <el-row>
            <el-col :span="16">
              <el-form-item label="手机：">
                {{ userInfo.mobile }}
                <span style="margin-left: 20px; color: #999">不可修改</span>
              </el-form-item>
              <el-form-item label="余额：">
                ￥{{ userInfo.availableAmount }}元&nbsp;&nbsp;
                <!--<el-button type="danger" size="small" @click="onDevelop"> 充 值 </el-button>-->
              </el-form-item>
              <el-form-item label="昵称：">
                <el-input v-model="userInfo.nickname" size="large" placeholder="请输入昵称" />
              </el-form-item>
              <el-form-item label="年龄：">
                <el-input-number v-model="userInfo.userAge" size="large" />
              </el-form-item>
              <el-form-item label="">
                <el-button type="primary" size="large" @click="onSubmit"> 保存设置 </el-button>
              </el-form-item>
            </el-col>
            <el-row>
              <el-row>
                <el-col :span="4">
                  <el-form-item>
                    <img :src="userInfo.userHead" style="height: 100px; width: auto" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-row>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane :name="2" label="账号设置">
        <el-card class="account-setting">
          <div class="setting">
            <div class="setting-info">
              <img src="../../assets/svg/account/password.svg" width="60px" />
              <div>
                重置登录密码
                <br />
                ********
              </div>
            </div>
            <el-button text type="primary">
              <nuxt-link :to="{ name: 'reset' }"> 密码重置 </nuxt-link>
            </el-button>
          </div>
        </el-card>
        <el-card class="account-setting">
          <div class="setting">
            <div class="setting-info">
              <img src="../../assets/svg/account/wechat.svg" width="60px" />
              <div>
                微信账号绑定
                <br />
                <span v-if="userInfo.unionId || userInfo.openId" style="color: #999">已绑定</span>
                <span v-else style="color: #999">未绑定</span>
              </div>
            </div>
            <el-button text type="primary">
              <div v-if="userInfo.unionId || userInfo.openId" @click="handleUnBind">解除绑定</div>
              <div v-else @click="handleBinding">绑定微信</div>
            </el-button>
          </div>
          <account-wechat v-model="binding" @callback="getUserInfo()" />
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </NuxtLayout>
</template>
<script setup>
  import { userApi } from '~/api/user.js'
  import { ElMessage } from 'element-plus'
  import { ref } from 'vue'

  const router = useRouter()
  const route = useRoute()

  const activeName = ref(1)
  const userInfo = ref({})
  const binding = ref(false)
  const wxCode = ref('')

  onMounted(() => {
    wxCode.value = route.query.code
    if (wxCode.value) {
      // 进行绑定
      userBinding()
    }
    getUserInfo()
  })

  // 获取用户信息
  const getUserInfo = async () => {
    userInfo.value = await userApi.getUserInfo()
  }

  // 绑定
  const handleBinding = () => {
    binding.value = true
  }

  // 用户绑定微信
  const userBinding = async () => {
    const res = await userApi.userBinding({ code: wxCode.value })
    await router.push({
      query: Object.assign({ ...route.query }, { code: '', state: '' })
    })
    await getUserInfo()
    ElMessage.success(res)
    activeName.value = 2
  }

  // 解除绑定
  const handleUnBind = () => {
    ElMessageBox.confirm('确定解除绑定？解绑后，将无法使用微信账号快捷登录', '解绑提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      userApi.userUnbind().then((res) => {
        ElMessage.success(res)
        getUserInfo()
        activeName.value = 2
      })
    })
  }

  const onSubmit = () => {
    if (!userInfo.value.nickname) {
      ElMessage.warning('请输入昵称')
      return
    }

    if (userInfo.value.userAge < 0) {
      ElMessage.warning('请输入正确的年龄')
      return
    }

    userApi.usersUpdata(userInfo.value).then((res) => {
      ElMessage.info(res)
    })
  }
</script>
<style lang="scss" scoped>
  .el-form {
    margin: 20px;
    .el-form-item {
      margin: 20px;
    }
  }

  .account-setting {
    margin: 20px auto;
    width: 90%;
  }

  .setting {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 30px;
    img {
      padding: 10px 20px;
    }
    .setting-info {
      font-size: 16px;
      display: flex;
      align-items: center;
    }
  }
</style>
