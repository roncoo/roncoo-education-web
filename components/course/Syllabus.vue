<!-- 课程大纲列表 -->
<template>
  <div class="sy_body">
    <div class="title"><span></span>课程大纲</div>
    <div class="chapter_info" v-for="(one, index) in list" :key="index">
      <div class="chapter_name">
        <span>第{{index + 1}}章&nbsp;&nbsp;</span>{{one.chapterName}}
      </div>
      <div class="period_info" v-for="(two, num) in one.periodList" :key="num">
        <div class="period_top" @click="videoPlay(two)" :class="{on : nowNo == two.id}">
          <div class="period_video" :class="{no_v: !two.videoVid}"></div>
          <span class="period_num">第{{num+1}}讲</span>
          <span v-if="!two.videoVid" class="no_video">(未更新)</span>
          <span v-if="two.isFree" class="c_blue">(免费)</span>
          {{two.periodName}}
          <span class="video_time fr" v-if="two.videoVid">{{two.videoLength}}分钟</span>
        </div>
        <!-- <a :href="two.accessoryInfoDTOList[0].acUrl" v-if="two.accessoryInfoDTOList && userInfo && two.accessoryInfoDTOList.length && !minVideo">下载课件</a> -->
        <a href="javascript:" @click="noDown(two)" v-if="two.isDoc">下载课件</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: []
    },
    nowNo: {
      type: String,
      default: ''
    },
  },
  data (){
    return {
    }
  },
  methods: {
    noDown (item) {
      console.log(item)
      if (!this.$store.state.tokenInfo) {
        this.$msgBox({
          content: '登录后才可以下载'
        }).then(res => {
          this.$store.dispatch('REDIRECT_LOGIN');
        }).catch(() => {
        })
        return false;
      }
      if (!item.isFree) {
        this.$msgBox({
          content: '购买后才可以下载',
          isShowCancelBtn: false
        }).then(() => {
          // this.openOrder()
        }).catch(() => {})
        return false;
      }
      window.location.href = item.docUrl
    },
    videoPlay (data) {
      console.log(data)
      if (!data.videoVid) {
        this.$msgBox({
          content: '该视频未更新',
          isShowCancelBtn: false
        }).catch(() => {})
        return false;
      }
      if (!this.$store.state.tokenInfo) {
        this.$msgBox({
          content: '请先登录'
        }).then(res => {
          this.$store.dispatch('REDIRECT_LOGIN');
        }).catch(() => {
        })
        return false;
      }
      
      this.$emit('playfunc', data)
      
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
  .sy_body{
    .title {
      border-left: 3px solid #000;
      padding-left: 12px;
      font-size: 16px;
      color: #000;
      font-weight: 700;
      margin-bottom: 25px;
    }
  }
  .chapter_info {
    width: 839px;
    margin: 0 auto;
    font-size: 14px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 30px;
    padding-bottom: 20px;
    &:last-child {
      border: none;
    }
    .chapter_name {
      font-size: 14px;
      font-weight: 700;
      color: #333;
      padding-bottom: 10px;
    }
  }
  .period_info {
    position: relative;
    a {
      display: inline-block;
      font-size: 12px;
      width: 66px;
      height: 26px;
      text-align: center;
      line-height: 26px;
      color: #999;
      position: absolute;
      right: 0px;
      top: 10px;
      border: 1px solid rgb(153, 153, 153);
      border-radius: 13px;
      &:hover {
        color: rgb(213, 20, 35);
        text-decoration: none;
        border: 1px solid rgb(213, 20, 35);
        cursor: pointer;
      }
    }
  }
  .period_top {
    width: 627px;
    padding-left: 20px;
    height: 46px;
    line-height: 46px;
    position: relative;
    padding-right: 104px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    .video_time {
      position: absolute;
      right: 0;
    }
    .period_num {
      margin-right: 6px;
    }
    .period_video {
      display: inline-block;
      width: 21px;
      height: 21px;
      position: relative;
      top: 6px;
      margin-right: 10px;
      background: url(../../assets/image/video1.svg) center center;
      background-size: 21px 21px;
      &.no_v {
        background: url(../../assets/image/no_video.svg) no-repeat center center;
      }
    }
    &:hover, &.on {
      cursor: pointer;
      background: rgb(242, 242, 242);
      color: rgb(213, 20, 35);
      .period_video {
        background: url(../../assets/image/video.png) center center;
        &.no_v {
          background: url(../../assets/image/no_video.svg) no-repeat center center;
        }
      }
    }
  }
</style>
