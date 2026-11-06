<script setup>
  import { courseApi } from '~/api/course'
  import useTable from '~/utils/table'
  const props = defineProps({ courseId: { type: [String, Number], default: '' }, showPage: { type: Boolean, default: true } })
  const text = ref(''),
    busy = ref(false),
    message = ref('')
  const { page, handlePage } = useTable({ page: courseApi.courseCommentPage }, { courseId: props.courseId })
  async function submit() {
    if (busy.value) return
    if (!text.value.trim()) {
      message.value = '请先填写评论内容'
      return
    }
    busy.value = true
    message.value = ''
    try {
      await courseApi.courseCommentAdd({ courseId: props.courseId, commentText: text.value.trim() })
      text.value = ''
      await handlePage()
      ElMessage.success('评论已发布')
    } catch {
      message.value = '发布失败，请确认已登录后重试。'
    } finally {
      busy.value = false
    }
  }
</script>
<template>
  <div class="comments">
    <form class="comment-form" @submit.prevent="submit">
      <label :for="'comment-' + courseId">分享你的学习感受</label>
      <ElInput :id="'comment-' + courseId" v-model="text" class="comment-textarea" type="textarea" :rows="4" maxlength="200" show-word-limit placeholder="写下你的收获或问题…" />
      <p v-if="message" class="comment-error" role="alert">{{ message }}</p>
      <ElButton native-type="submit" type="primary" :loading="busy">发布评论</ElButton>
    </form>
    <CommonState
      :loading="page.loading"
      :error="page.error"
      :empty="!page.list.length"
      title="还没有学员评论"
      description="分享你的学习体验，让更多同学了解这门课程。"
      action-to=""
      @retry="handlePage"
    />
    <template v-if="!page.loading && !page.error">
      <article v-for="item in page.list" :key="item.id" class="comment-item">
        <CommonImage class="comment-avatar" :src="item.usersVO?.userHead" :alt="item.usersVO?.nickname || '学员'" :width="40" :height="40" />
        <div>
          <strong>{{ item.usersVO?.nickname || '学员' }}</strong>
          <p>{{ item.commentText }}</p>
          <time>{{ item.gmtCreate }}</time>
        </div>
      </article>
    </template>
    <div v-if="showPage && !page.loading && !page.error && page.list.length > 0 && page.totalCount > 0" class="pagination">
      <CommonPagination v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" :total="page.totalCount" @pagination="handlePage" />
    </div>
  </div>
</template>
<style scoped>
  .comment-form {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 12px;
    margin: 16px 0 28px;
  }
  .comment-form label {
    font-weight: 500;
  }
  .comment-error {
    color: #dc2626;
    font-size: 12px;
    margin: 0;
  }
  .comment-item {
    display: flex;
    gap: 14px;
    padding: 24px 0;
    border-bottom: 1px solid var(--line);
  }
  .comment-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .comment-item > div {
    min-width: 0;
    flex: 1;
  }
  .comment-item p {
    margin: 8px 0;
    white-space: pre-wrap;
  }
  .comment-item time {
    font-size: 12px;
    color: var(--muted);
  }
</style>
