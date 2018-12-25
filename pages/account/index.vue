<template>
  <div class="">
    <y-header></y-header>
    <div class="person_body clearfix">
      <y-side></y-side>
      <div class="person_content">
        <ul class="person_title clearfix">
          <li>基础信息</li>
        </ul>
        <div class="person_info" v-if="isLogin">
          <form action="" @submit="userEducationInfUpdate">
            <div class="form_group">
              <div class="label">用户名:</div>
              <div class="form_ctl">
                <div class="text">{{ obj.mobile }}</div>
              </div>
            </div>
            <div class="form_group">
              <div class="label">昵称:</div>
              <div class="form_ctl">
                <input type="text" v-model="obj.nickname" placeholder="请输入昵称">
                <p class="err" v-show="errTip1">{{errTip1}}</p>
              </div>
            </div>
            <div class="form_group">
              <div class="label">年龄:</div>
              <div class="form_ctl">
                <input type="text" v-model="obj.age" placeholder="请输入年龄">
              </div>
            </div>
            <div class="form_group">
              <div class="label">性别:</div>
              <div class="form_ctl">
                <input type="radio" v-model="obj.sex" class="radiobox" id="sex1" value="1" name="sex">
                <label for="sex1">男</label>
                <input type="radio" v-model="obj.sex" class="radiobox" id="sex2" value="2" name="sex">
                <label for="sex2">女</label>
                <input type="radio" v-model="obj.sex" class="radiobox" id="sex3" value="3" name="sex">
                <label for="sex3">保密</label>
              </div>
            </div>
            <div class="form_group">
              <div class="label">上传头像:</div>
              <div class="form_ctl">
                <div class="no_phone">
                  <img :src="obj.headImgUrl" alt="" v-if="obj.headImgUrl">
                  <img v-else src="../../assets/image/user_phone.png" alt="">
                </div>
                <p class="photo_text">* 图片尺寸为800px*800px，仅支持jpg、jpeg、png 格式，图片大小不超过2MB。</p>
              </div>
            </div>
            <div class="form_group">
              <div class="label">&nbsp;</div>
              <div class="form_ctl">
                <d-upload @rtnUrl="setUrl"></d-upload>
              </div>
            </div>
            <div class="form_group">
              <div class="label">&nbsp;</div>
              <div class="form_ctl">
                <button href="javascript:" class="submit_btn">保存</button>
              </div>
            </div>
          </form>
        </div>
        <div class="person_info" v-else>
          <div class="form_group">
            <div class="label">用户名:</div>
            <div class="form_ctl">
              <div class="text">{{ obj.mobile }}</div>
            </div>
          </div>
          <div class="form_group">
            <div class="label">昵称:</div>
            <div class="form_ctl">
              <div class="text">{{ obj.nickname }}</div>
            </div>
          </div>
          <div class="form_group">
            <div class="label">年龄:</div>
            <div class="form_ctl">
              <div class="text">{{ obj.age }}</div>
            </div>
          </div>
          <div class="form_group">
            <div class="label">性别:</div>
            <div class="form_ctl">
              <div class="text" v-if="obj.sex === 1">男</div>
              <div class="text" v-else-if="obj.sex === 2">女</div>
              <div class="text" v-else-if="obj.sex === 3">保密</div>
            </div>
          </div>
          <div class="form_group">
            <div class="label">用户头像:</div>
            <div class="form_ctl">
              <img :src="obj.headImgUrl" alt="" v-if="obj.headImgUrl">
              <img v-else src="../../assets/image/user_phone.png" alt="">
            </div>
          </div>
          <div class="form_group">
            <div class="label">&nbsp;</div>
            <div class="form_ctl">
              <button href="javascript:" class="submit_btn" @click="editInfo">修改</button>
            </div>
          </div>
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
import DUpload from '~/components/account/Upload'
import {getUserInfo} from '~/api/user.js'
import {updateUserEducationInf} from '~/api/account/user.js'
export default {
  data () {
    return {
      isLogin: false,
      region1: [],
      region2: [],
      errTip1: '',
      errTip2: '',
      obj: {
        id: '',
        province: '',
        city: '',
        mobile: '',
        nickname: '',
        sex: '',
        birthday: '',
        school: '',
        eduGrade: '',
        headImgUrl: '',
        orgNo: '',
        userNo: ''
      }
    }
  },
  methods: {
    getByUser () {
      getUserInfo().then(res => {
        let result = res.data
        console.log(result)
        if (result.code === 200) {
          this.obj = result.data || {}
        } else if (result.code > 300 && result.code < 400) {
          this.$msgBox({
            content: '登陆超时，请重新登陆',
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
          })
        }
      }).catch(msg => {
        this.$msgBox({
          content: '加载数据失败，请稍后刷新再试！！',
          isShowCancelBtn: false
        })
      })
    },
    editInfo () {
      this.isLogin = true;
    },
    userEducationInfUpdate (e) {
      e.preventDefault();
      if (!this.obj.nickname) {
        this.errTip1 = '请输入昵称';
        return false;
      } else {
        this.errTip1 = false;
      }
      this.id = this.obj.id;
      console.log(this.obj)
      updateUserEducationInf(this.obj).then(res => {
        console.log(res)
        let result = res.data
        if (result.code === 200) {
          this.$store.commit('SET_USER', result.data)
          this.$msgBox({
            content: '修改成功',
            isShowCancelBtn: false
          }).then(async (val) => {
            window.location.reload()
          }).catch(() => {
            window.location.reload()
          })
        } else {
          if (result.code >= 300 && result.code < 400) {
            this.$msgBox({
              content: '登陆超时，请重新登陆',
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
            }).then(async (val) => {
              window.location.reload()
            }).catch(() => {
              window.location.reload()
            })
          }
        }
      })
    },
    setUrl (res) {
      this.obj.headImgUrl = res.url;
    }
  },
  mounted () {
    this.getByUser()
  },
  components: {
    YHeader,
    YFooter,
    YSide,
    DUpload
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  // @import '../assets/css/common.scss';
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
        .photo_text {
          width: 176px;
          position: absolute;
          top: 15px;
          left: 116px;
          font-size: 12px;
          color: #999;
        }
        img {
          width: 96px;
          height: 96px;
        }
        label {
          line-height: 36px;
          margin-right: 20px;
        }
        input {
          width: 310px;
          height: 46px;
          padding-left: 10px;
          border-radius: 6px;
          font-size: 14px;
          margin-top: -5px;
          &.radiobox {
            width: 14px;
            height: 14px;
          }
          &.data_input {
            height: 24px;
            padding: 10px;
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
      background-color: rgb(213, 20, 35);
      width: 320px;
      color: #fff;
      border-radius: 6px;
      cursor: pointer;
    }
    .form_input_min {
      width: 150px;
      height: 46px;
      border-radius: 6px;
      margin-top: -5px;
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
    .err{
      color: red;
      padding-top: 5px;
    }
</style>
