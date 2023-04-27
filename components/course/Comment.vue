<!-- 课程评论列表 -->
<template>
  <div>
    <div class="comment_box">
      <textarea v-model="commentText" class="comment_input" rows="4" maxlength="200" placeholder="请输入内容" />
      <div class="comment_btn_wrapper"><div class="comment_btn" :class="{no_allow: !commentText}" @click="handleComment">评论</div></div>
      <div class="course_comment_list">
        <div v-for="(comment, index) in pageObj.list" :key="index" class="course_comment_item">
          <div class="course_comment_cover"><img :src="comment.usersVO.userHead" class="comment_cover_img"></div>
          <div class="course_comment_content">
            <div class="course_comment_user">{{ comment.usersVO.nickname }}</div>
            <div class="course_comment_int">{{ comment.commentText }}</div>
            <div class="course_comment_btn"><div class="course_comment_time">{{ comment.gmtCreate }}</div></div>
          </div>
        </div>
        <div class="loading_btn">
          <span class="loading_text">已经到底部，没有更多内容了</span>
        </div>
      </div>
    </div>
    <d-page v-if="pageObj.totalPage > 1" :page="pageObj" @btnClick="getCommentList" />
  </div>
</template>

<script>
import { courseCommentPage, courseCommentAdd } from '@/api/course.js'
import DPage from '~/components/common/Page'
export default {
  components: {
    DPage
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tokenInfo: this.$store.state.tokenInfo,
      commentText: '',
      pageObj: {
        totalPage: 0,
        pageCurrent: 1,
        pageSize: 20
      }
    }
  },
  mounted() {
    this.getCommentList()
  },
  methods: {
    handleComment() {
      if (!this.tokenInfo) {
        this.$msgBox({
          content: '请先登录',
          isShowCancelBtn: false
        }).then(() => {
          this.$store.dispatch('REDIRECT_LOGIN')
        })
        return
      }
      if (!this.commentText) {
        return
      }
      courseCommentAdd({
        commentId: '',
        commentText: this.commentText,
        courseId: this.id
      }).then(res => {
        if (res) {
          this.getCommentList()
          this.commentText = ''
          this.$msgBox({
            content: res,
            isShowCancelBtn: false
          }).catch(() => {
          })
        }
      })
    },
    getCommentList() {
      courseCommentPage({ courseId: this.id, pageCurrent: this.pageObj.pageCurrent }).then(res => {
        this.pageObj = res
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
.comment_input {
  width: 100% !important;
  padding: 10px;
}
.comment_btn_wrapper {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}
.comment_btn {
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: #2256F6;
  color: #fff;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
}
.no_allow {
  background: #F5F5F5;
  color: #999;
  cursor: not-allowed;
}

.course_comment_item{
  border-bottom: 1px solid #ebeef5;
  display: flex;
  padding-bottom: 20px;
  padding-top: 20px;
}
.course_comment_cover {
  margin-right:20px;
  .comment_cover_img{
    border-radius:50%;
    width: 50px;
  }
}

.course_comment_content {
  width: calc(100% - 68px);
  .course_comment_int{
  color: #999;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  margin-bottom: 10px;
  margin-top: 10px;}
}
.loading_btn{
  margin-top: 20px;
  padding-bottom: 11px;
  padding-top: 11px;
  text-align: center;
}
.loading_text{
  color: #999;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
}
</style>
