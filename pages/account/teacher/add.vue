<template>
  <div class="">
    <y-header></y-header>
    <div class="container account_cont">
      <y-side :type="sideTy"></y-side>
      <div class="main_box">
        <div class="" v-if="!obj.id">
          <div class="step_panel">
            <div class="step on">1.填写课程信息</div>
            <div class="step">2.上传课程内容</div>
            <div class="step">3.提交审核</div>
          </div>
        </div>
        <div class="main_cont form">
          <form action="" @submit="courseSave">
            <div class="form_group">
              <div class="label">课程名称</div>
              <div class="form_ctl">
                <input type="text" v-model="obj.courseName" class="form_input" placeholder="请输入课程名称">
              </div>
            </div>
            <div class="form_group">
              <div class="label">课程分类</div>
              <div class="form_ctl">
                <select v-model="obj.categoryId1" @change="changeCate1" name="" id="" class="form_input_min">
                  <option value="">--请选择--</option>
                  <option v-for="cate in cate1" :checked="obj.categoryId1 == cate.id" :key="cate.id" :value="cate.id" v-html="cate.categoryName"></option>
                </select>
                <select name="" v-model="obj.categoryId2" @change="changeCate2" id="" v-if="cate2 && cate2.length" class="form_input_min">
                  <option value="">--请选择--</option>
                  <option v-for="cate in cate2" :key="cate.id" :value="cate.id" v-html="cate.categoryName"></option>
                </select>
                <select name="" v-model="obj.categoryId3" id="" v-if="cate3 && cate3.length" class="form_input_min">
                  <option value="">--请选择--</option>
                  <option v-for="cate in cate3" :key="cate.id" :value="cate.id">{{cate.categoryName}}</option>
                </select>
              </div>
            </div>
            <div class="form_group" v-if="!(this.$route.query.t === 'paper')">
              <div class="label">课程介绍</div>
              <div class="form_ctl">
                <div id="courseInfo"></div>
              </div>
            </div>
            <div class="form_group">
              <div class="label">是否免费</div>
              <div class="form_ctl form_ctl_radio">
                <input name="sex" v-model="obj.isFree" type="radio" value="0" id="sex1">
                <label for="sex1">付费</label>
                <input name="sex" v-model="obj.isFree" type="radio" value="1" id="sex2">
                <label for="sex2">免费</label>
              </div>
            </div>
            <div class="form_group" v-if="this.$route.query.t === 'paper'">
              <div class="label">是否存在答案</div>
              <div class="form_ctl form_ctl_radio">
                <input name="ans" v-model="obj.isAnswer" type="radio" value="0" id="ans1">
                <label for="ans1">没答案</label>
                <input name="ans" v-model="obj.isAnswer" type="radio" value="1" id="ans2">
                <label for="ans2">有答案</label>
              </div>
            </div>
            <div class="form_group" v-if="obj.isFree == 0">
              <div class="label">课程售价</div>
              <div class="form_ctl">
                <input type="text" v-model="obj.courseOriginal" class="form_input_min" placeholder="请输入价格"><span>元</span>
              </div>
            </div>
            <div class="form_group" v-if="!(this.$route.query.t === 'paper')">
              <div class="label">上传封面</div>
              <div class="form_ctl upload_ctl">
                <input type="hidden" v-model="obj.courseLogo">
                <div class="preview">
                  <img :src="obj.courseLogo" alt="" v-if="obj.courseLogo">
                  <i class="iconfont" v-else>&#xe6b2;</i>
                </div>
                <d-upload @rtnUrl="setUrl" :btntxt="'上传图片'" :accept="'image/png,image/gif,image/jpeg'"></d-upload>
                <!-- <p class="tip">* 图片尺寸为800x800，图片大小&lt;500KB，建议使用真人照片，便于品牌宣传效果</p> -->
              </div>
            </div>
            <div class="form_group">
              <div class="label">&nbsp;</div>
              <div class="form_ctl">
                <button class="submit_btn" :disabled="btnDis">确认</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <y-footer class=""></y-footer>
  </div>
</template>
<script>
import YHeader from '~/components/common/Header'
import YFooter from '~/components/common/Footer'
import YSide from '~/components/account/Side'
import DUpload from '~/components/account/Upload'
import {infiniteCate, saveCourseInfo, courseDetail, courseUpdate, accessoryList} from '~/api/account/course.js'
export default {
  data () {
    return {
      btnDis: false,
      sideTy: 'kcgl',
      edit: true,
      cate1: [],
      cate2: false,
      cate3: false,
      change1: false,
      change2: false,
      tags: [],
      obj: {
        categoryId1: '',
        categoryId2: '',
        categoryId3: '',
        isFree: 0,
        courseCategory: '1',
        courseLogo: '',
        introduce: '',
        courseName: '',
        courseOriginal: ''
      }
    }
  },
  // 页面打开完毕
  methods: {
    setUrl (res) {
      this.obj.courseLogo = res.url;
      // console.log(res)
    },
    courseSave (e) {
      e.preventDefault();
      // console.log(this.obj)
      this.obj.introduce = this.editor2.txt.html();
      if (!this.obj.introduce) {
        this.$msgBox({
          content: '请输入课程介绍',
          isShowCancelBtn: false
        })
        return false;
      }
      if (!this.obj.courseName) {
        this.$msgBox({
          content: '请输入课程名称',
          isShowCancelBtn: false
        })
        return false;
      }
      if (!this.obj.categoryId1 && !this.obj.id) {
        this.$msgBox({
          content: '请选择课程分类',
          isShowCancelBtn: false
        })
        return false;
      }
      if (parseInt(this.obj.isFree) !== 1) {
        if (!this.obj.courseOriginal) {
          this.$msgBox({
            content: '请输入课程售价',
            isShowCancelBtn: false
          })
          return false;
        }
        if (this.obj.courseOriginal <= 0) {
          this.$msgBox({
            content: '请输入正确的课程原价',
            isShowCancelBtn: false
          })
          return false;
        }
      } else {
        this.obj.courseOriginal = 0;
      }
      if (!this.obj.courseLogo && !(this.$route.query.t === 'paper')) {
        this.$msgBox({
          content: '请上传课程封面',
          isShowCancelBtn: false
        })
        return false;
      }
      // console.log(tx)

      this.btnDis = true;
      if (this.obj.id) {
        // console.log('courseUpdate')
        courseUpdate(this.obj).then(res => {
          this.btnDis = false;
          res = res.data;
          if (res.code === 200) {
            this.$msgBox({
              content: '修改成功',
              isShowCancelBtn: false
            }).then(async (val) => {
              this.$router.push({name: 'account-teacher-course', query: {no: res.data.id}})
            })
          } else {
            this.$msgBox({
              content: res.msg,
              isShowCancelBtn: false
            })
          }
        }).catch(() => {
          this.btnDis = false;
          this.$msgBox({
            content: '修改失败,请稍后再试',
            isShowCancelBtn: false
          })
        })
      } else {
        // console.log(this.obj)
        saveCourseInfo(this.obj).then(res => {
          res = res.data;
          this.btnDis = false;
          if (res.code === 200) {
            this.$msgBox({
              content: '保存成功',
              isShowCancelBtn: false
            }).then(async (val) => {
              this.$router.push({path: '/account/teacher/period', query: {no: res.data.id}})
            })
          } else {
            if (res.code >= 300 && res.code < 400) {
              this.$msgBox({
                content: res.msg,
                isShowCancelBtn: false
              }).then(() => {
                this.$store.dispatch('REDIRECT_LOGIN', result.code)
              }).catch(() => {
                this.$store.dispatch('REDIRECT_LOGIN', result.code)
              })
            } else {
              this.$msgBox({
                content: res.msg,
                isShowCancelBtn: false
              }).catch(() => {})
            }
          }
        }).catch(() => {
          this.btnDis = false;
          this.$msgBox({
            content: '保存失败,请稍后再试',
            isShowCancelBtn: false
          })
        })
      }
    },
    changeCate1 () {
      if (this.obj.categoryId2 == 0) {
        this.obj.categoryId2 = ''
      }
      if (this.obj.categoryId3 == 0) {
        this.obj.categoryId3 = ''
      }
      if (!this.$route.query.no) {
        this.obj.categoryId2 = '';
        this.obj.categoryId3 = '';
        this.cate2 = [];
        this.cate3 = [];
      }
      if (this.change1) {
        this.obj.categoryId2 = '';
        this.obj.categoryId3 = '';
        this.cate2 = [];
        this.cate3 = [];
      }
      let c1 = this.obj.categoryId1;
      let that = this;
      if (c1 === '') {
        that.cate2 = false;
        that.cate3 = false;
      } else {
        let catels = that.cate1;
        catels.map(function (item, i) {
          if (item.id === c1) {
            that.cate2 = item.twoList;
            that.cate3 = false;
          }
        })
        this.changeCate2();
      }
      if (this.$route.query.no) {
        this.change1 = true
      }
      // console.log(this.obj)
    },
    changeCate2 () {
      if (!this.$route.query.no) {
        this.obj.categoryId3 = '';
        this.cate3 = [];
      }
      if (this.change2) {
        this.obj.categoryId3 = '';
        this.cate3 = [];
      }
      let c2 = this.obj.categoryId2;
      let that = this;
      if (c2 === '') {
        that.cate3 = false;
      } else {
        let catels = that.cate2;
        catels.map(function (item, i) {
          if (item.id === c2) {
            if (item.threeList && item.threeList.length > 0) {
              that.cate3 = item.threeList;
            } else {
              that.cate3 = false;
            }
          }
        })
      }
      if (this.$route.query.no) {
        this.change2 = true
      }
      // console.log(this.cate2)
    },
    // 获取课程信息
    getCourse () {
      this.load = true;
      courseDetail({id: this.$route.query.no}).then(res => {
        this.load = false;
        if (res.data.code === 200) {
          let courseData = res.data.data;
          this.editor2.txt.html(courseData.introduce);
          this.obj = courseData;
          if (this.cate1.length) {
            this.changeCate1();
          }
        } else {
          if (res.code >= 300 && res.code < 400) {
            this.$msgBox({
              content: res.msg,
              isShowCancelBtn: false
            }).then(() => {
              this.$store.dispatch('REDIRECT_LOGIN', result.code)
            }).catch(() => {
              this.$store.dispatch('REDIRECT_LOGIN', result.code)
            })
          } else {
            this.$msgBox({
              content: res.msg,
              isShowCancelBtn: false
            }).catch(() => {})
          }
        }
      }).catch(() => {
        this.load = false;
        this.$msgBox({
          content: '加载数据失败，请稍后刷新再试！！',
          isShowCancelBtn: false
        })
      })
    }
  },
  // 页面打开
  mounted () {
    if (!(this.$route.query.t === 'paper')) {
    let E = require('wangeditor')
      this.editor2 = new E('#courseInfo')
      this.editor2.create();
    }
    // console.log(this.clientData)

    // 根据是否有课程编号判断添加或编辑
    if (this.$route.query.no) {
      this.getCourse();
    }
    // 课程分类数据
    infiniteCate().then(res => {
      // console.log(res.data)
      if (res.data.code === 200) {
        this.cate1 = res.data.data.courseCategoryList;
        if (this.obj.categoryId1) {
          this.changeCate1();
        }
      }
    })
  },
  components: {
    YHeader,
    YFooter,
    DUpload,
    YSide
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
@import '~/assets/css/account.scss';
  .step_panel{
    overflow: hidden;
    background-color: #eee;
    .step{
      float: left;
      width: 33.33333%;
      text-align: center;
      height: 50px;
      line-height: 50px;
      color: #333;
      font-size: 14px;
      position: relative;
      &:after{
        content: "";
        display: block;
        position: absolute;
        right: -12px;
        top: -5px;
        z-index: 1;
        width: 60px;
        height: 60px;
        box-shadow: 1px 1px 0 #fff;
        transform:rotate(-45deg);
      }
      &.on{
        color: #fff;
        background-color: #ec7e00;
        &:after{
          background-color: #ec7e00;
        }
      }
    }
  }
  .course_period{
    label{
      margin-right: 8px;
      color: #333;
    }
    .form_input{
      height: 34px;
      border: 1px solid #e7e7e7;
      width: 278px;
      text-indent: 1em;
    }
    .form_input_min{
      text-indent: 1em;
      width: 130px;
      height: 34px;
      margin-right: 10px;
      border: 1px solid #e7e7e7;
    }
  }
  .upload_ctl{
    .preview{
      width: 200px;
      height: 120px;
      overflow: hidden;
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
  .ac_ctl{
    .item_ac_op{
      line-height: 30px;
    }
  }
</style>
