<template>
  <div class="">
    <y-header></y-header>
    <div class="container account_cont clearfix">
      <y-side></y-side>
      <div class="main_box">
        <ul class="tabs clearfix">
          <a class="tab on">基础信息</a>
        </ul>
        <div class="main_cont form" v-if="isLogin">
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
                  <input type="text" v-model="obj.nickname" class="form_input" placeholder="请输入昵称">
              </div>
            </div>
            <div class="form_group">
              <div class="label">年龄:</div>
              <div class="form_ctl">
                  <input type="text" v-model="obj.age" class="form_input" placeholder="请输入昵称">
              </div>
            </div>
            <div class="form_group">
              <div class="label">性别:</div>
              <div class="form_ctl form_ctl_radio">
                <input type="radio" v-model="obj.sex" class="radiobox" id="sex1" value="1" name="sex">
                <label for="sex1">男</label>
                <input type="radio" v-model="obj.sex" class="radiobox" id="sex2" value="2" name="sex">
                <label for="sex2">女</label>
                <input type="radio" v-model="obj.sex" class="radiobox" id="sex3" value="3" name="sex">
                <label for="sex3">保密</label>
              </div>
            </div>
            <div class="form_group">
              <div class="label">讲师头像:</div>
              <div class="form_ctl upload_ctl">
                <input type="hidden" v-model="obj.headImgUrl">
                <div class="preview">
                  <img :src="obj.headImgUrl" alt="" v-if="obj.headImgUrl">
                  <i class="iconfont" v-else>&#xe6b2;</i>
                </div>
                <d-upload @rtnUrl="setUrl"></d-upload>
                <p class="tip">* 图片尺寸为800x800，图片大小&lt;500KB，建议使用真人照片，便于品牌宣传效果</p>
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
        <div class="main_cont form" v-else>
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
            <div class="label">讲师头像:</div>
            <div class="form_ctl upload_ctl">
              <input type="hidden" v-model="obj.headImgUrl">
                <div class="preview">
                  <img :src="obj.headImgUrl" alt="" v-if="obj.headImgUrl">
                  <i class="iconfont" v-else>&#xe6b2;</i>
                </div>
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
import { myHttp } from '~/utils/myhttp.js'
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
      myHttp.call(this, {
        method: getUserInfo
      }).then(res => {
        this.obj = res.data || {}
      }).catch(error => {})
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
      myHttp.call(this, {
        method: updateUserEducationInf,
        params: this.obj,
        confirm: () => {window.location.reload()},
        cancel: () => {window.location.reload()}
      }).then(res => {
        this.$store.commit('SET_USER', res.data)
        this.$msgBox({
          content: '修改成功',
          isShowCancelBtn: false
        }).then(async (val) => {
          window.location.reload()
        }).catch(() => {
          window.location.reload()
        })
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
  @import '~/assets/css/account.scss';
  .upload_ctl{
    .preview{
      width: 100px;
      height: 100px;
      background-color: #f5f5f5;
      text-align: center;
      margin-bottom: 10px;
      i{
        line-height: 120px;
        font-size: 80px;
        color: #ddd;
      }
    }
  }
</style>
