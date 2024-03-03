<template>
  <NuxtLayout>
    <course-choose v-for="(category, index) in opts.categoryList" :key="index" :menu="category" :index="index" @change="handleChange" />
    <course-list :list="page.list" />
  </NuxtLayout>
</template>
<script setup>
  import { courseApi } from '~/api/course.js'

  // 分类查询
  const categoryList = ref([])

  // 分页条件
  const page = ref({
    pageCurrent: 1
  })

  onMounted(async () => {
    handlePage()
    getCategoryList()
  })

  const opts = reactive({
    errorNum: 0,
    lastCategory: [],
    tableList: [],
    categoryList: [],
    SortTypeEnum: [],
    categoryChild: {},
    infoTimer: null,
    style: {
      height: '525px'
    }
  })
  const ctrl = reactive({
    tableLoading: false,
    showCate: true
  })
  const router = useRouter()
  let selectCategory = []

  const getCategoryList = async () => {
    opts.initCategoryList = await courseApi.categoryList()
    categoryListInit()
  }
  const categoryListInit = () => {
    selectCategory = []
    opts.categoryList = []
    setTimeout(() => {
      opts.categoryList.push({
        active: '',
        list: [{ id: '', categoryName: '全部' }].concat(opts.initCategoryList)
      })
    }, 200)
  }

  const route = useRoute()

  // 分类查询更换
  const handleChange = (index, row) => {
    if (selectCategory[index] !== row.id) {
      selectCategory[index] = row.id
      if (row.childrenList && row.childrenList.length) {
        ctrl.showCate = false
        if (opts.categoryList.length > index + 1) {
          opts.categoryList.length = index + 1
        }
        opts.categoryList.push({
          active: row.id,
          all: row.id,
          list: [{ id: row.id, categoryName: '全部' }].concat(row.childrenList)
        })
        ctrl.showCate = true
      } else {
        opts.categoryList.length = index + 1
        selectCategory.length = index + 1
      }
    }

    const query = Object.assign({ ...(route.query || {}) }, { categoryId: selectCategory[selectCategory.length - 1] || '' })
    if (!query.categoryId) {
      delete query.categoryId
    }
    router.push({
      query
    })
  }

  async function handlePage() {
    const res = await courseApi.courseList(page)
    page.value = res
  }
</script>
<style lang="scss" scoped></style>
