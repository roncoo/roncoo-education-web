<script setup>
  import { courseApi } from '~/api/course'
  const route = useRoute()
  const { data: categories, error, refresh } = useAsyncData('course-categories', () => courseApi.categoryList(), { default: () => [] })
  const rows = computed(() => {
    const result = [{ label: '课程分类', items: categories.value || [], parent: '' }]
    function descend(items) {
      for (const item of items || []) {
        if (String(item.id) === String(route.query.categoryId)) return [item]
        const sub = descend(item.list)
        if (sub) return [item, ...sub]
      }
      return null
    }
    const trail = descend(categories.value)
    for (const item of trail || []) if (item.list?.length) result.push({ label: item.categoryName, items: item.list, parent: item.id })
    return result
  })
  function active(item, row) {
    return String(route.query.categoryId || '') === String(item?.id || row.parent || '') || contains(item?.list)
  }
  function contains(items) {
    return (items || []).some((item) => String(item.id) === String(route.query.categoryId) || contains(item.list))
  }
</script>
<template>
  <CommonState v-if="error" error @retry="refresh" />
  <div v-else class="filters surface">
    <div v-for="row in rows" :key="row.label" class="filter-row">
      <span>{{ row.label }}</span>
      <div>
        <NuxtLink :class="{ selected: String(route.query.categoryId || '') === String(row.parent) }" :to="{ query: { ...route.query, categoryId: row.parent || undefined, page: undefined } }">
          全部
        </NuxtLink>
        <NuxtLink v-for="item in row.items" :key="item.id" :class="{ selected: active(item, row) }" :to="{ query: { ...route.query, categoryId: item.id, page: undefined } }">
          {{ item.categoryName }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .filters {
    margin-bottom: 28px;
    padding: 20px 28px;
  }
  .filter-row {
    display: flex;
    gap: 26px;
    padding: 12px 0;
    align-items: baseline;
  }
  .filter-row + .filter-row {
    border-top: 1px solid #f0f3f8;
  }
  .filter-row > span {
    color: var(--muted);
    min-width: 70px;
    font-size: 13px;
  }
  .filter-row > div {
    display: flex;
    gap: 6px 8px;
    flex-wrap: wrap;
  }
  .filter-row a {
    padding: 5px 15px;
    border: 1px solid transparent;
    border-radius: 7px;
    font-size: 13px;
    transition:
      background-color 0.2s,
      color 0.2s,
      border-color 0.2s;
  }
  .filter-row a:hover {
    background: var(--brand-soft);
    color: var(--brand);
  }
  .filter-row .selected {
    background: var(--brand-soft);
    color: var(--brand);
    border-color: #dce7ff;
    font-weight: 550;
  }
</style>
