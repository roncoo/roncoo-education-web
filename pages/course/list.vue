<template>
  <NuxtLayout>
    <div class="main">
      <course-choose v-for="(category, index) in categoryList" :key="index" :menu="category" :index="index" @change="handleChange" />
      <course-list :list="page.list" />
    </div>
  </NuxtLayout>
</template>
<script setup>
  import { courseApi } from '~/api/course.js'
  import useTable from '~/utils/table.js'

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
    const query = Object.assign({ ...(route.query || {}) }, { categoryId: selectCategory[selectCategory.length - 1] || '' })
    if (!query.categoryId) {
      delete query.categoryId
    }
    router.push({ query })
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
  const { page } = reactive({
    ...useTable({
      page: courseApi.courseList
    })
  })
</script>
<style lang="scss" scoped></style>
