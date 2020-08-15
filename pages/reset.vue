<template>
  <div class="register_page">
    <div class="register">
      <div class="register_body">
        <div class="register_header">
          <div class="register_logo">
            <nuxt-link :to="{name: 'index'}">
              <img :src="webInfo.logoImg" alt="" v-if="webInfo && webInfo.logoImg">
            </nuxt-link>
          </div>
          <p>
            已有账号，<nuxt-link :to="{name: 'login'}">立即登陆</nuxt-link><span></span><nuxt-link :to="{name: 'index'}">返回首页</nuxt-link>
          </p>
        </div>
        <div class="register_content">
          <div class="register_title">修改密码</div>
          <form action="" @submit="resetPsw">
            <div class="form_group">
              <div class="label">手机号:</div>
              <div class="form_ctl">
                <input type="text" maxlength="11" @change="enterPhone" v-model="obj.mobile">
                <p class="err" v-show="errTip0">{{errTip0}}</p>
              </div>
            </div>
            <div class="form_group">
              <div class="label">验证码:</div>
              <div class="form_ctl">
                <input type="text" maxlength="6" v-model="obj.code" name="code" @change="enter">
                <y-button :mobile="obj.mobile" />
                <p class="err" v-show="errTip1">{{errTip1}}</p>
              </div>
            </div>
            <div class="form_group">
              <div class="label">新密码:</div>
              <div class="form_ctl">
                <input type="password" v-model="obj.newPassword" @change="enter" name="password">
                <p class="err" v-show="errTip2">{{errTip2}}</p>
              </div>
            </div>
            <div class="form_group">
              <div class="label">重复密码:</div>
              <div class="form_ctl">
                <input type="password" v-model="obj.confirmPassword" @change="enter" name="repassword">
                <p class="err" v-show="errTip3">{{errTip3}}</p>
              </div>
            </div>
            <div class="form_group">
              <div class="label">&nbsp;</div>
              <div class="form_ctl">
                <input type="submit" class="submit_btn" value="确定">
              </div>
            </div>
          </form>
        </div>
      </div>
      <p class="footer_text">
        <span v-if="service.copyright" v-html="service.copyright"></span>
        <span v-if="service.icp">&nbsp;|&nbsp;</span>
        <a href="http://www.miitbeian.gov.cn/" target="_blank">{{service.icp}}</a>
        <span v-if="service.prn">&nbsp;|&nbsp;</span>
        <a :href="'http://www.beian.gov.cn/portal/index'" target="_blank" v-if="service.prn"><img src="../assets/image/prn_icon.png" class="prn_icon" alt="">&nbsp;{{service.prn}}</a>
      </p>
      <a href="http://www.doityun.com/" target="_blank" class="lingke_link">IT云提供计算服务</a>
    </div>
  </div>
</template>
<script>
import YButton from '~/components/common/CodeButton'
import {updatePassword} from '~/api/account/user.js'
export default {
  metaInfo () {
      return {
        title: '修改密码'
      }
  },
  data () {
    return {
      errTip0: '',
      errTip1: '',
      errTip2: '',
      errTip3: '',
      obj: {
        mobile: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
      },
      webInfo: this.$store.state.webInfo,
      service: {}
    }
  },
  methods: {
    goLogin () {
      this.$router.push({path: '/login'});
    },
    // 输入内容
    enter (e) {
      let name = e.target.name;
      if (name === 'code') {
        if (this.obj.code.length !== 6) {
          this.errTip1 = '请输入正确的手机验证码';
          return false;
        } else {
          this.errTip1 = false;
        }
      } else if (name === 'password') {
        if (this.obj.newPassword.length < 6 || this.obj.newPassword.length > 16) {
          this.errTip2 = '请输入6-16位的登录密码,区分大小写,不可有空格';
          return false;
        } else {
          this.errTip2 = false;
        }
      } else if (name === 'repassword') {
        if (this.obj.newPassword !== this.obj.confirmPassword) {
          this.errTip3 = '两次输入密码不一致';
          return false;
        } else {
          this.errTip3 = false;
        }
      }
    },
    // 输入手机
    enterPhone () {
      if (this.obj.mobile.length === 11) {
        if ((/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(this.obj.mobile.trim()))) {
          this.errTip0 = false;
          this.getCodeBtn = true;
        } else {
          this.errTip0 = '请输入正确手机';
          this.getCodeBtn = false;
        }
      } else {
        this.errTip0 = false;
        this.getCodeBtn = false;
      }
    },
    showMsg (msg) {
      this.$msgBox({
        content: msg,
        isShowCancelBtn: false
      }).catch(() => {})
    },
    resetPsw (e) {
      e.preventDefault()
      if (!(/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(this.obj.mobile.trim()))) {
        this.showMsg('请输入正确格式的手机号码')
        return
      }
      if (this.obj.code.length !== 6) {
        this.showMsg('请输入正确的验证码')
        return
      }
      if (this.obj.newPassword.length < 6 || this.obj.newPassword.length > 16) {
        this.showMsg('请输入6-16位的登录密码,区分大小写,不可有空格')
        return
      }
      if (this.obj.newPassword !== this.obj.confirmPassword) {
        this.showMsg('两次输入密码不一致')
        return
      }
      this.obj.clientId = this.$store.state.clientData.id
      console.log(this.obj)
      updatePassword(this.obj).then(res => {
        let result = res.data
        if (result.code === 200) {
          this.$msgBox({
            content: '修改成功',
            isShowCancelBtn: false
          }).then(() => {
            this.$store.commit('SIGN_OUT')
            this.$router.push({name: 'login'})
          }).catch(() => {
            this.$store.commit('SIGN_OUT')
            this.$router.push({name: 'login'})
          })
        } else {
          this.$msgBox({
            content: result.msg,
            isShowCancelBtn: false
          }).catch(() => {})
        }
      }).catch(() => {
        this.showMsg('系统繁忙，请稍后重试')
      })
    }
  },
  mounted () {
    if (this.webInfo) {
      this.service = this.webInfo
    }
  },
  components: {
    YButton
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.register_page {
  .register {
    background: rgb(247, 247, 247);
    padding-bottom: 30px;
    .register_body {
      width: 900px;
      margin: 0 auto 30px;
    }
    .footer_text {
      text-align: center;
      font-size: 12px;
      color: #999;
      padding: 10px 0;
    }
    .register_header {
      height: 112px;
      padding-top: 30px;
      position: relative;
      .register_logo {
        position: absolute;
        top: 60px;
        img {
          height: 52px;
        }
      }
      p {
        font-size: 14px;
        text-align: right;
        height: 18px;
        line-height: 18px;
        margin-top: 48px;
        a {
          color: #0099FF;
          &:hover {
            text-decoration: none;
          }
        }
        span {
          display: inline-block;
          width: 1px;
          height: 18px;
          background: #333;
          position: relative;
          top: 4px;
          margin: 0 10px;
        }
      }
    }
    .register_content {
      border-radius: 8px;
      background: #fff;
      min-height: 600px;
      margin-top: 20px;
      .register_title {
        border-radius: 8px 8px 0 0;
        height: 80px;
        line-height: 80px;
        background: rgb(228, 228, 228);
        font-size: 18px;
        text-align: center;
        color: #333;
      }
    }
    .m_center {
      width: 390px;
      margin: 30px auto;
    }
  }
  .prn_icon {
    width: 16px;
    height: 16px;
    position: relative;
    top: 3px;
  }
  .form_group{
    width: 432px;
    margin: 20px auto 0;
    font-size: 14px;
    .label{
      text-align: right;
      float: left;
      display: block;
      width: 110px;
      line-height: 36px;
      color: #333;
    }
    .form_ctl{
      margin-left: 12px;
      float: left;
      position: relative;
      input {
        width: 250px;
        height: 46px;
        padding-left: 10px;
        border-radius: 6px;
        font-size: 14px;
        margin-top: -5px;
        &.reset_yzm {
          width: 310px;
          padding-right: 110px;
        }
      }
      .submit_btn {
        width: 250px;
        background: rgb(213, 20, 35);
        border: none;
        color: #fff;
        cursor: pointer;
      }
      .yzm_btn {
        width: 100px;
        height: 46px;
        position: absolute;
        left: 150px;
        top: -5px;
        line-height: 48px;
        background: rgb(213, 20, 35);
        border-radius: 0 6px 6px 0;
        text-align: center;
        color: #fff;
        cursor: pointer;
        border: none;
        &:disabled {
          background: rgb(204, 204, 204);
        }
      }
      .err {
        color: rgb(213, 20, 35);
      }
    }
    .text{
      color: #333;
      line-height: 36px;
    }
    &:after{
      content: '';
      display: block;
      clear: both;
    }
  }
}
</style>
