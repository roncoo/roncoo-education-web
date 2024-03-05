<template>
  <NuxtLayout>
    <div class="detail_content">
      <div class="detail_body">
        <ul class="detail_header clearfix">
          <li>
            <nuxt-link :to="{ path: '/' }"> 首页 </nuxt-link>
            <span>></span>
          </li>
          <li>
            <nuxt-link :to="{ name: 'course-list' }"> 课程中心 </nuxt-link>
            <span>></span>
          </li>
          <li>{{ courseInfo.courseName }}</li>
        </ul>
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
                  ￥{{ courseInfo.coursePrice }} <b style="text-decoration-line: line-through; font-size: 18px">￥{{ courseInfo.rulingPrice }}</b>
                </span>
              </div>
            </div>
            <div v-if="teacherInfo" class="view_teacher">
              <span class="text_b">讲师:</span>
              {{ teacherInfo.lecturerName }}
            </div>
            <div class="view_teacher mgt20"><span class="text_b">购买:</span>{{ courseInfo.countBuy }} 人</div>
            <div class="foot_box">
              <button v-if="!isLogin" class="buy_btn" @click="handleLogin">登录观看</button>
              <button v-if="isLogin && !courseInfo.allowStudy" class="buy_btn" @click="handleBuy(courseInfo)">立即购买</button>
              <button v-if="isLogin && courseInfo.allowStudy" class="buy_btn" @click="handleStudy">马上学习</button>
              <div class="handle_info_btn">
                <div class="study_num">{{ courseInfo.countStudy }} 人已学习</div>
                <div class="handle_info_btn collect_btn" @click="handleCollect">收藏</div>
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
          <el-tabs type="border-card">
            <el-tab-pane label="课程介绍">
              <div class="introduce" v-html="courseInfo.introduce" />
            </el-tab-pane>
            <el-tab-pane label="课程目录">
              <course-chapter :list="courseInfo.chapterRespList" />
            </el-tab-pane>
            <el-tab-pane label="课程评论"> 课程评论 </el-tab-pane>
          </el-tabs>
        </div>
        <div class="layout_right">
          <div class="teacher_info clearfix">
            <span class="head">讲师简介</span>
            <div class="teacher_msg">
              <div v-if="teacherInfo" class="teacher_msg_right">
                <img v-if="teacherInfo.lecturerHead" class="teacher_phone" :src="teacherInfo.lecturerHead" alt="" />
                <img v-else class="teacher_phone" src="../../assets/image/common_head.jpg" alt="" />
                <div class="teacher_name">
                  {{ teacherInfo.lecturerName }}
                </div>
                <div class="teacher_position">
                  {{ teacherInfo.lecturerPosition }}
                </div>
                <div class="info_box" v-html="teacherInfo.introduce" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <common-pay ref="commonPayRef" />
  </NuxtLayout>
</template>
<script setup>
  import { courseApi } from '~/api/course.js'

  const route = useRoute()

  const isLogin = getToken()
  const courseInfo = ref({})
  const teacherInfo = ref({})

  onMounted(() => {
    if (getToken()) {
      // 已登录
      courseApi.userCourseDetail({ courseId: route.query.id }).then((res) => {
        courseInfo.value = res
      })
    } else {
      // 未登录
      courseApi.courseDetail({ courseId: route.query.id }).then((res) => {
        courseInfo.value = res
        if (res.lecturerResp) {
          teacherInfo.value = res.lecturerResp
        }
      })
    }
  })

  const commonPayRef = ref()

  // 购买
  function handleBuy(courseInfo) {
    if (getToken()) {
      // 购买
      commonPayRef.value.onOpen(courseInfo)
    } else {
      ElMessageBox.confirm('请先登录', '提示', { confirmButtonText: '立即登录', cancelButtonText: '取消', type: 'warning' }).then(() => {
        useRouter().push('/login')
      })
    }
  }

  // 课程收藏
  function handleCollect() {}

  // 学习
  function handleStudy() {
    useRouter().push('/course/study?id=' + courseInfo.value.id)
  }

  // 登录
  function handleLogin() {
    useRouter().push('/login')
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
  }

  .detail_header {
    li {
      float: left;
      line-height: 57px;
      margin: 0 10px;
      color: #fff;
      font-size: 14px;

      span {
        margin-left: 20px;
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
    width: 620px;
    height: 300px;
    position: relative;

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
      // position: absolute;
      // bottom: 0px;
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
    .study_num {
      height: 36px;
      line-height: 36px;
      color: #999;
      font-size: 14px;
      margin-right: 20px;
    }
    .collect_btn {
      cursor: pointer;
    }
    .huabei {
      color: #fff;
      font-size: 13px;
      position: absolute;
      bottom: 0;
      padding-left: 25px;

      img {
        width: 17px;
        height: 17px;
        position: absolute;
        left: 0;
      }
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

    .font_16 {
      font-size: 16px;
      font-weight: 400;
    }

    .set_vip {
      color: #0099ff;
      margin-left: 6px;
    }

    .favo {
      font-size: 10px;
      display: inline-block;
      height: 14px;
      line-height: 14px;
      background: #d51423;
      color: #333;
      padding: 0 8px;
      border-radius: 0 7px 7px 0;
      margin-left: 7px;
    }

    .favo_right {
      background: none;
      border: 1px solid #d51423;
      height: 13px;
      color: #d51423;
      margin-left: -5px;
      border-radius: 7px 0 0 7px;
    }

    .small_favo {
      font-size: 10px;
      border: 1px solid #d51423;
      height: 13px;
      line-height: 14px;
      color: #d51423;
      padding: 0 5px;
    }

    .big_favo {
      color: #999;
      font-size: 14px;
      font-weight: 400;
      margin-left: 3px;
    }
  }

  .detail_view {
    float: left;
    width: 540px;
    height: 300px;
    background: rgb(102, 102, 102);
    background-size: 100%;

    &.float_win {
      position: fixed;
      right: 10px;
      bottom: 30px;
      z-index: 9999;
    }
  }

  .view_teacher {
    color: rgb(102, 102, 102);
    font-size: 14px;

    .text_b {
      margin-right: 20px;
      font-weight: bold;
    }
  }

  .course_info {
    margin: 20px 0;
  }
  .layout_left {
    width: 920px;
    float: left;
  }
  .layout_right {
    width: 260px;
    float: right;

    img {
      width: 50px;
    }
  }
</style>
