<template>
  <client-only>
    <el-dropdown>
      <span class="el-dropdown-link">
        <img v-if="userInfo?.userHead" class="header-image" :src="userInfo.userHead" alt="头像" />
        <img v-else class="header-image" src="../../assets/image/common_head.jpg" alt="头像" />
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <nuxt-link :to="{ name: 'account-course' }"> 我的课程 </nuxt-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <nuxt-link :to="{ name: 'account-collect' }"> 我的收藏 </nuxt-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <nuxt-link :to="{ name: 'account-order' }"> 我的订单 </nuxt-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <nuxt-link :to="{ name: 'account-user' }"> 个人信息 </nuxt-link>
          </el-dropdown-item>
          <el-dropdown-item @click="handleLogout"> 安全退出 </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </client-only>
</template>
<script setup>
  import { userApi } from '~/api/user'
  import { logout } from '~/utils/login'

  const userInfo = ref(null)
  onMounted(async () => {
    userInfo.value = await userApi.getUserInfo()
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
<style lang="scss" scoped>
  .header-image {
    border-radius: 50%;
    height: 40px;
  }
</style>
