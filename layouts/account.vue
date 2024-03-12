<template>
  <common-header />
  <el-container class="container-main">
    <el-aside>
      <client-only>
        <el-menu :default-active="defaultActive">
          <nuxt-link v-for="(item, index) in menuList" :key="index" :to="{ name: item.name }">
            <el-menu-item :index="item.name"> <img :src="item.icon" class="img-icon" /> {{ item.title }} </el-menu-item>
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

  import course from '~/assets/svg/course.svg'
  import collect from '~/assets/svg/collect.svg'
  import order from '~/assets/svg/order.svg'
  import user from '~/assets/svg/user.svg'

  const menuList = [
    {
      name: 'account-course',
      icon: course,
      title: '我的课程'
    },
    {
      name: 'account-collect',
      icon: collect,
      title: '我的收藏'
    },
    {
      name: 'account-order',
      icon: order,
      title: '我的订单'
    },
    {
      name: 'account-user',
      icon: user,
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
      width: 20px;
      margin-right: 5px;
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
