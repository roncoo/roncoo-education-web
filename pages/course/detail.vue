<template>
  <NuxtLayout>
    <!-- 课程详情 -->
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
              <img v-else class="teacher_phone" src="~/assets/image/common_friend.jpg" alt="" />
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
  </NuxtLayout>
</template>
<script setup>
  import { courseApi } from '~/api/course.js'

  const route = useRoute()

  const courseInfo = ref({})
  const teacherInfo = ref({})

  onMounted(async () => {
    const res = await courseApi.courseDetail({ courseId: route.query.id })
    courseInfo.value = res
    if (res.lecturerResp) {
      teacherInfo.value = res.lecturerResp
    }
  })
</script>
<style lang="scss" scoped>
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
