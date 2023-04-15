<!-- 课程评论列表 -->
<template>
  <div>
    <div class="comment_box">
      <textarea
        v-model="commentText"
        class="comment_input"
        rows="4"
        maxlength="200"
        placeholder="请输入内容"
      />
      <div class="comment_btn_wrapper">
        <div class="comment_btn" :class="{no_allow: !commentText}" @click="handleComment">
          评论
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
        console.info(res)
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
</style>
