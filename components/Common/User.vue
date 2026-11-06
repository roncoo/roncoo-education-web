<script setup>
  import { userApi } from '~/api/user'
  import { logout } from '~/utils/login'

  const userInfo = ref(null)
  onMounted(async () => {
    try {
      userInfo.value = await userApi.getUserInfo()
    } catch {
      userInfo.value = null
    }
  })

  // 退出登录
  function handleLogout() {
    ElMessageBox.confirm('确认退出', '退出登录', {
      confirmButtonText: '确认',
      showCancelButton: false,
      type: 'warning'
    }).then(() => {
      logout()
      location.reload()
    })
  }
</script>
<template>
  <client-only>
    <el-dropdown>
      <button type="button" class="el-dropdown-link" aria-label="个人中心菜单">
        <CommonImage class="header-image" :src="userInfo?.userHead" alt="个人头像" :width="36" :height="36" />
      </button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <nuxt-link :to="{ name: 'account-course' }">我的课程</nuxt-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <nuxt-link :to="{ name: 'account-collect' }">我的收藏</nuxt-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <nuxt-link :to="{ name: 'account-order' }">我的订单</nuxt-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <nuxt-link :to="{ name: 'account-user' }">个人信息</nuxt-link>
          </el-dropdown-item>
          <el-dropdown-item @click="handleLogout">安全退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </client-only>
</template>

<style lang="scss" scoped>
  .el-dropdown-link {
    border: 0;
    background: none;
    padding: 0;
    display: flex;
  }
  .header-image {
    width: 36px;
    object-fit: cover;
    border-radius: 50%;
    height: 36px;
    font-size: 12px;
    letter-spacing: 0;
    line-height: 1;
    overflow: hidden;
  }
</style>
