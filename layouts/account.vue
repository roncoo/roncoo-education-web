<template>
  <common-header />
  <el-main>
    <el-container class="main">
      <el-aside>
        <client-only>
          <el-menu :default-active="defaultActive">
            <nuxt-link v-for="(item, index) in menuList" :key="index" :to="{ name: item.name }">
              <el-menu-item :index="item.name"> <img :src="item.icon" class="img-icon" /> {{ item.title }} </el-menu-item>
            </nuxt-link>
          </el-menu>
        </client-only>
      </el-aside>
      <div class="account">
        <slot />
      </div>
    </el-container>
    <common-footer />
  </el-main>
</template>
<script setup>
  import course from 'assets/svg/account/course.svg'
  import collect from 'assets/svg/account/collect.svg'
  import order from 'assets/svg/account/order.svg'
  import user from 'assets/svg/account/user.svg'

  useHead({
    title: '用户中心'
  })

  const route = useRoute()
  const defaultActive = ref(route.name)

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
  .account {
    width: calc(100% - 200px);
    padding: 20px;
    background: #fff;
    margin-bottom: 20px;
    border-radius: 5px;
  }
  .el-aside {
    width: 200px;
    margin-right: 20px;
    text-align: center;
    min-height: calc(100vh - 150px);
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
    .img-icon {
      width: 20px;
      margin-right: 5px;
    }
  }

  .el-main {
    padding: 20px 0 0;
    overflow: auto;
    margin: 70px auto 0;
    height: calc(100vh - 70px);
  }
</style>
