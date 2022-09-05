<template>
  <div class="applymsg_page">
    <div class="register">
      <div class="register_body">
        <div class="register_header">
          <div class="register_logo">
            <nuxt-link :to="{name: 'index'}">
              <img v-if="webInfo && webInfo.logoImg" :src="webInfo.logoImg" alt="">
            </nuxt-link>
          </div>
        </div>
        <div class="register_content">
          <div class="register_title">{{ applyTitle }}</div>
          <div class="steps">
            <span class="step" :class="{step_ok: step1}">签订协议</span>
            <span class="step" :class="{step_ok: step2}">填写资料</span>
            <span class="step" :class="{step_ok: step3}">审核</span>
          </div>
          <div v-if="tab === 1">
            <div class="step_info">
              <div class="clearfix" v-html="webInfo.entryAgreement">这里是协议内容</div>
            </div>
            <footer class="info_footer">
              <input id="isRead" v-model="isRead" type="checkbox">
              <label for="isRead">
                我已阅读并同意此协议
              </label>
              <span class="c_red">（温馨提示：阅读整个协议，才能进行下一步。）</span>
            </footer>
            <div>
              <button class="next_btn" @click="goNext()">下一步</button>
            </div>
          </div>
          <div v-show="tab === 2">
            <div class="form_group">
              <div class="label">名称:</div>
              <div class="form_ctl">
                <input v-model="obj.lecturerName" type="text" placeholder="请输入讲师名称">
                <p v-show="errTip2" class="err">{{ errTip2 }}</p>
              </div>
            </div>
            <div class="form_group">
              <div class="label">邮箱:</div>
              <div class="form_ctl">
                <input v-model="obj.email" type="text" name="email" placeholder="请输入邮箱" @change="enter">
                <p v-show="errTip4" class="err">{{ errTip4 }}</p>
              </div>
            </div>
            <div class="form_group">
              <div class="label">简介:</div>
              <div class="form_ctl">
                <div id="lecturerInfo" />
              </div>
            </div>
            <hr>
            <div class="form_group">
              <div class="label">手机号:</div>
              <div class="form_ctl">
                <input v-model="obj.mobile" type="text" maxlength="11" placeholder="请输入注册手机号">
                <p v-show="errTip0" class="err">{{ errTip0 }}</p>
              </div>
            </div>
            <div class="form_group">
              <div class="label">验证码:</div>
              <div class="form_ctl">
                <input v-model="obj.code" type="text" maxlength="6" name="code" placeholder="请输入手机验证码" @change="enter">
                <y-button :mobile="obj.mobile" @cb="submitBtn = true" />
                <p v-show="errTip1" class="err">{{ errTip1 }}</p>
              </div>
            </div>
            <div class="form_group">
              <div class="label">密码:</div>
              <div class="form_ctl">
                <input v-model="obj.passwd" type="password" name="pwd" placeholder="请输入密码" @change="enter">
                <p v-show="errTip6" class="err">{{ errTip6 }}</p>
              </div>
            </div>
            <div v-if="sendCode" class="form_group">
              <div class="label">确认密码:</div>
              <div class="form_ctl">
                <input v-model="obj.rePasswd" type="password" name="repwd" placeholder="请再次输入秘密" @change="enter">
                <p v-show="errTip5" class="err">{{ errTip5 }}</p>
              </div>
            </div>
            <div v-if="isReferralCode" class="form_group">
              <div class="label">推荐码:</div>
              <div class="form_ctl">
                <input v-model="obj.referralCode" type="text" maxlength="6" placeholder="请输入推荐码">
                <p v-show="errTip7" class="err">{{ errTip7 }}</p>
              </div>
            </div>
            <div>
              <a href="javascript:" class="next_btn" @click="isSubmit">提交审核</a>
            </div>
          </div>
          <div v-if="tab === 3">
            <div class="success_msg">
              <i class="iconfont">&#xe69f;</i>
              <p class="success_one">资料提交成功！</p>
              <p class="success_two">审核结果将在2个工作日内完成，请留意。！</p>
            </div>
            <div>
              <a href="javascript:" class="next_btn" @click="goIndex">返回首页</a>
            </div>
          </div>
        </div>
      </div>
      <p class="foot_text">
        <span v-html="webInfo.copyright" />
      </p>
      <p class="foot_text">
        <a href="http://www.doityun.com/" target="_blank" class="lingke_link">IT云提供计算服务</a>
        <span v-if="webInfo.icp">&nbsp;|&nbsp;</span>
        <a href="http://www.miitbeian.gov.cn/" class="lingke_link" target="_blank">{{ webInfo.icp }}</a>
        <span v-if="webInfo.prn">&nbsp;|&nbsp;</span>
        <a v-if="webInfo.prn" :href="'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=' + webInfo.prnNo" target="_blank" class="lingke_link"><img src="../assets/image/prn_icon.png" class="prn_icon" alt="">&nbsp;{{ webInfo.prn }}</a>
      </p>
    </div>
  </div>
</template>
<script>
import YButton from '~/components/common/CodeButton'
import { teacherEnter } from '~/api/user.js'
import { uploadPic } from '~/api/upload.js'
import { myHttp } from '~/utils/myhttp.js'
export default {
  components: {
    YButton
  },
  async asyncData(context) {
    const dataObj = {}
    const clientNo = context.store.state.clientData.no
    const applyType = context.query.apply
    let recruitType = ''
    let applyTitle = ''
    try {
      if (applyType === '1') {
        recruitType = 1
        applyTitle = '申请成为讲师'
      }
      dataObj.clientNo = clientNo
      dataObj.applyType = applyType
      dataObj.recruitType = recruitType
      dataObj.applyTitle = applyTitle
      return dataObj
    } catch (e) {
      context.error({ message: 'User not found', statusCode: 404 })
    }
  },
  data() {
    return {
      clientData: this.$store.state.clientData,
      webInfo: this.$store.state.webInfo,
      userInfo: this.$store.state.userInfo,
      recruitType: 1,
      applyType: '',
      applyTitle: '',
      submitBtn: false,
      errTip0: '',
      errTip1: '',
      errTip2: '',
      errTip3: '',
      errTip4: '',
      errTip5: '',
      errTip6: '',
      errTip7: '',
      gradeList: [],
      subjectList: [],
      gradeNoList: [],
      subjectNoList: [],
      isReferralCode: false,
      sendCode: false,
      obj: {
        lecturerName: '',
        mobile: '',
        headImgUrl: '',
        code: '',
        orgNo: '',
        email: '',
        userNo: '',
        uno: '',
        passwd: '',
        rePasswd: '',
        addr: '',
        referralCode: ''
      },
      isRead: false,
      step1: true,
      step2: false,
      step3: false,
      tab: 1
    }
  },
  head() {
    return {
      title: this.applyTitle,
      meta: [
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.$store.state.webInfo.websiteKeyword
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$store.state.webInfo.websiteDesc
        }
      ]
    }
  },
  mounted() {
    const E = require('wangeditor')
    this.editor2 = new E('#lecturerInfo')
    this.editor2.customConfig.uploadImgMaxLength = 1
    this.editor2.customConfig.customUploadImg = this.editorUpload
    this.editor2.create()
  },
  methods: {
    setUrl(res) {
      this.obj.headImgUrl = res.url
    },
    enter(e) {
      const name = e.target.name
      if (name === 'code') {
        if (this.obj.code.length !== 6) {
          this.errTip1 = '请输入正确的手机验证码'
          return false
        } else {
          this.errTip1 = false
        }
      }
      if (name === 'email') {
        if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/).test(this.obj.email)) {
          this.errTip4 = '请输入正确的邮箱'
          return false
        } else {
          this.errTip4 = ''
        }
      }
      if (name === 'pwd') {
        if (this.obj.passwd.length < 6) {
          this.errTip6 = '密码长度不能小于6位数'
          return false
        } else {
          this.errTip6 = ''
        }
      }
      if (name === 'repwd') {
        if (this.obj.rePasswd !== this.obj.passwd) {
          this.errTip5 = '两次密码不一致'
          return false
        } else {
          this.errTip5 = ''
        }
      }
    },
    goNext() {
      if (!this.isRead) {
        this.$msgBox({
          content: '请先阅读协议',
          isShowCancelBtn: false
        })
        return
      }
      this.step2 = true
      this.tab = 2
    },
    isSubmit() {
      if (!(/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(this.obj.mobile.trim())) || this.obj.mobile.trim().length !== 11) {
        this.errTip0 = '请输入正确手机号码'
        return
      } else {
        this.errTip0 = ''
      }
      if (!this.obj.code) {
        this.errTip1 = '请输入手机验证码'
        return
      } else {
        this.errTip1 = ''
      }
      if (!this.obj.lecturerName) {
        this.errTip2 = '请输入昵称'
        return
      } else {
        this.errTip2 = ''
      }
      if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/).test(this.obj.email)) {
        this.errTip4 = '请输入正确的邮箱'
        return false
      }
      if (!this.obj.referralCode && this.isReferralCode) {
        this.errTip7 = '请输入推荐码'
        return
      } else {
        this.errTip7 = ''
      }
      if (!this.obj.passwd) {
        this.$msgBox({
          content: '请输入密码',
          isShowCancelBtn: false
        })
        return
      }
      if (this.obj.passwd.length < 6) {
        this.$msgBox({
          content: '密码长度不能小于6位数',
          isShowCancelBtn: false
        })
        return
      }
      if (this.applyType === '1' && this.sendCode) {
        if (!this.obj.rePasswd) {
          this.$msgBox({
            content: '请确认密码',
            isShowCancelBtn: false
          })
          return
        }
        if (this.obj.rePasswd !== this.obj.passwd) {
          this.$msgBox({
            content: '两次密码不一致',
            isShowCancelBtn: false
          })
          return
        }
      } else if (this.applyType === '2') {
        if (!this.obj.rePasswd) {
          this.$msgBox({
            content: '请确认密码',
            isShowCancelBtn: false
          })
          return
        }
        if (this.obj.rePasswd !== this.obj.passwd) {
          this.$msgBox({
            content: '两次密码不一致',
            isShowCancelBtn: false
          })
          return
        }
      }
      const ht = this.editor2.txt.html()
      this.obj.introduce = ht
      const headImgUrl = this.obj.headImgUrl
      const introduce = ht
      const lecturerName = this.obj.lecturerName
      const lecturerMobile = this.obj.mobile
      const lecturerEmail = this.obj.email
      const mobilePsw = this.obj.passwd
      const repassword = this.obj.rePasswd
      const referralCode = this.obj.referralCode
      const code = this.obj.code
      const grade = this.gradeNoList.join(',')
      const subject = this.subjectNoList.join(',')
      const newObj = {
        headImgUrl,
        introduce,
        lecturerName,
        lecturerMobile,
        lecturerEmail,
        grade,
        subject,
        mobilePsw,
        repassword,
        referralCode,
        code,
        clientId: this.$store.state.clientData.id
      }
      myHttp.call(this, {
        method: teacherEnter,
        params: newObj
      }).then(res => {
        this.step3 = true
        this.tab = 3
      })
    },
    goIndex() {
      this.tab = 1
      this.step2 = false
      this.step3 = false
      this.$router.push({ name: 'index' })
    },
    goLogin() {
      this.$router.push({ path: '/login' })
    },
    // 编辑器上传图片
    editorUpload(files, insert) {
      const file = files[0]
      const param = new FormData()
      param.append('picFile', file, file.name)
      this.$nuxt.$loading.start()
      uploadPic(param, function(int) {
      }).then(res => {
        this.$nuxt.$loading.finish()
        if (res.code === 200) {
          const imgUrl = res.data
          insert(imgUrl)
        } else {
          this.$msgBox({
            content: res.msg,
            isShowCancelBtn: false
          })
        }
      }).catch(() => {
        this.$msgBox({
          content: '上传图片出错，请稍后重试',
          isShowCancelBtn: false
        })
      })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
  hr {
    margin-bottom: 30px;
  }
  .applymsg_page {
    .register {
    background: rgb(247, 247, 247);
    padding-bottom: 30px;
    .register_body {
      width: 900px;
      margin: 0 auto 30px;
    }
    .foot_text, .text_p {
      text-align: center;
      font-size: 12px;
      color: #999;
      padding: 10px 0;
    }
  }
  .register_header {
    height: 112px;
    // padding-top: 30px;
    position: relative;
    .register_logo {
      position: absolute;
      top: 30px;
      img {
        width: 186px;
        height: 52px;
      }
    }
    .text_p {
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
    padding-bottom: 30px;
    min-height: 600px;
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
  .steps {
    width: 840px;
    margin: 0 auto;
    .step {
      display: inline-block;
      line-height: 30px;
      color: #999;
      font-size: 13px;
      width: 270px;
      margin: 30px 1px;
      background: rgba(242, 242, 242, 1);
      text-align: center;
      &.step_ok {
        background: rgba(0, 153, 255, 1);
        color: #fff;
      }
    }
  }
  .step_info {
    width: 798px;
    padding: 20px;
    border: 1px solid rgb(228, 228, 228);
    margin: 0 auto;
    .info_title {
      font-size: 16px;
      font-weight: 700;
      color: #333;
      text-align: center;
    }
    .text_p {
      font-size: 14px;
      text-align: left;
      color: #333;
    }
  }
  .info_footer {
    width: 798px;
    line-height: 30px;
    padding: 0 20px;
    margin: 0 auto;
    font-size: 14px;
    border: 1px solid rgb(228, 228, 228);
  }
  .next_btn {
    display: inline-block;
    width: 320px;
    line-height: 46px;
    color: #fff;
    font-size: 14px;
    text-align: center;
    background: rgba(213, 20, 35, 1);
    border-radius: 6px;
    position: relative;
    left: 50%;
    margin-left: -160px;
    margin-top: 30px;
    border: none;
    &:hover {
      color: #fff;
      text-decoration: none;
    }
    &.b_dis {
      background: #ccc;
    }
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
        .photo_text {
          width: 176px;
          position: absolute;
          top: 15px;
          left: 116px;
          font-size: 12px;
          color: #999;
        }
        input {
          width: 310px;
          height: 46px;
          padding-left: 10px;
          border-radius: 6px;
          font-size: 14px;
          margin-top: -5px;
          &.reset_yzm {
            width: 200px;
            padding-right: 110px;
          }
          &.check_item {
            width: 14px;
            height: 14px;
            position: relative;
            top: 3px;
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
            background: #999;
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
    .no_phone {
      width: 96px;
      height: 96px;
      background: rgb(242, 242, 242);
      border-radius: 6px;
      position: relative;
      text-align: center;
      line-height: 80px;
      font-weight: 700;
      color: #999;
      font-size: 20px;
      span {
        font-size: 12px;
        position: absolute;
        text-align: center;
        width: 96px;
        top: 20px;
        left: 0;
        font-weight: 400;
      }
    }
    .success_msg {
      width: 380px;
      margin: 0 auto;
      position: relative;
      i {
       color: green;
       font-size: 70px;
      }
      p {
        position: absolute;
        left: 90px;
        &.success_one {
          font-size: 20px;
          color: #333;
          top: 0
        }
        &.success_two {
          color: #999;
          font-size: 14px;
          top: 44px;
          padding: 0;
          text-align: left;
        }
      }
    }
    .err{
      color: red;
      padding-top: 5px;
    }
    .user_photo {
      width: 96px;
      height: 96px;
    }
    .select_box {
      height: 80px;
      width: 146px;
      margin: -5px 3px 0 0;
    }
    .text_box {
      font-size: 14px;
      color: #000;
      padding: 10px;
      border-radius: 6px;
      resize: none;
    }
    .checks {
      display: inline-block;
      margin-left: 10px;
      &:first-child {
        margin-left: 0;
      }
    }
    .prn_icon {
      width: 16px;
      height: 16px;
      position: relative;
      top: 3px;
    }
  }
</style>
