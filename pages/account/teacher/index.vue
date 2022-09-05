<template>
  <div class="">
    <y-header />
    <div class="container account_cont clearfix">
      <y-side :type="'jsxx'" />
      <div class="main_box">
        <div class="tabs">
          <span class="tab on">讲师信息</span>
        </div>
        <div v-show="edit" class="main_cont form">
          <form action="" @submit="userUpdate">
            <div class="form_group">
              <div class="label">讲师头像:</div>
              <div class="form_ctl upload_ctl">
                <input v-model="teacherInfo.headImgUrl" type="hidden">
                <div class="preview">
                  <img v-if="teacherInfo.headImgUrl" :src="teacherInfo.headImgUrl" alt="">
                  <i v-else class="iconfont">&#xe6b2;</i>
                </div>
                <d-upload @rtnUrl="setUrl" />
                <p class="tip">* 图片尺寸为800x800，图片大小&lt;500KB，建议使用真人照片，便于品牌宣传效果</p>
              </div>
            </div>
            <div class="form_group">
              <div class="label">讲师昵称:</div>
              <div class="form_ctl">
                <input v-model="teacherInfo.lecturerName" type="text" class="form_input" placeholder="请输入昵称">
              </div>
            </div>
            <div class="form_group">
              <div class="label">个人简介</div>
              <div class="form_ctl">
                <div id="lecturerInfo" />
              </div>
            </div>
            <div class="form_group">
              <div class="label">&nbsp;</div>
              <div class="form_ctl">
                <button class="submit_btn">确认</button>
              </div>
            </div>
          </form>
        </div>
        <div v-show="!edit" class="main_cont form">
          <div class="form_group">
            <div class="label">讲师头像:</div>
            <div class="form_ctl upload_ctl">
              <input v-model="teacherInfo.headImgUrl" type="hidden">
              <div class="preview">
                <img v-if="teacherInfo.headImgUrl" :src="teacherInfo.headImgUrl" alt="">
                <i v-else class="iconfont">&#xe6b2;</i>
              </div>
            </div>
          </div>
          <div class="form_group">
            <div class="label">讲师昵称:</div>
            <div class="form_ctl">
              <div class="text">{{ teacherInfo.lecturerName }}</div>
            </div>
          </div>
          <div class="form_group">
            <div class="label">个人简介:</div>
            <div class="form_ctl">
              <div class="text" v-html="teacherInfo.introduce" />
            </div>
          </div>
          <div class="form_group">
            <div class="label">&nbsp;</div>
            <div class="form_ctl">
              <button href="javascript:" class="submit_btn" @click="edit = true">修改</button>
            </div>
          </div>
          <div v-if="teacherInfo.auditStatus === 0" class="c_orange" style="margin-left: 120px;">*修改的信息需要通过审核才能生效，若已经修改请耐心等待！</div>
          <div v-if="teacherInfo.auditStatus === 2" class="c_orange" style="margin-left: 120px;">*审核失败，失败原因：{{ teacherInfo.auditOpinion }}</div>
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
import DUpload from '~/components/account/Upload'
import { getLecturerInfoAudit, updataLecturerInfoAudit } from '~/api/account/user.js'
import { myHttp } from '~/utils/myhttp.js'
export default {
  components: {
    YHeader,
    YFooter,
    YSide,
    DUpload
  },
  data() {
    return {
      edit: false,
      teacherInfo: {}
    }
  },
  mounted() {
    const E = require('wangeditor')
    this.editor2 = new E('#lecturerInfo')
    this.editor2.create()
    this.getByTeacher()
  },
  methods: {
    getByTeacher() {
      myHttp.call(this, {
        method: getLecturerInfoAudit,
        params: { lecturerUserNo: this.$store.state.userInfo.userNo }
      }).then(res => {
        this.teacherInfo = res.data
        this.editor2.txt.html(this.teacherInfo.introduce)
        this.edit = false
      })
    },
    userUpdate(e) {
      e.preventDefault()
      const ht = this.editor2.txt.html()
      this.teacherInfo.introduce = ht
      this.teacherInfo.lecturerUserNo = this.$store.state.userInfo.userNo
      myHttp.call(this, {
        method: updataLecturerInfoAudit,
        params: this.teacherInfo
      }).then(res => {
        this.$msgBox({
          content: '修改成功',
          isShowCancelBtn: false
        }).then(() => {
          this.getByTeacher()
        }).catch(() => {
          this.getByTeacher()
        })
      })
    },
    setUrl(res) {
      this.teacherInfo.headImgUrl = res.url
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
@import '~/assets/css/account.scss';
.upload_ctl{
    .preview{
      width: 100px;
      height: 100px;
      background-color: #f5f5f5;
      text-align: center;
      margin-bottom: 10px;
      img {
        width: 100%;
        height: 100%;
      }
      i{
        line-height: 120px;
        font-size: 80px;
        color: #ddd;
      }
    }
  }
</style>
