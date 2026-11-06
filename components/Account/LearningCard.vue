<script setup lang="ts">
  interface Learning {
    courseResp?: { id: string; courseLogo?: string; courseName?: string }
    courseProgress?: number
    periodName?: string
    periodProgress?: number
    periodTime?: string
  }
  const props = defineProps<{ item: Learning }>()
  const progress = computed(() => Math.min(100, Math.max(0, Number(props.item.courseProgress) || 0)))
</script>
<template>
  <article v-if="item.courseResp" class="learning-card surface">
    <NuxtLink class="learning-cover-link" :to="{ path: '/course/detail', query: { id: item.courseResp.id } }" :aria-label="item.courseResp.courseName || '课程详情'">
      <CommonImage class="learning-cover" :src="item.courseResp.courseLogo" :alt="item.courseResp.courseName" />
    </NuxtLink>
    <div class="learning-info">
      <div class="learning-heading">
        <NuxtLink class="learning-title" :to="{ path: '/course/detail', query: { id: item.courseResp.id } }">
          <h3>{{ item.courseResp.courseName }}</h3>
        </NuxtLink>
        <span :class="['status', { complete: progress >= 100 }]">{{ progress >= 100 ? '已完成' : '学习中' }}</span>
      </div>
      <p class="learning-period" :title="item.periodName">{{ item.periodName ? '学习至：' + item.periodName : '还未开始学习，迈出第一步吧' }}</p>
      <small v-if="item.periodTime" class="learning-time">
        <CommonIcon name="clock" :size="13" />
        最近学习：{{ item.periodTime }}
      </small>
      <div class="learning-footer">
        <div class="learning-progress">
          <span class="progress-label">学习进度</span>
          <ElProgress :percentage="progress" :show-text="false" :stroke-width="5" :status="progress >= 100 ? 'success' : undefined" />
          <strong class="progress-value">{{ progress }}%</strong>
        </div>
        <NuxtLink class="button-link primary" :to="{ path: '/course/study', query: { id: item.courseResp.id } }"
          >{{ progress >= 100 ? '再次学习' : '继续学习' }} <CommonIcon name="arrow" :size="16"
        /></NuxtLink>
      </div>
    </div>
  </article>
</template>
<style scoped>
  .learning-card {
    display: grid;
    grid-template-columns: 200px minmax(0, 1fr);
    align-items: stretch;
    gap: 24px;
    margin-bottom: 16px;
    padding: 22px;
    transition:
      box-shadow 0.2s,
      border-color 0.2s;
  }
  .learning-card:hover {
    box-shadow: 0 10px 28px #172b4d08;
    border-color: #d7e2f4;
  }
  .learning-cover-link {
    position: relative;
    display: block;
    border-radius: 10px;
    overflow: hidden;
    min-height: 120px;
  }
  .learning-cover-link .learning-cover {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .learning-info {
    min-width: 0;
    display: flex;
    flex-direction: column;
  }
  .learning-heading {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 8px;
  }
  .learning-title {
    min-width: 0;
    flex: 1;
  }
  .learning-title h3 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.6;
  }
  .learning-period {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--muted);
    font-size: 12px;
    margin: 0 0 6px;
  }
  .status {
    flex-shrink: 0;
    font-size: 11px;
    line-height: 20px;
    color: var(--brand);
    background: var(--brand-soft);
    padding: 2px 8px;
    border-radius: 5px;
  }
  .status.complete {
    background: #edf8f2;
    color: #18764f;
  }
  .learning-time {
    display: flex;
    align-items: center;
    gap: 5px;
    color: var(--muted);
    font-size: 11px;
  }
  .learning-footer {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-top: auto;
    padding-top: 18px;
  }
  .learning-progress {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
  }
  .progress-label {
    flex-shrink: 0;
    font-size: 11px;
    color: var(--muted);
  }
  .learning-progress :deep(.el-progress) {
    flex: 1;
    min-width: 0;
  }
  .progress-value {
    flex-shrink: 0;
    font-size: 11px;
    color: var(--brand);
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }
  .button-link {
    flex-shrink: 0;
    font-size: 13px;
    min-height: 38px;
    padding: 7px 14px;
    border-radius: 8px;
  }
  @media (max-width: 1100px) {
    .learning-card {
      grid-template-columns: 160px minmax(0, 1fr);
      gap: 20px;
      padding: 20px;
    }
    .learning-footer {
      gap: 16px;
    }
  }
</style>
