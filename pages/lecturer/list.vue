<script setup>
  import { lecturerApi } from '~/api/lecturer'
  const { list, total, loading, error, page, pageSize, load, updateQuery } = useCatalog(lecturerApi.lecturerList, () => ({}))
  useHead({ title: '名师团队' })
</script>
<template>
  <NuxtLayout>
    <div class="main page-space">
      <header class="page-heading">
        <div>
          <p class="eyebrow">专业陪伴 · 一起成长</p>
          <h1>与优秀的讲师一起成长</h1>
          <p>了解讲师，找到适合你的学习引路人。</p>
        </div>
      </header>
      <CommonState :loading="loading" :error="error" @retry="load" />
      <LecturerList v-if="!loading && !error" :list="list" />
      <div v-if="!loading && !error && list.length > 0 && total > 0" class="pagination">
        <ElPagination :current-page="page" :page-size="pageSize" :total="total" layout="prev, pager, next" background @current-change="(value) => updateQuery({ page: value })" />
      </div>
    </div>
  </NuxtLayout>
</template>
