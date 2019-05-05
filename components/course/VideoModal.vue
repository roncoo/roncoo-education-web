<!-- 播放视频窗口 -->
<template>
  <div class="video_modal">
    <div class="mask" @click="close()"></div>
    <div class="video_content">
      <div class="modal_head">
        <a href="javascript:" @click="close()" class="close iconfont">&#xe616;</a>
      </div>
      <div class="modal_body" ref="playerbox">
        <div id="player"></div>
      </div>
    </div>
  </div>
</template>
<script>
import {chapterSign} from '@/api/course.js'
import {mapState} from 'vuex'
export default {
  props: {
    data: {
      type: [Object, Array],
      default: null
    }
  },
  mounted () {
    console.log(this.data)
    /* eslint-disable*/
    this.videoPlay(this.data.vid);
  },
  computed: {
    ...mapState(['clientData', 'userInfo'])
  },
  methods: {
    videoPlay (vid){
      console.log(this.data)
      let vobj = {
        userNo: this.userInfo.userNo,
        periodNo: this.data.periodNo,
        courseCategory: 2,
        vid: vid
      }
      if (this.data.accessoryNo) {
        vobj.courseCategory = 3
        vobj.periodNo = this.data.accessoryNo
      }
      console.log(vobj)
      chapterSign(vobj).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.play(Object.assign({vid: vid}, res.data));
        } else if (res.code === 402) {
          this.$msgBox({
            content: '购买后才可以观看',
            isShowCancelBtn: false
          })
        }
      })
    },
    play (data) {
      console.log(data)
      let box = this.$refs.playerbox;
      if (this.player) {
        this.player.changeVid({
          vid:data.vid,
          playsafe: data.token,
          ts: data.ts,
          sign: data.sign,
          autoplay: true
        });
      } else {
        this.player = polyvObject('#player').videoPlayer({
            'width': box.offsetWidth,
            'height': box.offsetHeight,
            'forceH5': true,
            'code': data.code,
            'playsafe': data.token,
            'ts': data.ts,
            'sign': data.sign,
            'vid': data.vid
        });
      }
    },
    close () {
      this.$emit('hidefun', event);
    },
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.mask{
  position: fixed;
  left: 0;
  top: 0;
  z-index: 888;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.video_content{
  position: fixed;
  z-index: 999;
  top: 10%;
  left: 10%;
  right: 10%;
  bottom: 10%;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.modal_head{
  line-height: 46px;
  background-color: #f9f9f9;
  text-align: right;
  padding: 0 20px;
  .close{
    font-size: 14px;
  }
}
.modal_body{
  height: 460px;
  flex: 1;
  overflow: auto;
  position: relative;
  .img{
    padding: 30px;
  }
  .more{
    margin: 0 30px;
    border-top: 1px solid #ddd;
    a{
      color: #106af6;
      display: inline-block;
      margin-bottom: 8px;
      margin-right: 8px;
      text-decoration: underline;
    }
    .text{
      line-height: 30px;
    }
  }
}
</style>