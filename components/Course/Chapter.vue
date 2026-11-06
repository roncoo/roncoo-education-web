<script setup>
  import { formatTime, getResourceTypeName } from '~/utils/base'
  defineProps({ list: { type: Array, default: () => [] }, playPeriod: { type: String, default: '' } })
  const route = useRoute()
</script>
<template>
  <CommonState v-if="!list.length" empty title="课程目录正在准备中" description="课时更新后将在这里展示。" action-to="" />
  <section v-for="(chapter, index) in list" :key="chapter.id || index" class="chapter">
    <h3>第 {{ index + 1 }} 章 · {{ chapter.chapterName }}</h3>
    <NuxtLink
      v-for="(period, num) in chapter.periodRespList"
      :key="period.id"
      class="period"
      :class="{ active: playPeriod === period.id }"
      :to="{ path: '/course/study', query: { id: route.query.id, periodId: period.id } }"
    >
      <span class="period-number">{{ index + 1 }}-{{ num + 1 }}</span>
      <span class="period-name">{{ period.periodName }}</span>
      <ElTag v-if="period.isFree" size="small" type="success">试看</ElTag>
      <span class="period-meta">
        {{
          period.resourceResp?.videoStatus === 1 ? '待更新' : period.resourceResp?.videoLength ? formatTime(period.resourceResp.videoLength) : getResourceTypeName(period.resourceResp?.resourceType)
        }}
      </span>
    </NuxtLink>
  </section>
</template>
<style scoped>
  .chapter {
    margin-bottom: 28px;
  }
  .chapter h3 {
    background: var(--canvas);
    padding: 12px 16px;
    font-size: 16px;
    margin-bottom: 8px;
    border-radius: 8px;
  }
  .period {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--line);
    border-radius: 6px;
  }
  .period:hover,
  .period.active {
    background: var(--brand-soft);
    color: var(--brand);
  }
  .period-number,
  .period-meta {
    color: var(--muted);
    font-size: 12px;
    white-space: nowrap;
  }
  .period-name {
    flex: 1;
    min-width: 0;
  }
  .period-number {
    font-variant-numeric: tabular-nums;
  }
</style>
