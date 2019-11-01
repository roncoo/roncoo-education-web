<template>
  <div>
    <y-header></y-header>
    <div class="person_body clearfix">
      <y-side :type="'kcgl'"></y-side>
      <div class="person_content">
        <ul class="person_title clearfix">
          <li>第{{num}}章</li>
        </ul>
        <div class="person_info ">
          <table class="table ">
            <thead>
              <tr>
                <th>序号</th>
                <th>题目</th>
                <th>是否免费</th>
                <th>视频</th>
                <th>课件</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in list" :key="item.id" v-if="item.periodDesc != 'true'"  v-dragging="{ item: item, list: list, group: 'color' }">
                <td>{{index + 1}}</td>
                <td class="name">{{item.periodName}}</td>
                <td>
                  <span v-if="item.isFree" class="c_green">免费</span>
                  <span v-else class="c_red">收费</span>
                </td>
                <td class="c_green"><button @click="openVideo(item.id,2)" :class="{on: item.videoNum}" class="gray_btn">视频管理<i class="num">{{item.videoNum}}</i></button></td>
                <td class="c_green">
                  <a v-if="item.isDoc" :href="item.docUrl">{{item.docName}}</a>
                  <span v-else>暂无附件</span>
                </td>
                <td class="c_green" v-if="item.auditStatus">已审核</td>
                <td class="c_blue" v-else>待审核</td>
                <td class="operate">
                  <a href="javascript:void(0)" @click="edit1(index)" class="text_link">修改</a><br>
                  <a href="javascript:void(0)" @click="del(item.id)" class="text_link">删除</a>
                </td>
              </tr>
              <tr v-else>
                <td>{{index + 1}}
                </td>
                <td class="name"><input type="text" v-model="item.periodName" class="form_input" placeholder="请输入课时名称"></td>
                <td><input type="checkbox" v-model="item.isFree" value="1"></td>
                <td> - </td>
                <td><y-upload :upOk="isUp" @rtnUrl="getUrl" :isresource="true" /></td>
                <td> - </td>
                <td class="operate">
                  <button class="solid_btn b_red" @click="updatas(item)" :disabled="solidBtn">保存</button>
                </td>
              </tr>
              <tr>
                <td>
                  {{sort}}
                </td>
                <td class="name"><input type="text" v-model="obj.periodName" class="form_input" placeholder="请输入课时名称"></td>
                <td><input type="checkbox" v-model="obj.isFree" value="1"></td>
                <td> - </td>
                <td><y-upload :upOk="isUp" @rtnUrl="getUrl" :isresource="true" /></td>
                <td> - </td>
                <td class="operate">
                  <button class="solid_btn b_red" @click="addPraxis" :disabled="solidBtn">保存</button>
                </td>
              </tr>
            </tbody>
          </table>
          <a href="javascript:" @click="$router.back(-1)" class="cont_btn solid_btn b_red">完成返回</a>
        </div>
      </div>
    </div>
    <y-footer></y-footer>
    <y-video v-if="showVideo" :open="showVideo" :data="videoData" :type="videoType" @hidefun="hideModal()"></y-video>
  </div>
</template>
<script>
import YHeader from '~/components/common/Header'
import YFooter from '~/components/common/Footer'
import YSide from '~/components/account/Side'
import YVideo from '~/components/account/VideoModal'
import YUpload from '~/components/account/Upload'
import {chapterPraxisList, savePraxis, deletePraxis, updatePraxis, updatePraxisSort} from '~/api/account/course.js'
export default {
  data () {
    return {
      load: false,
      tab: 1,
      num: 1,
      list: [],
      solidBtn: false,
      showVideo: false,
      videoType: 1,
      videoData: null,
      obj: {
        isFree: 0,
        chapterNo: 0,
        courseNo: 0,
        lecturerUserNo: 0,
        orgNo: '',
        periodName: ''
        // sort: 0
      },
      sort: 0,
      docUrl: ''
    }
  },
  computed: {
    isUp () {
      if (this.docUrl) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    // 获取上传附件
    getUrl (file) {
      this.docUrl = file.url || ''
      this.obj.docName = file.name || ''
      this.obj.docUrl = file.url || ''
    },
    // 展开视频选择
    openVideo (id, ty) {
      this.videoData = {
        cNo: this.$route.query.no,
        pNo: id
      };
      this.videoType = ty;
      this.showVideo = true;
    },
    hideModal: function () {
      this.showVideo = false;
      this.chapterList();
    },
    // 修改例题
    edit1 (no) {
      let arr = this.list
      arr[no].periodDesc = 'true';
      this.list = arr;
    },
    // 更新例题
    updatas (data) {
      if (data.periodName === '') {
        this.$msgBox({
          content: '请输入课时名称',
          isShowCancelBtn: false
        }).catch(() => {})
        return
      }
      this.solidBtn = true;
      data.periodDesc = '';
      data.isFree = data.isFree ? 1 : 0;
      data.docName = this.obj.docName || data.docName;
      data.docUrl = this.obj.docUrl || data.docUrl;
      if (data.docName) {
        data.isDoc = 1
      }
      updatePraxis(data).then(res => {
        this.solidBtn = false;
        if (res.data.code === 200) {
          this.obj.docName = ''
          this.obj.docUrl = ''
          this.docUrl = ''
        } else {
          if (res.data.code > 300 && res.data.code < 400) {
            this.$msgBox({
              content: '登录异常，请重新登录',
              isShowCancelBtn: false
            }).then(() => {
              this.$store.dispatch('REDIRECT_LOGIN', result.code)
            }).catch(() => {
              this.$store.dispatch('REDIRECT_LOGIN', result.code)
            })
          }
        }
      }).catch(() => {
        this.solidBtn = false;
        this.$msgBox({
          content: '更新失败',
          isShowCancelBtn: false
        })
      })
    },
    // 删除例题
    del (no) {
      let that = this;
      this.$msgBox({
        content: '你确定要删除该课时吗?'
      }).then(async (val) => {
        deletePraxis({id: no}).then(res => {
          res = res.data
          if (res.code === 200) {
            this.$msgBox({
              content: '删除成功',
              isShowCancelBtn: false
            })
            that.chapterList();
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
          // console.log(res)
        })
      }).catch(() => {
      })
    },
    // 例题列表
    chapterList () {
      chapterPraxisList({
        chapterId: this.$route.query.no
      }).then(res => {
        res = res.data;
        if (res.code === 200) {
          this.list = res.data.userPeriodAuditList || [];
          this.obj.courseNo = res.data.courseNo;
          this.sort = this.list.length + 1;
          // this.setSort();
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
      })
    },
    // 保存排序
    saveSort () {
      if (!this.list.length) {
        return
      }
      updatePraxisSort({list: this.list}).then(res => {
        res = res.data
        if (res.code === 200) {
          this.isSort = 1;
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
    // 添加例题
    addPraxis () {
      if (!this.obj.periodName) {
        this.$msgBox({
          content: '课时名称不能为空',
          isShowCancelBtn: false
        })
        return
      }
      this.solidBtn = true;
      // console.log(this.obj)
      this.sort = this.int;
      this.obj.isFree = this.obj.isFree ? 1 : 0;
      savePraxis(this.obj).then(res => {
        res = res.data;
        this.solidBtn = false;
        if (res.code === 200) {
          this.chapterList();
          this.obj.periodName = '';
          this.obj.isFree = '';
          this.obj.docName = '';
          this.obj.docUrl = '';
          this.docUrl = ''
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
        this.solidBtn = false;
        this.$msgBox({
          content: '添加失败',
          isShowCancelBtn: false
        })
      })
    }
  },
  mounted () {
    this.num = this.$route.query.i ? this.$route.query.i : 1;
    this.obj.chapterId = this.$route.query.no;
    this.chapterList();
    this.$dragging.$on('dragend', ({ value }) => {
      this.saveSort();
    })
  },
  components: {
    YHeader,
    YFooter,
    YVideo,
    YUpload,
    YSide
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
@import '~/assets/css/account.scss';
  .person_body {
    width: 1200px;
    margin: 30px auto 0;
    min-height: 1000px;
    .upload_com {
      .solid_btn {
        display: inline-block;
        height: 25px;
        line-height: 22px;
        background: #fff;
        border-color: #ddd;
        color: #999;
        outline: none;
        &:hover {
          color: #D51423;
          border-color: #D51423;
        }
      }
    }
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
    padding-bottom: 40px;
  }
  .name{
    .form_input{
      margin: 10px 0;
      height: 34px;
      border: 1px solid #e7e7e7;
      width: 278px;
      text-indent: 1em;
    }
  }
  .cont_btn {
    width: 280px;
    display: block;
    margin:20px auto 0;
  }
</style>
