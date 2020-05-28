<template>
  <div class="">
    <y-header></y-header>
    <div class="container account_cont">
      <y-side :type="side"></y-side>
      <div class="main_box">
        <div class="step_panel">
          <div class="step on">1.填写课程信息</div>
          <div class="step on">2.上传课程内容</div>
          <div class="step">3.提交审核</div>
        </div>
        <div class="main_cont course_period">
          <div class="tip">可<span class="c_red">"拖动"</span>章节名称调整先后顺序</div>
          <table class="table">
            <thead>
              <tr>
                <th width="80">序号</th>
                <th>章节名称</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in chapterList" v-dragging="{ item: item, list: chapterList }" :key="item.chapterNo" v-if="item.chapterDesc != 'true'">
                <td>第{{ index + 1 }}章</td>
                <td class="name">{{item.chapterName}}</td>
                <td class="operate">
                  <a href="javascript:" class="text_link" @click="edit(index)">修改</a><br>
                  <router-link :to="'/account/teacher/praxis?no=' +item.id+ '&i='+ (index +1)" class="text_link">
                    课时管理
                    <span v-if="item.periodNum" class="c_red">({{item.periodNum}})</span>
                  </router-link><br>
                  <a href="javascript:" @click="del(item.id)" class="text_link">删除</a>
                </td>
              </tr>
              <tr v-else>
                <td>第{{ index + 1 }}章</td>
                <td class="name"><input type="text" v-model="item.chapterName" class="form_input" placeholder="请输入章节名称"></td>
                <td class="operate">
                  <button @click="updatas(item)" class="solid_btn" :disabled="btnDab">保存</button>
                </td>
              </tr>
              <tr>
                <td>第{{num}}章</td>
                <td class="name"><input type="text" v-model="newData.chapterName" class="form_input" placeholder="请输入章节名称"></td>
                <td class="operate">
                  <button @click="addPeriod" class="solid_btn" :disabled="btnDab">保存</button>
                </td>
              </tr>
            </tbody>
          </table>
          <router-link to="/teacher/check" class="cont_btn solid_btn">下一步</router-link>
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
import {saveChapter, courseChapterList, updateChapter, deleteChapter, chapterSort} from '~/api/account/course.js'
export default {
  head () {
    return {
      title: '添加课程章节'
    }
  },
  data () {
    return {
      showModal: false,
      modalData: null,
      side: 'kcgl',
      num: 1,
      btnDab: false,
      chapterList: [],
      newData: {
        'chapterName': '',
        'courseId': 0,
        'isFree': 0
      }
    }
  },
  methods: {
    addPeriod () {
      if (this.newData.chapterName === '') {
        this.$msgBox({
          content: '请输入课时名称',
          isShowCancelBtn: false
        })
        return false;
      }
      this.btnDab = true;
      this.newData.sort = this.num;
      saveChapter(this.newData).then(res => {
        res = res.data;
        // console.log(res)
      this.btnDab = false;
        if (res.code === 200) {
          this.chapterList.push(res.data)
          this.num = this.chapterList.length + 1;
          this.newData.chapterName = '';
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
        this.btnDab = false;
        this.$msgBox({
          content: '添加失败',
          isShowCancelBtn: false
        })
      })
    },
    // 修改例题
    edit (no) {
      let arr = this.chapterList
      arr[no].chapterDesc = 'true';
      this.chapterList = Object.assign([], arr);
    },
    // 更新例题
    updatas (data) {
      if (data.chapterName === '') {
        this.$msgBox({
          content: '请输入课时名称',
          isShowCancelBtn: false
        }).catch(() => {})
        return
      }
      this.btnDab = true;
      data.periodDesc = '';
      updateChapter(data).then(res => {
        // console.log(res)
        this.btnDab = false;
        this.getChapterList();
      }).catch(() => {
        this.btnDab = false;
        this.$msgBox({
          content: '修改失败',
          isShowCancelBtn: false
        })
      })
    },
    // 删除例题
    del (no) {
      let that = this;
      this.$msgBox({
        content: '确认删除该例题?'
      }).then(async (val) => {
        deleteChapter({id: no}).then(res => {
          res = res.data;
          // console.log(res)
          if (res.code === 200) {
            this.$msgBox({
              content: '删除成功',
              isShowCancelBtn: false
            })
            that.getChapterList();
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
        })
      }).catch(() => {
        this.$msgBox({
          content: '删除失败',
          isShowCancelBtn: false
        })
        })
    },
    // 保存排序
    saveSort () {
      // console.log(this.chapterList)
      let sort = new Array();
      for (var i = 0; i < this.chapterList.length; i++) {
        sort.push(this.chapterList[i].id)
      }
      chapterSort({chapterIdList: sort}).then(res => {
        res = res.data
        // console.log(res)
        if (res.code === 200) {
        } else {
          this.$msgBox({
            content: res.msg,
            isShowCancelBtn: false
          })
        }
      }).catch(() => {
        this.$msgBox({
          content: '排序保存失败',
          isShowCancelBtn: false
        })
      })
    },
    getChapterList () {
      // courseId
      courseChapterList({
        courseId: this.newData.courseId
      }).then(res => {
        res = res.data;
        // console.log(res)
        if (res.code === 200) {
          this.chapterList = res.data.userChapterAuditList || [];
          this.num = this.chapterList.length + 1;
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
      }).catch(msg => {
        this.$msgBox({
          content: '加载数据失败，请稍后刷新再试！！',
          isShowCancelBtn: false
        })
      })
    }
  },
  mounted () {
    this.newData.courseId = this.$route.query.no;
    this.num = this.chapterList.length + 1;
    this.getChapterList();
    this.$dragging.$on('dragend', () => {
      this.saveSort();
    })
  },
  components: {
    YHeader,
    YFooter,
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
    .cont_btn {
      width: 280px;
      display: block;
      margin:20px auto 0;
    }
  }
  .dragging{
    color: #ec7e00;
  }
</style>
