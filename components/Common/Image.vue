<script setup lang="ts">
  const props = withDefaults(defineProps<{ src?: string; alt?: string; width?: number; height?: number; eager?: boolean }>(), { alt: '', width: 640, height: 360 })
  const failed = shallowRef(false)
  watch(
    () => props.src,
    () => {
      failed.value = false
    }
  )
</script>
<template>
  <img v-if="src && !failed" :src="src" :alt="alt" :width="width" :height="height" :loading="eager ? 'eager' : 'lazy'" :fetchpriority="eager ? 'high' : 'auto'" @error="failed = true" />
  <div v-else class="image-placeholder" role="img" :aria-label="alt || '暂无图片'">
    <span aria-hidden="true">{{ alt ? alt.slice(0, 2) : '学' }}</span>
  </div>
</template>
<style scoped>
  img {
    height: auto;
    object-fit: cover;
  }
  .image-placeholder {
    display: grid;
    place-items: center;
    aspect-ratio: 16/9;
    background: linear-gradient(130deg, #e9f0ff, #f0f5fb);
    color: #5775a5;
    font-size: 24px;
    letter-spacing: 4px;
  }
</style>
