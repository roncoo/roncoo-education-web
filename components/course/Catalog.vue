<!-- 课程大纲列表 -->
<template>
  <div class="sy_body">
    <div v-for="(one, index) in list" :key="index" class="chapter_info">
      <div class="chapter_name">
        <span>第{{ index + 1 }}章&nbsp;&nbsp;</span>{{ one.chapterName }}
      </div>
      <div v-for="(two, num) in one.periodRespList" :key="num" class="period_info">
        <div class="period_top" :class="{on : playPeriod == two.id}" @click="playVideo(two)">
          <div class="period_video" :class="{no_v: !two.videoVid}" />
          <span class="period_num">第{{ num + 1 }}讲</span>
          <span v-if="two.resourceResp && two.resourceResp.videoStatus === 1" class="no_video">(未更新)</span>
          <span v-if="two.isFree" class="c_blue">(免费)</span>
          {{ two.periodName }}
          <span v-if="two.resourceResp && two.resourceResp.videoStatus === 2">{{ formatDuring(two.resourceResp.videoLength * 1000) }}</span>
          <span v-if="two.periodProgress" class="video_time fr">{{ two.periodProgress }}%</span>
        </div>
        <a v-if="two.isDoc" href="javascript:" @click="downFile(two)">下载课件</a>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDuring } from '@/utils/utils.js'

export default {
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    playPeriod: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tokenInfo: this.$store.state.tokenInfo
    }
  },
  mounted() {
  },
  methods: {
    formatDuring(data) {
      return formatDuring(data)
    },
    downFile(item) {
      // TODO
    },
    playVideo(data) {
      if (!this.tokenInfo) {
        this.$msgBox({
          content: '请先登录'
        }).then(res => {
          this.$store.dispatch('REDIRECT_LOGIN')
        })
        return false
      }
      if (data.resourceResp && data.resourceResp.videoStatus === 1) {
        this.$msgBox({
          content: '该视频未更新',
          isShowCancelBtn: false
        })
        return false
      }

      this.$emit('playfunc', data.id)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
.sy_body {
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
  //width: 627px;
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
    right: 10px;
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
