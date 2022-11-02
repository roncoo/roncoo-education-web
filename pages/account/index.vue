<template>
  <div class="">
    <y-header />
    <div class="container account_cont clearfix">
      <y-side :type="'grxx'" />
      <div class="main_box">
        <ul class="tabs clearfix">
          <a class="tab on">基础信息</a>
        </ul>
        <div v-if="editStatus" class="main_cont form">
          <form action="" @submit="userInfoUpdate">
            <div class="form_group">
              <div class="label">手机号:</div>
              <div class="form_ctl">
                <div class="text">{{ obj.mobile }}</div>
              </div>
            </div>
            <div class="form_group">
              <div class="label">昵称:</div>
              <div class="form_ctl">
                <input v-model="obj.nickname" type="text" class="form_input" placeholder="请输入昵称">
              </div>
            </div>
            <div class="form_group">
              <div class="label">年龄:</div>
              <div class="form_ctl">
                <input v-model="obj.userAge" type="number" class="form_input" placeholder="请输入年龄">
              </div>
            </div>
            <div class="form_group">
              <div class="label">性别:</div>
              <div class="form_ctl form_ctl_radio">
                <input id="sex1" v-model="obj.userSex" type="radio" class="radiobox" value="1" name="sex">
                <label for="sex1">男</label>
                <input id="sex2" v-model="obj.userSex" type="radio" class="radiobox" value="2" name="sex">
                <label for="sex2">女</label>
                <input id="sex3" v-model="obj.userSex" type="radio" class="radiobox" value="3" name="sex">
                <label for="sex3">保密</label>
              </div>
            </div>
            <div class="form_group">
              <div class="label">头像:</div>
              <div class="form_ctl upload_ctl" style="float: none;">
                <input v-model="obj.userHead" type="hidden">
                <div class="preview" style="display: flex;align-items: center; width: 300px;">
                  <img v-if="obj.userHead" :src="obj.userHead" alt="" style="height: 100px; margin-left: 10px">
                  <i v-else class="iconfont">&#xe6b2;</i>
                  <d-upload style="margin-left: 50px" :btntxt="'选择头像'" @rtnUrl="setUrl" />
                </div>
              </div>
              <p class="tip" style="padding-left:110px;">* 图片尺寸为800x800，图片大小&lt;500KB，建议使用真人照片，便于品牌宣传效果</p>
            </div>
            <div class="form_group">
              <div class="label">&nbsp;</div>
              <div class="form_ctl">
                <button type="submit" class="submit_btn">保存</button>
              </div>
            </div>
          </form>
        </div>
        <div v-else class="main_cont form">
          <div class="form_group">
            <div class="label">手机号:</div>
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
              <div class="text">{{ obj.userAge }}</div>
            </div>
          </div>
          <div class="form_group">
            <div class="label">性别:</div>
            <div class="form_ctl">
              <div v-if="obj.userSex === 1" class="text">男</div>
              <div v-else-if="obj.userSex === 2" class="text">女</div>
              <div v-else-if="obj.userSex === 3" class="text">保密</div>
            </div>
          </div>
          <div class="form_group">
            <div class="label">头像:</div>
            <div class="form_ctl upload_ctl">
              <div class="preview">
                <img v-if="obj.userHead" :src="obj.userHead" alt="">
                <i v-else class="iconfont">&#xe6b2;</i>
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
    <!-- <bottom /> -->
  </div>
</template>
<script>
import YSide from '~/components/account/Side'
import YHeader from '~/components/common/Header'
import DUpload from '~/components/common/Upload'
import { getUserInfo, usersUpdata } from '@/api/user.js'
// import Bottom from '@/components/common/Bottom'

export default {
  components: {
    // Bottom,
    YHeader,
    YSide,
    DUpload
  },
  data() {
    return {
      editStatus: false,
      region1: [],
      region2: [],
      obj: {}
    }
  },
  head() {
    return {
      title: '个人信息-' + this.$store.state.websiteInfo.websiteName
    }
  },
  mounted() {
    this.userInfo()
  },
  methods: {
    userInfo() {
      getUserInfo().then(res => {
        this.obj = res || {}
      })
    },
    editInfo() {
      this.editStatus = true
    },
    userInfoUpdate(e) {
      e.preventDefault()
      usersUpdata(this.obj).then(res => {
        this.$msgBox({
          content: '修改成功',
          isShowCancelBtn: false
        }).then(async(val) => {
          window.location.reload()
        }).catch(() => {
          window.location.reload()
        })
      })
    },
    setUrl(res) {
      this.obj.userHead = res.url
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import '~/assets/css/account.scss';

.upload_ctl {
  .preview {
    width: 100px;
    height: 100px;
    text-align: center;
    margin-bottom: 10px;

    i {
      line-height: 120px;
      font-size: 100px;
      color: #ddd;
    }
  }
}
</style>
