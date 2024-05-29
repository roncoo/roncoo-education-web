<template>
  <NuxtLayout>
    <div class="main course-list">
      <!-- 选择分类 -->
      <course-choose v-for="(category, index) in categoryList" :key="index" :menu="category" :index="index" @change="handleChange" />

      <!-- 课程列表 -->
      <course-list v-loading="page.loading" :list="page.list" />

      <!-- 分页功能 -->
      <div v-if="page.totalCount >= 1" class="pagination clearfix">
        <common-pagination v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" :total="page.totalCount" @pagination="handlePage" />
      </div>
    </div>
  </NuxtLayout>
</template>
<script setup>
  import { courseApi } from '~/api/course.js'
  import useTable from '~/utils/table.js'
  import { indexApi } from '~/api'

  const { data } = useAsyncData('website', async () => {
    return indexApi.websiteInfo()
  })
  useHead({
    title: '课程列表',
    meta: [
      { hid: 'keywords', name: 'keywords', content: '领课网络、在线教育系统、开源教育系统、roncoo-education' },
      { hid: 'description', name: 'description', content: data.value?.websiteDesc }
    ]
  })

  const router = useRouter()
  const route = useRoute()

  // 分类查询
  const categoryList = ref([])
  let selectCategory = []

  onMounted(async () => {
    // 分类列表
    await getCategoryList()
    // 初始化分类
    initCategory()
  })

  const initCategory = () => {
    if (route.query.categoryId) {
      const classifyIdObj = {}
      const key = []
      const init = (list, prefixId) => {
        list.forEach((e) => {
          if (e.id) {
            const id = prefixId ? prefixId + '_' + e.id : e.id
            key.push(id)
            classifyIdObj[e.id] = e
            if (e.list && e.list.length) {
              return init(e.list, id)
            }
          }
        })
      }
      init(categoryRes, '')
      const lists = key.filter((e) => e.indexOf(route.query.categoryId) > -1)
      if (lists && lists.length) {
        lists.sort((a, b) => {
          return a.length - b.length
        })
        const ids = lists[0].split('_')
        if (ids && ids.length) {
          categoryList.value.push({
            active: ids[0],
            list: [{ id: '', categoryName: '全部' }].concat(categoryRes)
          })
          ids.forEach((id, index) => {
            const item = classifyIdObj[id]
            if (item) {
              selectCategory.push(id)
              if (item.list.length) {
                categoryList.value.push({
                  active: ids[index + 1] || id,
                  list: [{ id: id, categoryName: '全部' }].concat(item.list)
                })
              }
            }
          })
        }
      }
      console.log(categoryList)
    } else {
      categoryList.value.push({
        active: '',
        list: [{ id: '', categoryName: '全部' }].concat(categoryRes)
      })
    }
  }

  // 分类处理
  const handleChange = (index, row) => {
    if (selectCategory[index] !== row.id) {
      selectCategory[index] = row.id
      if (row.list && row.list.length) {
        if (categoryList.value.length > index + 1) {
          categoryList.value.length = index + 1
        }
        categoryList.value.push({
          active: row.id,
          list: [{ id: row.id, categoryName: '全部' }].concat(row.list)
        })
      } else {
        categoryList.value.length = index + 1
        selectCategory.length = index + 1
      }
    }
    const queryObj = Object.assign({ ...(route.query || {}) }, { categoryId: selectCategory[index] || '' })
    if (!queryObj.categoryId) {
      delete queryObj.categoryId
    }
    router.push({ query: queryObj })
    query.categoryId = queryObj.categoryId
    handleQuery()
  }

  // 分类查询
  let categoryRes = []
  const getCategoryList = async () => {
    const res = await courseApi.categoryList()
    categoryRes = res
    selectCategory = []
  }

  // 分页查询
  const { page, handlePage, query, handleQuery } = useTable(
    {
      page: courseApi.courseList
    },
    { categoryId: route.query.categoryId || '' }
  )
</script>
<style lang="scss" scoped>
  .course-list {
    padding: 10px 0;
  }
</style>
