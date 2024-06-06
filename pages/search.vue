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

      <el-tabs v-model="activeName" @tab-change="handleSearch">
        <el-tab-pane label="课程" name="course"></el-tab-pane>
        <el-tab-pane label="讲师" name="lecturer"></el-tab-pane>
      </el-tabs>

      <div class="search-result">搜索结果：{{ page.totalCount }} 个</div>
      <div v-if="activeName === 'course'">
        <course-list :list="page.list" />
        <div v-if="page.totalCount >= 1" class="pagination clearfix">
          <common-pagination v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" :total="page.totalCount" @pagination="handlePage" />
        </div>
      </div>

      <div v-if="activeName === 'lecturer'">
        <lecturer-list :list="page.list" />
        <div v-if="page.totalCount >= 1" class="pagination clearfix">
          <common-pagination v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" :total="page.totalCount" @pagination="handlePage" />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
<script setup>
  import { courseApi } from '~/api/course.js'
  import useTable from '~/utils/table.js'
  import { lecturerApi } from '~/api/lecturer'

  useHead({
    title: '课程搜索',
    meta: [{ hid: 'keywords', name: 'keywords', content: '领课网络、在线教育系统、开源教育系统、roncoo-education' }]
  })

  const activeName = ref('course')
  const route = useRoute()
  const router = useRouter()
  const kw = ref(route.query.kw)
  const apis = { page: courseApi.courseList }
  const paras = { courseName: kw.value || '' }

  function handleSearch() {
    if (kw.value === '') {
      return
    }
    if (activeName.value === 'course') {
      apis.page = courseApi.courseList
      router.push({ path: '/search', query: { kw: kw.value } })
      delete query.lecturerName
      query.courseName = kw.value
      handleQuery()
    } else if (activeName.value === 'lecturer') {
      apis.page = lecturerApi.lecturerList
      router.push({ path: '/search', query: { kw: kw.value } })
      delete paras.courseName
      delete query.courseName
      query.lecturerName = kw.value
      handleQuery()
    }
  }

  // 分页查询
  const { page, handlePage, query, handleQuery } = useTable(apis, paras)
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
