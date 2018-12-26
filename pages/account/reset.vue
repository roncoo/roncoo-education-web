<template>
  <div>
    <y-header></y-header>
    <div class="person_body clearfix">
      <y-side :type="'xgmm'"></y-side>
      <div class="person_content">
        <ul class="person_title clearfix">
          <li>修改密码</li>
        </ul>
        <div class="person_info">
          <form action="" @submit="regSubmit">
            <div class="form_group">
              <div class="label">手机号:</div>
              <div class="form_ctl">
                <input type="text" v-model="pobj.mobile" disabled="disabled" maxlength="11" readonly="">
              </div>
            </div>
            <div class="form_group">
              <div class="label">验证码:</div>
              <div class="form_ctl">
                <input type="text" class="reset_yzm" name="code" v-model="pobj.code" placeholder="请输入手机验证码" maxlength="6" @change="enter">
                <y-button :mobile="pobj.mobile" @cb="submitBtn = true"></y-button>
                <p class="err" v-show="errTip1">{{errTip1}}</p>
              </div>
            </div>
            <div class="form_group">
              <div class="label">重置密码:</div>
              <div class="form_ctl">
                <input type="password" name="newPassword" placeholder="请输入新密码" @change="enter" v-model="pobj.newPassword">
                <p class="err" v-show="errTip2">{{errTip2}}</p>
              </div>
            </div>
            <div class="form_group">
              <div class="label">确定密码:</div>
              <div class="form_ctl">
                <input type="password" name="confirmPassword" placeholder="请再次输入新密码" @change="enter" v-model="pobj.confirmPassword">
                <p class="err" v-show="errTip3">{{errTip3}}</p>
              </div>
            </div>
            <div class="form_group">
              <div class="label">&nbsp;</div>
              <div class="form_ctl">
                <button class="submit_btn b_red"  v-if="submitBtn">确认</button>
                <button class="submit_btn" v-else disabled="disabled">确认</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <y-footer></y-footer>
  </div>
</template>
<script>
import YHeader from '~/components/common/Header'
import YFooter from '~/components/common/Footer'
import YSide from '~/components/account/Side'
import YButton from '~/components/common/CodeButton'
import {updatePassword} from '~/api/account/user.js'
export default {
  data () {
    return {
      submitBtn: false,
      errTip1: '',
      errTip2: '',
      errTip3: '',
      pobj: {
        mobile: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    enter (e) {
      let name = e.target.name;
      if (name === 'code') {
        if (this.pobj.code.length !== 6) {
          this.errTip1 = '请输入正确的手机验证码';
          return false;
        } else {
          this.errTip1 = false;
        }
      } else if (name === 'newPassword') {
        if (this.pobj.newPassword.length < 6 || this.pobj.newPassword.length > 16) {
          this.errTip2 = '请输入6-16位的登录密码,区分大小写,不可有空格';
          return false;
        } else {
          this.errTip2 = false;
        }
      } else if (name === 'confirmPassword') {
        if (this.pobj.newPassword !== this.pobj.confirmPassword) {
          this.errTip3 = '两次输入密码不一致';
          return false;
        } else {
          this.errTip3 = false;
        }
      }
    },
    regSubmit: function (e) {
      e.preventDefault();
      if (!(/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(this.pobj.mobile))) {
        this.errTip0 = '请输入正确手机验证码';
        return false;
      }
      if (!this.pobj.code) {
        this.errTip1 = '请输入手机验证码';
        return false;
      }
      if (this.pobj.newPassword.length < 6 || this.pobj.newPassword.length > 16) {
        this.errTip2 = '请输入6-16位的登录密码,区分大小写,不可有空格';
        return false;
      }
      if (this.pobj.newPassword !== this.pobj.confirmPassword) {
        this.errTip3 = '两次输入密码不一致';
        return false;
      }
      this.pobj.clientId = this.$store.state.clientData.id
      console.log(this.pobj)
      updatePassword(this.pobj).then(res => {
        let result = res.data
        if (result.code === 200) {
          this.$msgBox({
            content: '修改成功',
            isShowCancelBtn: false
          }).then(async (val) => {
            this.$store.commit('SIGN_OUT')
            this.$router.push({name: 'login'})
          }).catch(() => {
            this.$store.commit('SIGN_OUT')
            this.$router.push({name: 'login'})
          })
        } else {
          if (result.code >= 300 && result.code < 400) {
            this.$msgBox({
              content: '登录异常，请重新登录',
              isShowCancelBtn: false
            }).then(() => {
              this.$store.commit('SET_TEMPORARYURL')
              this.$store.commit('SIGN_OUT')
              this.$router.push({name: 'login'})
            }).catch(() => {})
          } else {
            this.$msgBox({
              content: result.msg,
              isShowCancelBtn: false
            }).catch(() => {})
          }
        }
      }).catch(msg => {
        this.$msgBox({
          content: '加载数据失败，请稍后刷新再试！！',
          isShowCancelBtn: false
        })
      })
    }
  },
  mounted () {
    this.pobj.mobile = this.$store.state.userInfo.mobile;
  },
  components: {
    YHeader,
    YFooter,
    YSide,
    YButton
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .person_body {
    width: 1200px;
    margin: 30px auto 0;
    min-height: 1000px;
  }
  .person_content {
    width: 1012px;
    float: right;
    background: #fff;
    border-radius: 6px;
  }
  .person_title {
    border-bottom: 1px solid rgb(242, 242, 242);
    li {
      color: #D51423;
      float: left;
      line-height: 60px;
      padding: 0 30px;
      border-bottom: 2px solid #D51423;
      font-size: 14px;
    }
  }
  .person_info {
    padding: 50px 0;
    min-height: 400px;
  }
  .form_group{
      margin-bottom: 20px;
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
        width: 700px;
        position: relative;
        input {
          width: 310px;
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
        .yzm_btn {
          width: 100px;
          height: 46px;
          position: absolute;
          left: 210px;
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
    .submit_btn{
      height: 46px;
      border: none;
      width: 320px;
      color: #fff;
      border-radius: 6px;
      cursor: pointer;
      background: #ccc;
      &.b_red {
        background-color: rgb(213, 20, 35);
      }
    }
    .err{
      color: red;
      padding-top: 5px;
    }
</style>
