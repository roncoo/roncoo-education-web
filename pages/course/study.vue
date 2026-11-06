<script setup>
  const { course, loading, error, completed, activeId, panel, nextPeriod, select, retry } = useStudyPlayer()
  useHead({ title: () => course.value?.courseName || '课程学习', script: [{ src: 'https://player.polyv.net/resp/vod-player/latest/player.js' }] })
</script>
<template>
  <div class="study-shell">
    <header class="study-header">
      <NuxtLink class="study-back" to="/account/course"><CommonIcon name="arrow" :size="16" class="back-arrow" /> 我的课程</NuxtLink>
      <NuxtLink v-if="course" class="study-title" :to="{ path: '/course/detail', query: { id: course.id } }">{{ course.courseName }}</NuxtLink>
      <span v-else class="study-title">课程学习</span>
      <CourseCollect v-if="course" :course-id="course.id" :collect-status="course.courseCollect" />
      <CommonUser />
    </header>
    <main class="study-workspace">
      <section class="study-player" aria-label="课程播放器">
        <div v-show="!error && !completed" id="player" class="player-mount" />
        <div v-if="loading || error || completed" class="player-overlay" role="status" aria-live="polite">
          <template v-if="loading">
            <span class="loading-dot" aria-hidden="true"></span>
            <h2>正在准备课程…</h2>
            <p>请稍候，即将开始学习。</p>
          </template>
          <template v-else-if="error">
            <h2>暂时无法继续学习</h2>
            <p>{{ error }}</p>
            <div>
              <ElButton type="primary" @click="retry">重新加载</ElButton>
              <NuxtLink class="study-return" to="/account/course">返回我的课程</NuxtLink>
            </div>
          </template>
          <template v-else>
            <h2>{{ nextPeriod ? '这一节已学完，继续加油' : '本课程已播放完毕' }}</h2>
            <p>{{ nextPeriod ? '下一节：' + nextPeriod.periodName : '你可以选择目录中的课时，回顾学习内容。' }}</p>
            <ElButton v-if="nextPeriod" type="primary" @click="select(nextPeriod)">学习下一节 <CommonIcon name="arrow" :size="16" /></ElButton>
            <NuxtLink v-else class="button-link primary" to="/account/course">返回我的课程</NuxtLink>
          </template>
        </div>
      </section>
      <aside v-if="panel" class="study-panel">
        <header>
          <h2>{{ panel === 'chapter' ? '课程目录' : '学员评论' }}</h2>
          <button type="button" aria-label="收起侧栏" @click="panel = ''"><CommonIcon name="close" :size="18" /></button>
        </header>
        <div class="panel-scroll">
          <StudyCatalog v-if="panel === 'chapter'" :chapters="course?.chapterRespList || []" :active-id="activeId" :disabled="loading" @select="select" />
          <CourseComment v-else-if="course" :course-id="course.id" :show-page="false" />
        </div>
      </aside>
      <nav class="study-tools" aria-label="学习工具">
        <button type="button" :aria-pressed="panel === 'chapter'" @click="panel = panel === 'chapter' ? '' : 'chapter'">
          <CommonIcon name="book" :size="22" />
          目录
        </button>
        <button type="button" :aria-pressed="panel === 'comment'" @click="panel = panel === 'comment' ? '' : 'comment'">
          <CommonIcon name="comment" :size="22" />
          评论
        </button>
      </nav>
    </main>
  </div>
</template>
<style scoped>
  .study-shell {
    height: 100vh;
    overflow: hidden;
    background: #0c1321;
    color: #e2e8f0;
  }
  .study-header {
    height: 72px;
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 0 24px;
    border-bottom: 1px solid #273248;
    background: #111c2e;
  }
  .study-back {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: #94a3b8;
    white-space: nowrap;
  }
  .back-arrow {
    transform: rotate(180deg);
  }
  .player-overlay :deep(.el-button .ui-icon) {
    margin-left: 10px;
  }
  .study-title {
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }
  .study-workspace {
    display: flex;
    height: calc(100vh - 72px);
  }
  .study-player {
    position: relative;
    flex: 1;
    min-width: 0;
    background: #050a12;
    padding: 16px;
    overflow: auto;
  }
  .player-mount {
    height: 100%;
    min-height: 320px;
  }
  .player-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    background: #0c1321ee;
    text-align: center;
  }
  .player-overlay h2 {
    font-size: 22px;
    margin-bottom: 12px;
  }
  .player-overlay p {
    color: #94a3b8;
    max-width: 540px;
    margin-bottom: 28px;
  }
  .study-return {
    margin-left: 20px;
    color: #93c5fd;
  }
  .study-panel {
    width: 340px;
    flex-shrink: 0;
    background: #152033;
    display: flex;
    flex-direction: column;
    border-left: 1px solid #273248;
  }
  .study-panel > header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;
    padding: 0 20px;
    border-bottom: 1px solid #273248;
  }
  .study-panel h2 {
    font-size: 16px;
    margin: 0;
  }
  .study-panel header button {
    background: none;
    border: 0;
    color: #94a3b8;
    padding: 8px;
  }
  .panel-scroll {
    overflow: auto;
    flex: 1;
    padding: 20px 12px;
  }
  .study-tools {
    width: 64px;
    background: #111c2e;
    flex-shrink: 0;
    padding-top: 16px;
  }
  .study-tools button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    width: 100%;
    border: 0;
    background: none;
    padding: 16px 4px;
    color: #94a3b8;
    font-size: 12px;
  }
  .study-tools button span {
    font-size: 22px;
  }
  .study-tools button:hover,
  .study-tools button[aria-pressed='true'] {
    color: #93c5fd;
    background: #1c2d48;
  }
  .loading-dot {
    width: 32px;
    height: 32px;
    margin-bottom: 24px;
    border: 3px solid #334155;
    border-top-color: #60a5fa;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  .study-panel :deep(.surface) {
    background: #1c2d48;
    border-color: #334155;
    color: #e2e8f0;
  }
  .study-panel :deep(.comment-textarea) {
    color: var(--ink);
  }
  @media (max-width: 1100px) {
    .study-panel {
      width: 300px;
    }
    .study-header {
      gap: 16px;
    }
  }
  .study-header :deep(.collect-button) {
    color: #a4b8d4;
  }
  .study-header :deep(.collect-button:hover) {
    color: #bfdbfe;
    background: #20365a;
  }
  .study-panel :deep(.state p),
  .study-panel :deep(.comment-item time) {
    color: #aabbd2;
  }
  .study-panel :deep(.comment-item) {
    border-color: #30415b;
  }
</style>
