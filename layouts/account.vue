<template>
  <common-header />
  <el-container class="container-main">
    <el-aside>
      <client-only>
        <el-menu :default-active="defaultActive">
          <nuxt-link v-for="(item, index) in menuList" :key="index" :to="{ name: item.name }">
            <el-menu-item :index="item.name"> <img src="~/assets/svg/course.svg" class="img-icon" /> {{ item.title }} </el-menu-item>
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
      icon: '~/assets/svg/course.svg',
      title: '我的课程'
    },
    {
      name: 'account-collect',
      icon: '~/assets/svg/collect.svg',
      title: '我的收藏'
    },
    {
      name: 'account-order',
      icon: '~/assets/svg/order.svg',
      title: '我的订单'
    },
    {
      name: 'account-user',
      icon: '~/assets/svg/user.svg',
      title: '个人信息'
    }
  ]
</script>
<style lang="scss" scoped>
  .container-main {
    width: 1200px;
    margin: 70px auto 0;
    height: calc(100vh - 130px);
    .img-icon {
      width: 25px;
    }
  }
  .el-aside {
    width: 200px;
    min-height: calc(100vh - 130px);
    margin: 20px auto 0;
    text-align: center;
    ul {
      border-right: none;
      padding: 10px;
      border-radius: 10px;
      li {
        margin: 10px;
      }
      .is-active {
        background: rgba(61, 127, 255, 0.1);
        border-radius: 4px;
        color: #3d7fff;
      }
    }
  }
  .el-main {
    border-radius: 10px;
    margin: 20px;
    background-color: #fff;
  }
</style>
