<template>
  <div class="upload_com">
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
  watch: {
    upOk (newData) {
      if (newData) {
        this.ov = 0
      }
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
      let that = this;
      let uploadType = uploadPic
      let typeFile = 'picFile'
      /* eslint-disable no-undef */
      let param = new FormData();
      if (this.isresource) {
        uploadType = uploadDoc
        typeFile = 'docFile'
      }
      param.append(typeFile, file, file.name);
      // console.log(param)
      uploadType(param, function (int) {
        that.jd = int;
        that.ov = 1;
        that.tip = '上传中...';
      }).then(res => {
        e.target.value = '';
        that.ov = 2;
        if (res.code === 200) {
          e.target.value = '';
          that.tip = '上传成功';
          that.jd = 100
          that.$emit('rtnUrl', {name: file.name, url: res.data});
        } else {
          that.tip = res.msg;
        }
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
    this.tip = ''
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
