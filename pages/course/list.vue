<template>
  <NuxtLayout>
    <div class="main course-list">
      <course-choose v-for="(category, index) in categoryList" :key="category.active" :menu="category" :index="index" @change="handleChange" />
      <course-list v-loading="page.loading" :list="page.list" />
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
    title: '课程列表',
    meta: [
      { hid: 'keywords', name: 'keywords', content: '首页' },
      { hid: 'description', name: 'description', content: '首页' }
    ]
  })

  const router = useRouter()
  const route = useRoute()

  // 分类查询
  const categoryList = ref([])
  const showCate = ref(true)
  let selectCategory = []

  onMounted(() => {
    getCategoryList()
  })

  // 分类处理
  const handleChange = (index, row) => {
    if (selectCategory[index] !== row.id) {
      selectCategory[index] = row.id
      if (row.list && row.list.length) {
        showCate.value = false
        if (categoryList.value.length > index + 1) {
          categoryList.value.length = index + 1
        }
        categoryList.value.push({
          active: row.id,
          all: row.id,
          list: [{ id: row.id, categoryName: '全部' }].concat(row.list)
        })
        showCate.value = true
      } else {
        categoryList.value.length = index + 1
        selectCategory.length = index + 1
      }
    }
    const querys = Object.assign({ ...(route.query || {}) }, { categoryId: selectCategory[selectCategory.length - 1] || '' })
    if (!querys.categoryId) {
      delete querys.categoryId
    }
    router.push({ query: querys })
    query.categoryId = querys.categoryId
    handleQuery()
  }

  // 分类查询
  const getCategoryList = async () => {
    courseApi.categoryList().then((res) => {
      selectCategory = []
      setTimeout(() => {
        categoryList.value.push({
          active: '',
          list: [{ id: '', categoryName: '全部' }].concat(res)
        })
      }, 200)
    })
  }

  // 分页查询
  const { page, handlePage, query, handleQuery } = reactive({
    ...useTable(
      {
        page: courseApi.courseList
      },
      { categoryId: route.query.categoryId || '' }
    )
  })
</script>
<style lang="scss" scoped>
  .course-list {
    padding: 10px 0;
  }
</style>
