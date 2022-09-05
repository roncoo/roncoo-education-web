<template>
  <header class="side_box">
    <div v-if="showSide === 'zm'" class="menu_panel">
      <h3 class="title">招募中心</h3>
      <ul class="menus">
        <li :class="{on: type == 'jszm'}"><router-link :to="{name: 'teacherRecruit'}">讲师招募</router-link></li>
      </ul>
    </div>
    <!-- eslint-disable-next-line  -->
    <div v-for="(item, index) in list" v-if="showSide === 'wm'" :key="index" class="menu_panel">
      <h3 class="title">{{ item.navName }}</h3>
      <ul class="menus">
        <li v-for="that in item.websiteNavList" :key="that.id" :class="{on: now == that.id}">
          <nuxt-link :to="{name: 'terrace-id', params: {id: that.id}}">{{ that.navName }}</nuxt-link>
        </li>
      </ul>
    </div>
  </header>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: 'jszm'
    },
    showSide: {
      type: String,
      default: 'zm'
    }
  },
  data() {
    return {
      list: this.$store.state.aboutList ? this.$store.state.aboutList.list : [],
      now: ''
    }
  },
  mounted() {
    if (this.$route.params.id) {
      this.now = this.$route.params.id
    }
  },
  methods: {
    changeAbout(id) {
      this.now = id
      // this.$emit('changeInfo', id)
      this.$router.push({ name: 'terrace-id', params: { id }})
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .side_box{
    border-radius: 6px 6px 0 0;
    float: left;
    width: 168px;
  }
  .menu_panel{
    background-color: #fff;
    margin-bottom: 20px;
    border-radius: 6px 6px 0 0;
    .title{
      font-size: 14px;
      color: #333;
      line-height: 60px;
      padding: 0 35px;
      border-bottom: 1px solid rgb(242, 242, 242);
      i{
        padding-right: 6px;
        font-size: 16px;
        position: relative;
        left: -5px;
      }
    }
  }
  .menus{
    li{
      line-height: 40px;
      // padding-left: 35px;
      text-align: center;
      &:hover,&.on{
        a{
          color: #D51423;
        }
      }
    }
    a{
      color: #333;
      font-size: 14px;
    }
  }
</style>
