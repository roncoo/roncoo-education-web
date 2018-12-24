<!-- 课程大纲列表 -->
<template>
  <div class="info_body">
    <div class="info_title"><span></span>课程大纲</div>
    <div class="chapter_info" v-for="(one, index) in list" :key="index">
      <div class="chapter_title">
        <span>第{{index + 1}}章&nbsp;&nbsp;</span>{{one.chapterName}}
      </div>
      <div class="chapter_body" v-for="(two, num) in one.periodInfoV2DTOList" :key="num">
        <div class="chapter_top" @click="videoPlay(two)" :class="{on : nowNo == two.periodNo}">
          <div class="chapter_video" :class="{no_v: !two.periodVideoDTOList || !two.periodVideoDTOList.length}"></div>
          <span class="chapter_num">第{{num+1}}讲</span>
          <span v-if="!two.periodVideoDTOList || !two.periodVideoDTOList.length" class="no_video">(未更新)</span>
          <span v-if="allFree || two.isFree" class="c_blue">(免费)</span>
          {{two.periodName}}
          <span class="video_time fr" v-if="two.periodVideoDTOList && two.periodVideoDTOList.length">{{two.periodVideoDTOList[0].vlength}}分钟</span>
        </div>
        <!-- <a :href="two.accessoryInfoDTOList[0].acUrl" v-if="two.accessoryInfoDTOList && userInfo && two.accessoryInfoDTOList.length && !minVideo">下载课件</a> -->
        <a href="javascript:" @click="noDown(two)" v-if="two.accessoryInfoDTOList && two.accessoryInfoDTOList.length">下载课件</a>
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
    courseData: {
      type: Object,
      default: null
    },
    nowNo: {
      type: String,
      default: ''
    },
  },
  data (){
    return {
      allFree : this.courseData? this.courseData.courseInfoDTO.isFree : false 
    }
  },
  methods: {
    videoPlay (data) {
      console.log(data)
      if (!this.$store.state.tokenInfo) {
        this.$msgBox({
          content: '请先登录'
        }).then(res => {
          this.$store.dispatch('REDIRECT_LOGIN');
        }).catch(() => {
        })
        return false;
      }
      if (data.isFree || this.allFree) {
        this.$emit('playfunc', data)
      }else{
        this.$msgBox({
          content: '该章节购买后才可以播放'
        }).then(res => {
          this.$store.dispatch('REDIRECT_LOGIN');
        }).catch(() => {
        })
        return false;
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">

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
    .chapter_title {
      font-size: 14px;
      font-weight: 700;
      color: #333;
      padding-bottom: 10px;
    }
  }
  .chapter_body {
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
  .chapter_top {
    width: 627px;
    padding-left: 20px;
    // margin-top: 6px;
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
    .chapter_num {
      margin-right: 6px;
    }
    .chapter_time {
      display: inline-block;
      height: 23px;
      position: absolute;
      line-height: 23px;
      top: 13px;
      right: 0px;
      padding-right: 20px;
      border-right: 2px solid rgb(245, 245, 245);
    }
    .chapter_video {
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
      .chapter_video {
        background: url(../../assets/image/video.png) center center;
        &.no_v {
          background: url(../../assets/image/no_video.svg) no-repeat center center;
        }
      }
    }
  }
</style>
