<template>
  <div class="">
    <div class="mask" @click="close()"></div>
    <div class="modal_panel accessory_panel">
      <div class="modal_head">
        <a href="javascript:" @click="close()" class="close iconfont">&#xe616;</a>
      </div>
      <div class="modal_body">
        <div class="upload_box clearfix">
          <span>请上传课程附件</span>
          <div class="fr">
            <span>大小不超过200M</span>
            <input type="file" @change="addUpload" style="display: none;" id="file">
            <button class="solid_btn" :disabled="!upbtn" @click="upimg">本地上传</button>
          </div>
        </div>
        <div class="ac_list" v-loading="load">
            <ul class="">
              <li class="item_ac clearfix" v-for="(item, index) in list" :key="index">
                <a :href="item.acUrl" class="name">{{item.acName}}</a>
                <a href="javascript:" class="c_blue del" @click="del(item.id)">删除</a>
              </li>
              <li class="item_ac" v-for="(item, index) in uploadList" v-if="item.tip !== '上传成功'" :key="index + 'ls'">
                <div class="name">{{item.name}}</div>
                <div class="progress">
                  <div class="entity" :style="{width: item.jd + '%'}"></div>
                  <div class="tip">{{item.tip}}</div>
                </div>
              </li>
            </ul>
        </div>
      </div>
      <div class="modal_foot">
        <button class="solid_btn" @click="submit">确定</button>
        <button class="hollow_btn" @click="close()">取消</button>
      </div>
    </div>
  </div>
</template>
<script>
import {uploadDoc} from '~/api/upload.js'
import {accessoryList, accessoryChapterSave, accessoryRemove} from '~/api/course.js'
export default {
  props: {
    data: {
      type: [Object, String],
      default: null
    },
    type: {
      // 1问题图片，2问题答案，3习题图片，4习题答案
      type: [String, Number],
      default: 1
    },
    live: {
      type: [Boolean],
      default: false
    }
  },
  data () {
    return {
      load: false,
      kg: true,
      upbtn: true,
      list: null,
      savePic: {
        title: '',
        periodNo: 0,
        picType: this.type,
        picUrl: ''
      },
      uploadList: []
    }
  },
  methods: {
    // 选择上传图片
    upimg () {
      if (this.list && this.list.length) {
        this.$msgBox({
          content: '只能上传一个,请先删除其他课件',
          isShowCancelBtn: false
        })
        return
      }
      let myfile = document.getElementById('file');
      myfile.click();
    },
    // 加入上传列表
    addUpload (e) {
      let files = e.target.files;
      for (var i = 0; i < files.length; i++) {
        let file = files[i];
        file.tip = '等待上传';
        file.jd = 0;
        this.uploadList.push(file);
      }
      if (this.upbtn) {
        this.upload();
      }
    },
    // 上传图片
    upload () {
      this.upbtn = false;
      let pics = this.uploadList;
      let itemfile = null;
      for (var i = 0; i < pics.length; i++) {
        if (pics[i].jd === 0 && itemfile === null) {
          itemfile = pics[i];
        }
      }
      if (itemfile) {
        let file = itemfile;
        let that = this;
        /* eslint-disable no-undef */
        let param = new FormData();
        param.append('docFile', file, file.name);
        uploadDoc(param, function (int) {
          itemfile.jd = int;
          itemfile.tip = '上传中';
          that.uploadList = Object.assign([], that.uploadList);
        }).then(res => {
          if (res.code === 200) {
            itemfile.jd = 100
            itemfile.tip = '上传成功';
            that.upload();
            that.savaPic(res.data, itemfile.name);
          } else {
            itemfile.tip = res.msg;
            that.upload();
          }
          that.uploadList = pics;
        }).catch(msg => {
          itemfile.tip = '上传失败';
          that.upload();
        })
      } else {
        this.upbtn = true;
      }
    },
    // 保存图片
    savaPic (src, tit) {
      let cobj = {
        acName: tit,
        acUrl: src,
        courseCategory: 1,
        courseType: 3,
        orgNo: this.clientData.no,
        refNo: this.data.refNo
      }
      if (this.live) {
        cobj.courseCategory = 2
      }
      accessoryChapterSave(cobj).then(res => {
        if (this.list === null) {
          this.list = [];
        }
        this.list.push(res.data);
      }).catch(() => {
        this.$msgBox({
          content: '上传失败!',
          isShowCancelBtn: false
        })
      })
    },
    // 删除i
    del (id) {
        this.$msgBox({
          content: '你确定需要删除该课件吗?'
        }).then(res => {
          accessoryRemove({id}).then(res => {
            this.getAc();
          }).catch(() => {
            this.$msgBox({
              content: '删除失败',
              isShowCancelBtn: false
            })
          })
        }).catch(() => {
          console.log('取消删除')
        })
    },
    // 提交保存选中图片
    submit () {
      this.close();
    },
    close () {
      if (this.upbtn) {
        this.$emit('hidefun', event);
      } else {
        this.$msgBox({
          content: '文件正在上传,确定关闭上传窗口吗?'
        }).then(res => {
          this.$emit('hidefun', event);
        })
      }
    },
    btnClick (event) {
      this.$emit('btnClick', event);
    },
    changeTab (int) {
      this.$emit('change', int);
    },
      // 获取该例题已选中的图片
    getAc () {
      this.load = true;
      accessoryList({refNo: this.data.refNo}).then(res => {
        this.load = false;
        if (res.code === 200) {
          this.list = res.data.list;
        } else {
          if (result.code >= 300 && result.code < 400) {
            this.$msgBox({
              content: '登录超时，请重新登录',
              isShowCancelBtn: false
            }).then(() => {
              this.$store.dispatch('REDIRECT_LOGIN', result.code)
            }).catch(() => {
              this.$store.dispatch('REDIRECT_LOGIN', result.code)
            })
          } else {
            this.$msgBox({
              content: result.msg,
              isShowCancelBtn: false
            }).catch(() => {})
          }
        }
      }).catch(() => {
        this.load = false;
        this.$msgBox({
          content: '获取附件失败',
          isShowCancelBtn: false
        })
      })
    }
  },
  mounted () {
    this.kg = false;
    this.savePic.lecturerUserNo = this.userInfo.userNo;
    this.savePic.orgNo = this.userInfo.orgNo;
    this.getAc();
  },
  created () {
    // this.ty = this.type;
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.accessory_panel{
  width: 720px;
  margin-left: -360px;
  .modal_body{
    overflow: hidden;
  }
  .modal_foot{
    border-top: 1px solid #e7e7eb;
    padding: 20px;
    text-align: center;
  }
}
.upload_box{
  line-height: 36px;
  padding: 10px 20px;
  border-bottom: 1px solid #e7e7eb;
  span{
    margin-right: 12px;
    color: #666;
  }
}
.ac_list{
  margin: 12px;
}
.item_ac{
  position: relative;
  line-height: 30px;
  border-bottom: 1px dashed #ddd;
  .name{
    float: left;
    position: relative;
    width: 500px;
    z-index: 3;
    text-indent: .5em;
  }
  .progress{
    position: absolute;
    z-index: 2;
    left: 0;
    top: 0;
    width: 500px;
    height: 28px;
    border: 1px solid #ddd;
    .tip{
      position: absolute;
      left: 101%;
      top: 0;
      width: 150px;
    }
  }
  .entity{
    height: 100%;
    background-color: rgba(0, 204, 0, 0.59);
  }
  .del{
    float: right;
  }
}
</style>
