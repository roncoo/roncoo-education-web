<script setup>
  import { courseApi } from '~/api/course'
  import { setStorage } from '~/utils/storage'
  const props = defineProps({ courseId: { type: [String, Number], default: '' }, collectStatus: { type: Boolean, default: false } })
  const status = ref(false),
    busy = ref(false)
  watch(
    () => props.collectStatus,
    (value) => {
      status.value = value
    },
    { immediate: true }
  )
  async function handleCollect() {
    if (busy.value || !props.courseId) return
    if (!getToken()) {
      setStorage('history', window.location.href, 5)
      return navigateTo('/login')
    }
    busy.value = true
    try {
      const res = await courseApi.courseCollectAdd({ courseId: props.courseId })
      status.value = res === 'add'
      ElMessage.success(status.value ? '收藏成功' : '已取消收藏')
    } catch {
      ElMessage.error('收藏操作失败，请重试')
    } finally {
      busy.value = false
    }
  }
</script>
<template>
  <button class="collect-button" type="button" :disabled="busy" :aria-pressed="status" @click.stop.prevent="handleCollect">
    <CommonIcon name="heart" :size="16" :filled="status" />
    {{ status ? '已收藏' : '收藏' }}
  </button>
</template>
<style scoped>
  .collect-button {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    padding: 6px 8px;
    border-radius: 6px;
    border: 0;
    background: transparent;
    color: var(--muted);
    font-size: 12px;
  }
  .collect-button span {
    font-size: 19px;
  }
  .collect-button:hover,
  .collect-button[aria-pressed='true'] {
    color: var(--brand);
    background: var(--brand-soft);
  }
  .collect-button:disabled {
    opacity: 0.5;
    cursor: wait;
  }
</style>
