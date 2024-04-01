/**
 * 表单封装
 */
import { onMounted, reactive } from 'vue'

export default function useTable(apis, paras = {}) {
  // 分页对象
  const page = reactive({
    pageCurrent: 1,
    pageSize: 20,
    totalCount: 0,
    list: [],
    loading: true
  })

  // 分页查询
  const handlePage = async () => {
    if (apis.page) {
      page.loading = true
      try {
        const res = await apis.page({
          pageCurrent: page.pageCurrent,
          pageSize: page.pageSize,
          ...paras,
          ...query
        })
        if (res) {
          page.list = res.list || res || []
          page.totalCount = res.totalCount || 0
        }
      } finally {
        page.loading = false
      }
    }
  }

  // 查询对象
  const query = reactive({})

  // 查询
  const handleQuery = () => {
    page.pageCurrent = 1
    // 分页查询
    handlePage().then(() => {
      //ElMessage.success('查询成功')
    })
  }

  // 重置
  const resetQuery = () => {
    for (let i in query) {
      query[i] = ''
    }
    handleQuery()
  }

  // 获取数据
  onMounted(handlePage)

  return {
    page,
    handlePage,
    query,
    handleQuery,
    resetQuery
  }
}
