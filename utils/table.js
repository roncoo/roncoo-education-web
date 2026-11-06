import { onMounted, onUnmounted, reactive } from 'vue'
export default function useTable(apis, paras = {}) {
  const page = reactive({ pageCurrent: 1, pageSize: 12, totalCount: 0, list: [], loading: true, error: false })
  const query = reactive({})
  let sequence = 0
  async function handlePage() {
    const ticket = ++sequence
    page.loading = true
    page.error = false
    try {
      const res = await apis.page({ pageCurrent: page.pageCurrent, pageSize: page.pageSize, ...paras, ...query })
      if (ticket !== sequence) return
      page.list = Array.isArray(res) ? res : res?.list || []
      page.totalCount = res?.totalCount || 0
    } catch {
      if (ticket === sequence) {
        page.error = true
        page.list = []
        page.totalCount = 0
      }
    } finally {
      if (ticket === sequence) page.loading = false
    }
  }
  function handleQuery() {
    page.pageCurrent = 1
    return handlePage()
  }
  function resetQuery() {
    Object.keys(query).forEach((key) => delete query[key])
    return handleQuery()
  }
  onMounted(handlePage)
  onUnmounted(() => {
    sequence++
  })
  return { page, query, handlePage, handleQuery, resetQuery }
}
