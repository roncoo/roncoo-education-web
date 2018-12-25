<template>
  <div class="">
    <y-header></y-header>
    <div class="container account_cont clearfix">
      <y-side :type="'jsxx'"></y-side>
      <div class="main_box">
        <div class="tabs">
          <span class="tab on">讲师信息</span>
        </div>
        <div class="main_cont form" v-show="edit">
           <form action="" @submit="userUpdate">
              <div class="form_group">
                <div class="label">讲师头像:</div>
                  <div class="form_ctl upload_ctl">
                    <input type="hidden" v-model="obj.imgLogo">
                    <div class="preview">
                      <img :src="obj.imgLogo" alt="" v-if="obj.imgLogo">
                      <i class="iconfont" v-else>&#xe6b2;</i>
                    </div>
                    <d-upload @rtnUrl="setUrl"></d-upload>
                    <p class="tip">* 图片尺寸为800x800，图片大小&lt;500KB，建议使用真人照片，便于品牌宣传效果</p>
                    </div>
              </div>
              <div class="form_group">
                <div class="label">讲师昵称:</div>
                <div class="form_ctl">
                    <input type="text" v-model="obj.lecturerName" class="form_input" placeholder="请输入昵称">
                </div>
              </div>
              <div class="form_group">
                <div class="label">个人简介</div>
                  <div class="form_ctl">
                    <div id="lecturerInfo"></div>
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
        <div class="main_cont form" v-show="!edit">
          <div class="c_orange" v-if="obj.auditStatus === 0">*设置修改的信息需要通过审核才能生效，若已经修改请耐心等待！</div>
          <div class="c_orange" v-if="obj.auditStatus === 2">*审核失败，失败原因：{{obj.auditOpinion}}</div>
          <br>
          <div class="form_group">
            <div class="label">讲师头像:</div>
            <div class="form_ctl upload_ctl">
              <input type="hidden" v-model="obj.imgLogo">
                <div class="preview">
                  <img :src="obj.imgLogo" alt="" v-if="obj.imgLogo">
                  <i class="iconfont" v-else>&#xe6b2;</i>
                </div>
            </div>
          </div>
          <div class="form_group">
            <div class="label">讲师昵称:</div>
            <div class="form_ctl">
              <div class="text">{{obj.lecturerName}}</div>
            </div>
          </div>
          <div class="form_group">
            <div class="label">个人简介:</div>
            <div class="form_ctl">
              <div class="text" v-html="obj.introduce"></div>
            </div>
          </div>
          <div class="form_group">
            <div class="label">&nbsp;</div>
            <div class="form_ctl">
              <button href="javascript:" @click="edit = true" class="submit_btn">修改</button>
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
import {getLecturerInfo} from '~/api/account/user.js'
export default {
  data () {
    return {
      edit: false,
      obj: {

      }
    }
  },
  methods: {
    getByTeacher () {
      getLecturerInfo({lecturerUserNo: 11})
      .then(res => {
        console.log(res)
      })
      .catch(()=> {
        // 获取讲师信息失败
      })
    },
    userUpdate (e) {
      e.preventDefault();
    },
    setUrl (res) {
      this.obj.headImgUrl = res.url;
    }
  },
  mounted () {
    console.log(this.$store.state.userInfo)
    this.getByTeacher()
  },
  components: {
    YHeader,
    YFooter,
    YSide,
    DUpload
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
@import '../../assets/css/account.scss';
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
