<template>
  <div class="login_page">
    <y-header :hide-top="true" :hide-search="true" />
    <div class="login_body">
      <div class="login_box">
        <div class="login_logo"><img src="../assets/image/login_bg.png"></div>
        <div class="center_box">
          <div v-if="!(userInfo)" :class="{login_form: true, rotate: tab == 2}">
            <div v-if="tabp == 1" style="height: 30px" />
            <div :class="{tabs: true, clearfix: true, r180: tabp == 2}">
              <div class="fl tab" @click="changetab(1)">
                <span :class="{on: tab == 1}">登录</span>
              </div>
              <div class="fl tab" @click="changetab(2)">
                <span :class="{on: tab == 2}">注册</span>
              </div>
            </div>
            <div v-if="tabp == 1" class="form_body">
              <form action="" @submit="loginSubmit">
                <input v-model="loginObj.mobile" type="text" placeholder="请输入手机号或邮箱">
                <div class="error_msg">{{ errTip1 }}</div>
                <input v-model="loginObj.password" type="password" placeholder="6-20位密码，可用数字/字母/符号组合">
                <div class="error_msg">{{ errTip2 }}</div>
                <input v-if="subState" type="submit" disabled="disabled" value="登录中···" class="btn">
                <input v-else type="submit" value="登录" class="btn">
              </form>
              <nuxt-link class="is_go" :to="{name: 'reset'}">忘记密码</nuxt-link>
              <div style="margin-top: 20px;">注册即可体验</div>
            </div>
            <div v-if="tabp == 2" class="form_body r180">
              <form action="" @submit="regSubmit">
                <input v-model="registerObj.mobile" type="text" placeholder="请输入手机号">
                <div class="phone_yzm">
                  <input v-model="registerObj.code" type="text" name="code" placeholder="请输入手机验证码" class="phone" maxlength="6">
                  <y-button :mobile="registerObj.mobile" />
                </div>
                <input v-model="registerObj.mobilePwd" type="password" placeholder="6-20位密码，可用数字/字母/符号组合">
                <input v-model="registerObj.repassword" type="password" placeholder="确认密码">
                <div class="mgt20 font_14">
                  <input id="tonyi" v-model="registerObj.check" type="checkbox">
                  <label for="tonyi">我已经阅读并同意</label><a href="jvascript:" class="c_blue" @click="xieyi = true">《用户协议》</a>
                </div>
                <input v-if="subState" type="submit" disabled="disabled" value="提交中···" class="btn">
                <input v-else type="submit" value="注册" class="btn">
              </form>
            </div>
          </div>
          <div v-else class="login_form">
            <div style="height: 60px" />
            <div class="login_title is_login">领课教育系统（开源版）</div>
            <div class="form_body">
              <div class="img_box">
                <img v-if="userInfo.userHead" :src="userInfo.userHead" alt="">
                <img v-else src="../assets/image/friend.jpg" alt="">
              </div>
              <ul class="btn_box clearfix">
                <li>
                  <nuxt-link :to="{name: 'account-course'}">我的课程</nuxt-link>
                </li>
                <li>
                  <nuxt-link :to="{name: 'account-order'}">我的订单</nuxt-link>
                </li>
              </ul>
              <div>
                <a href="javascript:" class="out_btn" @click="signOut">退出登录</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="xieyi" class="xieyi" @click.self="xieyi = false">
      <div class="xieyi_content">
        <div class="xieyi_title">用户协议</div>
        <div v-if="websiteInfo && websiteInfo.websiteUserAgreement" class="xieyi_body" v-html="websiteInfo.websiteUserAgreement" />
        <input type="button" class="xieyi_btn" value="确定" @click="xieyi = false">
      </div>
    </div>
    <!-- <y-bottom /> -->
  </div>
</template>
<script>
import YHeader from '~/components/common/Header'
import YButton from '@/components/common/Code'
// import YBottom from '@/components/common/Bottom'
import { getOsInfo, getBrowserInfo } from '@/utils/utils'
import { register, userLogin, getIpInfo } from '@/api/login.js'

export default {

  components: {
    YHeader,
    YButton
    // YBottom
  },
  data() {
    return {
      tab: this.$route.query.tab || 1,
      tabp: this.$route.query.tab || 1,
      websiteInfo: this.$store.state.websiteInfo,
      userInfo: this.$store.state.userInfo,
      subState: false, // 提交状态
      xieyi: false, // 用户协议
      errTip1: '',
      errTip2: '',
      ipInfo: {},
      loginObj: {
        mobile: '',
        password: ''
      },
      registerObj: {
        mobile: '',
        code: '',
        mobilePwd: '',
        repassword: '',
        check: false
      }
    }
  },
  head() {
    return {
      title: '用户登录-' + this.websiteInfo.websiteName,
      meta: [
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.websiteInfo.websiteName
        },
        {
          hid: 'description',
          name: 'description',
          content: this.websiteInfo.websiteDesc
        }
      ]
    }
  },
  mounted() {
    if (this.$route.query.t === 'login') {
      this.$store.commit('SIGN_OUT')
      this.userInfo = ''
      this.errTip1 = '未登录或登录超时,请重新登录'
    } else if (this.$route.query.t) {
      window.location.href = '/index'
    }

    // this.$axios('get', 'https://gateway.doityun.com/ip/info')
    getIpInfo().then(res => {
      this.ipInfo = res.data.data
    })
  },
  methods: {
    signOut() {
      // this.SIGN_OUT();
      this.$store.commit('SIGN_OUT')
      this.userInfo = ''
    },
    changetab(int) {
      this.tab = int
      const _that = this
      setTimeout(function() {
        _that.tabp = int
      }, 200)
    },
    loginSubmit(e) {
      e.preventDefault()
      if (this.subState) {
        return false
      }
      this.errTip1 = ''
      this.errTip2 = ''
      if (!(/^1\d{10}$/.test(this.loginObj.mobile.trim())) && !(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/).test(this.loginObj.mobile.trim())) {
        this.errTip1 = '请输入正确手机号或者邮箱'
        return false
      }
      if (this.loginObj.password.length < 6) {
        this.errTip2 = '请输入正确的账号或密码'
        return false
      }
      this.loginObj.loginIp = this.ipInfo.ip
      this.loginObj.province = this.ipInfo.pro
      this.loginObj.city = this.ipInfo.city
      this.loginObj.os = getOsInfo().version
      this.loginObj.browser = getBrowserInfo().name + getBrowserInfo().version
      this.$nuxt.$loading.start()
      this.subState = true
      userLogin(this.loginObj).then(res => {
        this.subState = false
        this.$nuxt.$loading.finish()
        this.$store.commit('SET_TOKEN', res.token)
        this.$store.commit('GET_TEMPORARYURL')
        this.$store.dispatch('GET_USERINFO', store => {
          this.userInfo = this.$store.state.userInfo
          window.location.href = this.$store.state.temporaryUrl
        })
      }).catch((error) => {
        this.subState = false
        this.$nuxt.$loading.finish()
        this.$msgBox({
          content: error.msg,
          isShowCancelBtn: false
        })
      })
      return false
    },
    // 注册
    regSubmit: function(e) {
      e.preventDefault()
      if (this.subState) {
        return false
      }
      if (!(/^1\d{10}$/.test(this.registerObj.mobile.trim())) || this.registerObj.mobile.trim().length !== 11) {
        this.$msgBox({
          content: '请输入正确手机',
          isShowCancelBtn: false
        }).catch(() => {
        })
        return false
      }
      if (!this.registerObj.code || this.registerObj.code.length !== 6) {
        this.$msgBox({
          content: '请输入正确的手机验证码',
          isShowCancelBtn: false
        }).catch(() => {
        })
        return false
      }
      if (this.registerObj.mobilePwd.length < 6 || this.registerObj.mobilePwd.length > 16) {
        this.$msgBox({
          content: '请输入6-16位的登录密码,区分大小写,不可有空格',
          isShowCancelBtn: false
        }).catch(() => {
        })
        return false
      }
      if (this.registerObj.mobilePwd !== this.registerObj.repassword) {
        this.$msgBox({
          content: '两次输入密码不一致',
          isShowCancelBtn: false
        }).catch(() => {
        })
        return false
      }
      if (!this.registerObj.check) {
        this.$msgBox({
          content: '请先阅读并同意用户协议',
          isShowCancelBtn: false
        }).catch(() => {
        })
        return false
      }
      this.$nuxt.$loading.start()
      this.subState = true
      this.registerObj.loginIp = this.ipInfo.ip
      this.registerObj.province = this.ipInfo.pro
      this.registerObj.city = this.ipInfo.city
      this.registerObj.os = getOsInfo().version
      this.registerObj.browser = getBrowserInfo().name + getBrowserInfo().version
      register(this.registerObj).then(res => {
        this.$nuxt.$loading.finish()
        this.subState = false
        this.$msgBox({
          content: '注册成功！',
          confirmBtnText: '立即登录',
          isShowCancelBtn: false
        }).then(() => {
          this.changetab(1)
        }).catch(() => {
          this.changetab(1)
        })
        this.registerObj = {
          mobile: '',
          code: '',
          mobilePwd: '',
          repassword: '',
          check: false
        }
      }).catch(res => {
        this.$nuxt.$loading.finish()
        this.subState = false
        this.$msgBox({
          content: res.msg,
          isShowCancelBtn: false
        })
      })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.login_body {
  background-color: #2256f7;
  height: calc(100vh - 150px);
}

.login_page {
  .login_box {
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    .login_logo img {
      width: 500px;
      height: auto;
    }

    .center_box {
      position: relative;
      margin: 0 100px;
    }
  }

  .login {
    background: rgb(0, 153, 255);

    .login_header {
      width: 1200px;
      margin: 0 auto;
      height: 132px;
      position: relative;

      span {
        position: absolute;
        height: 28px;
        line-height: 28px;
        font-size: 26px;
        color: #fff;
        border-left: 2px solid #fff;
        padding-left: 25px;
        top: 46px;
        left: 210px;
      }
    }
  }

  .login_logo {
    img {
      width: 186px;
      height: 52px;
      margin-top: 32px;
    }
  }

  .login_body {
    img {
      width: 186px;
      height: 52px;
      display: block;
      margin: 0 auto;
    }

    p {
      text-align: center;
      font-size: 14px;
      color: #fff;
      margin-top: 30px;
    }
  }

  .login_form {
    width: 380px;
    border-radius: 6px;
    transition: all 0.8s;
    transform: perspective(600px);

    &.rotate {
      transform: rotateY(-180deg);
    }

    .login_title {
      height: 95px;
      line-height: 95px;
      font-size: 18px;
      padding-left: 30px;
      color: #333;
      background: #fff;
      border-radius: 6px 6px 0 0;

      &.is_login {
        padding-left: 0px;
        text-align: center;
      }
    }
  }

  .form_body {
    background: #fff;
    padding: 0 30px 20px;
    border-radius: 0 0 6px 6px;

    input[type='text'], input[type='password'], input[type='button'], input[type='submit'] {
      width: 310px;
      height: 46px;
      padding-left: 10px;
      margin-top: 20px;
      border-radius: 6px;
      font-size: 14px;
      border-color: rgb(230, 230, 230);

      &.btn {
        background: rgb(213, 20, 35);
        width: 320px;
        color: #fff;
        border: none;
        outline: none;
        cursor: pointer;
        margin-bottom: 20px;
      }
    }

    .error_msg {
      width: 310px;
      color: #D51423;
      font-size: 12px;
    }

    .next_auto {
      font-size: 14px;
      color: #333;
    }

    .is_go {
      float: right;
      color: #0099FF;
      height: 18px;
      line-height: 18px;
      font-size: 14px;
      display: inline-block;
      padding: 0 10px;

      &:hover {
        text-decoration: none;
      }
    }
  }

  .phone_yzm {
    position: relative;

    .phone {
      padding-right: 100px;
      width: 210px;
      font-size: 14px;
      border-color: rgb(230, 230, 230);
      padding-left: 10px;
      height: 46px;
      border-radius: 6px;
      margin-top: 20px;
    }
  }

  .yzm_btn {
    width: 100px;
    height: 46px;
    position: absolute;
    left: 210px;
    top: 21px;
    line-height: 48px;
    border-radius: 0 6px 6px 0;
    text-align: center;
    color: #fff;
    cursor: pointer;
    border: none;
  }

  .login_footer {
    padding-bottom: 30px;

    p {
      text-align: center;
      font-size: 12px;
      color: #1E1E1E;
      margin-top: 20px;
    }
  }

  .img_box {
    height: 70px;

    img {
      width: 70px;
      height: 70px;
      display: block;
      border-radius: 50%;
      margin: 0 auto;
    }
  }

  .hellow_text {
    text-align: center;
    font-size: 14px;
    padding: 20px 0;
    border-bottom: 1px solid #ccc;
  }

  .btn_box {
    border-bottom: 1px solid #ccc;
    padding-top: 20px;
    padding-bottom: 30px;
    font-size: 14px;

    li {
      float: left;
      width: 140px;
      text-align: center;
      line-height: 40px;
      margin: 20px 10px 0;
      border-radius: 6px;

      a {
        display: block;
        background: #f6f8fb;
        border-radius: 6px;

        &:hover {
          color: #fff;
          text-decoration: none;
          background: skyblue;
        }
      }
    }
  }

  .out_btn {
    display: inline-block;
    margin: 10px 0 0 100px;
    font-size: 16px;
    color: #333;
    width: 120px;
    line-height: 30px;
    text-align: center;

    &:hover {
      text-decoration: none;
    }
  }

  .prn_icon {
    width: 16px;
    height: 16px;
    position: relative;
    top: 3px;
  }

  .tabs {
    height: 60px;
    line-height: 60px;
    background: #fff;
    border-radius: 8px 8px 0 0;
    border-bottom: 1px solid rgb(230, 230, 230);

    .tab {
      font-size: 18px;
      width: 50%;
      text-align: center;
      cursor: pointer;
      line-height: 60px;
    }

    span {
      display: inline-block;
      height: 60px;
    }

    .on {
      border-bottom: 2px solid #D51423;
      color: #D51423;
    }
  }

  .r180 {
    transform: rotateY(-180deg);
  }

  .xieyi {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 10003;

    .xieyi_content {
      width: 900px;
      height: 500px;
      margin: 70px auto 0;
      border-radius: 8px;
      background: #fff;
      position: relative;
    }

    .xieyi_title {
      color: #333;
      font-size: 18px;
      line-height: 70px;
      text-align: center;
    }

    .xieyi_body {
      height: 350px;
      overflow-y: auto;
      padding: 0 20px;
    }

    .xieyi_btn {
      position: absolute;
      bottom: 10px;
      width: 166px;
      height: 46px;
      background: rgba(213, 20, 35, 1);
      color: #fff;
      border: none;
      outline: none;
      cursor: pointer;
      left: 50%;
      margin-left: -83px;
      border-radius: 6px;
    }
  }
}
</style>
