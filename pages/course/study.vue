<template>
  <div class="detail-video">
    <div class="video-header">
      <div class="header-left">
        <span class="cursor" @click="handleBack">
          <img class="cursor-image" src="https://asset.roncoos.com/static/return.png" alt="return" />
        </span>
        <nuxt-link :to="{ name: 'course-detail', query: { id: courseInfo?.id } }" class="left_col">
          <span class="header-course">
            {{ courseInfo?.courseName }}
          </span>
        </nuxt-link>
        <course-collect :course-id="courseInfo?.id" :collect-status="courseInfo?.courseCollect" />
      </div>
      <div class="header-right">
        <common-user />
      </div>
    </div>
    <div class="video-body">
      <div class="video-content" :class="{ show_panel: cateType }">
        <div class="player-box">
          <!-- 播放器 -->
          <div v-show="showing" id="player" v-loading="loading" class="player-video" />
          <div v-show="!showing" class="study-tip">
            <div v-if="nextPeriod">
              下一节：{{ nextPeriod?.periodName }}
              <el-button size="small" type="success" @click="handleStudy(nextPeriod)"> 马上学习</el-button>
            </div>
          </div>
        </div>
        <div class="video-info">
          <div class="video-info-tab">
            <div :class="{ on: cateType === 'chapter' }" class="video-info-button cursor" @click="handleTab('chapter')"><img src="~/assets/svg/chapter.svg" class="img-icon" />目录</div>
            <div :class="{ on: cateType === 'comment' }" class="video-info-button cursor" @click="handleTab('comment')"><img src="~/assets/svg/comment.svg" class="img-icon" />评论</div>
          </div>
          <div v-if="cateType != ''" class="video-info-content">
            <div v-if="cateType === 'chapter'" class="video-info-chapter">
              <div v-for="(one, index) in courseInfo?.chapterRespList" :key="index">
                <div class="catalog-chapter">第{{ index + 1 }}章：{{ one.chapterName }}</div>
                <div v-for="(two, num) in one.periodRespList" :key="num" class="catalog-chapter-period cursor" :class="{ on: studyPeriodId == two?.id }" @click="handleStudy(two)">
                  <div class="period-name">
                    &nbsp;&nbsp;
                    <span v-if="two.periodType === 10">{{ getResourceTypeName(two.resourceResp?.resourceType) }}：</span>
                    {{ index + 1 }}-{{ num + 1 }} {{ two.periodName }}
                    <span v-if="two.resourceResp && two.resourceResp.resourceType < 3 && two.resourceResp.videoStatus === 1">(未更新)</span>
                    <span v-if="two.isFree">(试看)</span>
                    <div v-if="two.periodType === 10" class="period-progress">
                      <el-progress v-if="two" :percentage="two.periodProgress ? two.periodProgress : 0" :stroke-width="2" :status="two.periodProgress > 99 ? 'success' : ''" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="cateType === 'comment'" class="video-info-comment">
              <course-comment :course-id="courseInfo?.id" :show-page="false" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { courseApi } from '~/api/course.js'
  import { getClient, getClientForPri } from '~/utils/polyv'

  const route = useRoute()

  useHead({
    title: '课程详情',
    meta: [
      { hid: 'keywords', name: 'keywords', content: '课程详情' },
      { hid: 'description', name: 'description', content: '课程详情' }
    ],
    script: [{ src: 'https://player.polyv.net/resp/vod-player/latest/player.js' }]
  })

  const courseInfo = ref(null)
  const loading = ref(false)
  const showing = ref(true)

  // 当前播放的课时id
  const studyPeriodId = ref()
  // 下一个课时
  const nextPeriod = ref()
  // 用户学习信息
  const userStudy = {}
  let progressInterval = null
  let polyvPlayerClient = null

  onMounted(async () => {
    // 课程信息
    await getCourseInfo()

    // 初始化学习
    await handleStudy({ id: route.query.periodId })
  })

  onUnmounted(() => {
    // 清除
    handleClear()
  })

  // 学习
  async function handleStudy(period) {
    loading.value = true
    showing.value = true

    // 更新课程信息
    await getCourseInfo()
    let studyRes
    try {
      studyRes = await courseApi.studySign({ periodId: period.id, courseId: route.query.id })
    } catch (e) {
      loading.value = false
    }

    studyPeriodId.value = studyRes.periodId
    userStudy.studyId = studyRes.studyId
    userStudy.resourceId = studyRes.resourceId

    // 资源类型
    if (studyRes.resourceType <= 2) {
      handleClear()
      // 音视频播放
      handlePlay(studyRes)
    } else if (studyRes.resourceType === 3) {
      // 文档播放
      handleDoc(JSON.parse(studyRes.docStudyConfig).previewUrl)
    } else if (studyRes.resourceType === 4) {
      // 图片播放
      handleDoc(JSON.parse(studyRes.picStudyConfig).previewUrl)
    } else {
      ElMessage.warning('暂不支持该类型资源')
    }
    loading.value = false
  }

  /**
   *  获取课程信息
   */
  async function getCourseInfo() {
    courseInfo.value = await courseApi.userCourseDetail({ courseId: route.query.id })
    return courseInfo.value
  }

  /**
   * 获取课程学习中的下一节
   * @param periodId
   * @returns {*}
   */
  function getNextPeriod(periodId) {
    for (let i = 0; i < courseInfo.value.chapterRespList.length; i++) {
      for (let j = 0; j < courseInfo.value.chapterRespList[i].periodRespList.length; j++) {
        if (courseInfo.value.chapterRespList[i].periodRespList[j].id === periodId) {
          if (courseInfo.value.chapterRespList[i].periodRespList.length === j + 1) {
            if (courseInfo.value.chapterRespList[i + 1]) {
              return courseInfo.value.chapterRespList[i + 1].periodRespList[0]
            }
          } else {
            return courseInfo.value.chapterRespList[i].periodRespList[j + 1]
          }
        }
      }
    }
  }

  /**
   * 文档图片播放
   */
  function handleDoc(srcPath) {
    const iframe = document.createElement('iframe')
    iframe.setAttribute('src', srcPath)
    iframe.style.width = '100%'
    iframe.style.height = '100%'
    const player = document.getElementById('player')
    player.innerHTML = ''
    player.appendChild(iframe)

    // 记录进度
    handleStudyRecord()
  }

  // 音视频播放
  function handlePlay(playRes) {
    // 清除内容
    document.getElementById('player').innerHTML = ''
    if (playRes.vodPlatform === 1) {
      // 领课云
      polyvPlayerClient = getClientForPri(playRes, courseInfo.value.speedDouble, courseInfo.value.speedDrag)
      polyvPlayerClient.on('s2j_onVideoPlay', function () {
        // 开始播放
        handleStart()
      })
      polyvPlayerClient.on('s2j_onVideoPause', function () {
        // 暂停播放
        handlePause()
      })
      polyvPlayerClient.on('s2j_onPlayOver', function () {
        // 完成播放
        handleComplete()
      })
    } else if (playRes.vodPlatform === 2) {
      // 保利威
      polyvPlayerClient = getClient(playRes, courseInfo.value.speedDouble, courseInfo.value.speedDrag)
      polyvPlayerClient.on('s2j_onVideoPlay', function () {
        // 开始播放
        handleStart()
      })
      polyvPlayerClient.on('s2j_onVideoPause', function () {
        // 暂停播放
        handlePause()
      })
      polyvPlayerClient.on('s2j_onPlayOver', function () {
        // 完成播放
        handleComplete()
      })
    } else {
      // 其他
      ElMessage.warning('暂不支持该平台的播放')
    }
  }

  // 记录进度
  function handleStudyRecordForVod(studyStatus) {
    userStudy.currentDuration = polyvPlayerClient.j2s_getCurrentTime()
    // studyStatus 1学习中 2暂停
    userStudy.studyStatus = studyStatus
    courseApi
      .studyProgress(userStudy)
      .then((res) => {
        if (res === 'OK') {
          // 完成，暂停同步
          if (progressInterval) {
            clearInterval(progressInterval)
          }
        }
      })
      .catch((error) => {
        polyvPlayerClient.j2s_pauseVideo()
        ElMessageBox.confirm('系统异常将暂停观看，请联系管理员', '提示', {
          confirmButtonText: '返回',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          handleBack()
        })
      })
  }

  // 记录进度
  function handleStudyRecord() {
    userStudy.currentPage = 1
    courseApi
      .studyProgress(userStudy)
      .then((res) => {
        if (res === 'OK') {
          // 完成，暂停同步
          if (progressInterval) {
            clearInterval(progressInterval)
          }
        }
      })
      .catch((error) => {
        ElMessageBox.confirm('系统异常将暂停观看，请联系管理员', '提示', {
          confirmButtonText: '返回',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          handleBack()
        })
      })
  }

  // tab切换
  const cateType = ref('chapter')

  function handleTab(item) {
    if (item === cateType.value) {
      cateType.value = ''
    } else {
      cateType.value = item
    }
  }

  // 开始
  function handleStart() {
    // 播放
    if (progressInterval) {
      clearInterval(progressInterval)
    }
    progressInterval = setInterval(() => {
      handleStudyRecordForVod(1)
    }, 3000)
  }

  // 暂停
  function handlePause() {
    // 更新进度
    handleStudyRecordForVod(2)
    if (progressInterval) {
      clearInterval(progressInterval)
    }
  }

  // 完成播放
  function handleComplete() {
    // 更新进度
    handleStudyRecordForVod(1)
    // 播放完成
    if (progressInterval) {
      clearInterval(progressInterval)
    }

    // 显示下一节
    showing.value = false
    nextPeriod.value = getNextPeriod(studyPeriodId.value)
  }

  // 清除
  function handleClear() {
    if (progressInterval) {
      clearInterval(progressInterval)
    }
    if (polyvPlayerClient) {
      // 暂停学习
      handleStudyRecordForVod(2)
      polyvPlayerClient.destroy()
    }
  }

  function handleBack() {
    window.history.go(-1)
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

        .study-tip {
          height: calc(100vh - 86px);
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          color: #fff;
          font-size: 16px;
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
          height: calc(100vh - 86px);
          overflow: auto;

          .catalog-chapter {
            font-size: 16px;
            margin: 15px 0;
          }

          .catalog-chapter-period {
            font-size: 14px;
            margin: 10px;

            &:hover {
              color: red;
            }

            .period-name {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              width: 350px;
            }

            .period-progress {
              height: 20px;
              width: 300px;
              margin-left: 50px;
            }

            .period-live {
              font-size: 12px;
              text-align: right;
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
