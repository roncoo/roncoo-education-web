<script setup>
  import { indexApi } from '~/api'
  const { data: list } = useAsyncData('website-links', () => indexApi.websiteLink(), { default: () => [] })
</script>
<template>
  <nav v-if="list.length" class="main friend-links" aria-label="友情链接">
    <span>友情链接</span>
    <a v-for="item in list" :key="item.linkUrl" :href="item.linkUrl" :target="item.linkTarget" rel="noopener noreferrer">{{ item.linkName }}</a>
  </nav>
</template>
<style scoped>
  .friend-links {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 24px;
    padding: 0 0 24px;
    color: var(--muted);
    font-size: 13px;
  }
</style>
