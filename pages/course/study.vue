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
          <div class="video-info-tab">
            <div :class="{ on: cateType === 'chapter' }" class="video-info-button cursor" @click="handleTab('chapter')"><img src="~/assets/svg/chapter.svg" class="img-icon" />目录</div>
            <div :class="{ on: cateType === 'comment' }" class="video-info-button cursor" @click="handleTab('comment')"><img src="~/assets/svg/comment.svg" class="img-icon" />评论</div>
          </div>
          <div v-if="cateType != ''" class="video-info-content">
            <div v-if="cateType === 'chapter'" class="video-info-chapter">
              <div v-for="(one, index) in courseInfo.chapterRespList" :key="index">
                <div class="catalog-chapter">第{{ index + 1 }}章：{{ one.chapterName }}</div>
                <div v-for="(two, num) in one.periodRespList" :key="num" class="catalog-chapter-period cursor" :class="{ on: playPeriodId == two.id }" @click="playVideo(two)">
                  <span>&nbsp;&nbsp;视频：{{ index + 1 }}-{{ num + 1 }} {{ two.periodName }}</span>
                  <span v-if="two.resourceResp && two.resourceResp.videoStatus === 1">(未更新)</span>
                  <span v-if="two.isFree">(免费)</span>
                </div>
              </div>
            </div>
            <div v-if="cateType === 'comment'" class="video-info-comment">
              <course-comment :course-id="courseInfo.id" :show-page="false" />
            </div>
          </div>
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
    ]
  })

  const route = useRoute()

  const playPeriodId = ref()
  const courseInfo = ref({})
  const cateType = ref('chapter')

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

    if (playRes.vodPlatform === 1) {
      // 私有化，这里也使用保利威的播放器
      myPolyvPlayer = window.polyvPlayer({
        wrap: '#player',
        height: '100%',
        width: '100%',
        autoplay: true,
        hideSwitchPlayer: true,
        showLine: 'off',
        url: params.hdUrl
      })
    } else if (playRes.vodPlatform === 2) {
      // 保利威
      myPolyvPlayer = window.polyvPlayer({
        wrap: '#player',
        height: '100%',
        width: '100%',
        autoplay: true,
        hideSwitchPlayer: true,
        showLine: 'off',
        history_video_duration: 1,
        playsafe: params.token,
        ...params
      })
    } else {
      // 其他
      ElMessage.warning('暂不支持该类型的播放')
    }
  }

  function handleBack() {
    window.history.go(-1)
  }

  const showContent = ref(false)
  function handleTab(item) {
    if (item === cateType.value) {
      cateType.value = ''
    } else {
      cateType.value = item
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
        padding: 10px 20px;
        .player-video {
          height: calc(100vh - 86px);
        }
      }

      .video-info {
        background: #1c1f21;
        display: flex;
        flex-direction: row-reverse;
        .video-info-tab {
          width: 80px;
          margin-top: calc(50vh - 120px);
          font-size: 16px;
          .video-info-button {
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px 0;
            .img-icon {
              width: 25px;
            }
            &:hover {
              background-color: #333;
            }
          }
          .on {
            background-color: #333;
          }
        }
        .content {
          display: block;
        }
        .video-info-content {
          background-color: #333;
          color: #fff;
          width: 400px;
          padding: 20px;
          overflow: hidden;
          .catalog-chapter {
            font-size: 16px;
            margin: 15px 0;
          }
          .catalog-chapter-period {
            font-size: 14px;
            margin: 5px;
            &:hover {
              color: #2256f6;
            }
          }
          .on {
            color: #2256f6;
          }
        }
      }
    }
  }
</style>
