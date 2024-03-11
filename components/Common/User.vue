<template>
  <client-only>
    <el-dropdown>
      <span class="el-dropdown-link">
        <img v-if="userInfo.userHead" class="header-image" :src="userInfo.userHead" alt="头像" />
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
  import { useUserStore } from '~/store/modules/user.js'
  import { userApi } from '~/api/user.js'
  const userStore = useUserStore()

  const userInfo = ref({})
  onMounted(() => {
    userApi.getUserInfo().then((res) => {
      userInfo.value = res
    })
  })

  // 退出登录
  function handleLogout() {
    ElMessageBox.confirm('确认退出', '退出登录', {
      confirmButtonText: '确认',
      showCancelButton: false,
      type: 'warning'
    }).then(() => {
      userStore.logout()
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
