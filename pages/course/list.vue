<script setup>
  import { courseApi } from '~/api/course'
  const route = useRoute()
  const { list, total, loading, error, page, pageSize, load, updateQuery } = useCatalog(courseApi.courseList, () => ({ categoryId: route.query.categoryId || '' }))
  useHead({ title: '全部课程' })
</script>
<template>
  <NuxtLayout>
    <div class="main page-space">
      <header class="page-heading">
        <div>
          <p class="eyebrow">探索课程 · 发现新的可能</p>
          <h1>发现适合你的课程</h1>
          <p>按兴趣与目标，找到下一步的学习方向。</p>
        </div>
        <NuxtLink class="button-link" to="/account/course">我的课程 <CommonIcon name="arrow" :size="16" /></NuxtLink>
      </header>
      <CourseFilters />
      <p class="result-count">{{ loading ? '正在查找课程…' : error ? '暂时无法获取课程' : '共 ' + total + ' 门课程' }}</p>
      <CommonState :loading="loading" :error="error" @retry="load" />
      <CourseList v-if="!loading && !error" :list="list" />
      <div v-if="!loading && !error && list.length > 0 && total > 0" class="pagination">
        <ElPagination :current-page="page" :page-size="pageSize" :total="total" layout="prev, pager, next" background @current-change="(value) => updateQuery({ page: value })" />
      </div>
    </div>
  </NuxtLayout>
</template>
<style scoped>
  .result-count {
    color: var(--muted);
    margin: 24px 0 18px;
  }
</style>
