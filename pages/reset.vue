<template>
  <div class="register_page">
    <div class="register">
      <div class="register_body">
        <div class="register_header">
          <div class="register_logo">
            <nuxt-link :to="{name: 'index'}">
              <img v-if="websiteInfo && websiteInfo.websiteLogo" :src="websiteInfo.websiteLogo" alt="">
            </nuxt-link>
          </div>
          <p>
            已有账号，
            <nuxt-link :to="{name: 'login'}">立即登陆</nuxt-link>
            <span />
            <nuxt-link :to="{name: 'index'}">返回首页</nuxt-link>
          </p>
        </div>
        <div class="register_content">
          <div class="register_title">修改密码</div>
          <form action="" @submit="resetPsw">
            <div class="form_group">
              <div class="label">手机号:</div>
              <div class="form_ctl">
                <input v-model="obj.mobile" type="text" maxlength="11" @change="enterPhone">
                <p v-show="errTip0" class="err">{{ errTip0 }}</p>
              </div>
            </div>
            <div class="form_group">
              <div class="label">验证码:</div>
              <div class="form_ctl">
                <input v-model="obj.code" type="text" maxlength="6" name="code" @change="enter">
                <y-button :mobile="obj.mobile" />
                <p v-show="errTip1" class="err">{{ errTip1 }}</p>
              </div>
            </div>
            <div class="form_group">
              <div class="label">新密码:</div>
              <div class="form_ctl">
                <input v-model="obj.mobilePwd" type="password" name="mobilePwd" @change="enter">
                <p v-show="errTip2" class="err">{{ errTip2 }}</p>
              </div>
            </div>
            <div class="form_group">
              <div class="label">重复密码:</div>
              <div class="form_ctl">
                <input v-model="obj.repassword" type="password" name="repassword" @change="enter">
                <p v-show="errTip3" class="err">{{ errTip3 }}</p>
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
      <!-- <y-bottom /> -->
    </div>
  </div>
</template>
<script>
import YButton from '@/components/common/Code'
// import YBottom from '@/components/common/Bottom'
import { updatePassword } from '~/api/login.js'

export default {
  components: {
    YButton
    // YBottom
  },
  data() {
    return {
      errTip0: '',
      errTip1: '',
      errTip2: '',
      errTip3: '',
      obj: {
        mobile: '',
        code: '',
        mobilePwd: '',
        repassword: ''
      },
      websiteInfo: this.$store.state.websiteInfo
    }
  },
  head() {
    return {
      title: '修改密码-' + this.websiteInfo.websiteName
    }
  },
  mounted() {

  },
  methods: {
    goLogin() {
      this.$router.push({ path: '/login' })
    },
    // 输入内容
    enter(e) {
      const name = e.target.name
      if (name === 'code') {
        if (this.obj.code.length !== 6) {
          this.errTip1 = '请输入正确的手机验证码'
          return false
        } else {
          this.errTip1 = false
        }
      } else if (name === 'mobilePwd') {
        if (this.obj.mobilePwd.length < 6 || this.obj.mobilePwd.length > 16) {
          this.errTip2 = '请输入6-16位的登录密码,区分大小写,不可有空格'
          return false
        } else {
          this.errTip2 = false
        }
      } else if (name === 'repassword') {
        if (this.obj.mobilePwd !== this.obj.repassword) {
          this.errTip3 = '两次输入密码不一致'
          return false
        } else {
          this.errTip3 = false
        }
      }
    },
    // 输入手机
    enterPhone() {
      if (this.obj.mobile.length === 11) {
        if ((/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(this.obj.mobile.trim()))) {
          this.errTip0 = false
          this.getCodeBtn = true
        } else {
          this.errTip0 = '请输入正确手机'
          this.getCodeBtn = false
        }
      } else {
        this.errTip0 = false
        this.getCodeBtn = false
      }
    },
    showMsg(msg) {
      this.$msgBox({
        content: msg,
        isShowCancelBtn: false
      }).catch(() => {
      })
    },
    resetPsw(e) {
      e.preventDefault()
      if (!(/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(this.obj.mobile.trim()))) {
        this.showMsg('请输入正确格式的手机号码')
        return
      }
      if (this.obj.code.length !== 6) {
        this.showMsg('请输入正确的验证码')
        return
      }
      if (this.obj.mobilePwd.length < 6 || this.obj.mobilePwd.length > 16) {
        this.showMsg('请输入6-16位的登录密码,区分大小写,不可有空格')
        return
      }
      if (this.obj.mobilePwd !== this.obj.repassword) {
        this.showMsg('两次输入密码不一致')
        return
      }
      updatePassword(this.obj).then(res => {
        this.$msgBox({
          content: '修改成功，请重新登录',
          isShowCancelBtn: false
        }).then(() => {
          this.$store.commit('SIGN_OUT')
          this.$router.push({ name: 'login' })
        }).catch(() => {
          this.$store.commit('SIGN_OUT')
          this.$router.push({ name: 'login' })
        })
      })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.register_page {
  .register {
    background: rgb(247, 247, 247);
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
      min-height: 500px;
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

  .form_group {
    width: 432px;
    margin: 20px auto 0;
    font-size: 14px;

    .label {
      text-align: right;
      float: left;
      display: block;
      width: 110px;
      line-height: 36px;
      color: #333;
    }

    .form_ctl {
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

    .text {
      color: #333;
      line-height: 36px;
    }

    &:after {
      content: '';
      display: block;
      clear: both;
    }
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
}
</style>
