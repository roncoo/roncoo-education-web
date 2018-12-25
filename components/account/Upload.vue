<template>
  <div class="">
    <div v-if="ov == 1" class="progress"><div class="entity" :style="{width: jd + '%'}">{{tip}}</div></div>
    <button v-else  class="solid_btn" @click="upimg" type="button">{{btntxt}}</button>
    <div class="tip" v-if="ov == 2 && !upOk">{{tip}}</div>
    <input :id="docId" name="file" style="display: none;" type="file" :accept="accept" multiple="multiple" @change="update"/>
  </div>
</template>
<script>
import {uploadPic, uploadDoc, uploadResVideo} from '~/api/upload.js'
import {mapState} from 'vuex'
export default {
  props: {
    isresource: {
      type: Boolean,
      default: false
    },
    isTiku: {
      type: Boolean
    },
    accept: {
      type: String,
      default: ''
    },
    btntxt: {
      type: String,
      default: '选择文件'
    },
    upOk: {
      type: Boolean
    }
  },
  data () {
    return {
      docId: '',
      ov: 0,
      jd: 0,
      tip: ''
    }
  },
  computed: {
    ...mapState(['clientData'])
  },
  methods: {
    // 选择上传图片
    upimg () {
      let myfile = document.getElementById(this.docId);
      myfile.click();
    },
    update (e) {
      let file = e.target.files[0];
      console.log(file)
      let that = this;
      let uploadType = uploadPic
      let typeFile = 'picFile'
      /* eslint-disable no-undef */
      let param = new FormData();
      if (this.isresource) {
        // console.log(file)
        let suffix = ''
        if (file) {
          suffix = /\.(\w+)$/.exec(file.name)[1]
        }
        // console.log(suffix)
        if (['mp4', 'avi', 'mpg', 'mpeg', 'ram', 'flv', 'mov', 'asf', '3gp', 'f4v', 'wmv', 'FLV', 'MOV', 'ASF', '3GP', 'F4V', 'WMV'].indexOf(suffix) !== -1) {
          uploadType = uploadResVideo
          typeFile = 'videoFile'
          param.append('type', 4)
          let orgNo = this.clientData.no
          param.append('orgNo', orgNo)
        } else if (['docx', 'doc', 'pdf'].indexOf(suffix) !== -1) {
          uploadType = uploadDoc
          typeFile = 'docFile'
        } else if (this.isTiku && ['jpg', 'jpeg', 'png'].indexOf(suffix) !== -1) {
          uploadType = uploadPic
          typeFile = 'picFile'
        } else if (this.isTiku) {
          uploadType = uploadDoc
          typeFile = 'docFile'
        } else {
          if (!file) {
            return
          }
          let msg = '文件只能上传视频，Word文档和PDF文档'
          this.$msgBox.showMsgBox({
            content: msg,
            isShowCancelBtn: false
          })
          e.target.value = '';
          return false
        }
      }
      // console.log(file)
      // console.log(uploadType, typeFile)
      param.append(typeFile, file, file.name);
      // console.log(param)
      uploadType(param, function (int) {
        that.jd = int;
        that.ov = 1;
        that.tip = '上传中...';
        // console.log(int)
      }).then(res => {
        e.target.value = '';
        console.log(res)
        console.log('upload--------')
        that.ov = 2;
        if (res.code === 200) {
          that.tip = '上传成功';
          that.$emit('rtnUrl', {name: file.name, url: res.data});
        } else {
          that.tip = res.msg;
        }
        // console.log(res)
      }).catch(() => {
        that.ov = 2;
        that.tip = '上传失败';
      })
    },
    randomString (len) {
      len = len || 32;
      let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
      let maxPos = $chars.length;
      let pwd = '';
      for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    }
  },
  mounted () {
  },
  created () {
    this.docId = this.randomString(6);
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.progress{
  display: inline-block;
  line-height: 34px;
  height: 34px;
  width: 110px;
  border-radius: 3px;
  background-color: #ddd;
  color: #333;
  text-align: center;
  box-shadow: 0 0 4px #a2a2a2 inset;
  overflow: hidden;
  .entity{
    height: 100%;
    background-color: #0c0;
    border-radius: 6px;
  }
}
.tip{
  display: inline-block;
}
</style>
