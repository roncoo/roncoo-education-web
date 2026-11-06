<script setup>
  import { indexApi } from '~/api'
  const { data: zones, status, error, refresh } = useAsyncData('home-zones', () => indexApi.zoneList({}), { default: () => [] })
</script>
<template>
  <CommonState :loading="status === 'pending'" :error="!!error" :empty="!zones.length" title="课程正在准备中" description="你可以前往课程中心浏览已上线的课程。" @retry="refresh" />
  <section v-for="zone in zones" :key="zone.id || zone.zoneName" class="course-section">
    <header class="page-heading">
      <div class="section-title">
        <h2>{{ zone.zoneName }}</h2>
        <p v-if="zone.zoneDesc">{{ zone.zoneDesc }}</p>
      </div>
      <NuxtLink class="more" to="/course/list">
        更多课程
        <CommonIcon name="arrow" :size="16" />
      </NuxtLink>
    </header>
    <CourseList :list="zone.courseList || []" />
  </section>
</template>
<style scoped>
  .course-section {
    margin-bottom: 52px;
  }
  .more {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--muted);
    font-size: 13px;
    white-space: nowrap;
  }
  .page-heading {
    margin-bottom: 20px;
  }
  .page-heading h2 {
    font-size: 25px;
    font-weight: 650;
    margin-bottom: 0;
    flex-shrink: 0;
  }
  .section-title {
    display: flex;
    align-items: baseline;
    gap: 16px;
    min-width: 0;
  }
  .section-title p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
