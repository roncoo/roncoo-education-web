<template>
  <div>
    <y-header />
    <div class="container account_cont clearfix">
      <y-side :type="'xgmm'" />
      <div class="main_box">
        <ul class="tabs clearfix">
          <a class="tab on">修改密码</a>
        </ul>
        <div class="main_cont form">
          <form action="" @submit="regSubmit">
            <div class="form_group">
              <div class="label">手机号:</div>
              <div class="form_ctl">
                <input v-model="pobj.mobile" type="text" class="form_input" placeholder="请输入昵称" disabled="disabled">
              </div>
            </div>
            <div class="form_group">
              <div class="label">验证码:</div>
              <div class="form_ctl">
                <input v-model="pobj.code" type="text" maxlength="6" class="form_input" placeholder="请输入手机验证码">
                <y-button :mobile="pobj.mobile" @cb="submitBtn = true" />
              </div>
            </div>
            <div class="form_group">
              <div class="label">重置密码:</div>
              <div class="form_ctl">
                <input v-model="pobj.newPassword" type="password" class="form_input" placeholder="请输入密码">
              </div>
            </div>
            <div class="form_group">
              <div class="label">确定密码:</div>
              <div class="form_ctl">
                <input v-model="pobj.confirmPassword" type="password" class="form_input" placeholder="请再次输入新密码">
              </div>
            </div>
            <div class="form_group">
              <div class="label">&nbsp;</div>
              <div class="form_ctl">
                <button v-if="submitBtn" class="submit_btn">确认</button>
                <button v-else class="submit_btn" disabled="disabled">确认</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <y-footer />
  </div>
</template>
<script>
import YHeader from '~/components/common/Header'
import YFooter from '~/components/common/Footer'
import YSide from '~/components/account/Side'
import YButton from '~/components/common/CodeButton'
import { updatePassword } from '~/api/account/user.js'
export default {
  components: {
    YHeader,
    YFooter,
    YSide,
    YButton
  },
  data() {
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
  mounted() {
    this.pobj.mobile = this.$store.state.userInfo.mobile
  },
  methods: {
    showMsg(msg) {
      this.$msgBox({
        content: msg,
        isShowCancelBtn: false
      }).catch(() => {})
    },
    regSubmit: function(e) {
      e.preventDefault()
      if (!this.pobj.code) {
        this.showMsg('请输入手机验证码')
        return false
      }
      if (this.pobj.newPassword.length < 6 || this.pobj.newPassword.length > 16) {
        this.showMsg('请输入6-16位的登录密码,区分大小写,不可有空格')
        return false
      }
      if (this.pobj.newPassword !== this.pobj.confirmPassword) {
        this.showMsg('两次输入密码不一致')
        return false
      }
      this.pobj.clientId = this.$store.state.clientData.id
      updatePassword(this.pobj).then(res => {
        const result = res.data
        if (result.code === 200) {
          this.$msgBox({
            content: '修改成功',
            isShowCancelBtn: false
          }).then(async(val) => {
            this.$store.commit('SIGN_OUT')
            this.$router.push({ name: 'login' })
          }).catch(() => {
            this.$store.commit('SIGN_OUT')
            this.$router.push({ name: 'login' })
          })
        } else {
          if (result.code >= 300 && result.code < 400) {
            this.$msgBox({
              content: '登录异常，请重新登录',
              isShowCancelBtn: false
            }).then(() => {
              this.$store.dispatch('REDIRECT_LOGIN', result.code)
            }).catch(() => {
              this.$store.dispatch('REDIRECT_LOGIN', result.code)
            })
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
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import '~/assets/css/account.scss';
</style>
