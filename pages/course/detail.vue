<template>
  <NuxtLayout>
    <div class="detail_content">
      <div class="detail_body">
        <div class="detail_header clearfix">
          <div class="detail_title">
            <nuxt-link :to="{ path: '/' }"> 首页 </nuxt-link>
            <span>></span>
          </div>
          <div class="detail_title">
            <nuxt-link :to="{ name: 'course-list' }"> 课程中心 </nuxt-link>
            <span>></span>
          </div>
          <div class="detail_title">
            {{ courseInfo.courseName }}
          </div>
        </div>
        <div class="clearfix">
          <div class="video_box">
            <div id="player" class="detail_view" :style="'background-image:url(' + courseInfo.courseLogo + ')'" />
          </div>
          <div class="view_info">
            <p>{{ courseInfo.courseName }}</p>
            <div class="view_price">
              <div>
                价格:<span v-if="courseInfo.coursePrice === 0">免费</span>
                <span v-else>
                  ￥{{ courseInfo.coursePrice }} <b style="text-decoration-line: line-through; color: grey; font-size: 18px">￥{{ courseInfo.rulingPrice }}</b>
                </span>
              </div>
            </div>
            <div v-if="courseInfo.lecturerResp" class="view_info_item">
              <span class="text_b">讲师名称:</span>{{ courseInfo.lecturerResp.lecturerName }}（{{ courseInfo.lecturerResp.lecturerPosition }}）
            </div>
            <div class="view_info_item"><span class="text_b">购买人数:</span>{{ courseInfo.countBuy }} 人</div>
            <div class="view_info_item"><span class="text_b">学习人数:</span>{{ courseInfo.countStudy }} 人</div>
            <div class="foot_box">
              <button v-if="courseInfo.allowStudy === 1" class="buy_btn" @click="handleStudy">马上学习</button>
              <button v-else-if="courseInfo.isFree === 0" class="buy_btn" @click="handleBuy(courseInfo)">立即购买</button>
              <button v-else-if="courseInfo.isFree === 1" class="buy_btn" @click="handleLogin">登录观看</button>
              <div class="handle_info_btn">
                <div class="collect_btn">
                  <course-collect :course-id="courseInfo.id" :collect-status="courseInfo.courseCollect" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="main">
      <!-- 章节详情 -->
      <div class="course_info clearfix">
        <div class="layout_left">
          <el-tabs type="border-card" @tab-click="handleTabClick">
            <el-tab-pane label="课程介绍">
              <div class="introduce" v-html="courseInfo.introduce" />
            </el-tab-pane>
            <el-tab-pane label="课程目录">
              <course-chapter :list="courseInfo.chapterRespList" />
            </el-tab-pane>
            <el-tab-pane label="课程评论" name="comment">
              <course-comment v-if="activeName === 'comment'" :course-id="courseInfo.id" />
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="layout_right">
          <div class="teacher_info clearfix">
            <span class="head">讲师简介</span>
            <div class="teacher_msg">
              <div v-if="courseInfo.lecturerResp" class="teacher_msg_right">
                <img v-if="courseInfo.lecturerResp.lecturerHead" class="teacher_phone" :src="courseInfo.lecturerResp.lecturerHead" alt="" />
                <img v-else class="teacher_phone" src="~/assets/image/common_head.jpg" alt="" />
                <div class="teacher_info_content">
                  <span class="teacher_name">{{ courseInfo.lecturerResp.lecturerName }}</span>
                  <br />
                  {{ courseInfo.lecturerResp.lecturerPosition }}
                </div>
              </div>
              <div class="info_box" v-html="courseInfo.lecturerResp.introduce" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <common-pay ref="commonPayRef" @refresh="handleCourse" />
  </NuxtLayout>
</template>
<script setup>
  import { courseApi } from '~/api/course.js'
  import { setStorage } from '~/utils/storage.js'
  const route = useRoute()

  const { data: courseInfo } = useAsyncData('course-detail' + route.query.id, async () => {
    if (getToken()) {
      // 已登录
      return await courseApi.userCourseDetail({ courseId: route.query.id })
    } else {
      // 未登录
      return await courseApi.courseDetail({ courseId: route.query.id })
    }
  })

  useHead({
    title: courseInfo.value?.courseName,
    meta: [
      { hid: 'keywords', name: 'keywords', content: '领课网络、在线教育系统、开源教育系统、roncoo-education' },
      { hid: 'description', name: 'description', content: courseInfo.lecturerResp?.introduce }
    ]
  })

  const commonPayRef = ref()

  // 购买
  function handleBuy(courseInfo) {
    if (getToken()) {
      // 购买
      commonPayRef.value.onOpen(courseInfo)
    } else {
      setStorage('history', window.location.href, 5)
      ElMessageBox.confirm('请先登录', '提示', { confirmButtonText: '立即登录', cancelButtonText: '取消', type: 'warning' }).then(() => {
        useRouter().push('/login')
      })
    }
  }

  // 课程详情
  async function handleCourse() {}

  // 课程收藏
  function handleCollect() {}

  // 学习
  function handleStudy() {
    useRouter().push('/course/study?id=' + courseInfo.value.id)
  }

  // 登录
  function handleLogin() {
    setStorage('history', window.location.href, 5)
    useRouter().push('/login')
  }

  const activeName = ref('')
  function handleTabClick(tab) {
    activeName.value = tab.props.name
  }
</script>
<style lang="scss" scoped>
  .detail_content {
    background: rgb(51, 51, 51);
    .detail_body {
      width: 1200px;
      margin: 0 auto;
      height: 373px;
    }
    .detail_header {
      .detail_title {
        float: left;
        line-height: 57px;
        margin: 0 5px;
        color: #fff;
        font-size: 14px;
        span {
          margin-left: 10px;
        }
        a {
          color: #fff;
          &:hover {
            text-decoration: none;
          }
        }
      }
    }
    .view_info {
      float: right;
      width: 600px;
      height: 260px;
      position: relative;

      .view_info_item {
        color: rgb(102, 102, 102);
        font-size: 14px;
        margin-top: 5px;

        .text_b {
          margin-right: 20px;
          font-weight: bold;
        }
      }

      .view_price {
        border-bottom: 1px solid rgb(102, 102, 102);
        padding-bottom: 10px;
        color: rgb(102, 102, 102);
        font-size: 14px;
        margin: 20px 0;

        span {
          font-size: 24px;
          color: #d51423;
          font-weight: bold;
          margin-left: 20px;
        }
      }

      p {
        font-size: 18px;
        color: #fff;
        word-break: break-all;
      }

      .foot_box {
        position: absolute;
        bottom: 0px;
        width: 100%;
        height: 36px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .buy_btn {
        display: block;
        width: 136px;
        height: 36px;
        color: #fff;
        background: #d51423;
        border: none;
        border-radius: 6px;
        line-height: 36px;
        text-align: center;
        font-size: 14px;
        &:hover {
          text-decoration: none;
          color: #fff;
          cursor: pointer;
        }
      }
      .handle_info_btn {
        display: flex;
        align-items: center;
        color: #999;
        font-size: 14px;
      }
    }

    .video_box {
      .detail_view {
        float: left;
        width: 575px;
        height: 280px;
        background-size: 100%;
        border-radius: 5px;

        &.float_win {
          position: fixed;
          right: 10px;
          bottom: 30px;
          z-index: 9999;
        }
      }
    }
  }

  .course_info {
    margin: 20px 0;
    overflow: hidden;
    .layout_left {
      width: 920px;
      float: left;
      .introduce {
        font-size: 14px;
        line-height: 30px;
        color: #333;
        padding-left: 8px;
      }
    }

    .layout_right {
      width: 260px;
      float: right;
      img {
        width: 50px;
        border-radius: 50px;
      }
      .teacher_info {
        background-color: #fff;
        padding: 20px;
        .head {
          font-size: 18px;
        }
        .teacher_msg_right {
          float: left;
          display: flex;
          padding: 20px 0;
          align-items: center;
          .teacher_info_content {
            margin-left: 10px;
          }
          .teacher_name {
            font-size: 16px;
            font-weight: bold;
          }
        }
        .info_box {
          clear: both;
        }
      }
    }
  }
</style>
