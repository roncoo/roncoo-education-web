<script setup lang="ts">
  withDefaults(defineProps<{ name: string; size?: number; filled?: boolean }>(), { size: 20 })
  const paths: Record<string, string> = {
    search: 'm21 21-4.5-4.5 M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0',
    arrow: 'M5 12h14m-6-6 6 6-6 6',
    book: 'M12 5.5C9 3.5 5.5 3.5 2 5v15c3.5-1.5 7-1.5 10 .5 3-2 6.5-2 10-.5V5c-3.5-1.5-7-1.5-10 .5Zm0 0v15',
    grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
    user: 'M20 21v-2a7 7 0 0 0-14 0v2 M17 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
    receipt: 'M5 3h14v18l-3-2-4 2-4-2-3 2V3Zm4 5h6m-6 4h6',
    heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
    play: 'm9 6 10 6-10 6V6Z',
    spark: 'm12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z',
    clock: 'M12 8v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
    check: 'm5 12 4 4L19 6',
    refresh: 'M20 7v5h-5 M4 17v-5h5 M6 7a7 7 0 0 1 12-2l2 2 M18 17a7 7 0 0 1-12 2l-2-2',
    close: 'm6 6 12 12M6 18 18 6',
    comment: 'M21 11a8 8 0 0 1-8 8H6l-4 3V11a9 9 0 0 1 19 0ZM7 10h10m-10 4h6'
  }
</script>
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="filled ? 'currentColor' : 'none'"
    stroke="currentColor"
    stroke-width="1.65"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    class="ui-icon"
  >
    <path :d="paths[name] || paths.book" />
  </svg>
</template>
<style scoped>
  .ui-icon {
    display: inline-block;
    vertical-align: middle;
    flex-shrink: 0;
  }
</style>
