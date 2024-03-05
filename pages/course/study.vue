<template>
  <div class="detail_video clearfix">
    <div class="video_header">
      <div class="header_left">
        <span class="return_btn" @click="handleBack">
          <img src="~/assets/svg/return.svg" alt="return" />
        </span>
        <nuxt-link :to="{ name: 'course-detail', query: { id: courseInfo.id } }" class="left_col">
          <span class="header-course">
            {{ courseInfo.courseName }}
          </span>
        </nuxt-link>
      </div>
      <div class="header_right">
        <nuxt-link :to="{ name: 'account-course' }" class="left_col">
          <span class="account">我的课程</span>
        </nuxt-link>
      </div>
    </div>
    <div class="video_body clearfix">
      <div class="video_content" :class="{ show_panel: cateType }">
        <div class="win_box">
          <div id="player" class="video_win" :style="'background-image:url(' + courseInfo.courseLogo + ')'" />
        </div>
        <div class="video_info">
          <div :class="{ on: cateType == 1 }" @click="changeTab(1)">目录</div>
          <div :class="{ on: cateType == 2 }" @click="changeTab(2)">课件</div>
        </div>

        <div class="cate_panel">
          <div v-if="cateType == 1">
            <div v-for="(one, index) in courseInfo.chapterRespList" :key="index">
              <div>第{{ index + 1 }}章：{{ one.chapterName }}</div>
              <div v-for="(two, num) in one.periodRespList" :key="num" :class="{ on: playPeriodId == two.id }" @click="playVideo(two)">
                <span class="iconfont">&#xe690;</span><span>第{{ num + 1 }}节：</span>{{ two.periodName }}
                <span v-if="two.resourceResp && two.resourceResp.videoStatus === 1" class="no_video2">(未更新)</span>
                <span v-if="two.isFree" class="c_blue">(免费)</span>
              </div>
            </div>
          </div>
          <div v-if="cateType == 2">
            <div v-for="(one, index) in courseInfo.chapterRespList" :key="index">
              <div>{{ one.chapterName }}</div>
              <div v-for="(two, num) in one.periodRespList" :key="num">
                <span @click="downFile"><i class="iconfont">&#xe602;</i>{{ two.periodName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { courseApi } from '~/api/course.js'
  import { ElMessage } from 'element-plus'

  useHead({
    title: '课程详情',
    meta: [
      { hid: 'keywords', name: 'keywords', content: '课程详情' },
      { hid: 'description', name: 'description', content: '课程详情' }
    ],
    script: [{ src: 'https://player.polyv.net/resp/vod-player/latest/player.js' }]
  })

  const route = useRoute()

  const playPeriodId = ref()
  const courseInfo = ref({})
  const cateType = ref(0)

  const userStudy = {}
  let progressInterval = null
  let myPolyvPlayer = null

  // 下载附件
  function downFile(item) {
    // TODO
  }
  function playVideo(data) {}

  onMounted(async () => {
    // 课程信息
    const res = await courseApi.userCourseDetail({ courseId: route.query.id })
    courseInfo.value = res

    const playRes = await courseApi.playSign({ courseId: route.query.id })
    playPeriodId.value = playRes.periodId
    userStudy.studyId = playRes.studyId

    // 播放视频
    handlePolyvPlay(JSON.parse(playRes.vodPlayConfig))

    window.s2j_onVideoPlay = (vid) => {
      // 播放
      progressInterval = setInterval(() => {
        handleStudyRecord()
      }, 3000)
    }

    window.s2j_onVideoPause = (vid) => {
      // 暂停
      if (progressInterval) {
        clearInterval(progressInterval)
      }
    }

    window.s2j_onPlayOver = (vid) => {
      // 播放完成
      clearInterval(progressInterval)
      handleStudyRecord()
    }
  })

  // 记录进度
  function handleStudyRecord() {
    userStudy.currentDuration = myPolyvPlayer.j2s_getCurrentTime()
    courseApi
      .studyProgress(userStudy)
      .then((res) => {
        if (res === 'OK') {
          // 完成，暂停同步
          clearInterval(progressInterval)
        }
      })
      .catch((error) => {
        myPolyvPlayer.j2s_pauseVideo()
        ElMessageBox.confirm('系统异常将暂停观看，请联系管理员', '提示', { confirmButtonText: '返回', cancelButtonText: '取消', type: 'warning' }).then(() => {
          handleBack()
        })
      })
  }

  function handlePolyvPlay(params) {
    myPolyvPlayer = window.polyvPlayer({
      wrap: '#player',
      autoplay: true,
      hideSwitchPlayer: true,
      showLine: 'off',
      playsafe: params.token,
      ...params
    })
  }

  function handleBack() {
    window.history.go(-1)
  }

  function changeTab(int) {
    cateType.value = int
  }
</script>
<style lang="scss" scoped>
  .video_header {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    height: 66px;
    line-height: 66px;
    margin: 0 auto;
    font-size: 18px;
    img {
      width: 20px;
    }

    .header_left {
      margin-left: 20px;
      .header-course {
        margin-left: 20px;
      }
    }

    .header_right {
      margin-right: 20px;
    }
  }

  .video_body {
    width: 100%;
    background: rgb(51, 51, 51);
    .video_content {
      overflow: hidden;
      .win_box {
        float: left;
        width: calc(100% - 466px);
        height: calc(100vh - 66px);
        .video_win {
          height: calc(100vh);
          background-size: 100%;
        }
      }
      .video_info {
        float: right;
        width: 66px;
        height: calc(100vh - 66px);
        background-color: #333;
        font-size: 18px;
        margin: 0 auto;
        text-align: center;
        div {
          padding: 20px 0;
          color: #fff;
        }
      }
      .cate_panel {
        float: right;
        padding: 20px;
        background-color: #000;
        height: calc(100vh - 106px);
        overflow: auto;
        transition: all 0.5s;
        color: #fff;
      }
    }
  }

  .show_panel {
    .cate_panel {
    }
  }

  .no_video {
    color: #999;
  }

  .no_video2 {
    color: #eee;
  }
</style>
