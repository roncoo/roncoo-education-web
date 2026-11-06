<script setup>
  import { courseApi } from '~/api/course'
  import { lecturerApi } from '~/api/lecturer'
  const route = useRoute(),
    router = useRouter()
  const kw = ref(String(route.query.kw || ''))
  const type = computed(() => (route.query.type === 'lecturer' ? 'lecturer' : 'course'))
  watch(
    () => route.query.kw,
    (v) => {
      kw.value = String(v || '')
    }
  )
  const { list, total, loading, error, page, pageSize, load, updateQuery } = useCatalog(
    (params) => (type.value === 'course' ? courseApi.courseList(params) : lecturerApi.lecturerList(params)),
    () => (type.value === 'course' ? { courseName: String(route.query.kw || '') } : { lecturerName: String(route.query.kw || '') })
  )
  function search() {
    router.push({ query: { kw: kw.value.trim() || undefined, type: type.value } })
  }
  useHead({ title: '搜索课程与讲师' })
</script>
<template>
  <NuxtLayout>
    <div class="main page-space">
      <header class="page-heading">
        <div>
          <p class="eyebrow">从一个关键词，开始探索</p>
          <h1>找到你想学的</h1>
          <p>搜索课程与讲师，发现更多学习可能。</p>
        </div>
      </header>
      <form class="search-form surface" role="search" @submit.prevent="search">
        <ElInput v-model="kw" name="search" aria-label="搜索课程或讲师" placeholder="输入课程名称或讲师姓名…" clearable />
        <ElButton native-type="submit" type="primary" size="large">搜索</ElButton>
      </form>
      <nav class="search-tabs" aria-label="搜索类型">
        <NuxtLink :class="{ active: type === 'course' }" :to="{ query: { ...route.query, type: 'course', page: undefined } }">课程</NuxtLink>
        <NuxtLink :class="{ active: type === 'lecturer' }" :to="{ query: { ...route.query, type: 'lecturer', page: undefined } }">讲师</NuxtLink>
      </nav>
      <p class="result-count">{{ loading ? '正在搜索…' : error ? '搜索暂时不可用' : '共找到 ' + total + ' 个结果' }}</p>
      <CommonState :loading="loading" :error="error" @retry="load" />
      <template v-if="!loading && !error">
        <CourseList v-if="type === 'course'" :list="list" />
        <LecturerList v-else :list="list" />
      </template>
      <div v-if="!loading && !error && list.length > 0 && total > 0" class="pagination">
        <ElPagination :current-page="page" :page-size="pageSize" :total="total" layout="prev, pager, next" background @current-change="(value) => updateQuery({ page: value })" />
      </div>
    </div>
  </NuxtLayout>
</template>
<style scoped>
  .search-form {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
  }
  .search-tabs {
    display: flex;
    gap: 32px;
    border-bottom: 1px solid var(--line);
  }
  .search-tabs a {
    padding: 12px 6px;
    font-size: 16px;
  }
  .search-tabs a.active {
    color: var(--brand);
    border-bottom: 3px solid var(--brand);
  }
  .result-count {
    color: var(--muted);
    margin: 20px 0;
  }
</style>
