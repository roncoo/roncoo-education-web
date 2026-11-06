<script setup lang="ts">
  withDefaults(defineProps<{ loading?: boolean; error?: boolean; empty?: boolean; title?: string; description?: string; actionTo?: string; actionLabel?: string }>(), {
    title: '还没有相关内容',
    description: '探索课程，开启下一段学习旅程。',
    actionLabel: '浏览课程',
    actionTo: '/course/list'
  })
  defineEmits<{ retry: [] }>()
</script>
<template>
  <div v-if="loading" class="state surface" role="status" aria-label="正在加载…"><ElSkeleton :rows="4" animated /></div>
  <div v-else-if="error || empty" class="state surface" role="status" aria-live="polite">
    <span class="state-symbol"><CommonIcon :name="error ? 'refresh' : 'book'" :size="27" /></span>
    <h3>{{ error ? '内容加载失败' : title }}</h3>
    <p>{{ error ? '请检查网络连接后重新加载。' : description }}</p>
    <ElButton v-if="error" type="primary" @click="$emit('retry')">重新加载</ElButton>
    <NuxtLink v-else-if="actionTo" class="button-link" :to="actionTo">{{ actionLabel }} <CommonIcon name="arrow" :size="16" /></NuxtLink>
  </div>
</template>
<style scoped>
  .state {
    padding: 48px 32px;
    text-align: center;
    margin: 16px 0;
  }
  .state-symbol {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: 16px;
    color: var(--brand);
    background: var(--brand-soft);
    margin: 0 auto 16px;
    font-size: 28px;
  }
  .state h3 {
    margin-bottom: 8px;
  }
  .state p {
    color: var(--muted);
    margin-bottom: 24px;
  }
</style>
