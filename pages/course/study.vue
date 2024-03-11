<template>
  <div class="detail-video">
    <div class="video-header">
      <div class="header-left">
        <span class="cursor" @click="handleBack">
          <img class="cursor-image" src="~/assets/svg/return.svg" alt="return" />
        </span>
        <nuxt-link :to="{ name: 'course-detail', query: { id: courseInfo.id } }" class="left_col">
          <span class="header-course">
            {{ courseInfo.courseName }}
          </span>
        </nuxt-link>
        <course-collect :course-id="courseInfo.id" :collect-status="courseInfo.courseCollect" />
      </div>
      <div class="header-right">
        <common-user />
      </div>
    </div>
    <div class="video-body">
      <div class="video-content" :class="{ show_panel: cateType }">
        <div class="player-box">
          <div id="player" class="player-video" />
        </div>
        <div class="video-info">
          <el-tabs v-model="activeTab" class="video-info-tabs" tab-position="right" @tab-click="handleTabClick">
            <el-tab-pane label="目录" name="catalog ">
              <div v-for="(one, index) in courseInfo.chapterRespList" :key="index" class="video-info-catalog">
                <div class="catalog-chapter">第{{ index + 1 }}章：{{ one.chapterName }}</div>
                <div v-for="(two, num) in one.periodRespList" :key="num" class="catalog-chapter-period cursor" :class="{ on: playPeriodId == two.id }" @click="playVideo(two)">
                  <span>&nbsp;&nbsp;视频：{{ index + 1 }}-{{ num + 1 }} {{ two.periodName }}</span>
                  <span v-if="two.resourceResp && two.resourceResp.videoStatus === 1">(未更新)</span>
                  <span v-if="two.isFree">(免费)</span>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="章节" name="chapter">
              <div v-for="(one, index) in courseInfo.chapterRespList" :key="index" class="video-info-chapter">
                <div>{{ one.chapterName }}</div>
                <div v-for="(two, num) in one.periodRespList" :key="num">
                  <span>{{ two.periodName }}</span>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { courseApi } from '~/api/course.js'

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
  async function playVideo(data) {
    const playRes = await courseApi.playSign({ periodId: data.id, courseId: route.query.id })
    handlePolyvPlay(playRes)
  }

  onMounted(async () => {
    // 课程信息
    const res = await courseApi.userCourseDetail({ courseId: route.query.id })
    courseInfo.value = res

    const playRes = await courseApi.playSign({ courseId: route.query.id })
    // 播放视频
    await handlePolyvPlay(playRes)

    window.s2j_onVideoPlay = () => {
      // 播放
      progressInterval = setInterval(() => {
        handleStudyRecord()
      }, 3000)
    }

    window.s2j_onVideoPause = () => {
      // 暂停
      if (progressInterval) {
        clearInterval(progressInterval)
      }
    }

    window.s2j_onPlayOver = () => {
      // 播放完成
      clearInterval(progressInterval)
      handleStudyRecord()
    }
  })

  onUnmounted(() => {
    if (myPolyvPlayer) {
      myPolyvPlayer.destroy()
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

  // 保利威播放
  function handlePolyvPlay(playRes) {
    playPeriodId.value = playRes.periodId
    userStudy.studyId = playRes.studyId
    userStudy.resourceId = playRes.resourceId
    const params = JSON.parse(playRes.vodPlayConfig)

    if (myPolyvPlayer) {
      myPolyvPlayer.destroy()
    }

    myPolyvPlayer = window.polyvPlayer({
      wrap: '#player',
      height: '100%',
      width: '100%',
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

  const activeTab = ref(0)
  function handleTabClick(tab) {
    if (activeTab.value === tab.props.name) {
      activeTab.value = 0
    } else {
      activeTab.value = tab.props.name
    }
  }
</script>
<style lang="scss">
  .video-header {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    height: 66px;
    line-height: 66px;
    margin: 0 auto;
    font-size: 18px;
    .cursor-image {
      width: 20px;
    }
    .header-left {
      margin-left: 20px;
      .header-course {
        margin-left: 20px;
      }
    }
    .header-right {
      margin-right: 20px;
      display: flex;
      align-items: center;
    }
  }

  .video-body {
    background: #000;
    .video-content {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      .player-box {
        width: calc(100% - 66px);
        padding: 20px 20px 0;
        .player-video {
          height: calc(100vh - 86px);
        }
      }

      .video-info {
        background: #fff;
        .video-info-catalog,
        .video-info-chapter {
          width: 400px;
          padding: 20px;
        }

        .catalog-chapter {
          padding: 10px 0;
          font-size: 14px;
        }
        .catalog-chapter-period {
          padding: 5px 0;

          &:hover {
            color: blue;
          }
        }

        .on {
          color: blue;
        }
      }
    }
  }
</style>
