<script setup lang="ts">
  interface Period {
    id: string
    periodName: string
    isFree?: boolean
    periodProgress?: number
    resourceResp?: { videoStatus?: number; resourceType?: number }
  }
  interface Chapter {
    id?: string
    chapterName: string
    periodRespList: Period[]
  }
  defineProps<{ chapters: Chapter[]; activeId?: string; disabled?: boolean }>()
  defineEmits<{ select: [period: Period] }>()
</script>
<template>
  <nav aria-label="课程章节">
    <p v-if="!chapters.length" class="empty-catalog">课程目录正在准备中</p>
    <section v-for="(chapter, index) in chapters" :key="chapter.id || index" class="study-chapter">
      <h3>第 {{ index + 1 }} 章 · {{ chapter.chapterName }}</h3>
      <button
        v-for="(period, num) in chapter.periodRespList"
        :key="period.id"
        type="button"
        :class="['study-period', { active: activeId === period.id }]"
        :aria-current="activeId === period.id ? 'step' : undefined"
        :disabled="disabled || (Number(period.resourceResp?.resourceType) > 0 && Number(period.resourceResp?.resourceType) < 3 && period.resourceResp?.videoStatus === 1)"
        @click="$emit('select', period)"
      >
        <span class="period-caption">
          <span>{{ index + 1 }}-{{ num + 1 }} {{ period.periodName }}</span>
          <small v-if="period.isFree">试看</small>
        </span>
        <span class="period-status">
          {{
            activeId === period.id ? '正在学习' : period.resourceResp?.videoStatus === 1 ? '待更新' : Number(period.periodProgress) >= 100 ? '已完成' : '学习进度 ' + (period.periodProgress || 0) + '%'
          }}
        </span>
        <span class="progress-track"><span :style="{ width: Math.min(100, Math.max(0, Number(period.periodProgress) || 0)) + '%' }" /></span>
      </button>
    </section>
  </nav>
</template>
<style scoped>
  .study-chapter {
    margin-bottom: 24px;
  }
  .study-chapter h3 {
    font-size: 14px;
    line-height: 1.7;
    color: #cbd5e1;
    margin: 0 0 10px;
    padding: 0 8px;
  }
  .study-period {
    display: block;
    width: 100%;
    text-align: left;
    color: #cbd5e1;
    border: 1px solid transparent;
    border-radius: 8px;
    background: none;
    padding: 12px;
    margin-bottom: 6px;
  }
  .study-period:hover {
    background: #263247;
  }
  .study-period.active {
    background: #21365c;
    border-color: #365b99;
    color: #fff;
  }
  .period-caption {
    display: flex;
    align-items: start;
    gap: 8px;
    font-size: 13px;
  }
  .period-caption > span {
    flex: 1;
    min-width: 0;
  }
  .period-caption small {
    color: #86efac;
    font-size: 11px;
    flex-shrink: 0;
  }
  .period-status {
    display: block;
    font-size: 11px;
    color: #94a3b8;
    margin: 6px 0;
  }
  .progress-track {
    display: block;
    background: #ffffff10;
    height: 3px;
    border-radius: 3px;
  }
  .progress-track > span {
    display: block;
    height: 100%;
    background: #60a5fa;
    border-radius: 3px;
  }
  .study-period:disabled {
    opacity: 0.5;
    cursor: default;
  }
  .empty-catalog {
    color: #94a3b8;
    padding: 20px;
  }
</style>
