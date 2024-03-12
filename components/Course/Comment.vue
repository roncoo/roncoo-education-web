<!-- 课程评论列表 -->
<template>
  <div>
    <el-form :model="comment" class="comment_box">
      <el-input v-model="comment.commentText" :rows="5" class="comment-text" maxlength="200" show-word-limit type="textarea" placeholder="请输入您的评论..." />
      <el-button class="comment-button" type="primary" size="large" @click="handleComment"> 评论 </el-button>
    </el-form>
    <div class="course_comment_list clearfix">
      <div v-for="(comment, index) in page.list" :key="index" class="course_comment_item">
        <div class="course_comment_cover">
          <img :src="comment.usersVO.userHead" class="comment_cover_img" />
        </div>
        <div class="course_comment_content">
          <div class="course_comment_user">
            {{ comment.usersVO.nickname }}
          </div>
          <div class="course_comment_int">
            {{ comment.commentText }}
          </div>
          <div class="course_comment_btn">
            <div class="course_comment_time">
              {{ comment.gmtCreate }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="props.showPage" class="pagination">
        <common-pagination v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" :total="page.totalCount" @pagination="handlePage" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import useTable from '~/utils/table.js'
  import { courseApi } from '~/api/course.js'

  const props = defineProps({
    courseId: {
      type: String,
      default: ''
    },
    showPage: {
      type: Boolean,
      default: true
    }
  })

  const comment = ref({
    courseId: props.courseId
  })

  function handleComment() {
    courseApi.courseCommentAdd(comment.value).then((res) => {
      handlePage()
    })
  }
  const { page, handlePage } = reactive({
    ...useTable(
      {
        page: courseApi.courseCommentPage
      },
      { courseId: props.courseId }
    )
  })
</script>

<style lang="scss" scoped>
  .comment_box {
    padding: 20px;
    .comment-text {
      float: right;
      margin-bottom: 20px;
    }
    .comment-button {
      float: right;
    }
  }
  .course_comment_list {
    padding: 20px 20px 0 20px;
    .course_comment_item {
      border-bottom: 1px solid #ebeef5;
      display: flex;
      padding-bottom: 20px;
      padding-top: 20px;
    }
    .course_comment_cover {
      margin-right: 20px;
      .comment_cover_img {
        border-radius: 50%;
        width: 50px;
      }
    }

    .course_comment_content {
      width: calc(100% - 68px);
      .course_comment_int {
        color: #999;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        margin-bottom: 10px;
        margin-top: 10px;
        word-wrap: break-word;
      }
    }
  }
</style>
