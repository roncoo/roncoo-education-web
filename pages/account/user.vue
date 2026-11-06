<script setup>
  import { userApi } from '~/api/user'
  const { data: website } = useWebsite()
  const user = ref({}),
    loading = ref(true),
    error = ref(false),
    saving = ref(false),
    binding = ref(false),
    formError = ref('')
  const route = useRoute(),
    router = useRouter()
  async function load() {
    loading.value = true
    error.value = false
    try {
      user.value = await userApi.getUserInfo()
    } catch {
      error.value = true
    } finally {
      loading.value = false
    }
  }
  async function save() {
    if (saving.value) return
    formError.value = ''
    if (!user.value.nickname?.trim()) {
      formError.value = '请输入昵称'
      return
    }
    saving.value = true
    try {
      await userApi.usersUpdate(user.value)
      ElMessage.success('个人资料已保存')
    } catch {
      formError.value = '保存失败，请稍后重试'
    } finally {
      saving.value = false
    }
  }
  async function unbind() {
    try {
      await ElMessageBox.confirm('解绑后将无法使用微信快捷登录。', '解除微信绑定', { confirmButtonText: '确认解绑', cancelButtonText: '保留绑定', type: 'warning' })
      await userApi.userUnbind()
      await load()
    } catch {
      /* User may cancel. */
    }
  }
  onMounted(async () => {
    if (route.query.code) {
      try {
        await userApi.userBinding({ code: route.query.code })
        await router.replace({ query: { ...route.query, code: undefined, state: undefined } })
      } catch {
        ElMessage.error('微信绑定未完成，请重试')
      }
    }
    await load()
  })
</script>
<template>
  <NuxtLayout name="account">
    <CommonState :loading="loading" :error="error" @retry="load" />
    <div v-if="!loading && !error" class="surface profile">
      <ElTabs>
        <ElTabPane label="基本资料">
          <div class="profile-content">
            <form class="profile-form" @submit.prevent="save">
              <div class="read-field">
                <span>手机号</span>
                <strong>{{ user.mobile }}</strong>
                <small>用于登录，不可修改</small>
              </div>
              <div class="read-field">
                <span>账户余额</span>
                <strong>{{ new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(user.availableAmount || 0) }}</strong>
              </div>
              <label for="nickname">昵称</label>
              <ElInput id="nickname" v-model="user.nickname" name="nickname" autocomplete="nickname" placeholder="输入你的昵称…" />
              <label for="birthday">生日</label>
              <ElDatePicker id="birthday" v-model="user.userAge" type="date" value-format="YYYY-MM-DD" format="YYYY-MM-DD" placeholder="选择出生日期…" />
              <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>
              <ElButton class="save" native-type="submit" type="primary" :loading="saving">保存资料</ElButton>
            </form>
            <div class="profile-avatar">
              <CommonImage :src="user.userHead" :alt="user.nickname || '个人头像'" :width="96" :height="96" />
              <p>个人头像</p>
            </div>
          </div>
        </ElTabPane>
        <ElTabPane label="账号安全">
          <div class="security-row">
            <div>
              <h3>登录密码</h3>
              <p>定期更新密码，保护你的账号安全</p>
            </div>
            <NuxtLink class="button-link" to="/reset">重置密码</NuxtLink>
          </div>
          <div v-if="website?.wxPcLoginEnable === '1'" class="security-row">
            <div>
              <h3>微信账号</h3>
              <p>{{ user.unionId || user.openId ? '已绑定，可使用微信快捷登录' : '绑定后可使用微信快捷登录' }}</p>
            </div>
            <ElButton v-if="user.unionId || user.openId" @click="unbind">解除绑定</ElButton>
            <ElButton v-else type="primary" @click="binding = true">绑定微信</ElButton>
          </div>
          <AccountWechat v-model="binding" @callback="load" />
        </ElTabPane>
      </ElTabs>
    </div>
  </NuxtLayout>
</template>
<style scoped>
  .profile {
    padding: 8px 28px 32px;
  }
  .profile-content {
    display: flex;
    justify-content: space-between;
    gap: 40px;
    padding: 24px 0;
  }
  .profile-form {
    display: flex;
    flex-direction: column;
    align-items: start;
    width: 420px;
    max-width: 100%;
  }
  .profile-form > label {
    margin: 16px 0 8px;
  }
  .profile-form > .el-input {
    width: 100%;
  }
  .read-field {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }
  .read-field > span {
    color: var(--muted);
    width: 70px;
  }
  .read-field small {
    color: var(--muted);
    font-size: 12px;
  }
  .profile-avatar {
    padding: 16px;
    text-align: center;
    color: var(--muted);
    font-size: 12px;
  }
  .profile-avatar :deep(img),
  .profile-avatar :deep(.image-placeholder) {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    margin-bottom: 12px;
  }
  .save {
    margin-top: 28px;
  }
  .form-error {
    color: #b91c1c;
    margin-top: 12px;
  }
  .security-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 28px 0;
    border-bottom: 1px solid var(--line);
  }
  .security-row h3 {
    font-size: 16px;
    margin-bottom: 6px;
  }
  .security-row p {
    color: var(--muted);
    margin: 0;
    font-size: 13px;
  }
</style>
