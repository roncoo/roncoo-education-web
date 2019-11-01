<template>
  <div class="bind_card">
    <ul class="tabs clearfix">
      <span class="tab on">银行卡信息</span>
    </ul>
    <div class="main_cont form">
      <div class="form_group">
        <div class="label">银行卡号:</div>
        <div class="form_ctl">
          <input class="form_input" type="number" placeholder="请输入银行卡号" v-model="obj.bankCardNo">
        </div>
      </div>
      <div class="form_group">
        <div class="label">开户人:</div>
        <div class="form_ctl">
          <input class="form_input" type="text" placeholder="请输入开户人姓名" v-model="obj.bankUserName">
        </div>
      </div>
      <div class="form_group">
        <div class="label">开户行:</div>
        <div class="form_ctl">
          <input class="form_input" type="text" placeholder="请输入开户行" v-model="obj.bankName">
        </div>
      </div>
      <div class="form_group">
        <div class="label">开户支行:</div>
        <div class="form_ctl">
          <input class="form_input" type="text" placeholder="请输入开户支行" v-model="obj.bankBranchName">
        </div>
      </div>
      <div class="form_group">
        <div class="label">身份证号:</div>
        <div class="form_ctl">
          <input class="form_input" type="text" placeholder="请输入身份证号" v-model="obj.bankIdCardNo">
        </div>
      </div>
      <div class="form_group">
        <div class="label">关联手机号:</div>
        <div class="form_ctl">
          <input class="form_input" type="text" placeholder="请输入关联手机号" v-model="obj.mobile">
        </div>
      </div>
      <div class="form_group">
        <div class="label">验证码:</div>
        <div class="form_ctl">
          <input class="form_input" type="text" maxlength="6" placeholder="请输入验证码" v-model="obj.smsCode">
          <y-button :mobile="obj.mobile" />
        </div>
      </div>
      <div class="form_group">
        <div class="label">&nbsp;</div>
        <div class="form_ctl">
          <input type="button" class="submit_btn" @click="startBind" value="确认">
        </div>
      </div>
      <div class="form_group">
        <div class="label">&nbsp;</div>
        <div class="form_ctl">
          <input type="button" @click="closeBind" class="submit_btn close_btn" value="取消">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {bindCard} from '~/api/account/user.js'
  import YButton from '~/components/common/CodeButton'
  import {myHttp} from '~/utils/myhttp.js'
  export default {
    components: {
      YButton
    },
    data () {
      return {
        obj: {
          bankBranchName: '',
          bankCardNo: '',
          bankIdCardNo: '',
          bankName: '',
          bankUserName: '',
          lecturerUserNo: '',
          mobile: '',
          smsCode: ''
        }
      }
    },
    methods: {
      closeBind () {
        this.$emit('closeBind')
      },
      showMsg (msg) {
        this.$msgBox({
          content: msg,
          isShowCancelBtn: false
        }).catch(() => {})
      },
      startBind () {
        if (!this.obj.bankBranchName) {
          this.showMsg('开户支行不能为空')
          return
        }
        if (!this.obj.bankCardNo) {
          this.showMsg('银行卡号不能为空')
          return
        }
        if (!this.obj.bankIdCardNo) {
          this.showMsg('身份证号不能为空')
          return
        }
        if (!this.obj.bankName) {
          this.showMsg('开户行不能为空')
          return
        }
        if (!this.obj.bankUserName) {
          this.showMsg('开户人不能为空')
          return
        }
        if (!/^1[3|4|5|8|7][0-9]\d{8}$/.test(parseInt(this.obj.mobile))) {
          this.showMsg('请输入正确的手机')
          return
        }
        if (this.obj.smsCode.length != 6) {
          this.showMsg('请输入正确的验证码')
          return
        }
        this.obj.lecturerUserNo = this.$store.state.userInfo.userNo
        this.obj.clientId = this.$store.state.clientData.id
        myHttp.call(this, {
          method: bindCard,
          params: this.obj
        }).then(res => {
          this.$msgBox({
            content: '绑定成功',
            isShowCancelBtn: false
          }).then(() => {
            window.location.reload()
          }).catch(() => {
            window.location.reload()
          })
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .bind_card {
    margin-top: 30px;
    background: #fff;
    border-radius: 8px;
    padding-bottom: 20px;
    .close_btn {
      background: #fff;
      border-color: #999;
      color: #999;
    }
  }
</style>