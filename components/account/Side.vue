<template>
  <header class="side_box">
    <div class="menu_panel" v-if="teacher">
      <h3 class="title"><i class="iconfont">&#xe640;</i>讲师中心</h3>
      <ul class="menus">
        <li :class="{on: type == 'jsxx'}"><router-link :to="{name: 'teacherInfo'}">讲师信息</router-link></li>
        <li :class="{on: type == 'kcgl'}"><router-link :to="{name: 'account-course'}">录播管理</router-link></li>
        <li :class="{on: type == 'zbgl'}" v-if="isLive"><router-link :to="{name: 'liveCourse'}">直播管理</router-link></li>
        <li :class="{on: type == 'zhtc'}" v-if="isLive"><router-link :to="{name: 'courseGroup'}">组合套餐</router-link></li>
        <li :class="{on: type == 'zygl'}" v-if="isResource"><router-link :to="{name: 'resource'}">资源管理</router-link></li>
        <li :class="{on: type == 'tkgl'}" v-if="isLibrary"><router-link :to="{name: 'library'}">题库管理</router-link></li>
        <li :class="{on: type == 'pdxx'}" v-if="isLive"><router-link :to="{name: 'channel'}">频道信息</router-link></li>
      </ul>
    </div>
    <!-- <div class="menu_panel">
      <h3 class="title"><i class="iconfont">&#xe649;</i>代理中心</h3>
      <ul class="menus">
        <li :class="{on: type == 'dlxx'}"><router-link :to="{name: 'agencyInfo'}">代理信息</router-link></li>
        <li :class="{on: type == 'dlgl'}"><router-link :to="{name: 'agencyManage'}">代理管理</router-link></li>
      </ul>
    </div> -->
    <div class="menu_panel" v-if="userInfo && userInfo.userType != 1">
      <h3 class="title"><i class="iconfont">&#xe614;</i>收益中心</h3>
      <ul class="menus">
        <li :class="{on: type == 'syqk'}"><router-link :to="{name: 'earnings'}">收益情况</router-link></li>
      </ul>
    </div>
    <div class="menu_panel">
      <h3 class="title">
        <img class="act_icon" src="../../assets/image/act_icon.png" alt="">
        活动中心
      </h3>
      <ul class="menus">
        <li :class="{on: type == 'yhj'}"><router-link :to="{name: 'coupon'}">我的优惠卷</router-link></li>
      </ul>
    </div>
    <div class="menu_panel">
      <h3 class="title"><i class="iconfont">&#xe6be;</i>课程中心</h3>
      <ul class="menus">
        <li :class="{on: type == 'wdkc'}"><router-link :to="{name: 'lesson'}">我的课程</router-link></li>
        <li :class="{on: type == 'wdzy'}" v-if="isResource"><router-link :to="{name: 'explorer'}">我的资源</router-link></li>
        <li :class="{on: type == 'wdtk'}" v-if="isLibrary"><router-link :to="{name: 'theme'}">我的题库</router-link></li>
        <li :class="{on: type == 'wdsc'}"><router-link :to="{name: 'collect'}">我的收藏</router-link></li>
        <li :class="{on: type == 'xxjl'}"><router-link :to="{name: 'study'}">学习记录</router-link></li>
      </ul>
    </div>
    <div class="menu_panel">
      <h3 class="title"><i class="iconfont">&#xe60a;</i>个人资料</h3>
      <ul class="menus">
        <li :class="{on: type == 'grxx'}"><router-link :to="{name: 'index'}">个人信息</router-link></li>
        <li :class="{on: type == 'xgmm'}"><router-link :to="{name: 'resetpwd'}">修改密码</router-link></li>
        <li :class="{on: type == 'wddd'}"><router-link :to="{name: 'order'}">我的订单</router-link></li>
        <li :class="{on: type == 'wdgz'}"><router-link :to="{name: 'attention'}">我的关注</router-link></li>
        <li :class="{on: type == 'tz'}"><router-link :to="{name: 'message'}">我的通知</router-link></li>
    <!--     <li :class="{on: type == 'shdz'}"><a href="">收货地址</a></li>
        <li :class="{on: type == 'smrz'}"><a href="">实名认证</a></li>
        <li :class="{on: type == 'wdjf'}"><a href="">我的积分</a></li>
        <li :class="{on: type == 'zhbd'}"><a href="">第三方账号绑定</a></li> -->
      </ul>
    </div>
  </header>
</template>
<script>
import {getUserInfo} from '~/api/user.js'
export default {
  props: {
    type: {
      type: String,
      default: 'grxx'
    }
  },
  data () {
    return {
      teacher: false,
      isLive: false,
      isLibrary: false,
      isCourse: false,
      isResource: false,
      webInfo: this.$store.state.webInfo,
      tokenInfo: this.$store.state.tokenInfo,
      userInfo: this.$store.state.userInfo
    }
  },
  methods: {
    close () {
      this.$emit('close')
    }
  },
  mounted () {
    if (this.tokenInfo && this.userInfo && this.userInfo.token == this.tokenInfo) {
      if (this.userInfo.userType === 2 || this.userInfo.userType === 4) {
        this.teacher = true;
        console.log('teacher+++++' + this.teacher)
      }
    } else {
      getUserInfo().then(res => {
        // console.log(res)
        let result = res.data
        if (result.code === 200) {
          if (result.data.userType === 2 || result.data.userType === 4) {
            this.teacher = true;
          }
        }
      })
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
    .act_icon {
      width: 16px;
      margin-right: 2px;
    }
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
