<template>
  <common-header />
  <el-container class="main">
    <el-aside>
      <client-only>
        <el-menu :default-active="defaultActive">
          <nuxt-link v-for="(item, index) in menuList" :key="index" :to="{ name: item.name }">
            <el-menu-item :index="item.name">
              {{ item.title }}
            </el-menu-item>
          </nuxt-link>
        </el-menu>
      </client-only>
    </el-aside>
    <el-main>
      <slot />
    </el-main>
  </el-container>
  <common-footer />
</template>
<script setup>
  const route = useRoute()
  const defaultActive = ref(route.name)

  const menuList = [
    {
      name: 'account-course',
      title: '我的课程'
    },
    {
      name: 'account-collect',
      title: '我的收藏'
    },
    {
      name: 'account-order',
      title: '我的订单'
    },
    {
      name: 'account-user',
      title: '个人信息'
    }
  ]
</script>
<style lang="scss" scoped>
  .main {
    width: 1200px;
    margin: 70px auto 0;
    padding: 0;
  }

  .el-aside {
    width: 200px;
    min-height: calc(100vh - 130px);
    margin: 0 auto;
    text-align: center;
  }

  .el-main {
    border: none;
  }
</style>
