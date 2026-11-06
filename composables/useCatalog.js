export function useCatalog(fetcher, params) {
  const route = useRoute(),
    router = useRouter()
  const list = ref([]),
    total = ref(0),
    loading = ref(true),
    error = ref(false)
  const page = computed(() => Math.max(1, Number(route.query.page) || 1))
  const pageSize = computed(() => Math.min(100, Math.max(1, Number(route.query.size) || 12)))
  let sequence = 0
  async function load() {
    const ticket = ++sequence
    loading.value = true
    error.value = false
    try {
      const res = await fetcher({ ...params(), pageCurrent: page.value, pageSize: pageSize.value })
      if (ticket !== sequence) return
      list.value = Array.isArray(res) ? res : res?.list || []
      total.value = res?.totalCount || 0
    } catch {
      if (ticket === sequence) {
        list.value = []
        total.value = 0
        error.value = true
      }
    } finally {
      if (ticket === sequence) loading.value = false
    }
  }
  function updateQuery(values) {
    return router.push({ query: { ...route.query, ...values } })
  }
  onMounted(load)
  watch(() => route.fullPath, load)
  onUnmounted(() => {
    sequence++
  })
  return { list, total, loading, error, page, pageSize, load, updateQuery }
}
