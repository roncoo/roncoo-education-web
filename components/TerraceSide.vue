<template>
  <header class="side_box">
    <div class="menu_panel" v-if="showSide === 'zm'">
      <h3 class="title">招募中心</h3>
      <ul class="menus">
        <li :class="{on: type == 'jszm'}"><router-link :to="{name: 'teacherRecruit'}">讲师招募</router-link></li>
      </ul>
    </div>
    <div class="menu_panel" v-for="(item, index) in list" :key="index" v-if="showSide === 'wm'">
      <h3 class="title">{{item.navName}}</h3>
      <ul class="menus">
        <li :class="{on: now == that.id}" v-for="(that, index)  in item.websiteNavList" :key="index">
          <nuxt-link :to="{name: 'terrace-id', params: {id: that.id}}">{{that.navName}}</nuxt-link>
        </li>
      </ul>
    </div>
  </header>
</template>
<script>
import {aboutList} from '~/api/main.js'
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
  data () {
    return {
      list: this.$store.state.aboutList ? this.$store.state.aboutList.list: [],
      now: ''
    }
  },
  methods: {
    changeAbout (id) {
      this.now = id
      // this.$emit('changeInfo', id)
      this.$router.push({name: 'terrace-id', params: {id}})
    },
  },
  mounted () {
    if (this.$route.params.id) {
      this.now = this.$route.params.id
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
