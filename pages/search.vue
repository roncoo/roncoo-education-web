<template>
  <NuxtLayout>
    <div class="main search">
      <div class="search-info">
        <el-input v-model="kw" class="search-input" placeholder="请输入课程名称" @keyup.enter="handleSearch">
          <template #suffix>
            <el-button type="primary" @click="handleSearch"> 搜索 </el-button>
          </template>
        </el-input>
      </div>
      <div class="search-result">搜索结果：{{ page.totalCount }} 个</div>
      <course-list :list="page.list" />
      <div v-if="page.totalCount >= 1" class="pagination clearfix">
        <common-pagination v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" :total="page.totalCount" @pagination="handlePage" />
      </div>
    </div>
  </NuxtLayout>
</template>
<script setup>
  import { courseApi } from '~/api/course.js'
  import useTable from '~/utils/table.js'

  useHead({
    title: '课程搜索',
    meta: [{ hid: 'keywords', name: 'keywords', content: '领课网络、在线教育系统、开源教育系统、roncoo-education' }]
  })

  const route = useRoute()
  const router = useRouter()

  const kw = ref(route.query.kw)

  function handleSearch() {
    if (kw.value) {
      router.push({ path: '/search', query: { kw: kw.value } })
      query.courseName = kw.value
      handleQuery()
    }
  }

  // 分页查询
  const { page, handlePage, query, handleQuery } = reactive({
    ...useTable(
      {
        page: courseApi.courseList
      },
      { courseName: kw.value || '' }
    )
  })
</script>
<style lang="scss" scoped>
  .search {
    padding: 10px 0;
    min-height: calc(100vh - 150px);
  }

  .search-info {
    width: 500px;
    margin: 0 auto;
    .search-input {
      margin: 10px auto;
      height: 45px;
    }
  }
</style>
