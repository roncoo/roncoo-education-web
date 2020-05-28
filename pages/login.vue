<template>
  <div class="login_page">
    <y-header :hideTop="true" :hideSearch="true"></y-header>
    <div class="login_box clearfix">
      <div class="center_box">
        <div v-if="!(userInfo)" :class="{login_form: true, rotate: tab == 2}">
          <div :class="{tabs: true, clearfix: true, r180: tabp == 2}">
            <div class="fl tab" @click="changetab(1)">
              <span :class="{on: tab == 1}">登录</span>
            </div>
            <div class="fl tab" @click="changetab(2)">
              <span :class="{on: tab == 2}">注册</span>
            </div>
          </div>
          <div class="form_body" v-if="tabp == 1">
            <form action="" @submit="loginSubmit">
              <input type="text" v-model="obj.mobile" placeholder="请输入手机号或邮箱">
              <div class="error_msg">{{errTip1}}</div>
              <input type="password" v-model="obj.password" placeholder="6-20位密码，可用数字/字母/符号组合">
              <div class="error_msg">{{errTip2}}</div>
              <input type="submit" v-if="subState" disabled="disabled" value="登录中···" class="btn" />
              <input type="submit" v-else value="登录" class="btn" />
            </form>
            <input type="checkbox" class="check"><span class="next_auto">下次自动登录</span>
            <nuxt-link class="is_go" :to="{name: 'reset'}">忘记密码</nuxt-link>
          </div>
          <div class="form_body r180" v-if="tabp == 2">
            <form action="" @submit="regSubmit">
              <input type="text" v-model="pobj.mobile" placeholder="请输入手机号">
              <div class="phone_yzm">
                <input type="text" name="code" placeholder="请输入手机验证码" class="phone" v-model="pobj.code" maxlength="6">
                <y-button :mobile="pobj.mobile"></y-button>
              </div>
              <input type="password" v-model="pobj.password" placeholder="6-20位密码，可用数字/字母/符号组合">
              <input type="password" v-model="pobj.repassword" placeholder="确认密码">
              <div class="mgt20 font_14">
                <input type="checkbox" id="tonyi" v-model="pobj.check">
                <label for="tonyi">我已经阅读并同意</label><a href="jvascript:" class="c_blue" @click="xieyi = true">《用户协议》</a>
              </div>
              <input type="submit" v-if="subState" disabled="disabled" value="提交中···" class="btn">
              <input type="submit" v-else value="注册" class="btn">
            </form>
          </div>
        </div>
        <div class="login_form" v-else>
          <div class="login_title is_login">欢迎来到{{clientData.name}}</div>
          <div class="form_body">
            <div class="img_box">
              <img v-if="userInfo.headImgUrl" :src="userInfo.headImgUrl" alt="" />
              <img v-else src="../assets/image/friend.jpg" alt="" />
            </div>
            <p class="hellow_text">欢迎来到{{clientData.name}}</p>
            <ul class="btn_box clearfix">
              <li><nuxt-link :to="{name: 'account-teacher'}">用户中心</nuxt-link></li>
              <li><nuxt-link :to="{name: 'account-study'}">学习记录</nuxt-link></li>
              <li><nuxt-link :to="{name: 'account-order'}">我的订单</nuxt-link></li>
            </ul>
            <div>
              <a href="javascript:" @click="signOut" class="out_btn">退出登录</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="xieyi" v-if="xieyi" @click.self="xieyi = false">
      <div class="xieyi_content">
        <div class="xieyi_title">用户协议</div>
        <div class="xieyi_body" v-if="service && service.userAgreement" v-html="service.userAgreement">
        </div>
        <input type="button" class="xieyi_btn" value="确定" @click="xieyi = false">
      </div>
    </div>
    <div class="login_footer">
      <p>
        <span v-html="service.copyright"></span>
      </p>
      <p>
        <a href="http://www.doityun.com/" target="_blank" class="lingke_link">IT云提供计算服务</a>
        <span v-if="service.icp">&nbsp;|&nbsp;</span>
        <a href="http://www.miitbeian.gov.cn/" class="lingke_link" target="_blank">{{service.icp}}</a>
        <span v-if="service.prn">&nbsp;|&nbsp;</span>
        <a :href="'http://www.beian.gov.cn/portal/index'" target="_blank" v-if="service.prn" class="lingke_link"><img src="../assets/image/prn_icon.png" class="prn_icon" alt="">&nbsp;{{service.prn}}</a>
      </p>
    </div>
  </div>
</template>
<script>
  import YHeader from '~/components/common/Header'
  import YButton from '~/components/common/CodeButton'
  import {userLogin, getUserInfo, register} from '~/api/user.js'
export default {
    head () {
      return {
        title: this.clientData.name + '-用户登录',
        meta: [
            {
                hid: 'keywords',
                name: 'keywords',
                content: this.webInfo.websiteKeyword
            },
            {
                hid: 'description',
                name: 'description',
                content: this.webInfo.websiteDesc
            }
        ]
      }
  },
  data () {
    return {
      tab: this.$route.query.tab || 1,
      tabp: this.$route.query.tab || 1,
      webInfo: this.$store.state.webInfo,
      clientData: this.$store.state.clientData,
      subState: false, //提交状态
      xieyi: false,
      service: {},
      errTip1: '',
      errTip2: '',
      userInfo: this.$store.state.userInfo,
      ipInfo: {},
      obj: {
        agent: '登录',
        clientId: this.$store.state.clientData.id,
        cookie: 'cookie',
        ip: '127.0.0.0',
        mobile: '',
        password: ''
      },
      pobj: {
        mobile: '',
        code: '',
        password: '',
        repassword: '',
        check: false
      }
    }
  },
  async asyncData(context) {
    let clientNo = context.store.state.clientData.no;
    let webInfo = context.store.state.webInfo;
    // console.log(webInfo)
    try {
      // 站点信息
      if (!webInfo) {
      }
      return '{webInfo: webInfo}'
    } catch (e) {
      context.error({ message: 'User not found', statusCode: 404 })
    }
  },
  methods: {
    // ...mapMutations(['RECORD_TOKEN', 'INIT_USERINFO', 'SIGN_OUT', 'RECORD_USERINFO', 'GET_TEMPORARYURL']),
    signOut () {
      // this.SIGN_OUT();
      this.$store.commit('SIGN_OUT');
      this.userInfo = '';
    },
    changetab (int) {
      this.tab = int;
      let _that = this;
      setTimeout(function(){
        _that.tabp = int
      },200)
    },
    loginSubmit (e) {
      e.preventDefault();
      if (this.subState) {
        return false;
      }
      this.errTip1 = '';
      this.errTip2 = '';
      if (!(/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(this.obj.mobile.trim())) && !(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/).test(this.obj.mobile.trim())) {
        this.errTip1 = '请输入正确手机号或者邮箱';
        return false;
      }
      if (this.obj.password.length < 6) {
        this.errTip2 = '请输入正确的账号或密码';
        return false;
      }
      this.obj.clientId = this.clientData.id;
      this.obj.city = this.ipInfo.city
      this.obj.province = this.ipInfo.pro
      this.obj.loginIp = this.ipInfo.ip
      this.obj.os = this.getOsInfo().version
      this.obj.browser = this.getBrowserInfo().name + this.getBrowserInfo().version
      this.$nuxt.$loading.start();
      this.subState = true;
      userLogin(this.obj).then(res => {
        this.subState = false;
        this.$nuxt.$loading.finish();
        if (res.data.code === 200) {
          this.$store.commit('SET_TOKEN', res.data.data.token);
          this.$store.commit('GET_TEMPORARYURL');
          this.$store.dispatch('GET_USERINFO',store=>{
            this.userInfo = this.$store.state.userInfo;
            window.location.href = this.$store.state.temporaryUrl;
          });
        } else {
          this.errTip2 = res.data.msg;
        }
      }).catch(() => {
        this.subState = false;
        this.$nuxt.$loading.finish();
        this.$msgBox({
          content: '登录失败,请稍后再试',
          isShowCancelBtn: false
        }).catch(() => {})
      })
      return false;
    },
    getBrowserInfo: function () {
      /* eslint-disable */
      const Sys = {};
      const ua = navigator.userAgent.toLowerCase();
      let s;
      (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1]
        : (s = ua.match(/msie ([\d]+)/)) ? Sys.ie = s[1]
        : (s = ua.match(/edge\/([\d]+)/)) ? Sys.edge = s[1]
          : (s = ua.match(/firefox\/([\d]+)/)) ? Sys.firefox = s[1]
            : (s = ua.match(/(?:opera|opr).([\d]+)/)) ? Sys.opera = s[1] :
              (s = ua.match(/chrome\/([\d]+)/)) ? Sys.chrome = s[1] :
                (s = ua.match(/version\/([\d]+).*safari/)) ? Sys.safari = s[1] : 0;
      // 根据关系进行判断
      if (Sys.ie) return { name: 'IE', version: Sys.ie };
      if (Sys.edge) return { name: 'EDGE:', version: Sys.edge };
      if (Sys.firefox) return { name: 'Firefox:', version: Sys.firefox };
      if (Sys.chrome) return { name: 'Chrome:', version: Sys.chrome };
      if (Sys.opera) return { name: 'Opera:', version: Sys.opera };
      if (Sys.safari) return { name: 'Safari:', version: Sys.safari };
      return { name: 'Unkonwn', version: '0.0.0' };
    },
    // 获取系统信息
    getOsInfo: function () {
      const userAgent = navigator.userAgent.toLowerCase();
      let name = 'Unknown';
      let version = 'Unknown';
      if (userAgent.indexOf('win') > -1) {
        name = 'Windows';
        if (userAgent.indexOf('windows nt 5.0') > -1) {
          version = 'Windows 2000';
        } else if (userAgent.indexOf('windows nt 5.1') > -1 || userAgent.indexOf('windows nt 5.2') > -1) {
          version = 'Windows XP';
        } else if (userAgent.indexOf('windows nt 6.0') > -1) {
          version = 'Windows Vista';
        } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
          version = 'Windows 7';
        } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
          version = 'Windows 8';
        } else if (userAgent.indexOf('windows nt 6.3') > -1) {
          version = 'Windows 8.1';
        } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows nt 10.0') > -1) {
          version = 'Windows 10';
        } else {
          version = 'Unknown';
        }
      } else if (userAgent.indexOf('iphone') > -1) {
        name = 'Iphone';
      } else if (userAgent.indexOf('mac') > -1) {
        name = 'Mac';
      } else if (userAgent.indexOf('x11') > -1 || userAgent.indexOf('unix') > -1 || userAgent.indexOf('sunname') > -1 || userAgent.indexOf('bsd') > -1) {
        name = 'Unix';
      } else if (userAgent.indexOf('linux') > -1) {
        if (userAgent.indexOf('android') > -1) {
          name = 'Android';
        } else {
          name = 'Linux';
        }
      } else {
        name = 'Unknown';
      }
      return { name, version };
    },
    // 注册
    regSubmit: function (e) {
      e.preventDefault();
      if (this.subState) {
        return false;
      }
      if (!(/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(this.pobj.mobile.trim())) || this.pobj.mobile.trim().length !== 11) {
        this.$msgBox({
          content: '请输入正确手机',
          isShowCancelBtn: false
        }).catch(() => {})
        return false;
      }
      if (!this.pobj.code || this.pobj.code.length !== 6) {
        this.$msgBox({
          content: '请输入正确的手机验证码',
          isShowCancelBtn: false
        }).catch(() => {})
        return false;
      }
      if (this.pobj.password.length < 6 || this.pobj.password.length > 16) {
        this.$msgBox({
          content: '请输入6-16位的登录密码,区分大小写,不可有空格',
          isShowCancelBtn: false
        }).catch(() => {})
        return false;
      }
      if (this.pobj.password !== this.pobj.repassword) {
        this.$msgBox({
          content: '两次输入密码不一致',
          isShowCancelBtn: false
        }).catch(() => {})
        return false;
      }
      if (!this.pobj.check) {
        this.$msgBox({
          content: '请先阅读并同意用户协议',
          isShowCancelBtn: false
        }).catch(() => {})
        return false;
      }
      // console.log(this.clientData)
      this.pobj.agent = '12';
      this.pobj.clientId = this.clientData.id;
      this.pobj.cookie = '12';
      this.pobj.ip = '12';
      // console.log(this.pobj)
      this.$nuxt.$loading.start();
      this.subState = true;
      register(this.pobj).then(res => {
        this.$nuxt.$loading.finish();
        this.subState = false;
        if (res.data.code === 200) {
          this.$msgBox({
            content: '注册成功！',
            confirmBtnText: '立即登录',
            isShowCancelBtn: false
          }).then(() => {
            this.changetab(1)
          }).catch(() => {
            this.changetab(1)
          })
          this.pobj = {
            mobile: '',
            code: '',
            password: '',
            repassword: '',
            check: false
          }
        } else {
          this.$msgBox({
            content: res.data.msg,
            isShowCancelBtn: false
          }).catch(() => {})
        }
      }).catch(() => {
        this.$nuxt.$loading.finish();
        this.subState = false;
        this.$msgBox({
          content: '系统繁忙，请稍后重试',
          isShowCancelBtn: false
        }).catch(() => {})
      })
    }
  },
  mounted () {
    if (this.webInfo) {
      this.service = this.webInfo
    }
    this.$axios.get('http://gateway.doityun.com/ip/info').then(res => {
      this.ipInfo = res.data.data
    })
    // this.GET_TEMPORARYURL();
    this.obj.clientId = 1;
    if (this.$route.query.t === 'login') {
      this.$store.commit('SIGN_OUT');
      this.userInfo = '';
      this.errTip1 = '未登录或登录超时,请重新登录';

      // this.SIGN_OUT();
    } else if (this.$route.query.t) {
      window.location.href = this.clientData.mainUrl + '/index'
    }
  },
  components: {
    YHeader,
    YButton
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.login_page {
  .login_box {
    height: 600px;
    background: url(../assets/image/login_bg.jpg) no-repeat center center;
    .center_box {
      width: 1200px;
      margin: 0 auto;
      position: relative;
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
    position: absolute;
    top: 80px;
    right: 0px;
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
  .check {
    width: 14px;
    height: 14px;
    position: relative;
    top: -1px;
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
    padding-bottom: 20px;
    li {
      float: left;
      width: 140px;
      text-align: center;
      line-height: 30px;
      margin: 20px 10px 0;
      border-radius: 6px;
      a {
        display: block;
        background: rgb(245, 245, 245);
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
    border-radius: 8px 8px 0 0 ;
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
    z-index: 3;
    .xieyi_content {
      width: 900px;
      height: 500px;
      margin: 50px auto 0;
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
