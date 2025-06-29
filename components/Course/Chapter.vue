<!-- 课程大纲列表 -->
<template>
  <div class="sy_body">
    <div v-for="(one, index) in list" :key="index" class="chapter_info">
      <div class="chapter_name">
        <span>第{{ index + 1 }}章&nbsp;&nbsp;</span>{{ one.chapterName }}
      </div>
      <div v-for="(two, num) in one.periodRespList" :key="num" class="period_info">
        <div class="period_top" :class="{ on: playPeriod == two.id }" @click="handlePlayVideo(two)">
          <span class="period_num">第{{ num + 1 }}讲</span>
          <span style="margin-right: 5px">
            <el-tag v-if="two.periodType === 10">{{ getResourceTypeName(two.resourceResp?.resourceType) }}</el-tag>
          </span>
          <span v-if="two.resourceResp && two.resourceResp.resourceType < 3 && two.resourceResp.videoStatus === 1" class="no_video">(未更新)</span>
          <span>{{ two.periodName }}</span>
          <span v-if="two.resourceResp && two.resourceResp.resourceType < 3 && two.resourceResp.videoStatus === 2">{{ formatTime(two.resourceResp.videoLength) }}</span>
          <span v-if="two.resourceResp && two.resourceResp.resourceType === 3">{{ two.resourceResp.docPage }}页</span>
          &nbsp;<span v-if="two.isFree" class="c_blue">(试看)</span>
          <!-- 右边 -->
          <span v-if="two.periodType === 10 && two.periodProgress" class="video_time fr"> {{ two.periodProgress }}% </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { formatTime, getResourceTypeName } from '~/utils/base.js'

  const router = useRouter()
  const route = useRoute()

  const props = defineProps({
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
  })

  function handlePlayVideo(period) {
    // 资源
    router.push('/course/study?id=' + route.query.id + '&periodId=' + period.id)
  }
</script>

<style lang="scss" scoped>
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
    font-size: 14px;
    border-bottom: 1px solid #ccc;
    margin: 0 auto 30px;
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
      right: 0;
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
      background: url(https://asset.roncoos.com/static/video.png) center center;
      background-size: 21px 21px;

      &.no_v {
        background: url(https://asset.roncoos.com/static/time.png) no-repeat center center;
      }
    }

    &:hover,
    &.on {
      cursor: pointer;
      background: rgb(242, 242, 242);
      color: rgb(213, 20, 35);
    }
  }
</style>
