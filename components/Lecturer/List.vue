<script setup>
  defineProps({ list: { type: Array, default: () => [] } })
</script>
<template>
  <CommonState v-if="!list.length" empty title="暂时没有相关讲师" description="换个关键词试试，或先浏览课程。" />
  <div v-else class="lecturer-grid">
    <NuxtLink v-for="item in list" :key="item.id" class="lecturer-card surface" :to="{ path: '/lecturer/detail', query: { id: item.id } }">
      <CommonImage class="avatar" :src="item.lecturerHead" :alt="item.lecturerName" :width="80" :height="80" />
      <div>
        <h3>{{ item.lecturerName }}</h3>
        <p>{{ item.lecturerPosition || '课程讲师' }}</p>
        <span>了解讲师 <CommonIcon name="arrow" :size="16" /></span>
      </div>
    </NuxtLink>
  </div>
</template>
<style scoped>
  .lecturer-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
  }
  .lecturer-card {
    display: flex;
    align-items: center;
    gap: 22px;
    padding: 30px 24px;
    transition:
      transform 0.2s,
      box-shadow 0.2s,
      border-color 0.2s;
    background: linear-gradient(145deg, #f8faff, white 60%);
  }
  .lecturer-card:hover {
    transform: translateY(-4px);
    border-color: #cfddf7;
    box-shadow: 0 14px 32px #172b4d0d;
  }
  .avatar {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    border-radius: 50%;
    object-fit: cover;
    box-shadow:
      0 0 0 6px white,
      0 0 0 7px #edf1f7;
  }
  .lecturer-card > div {
    min-width: 0;
  }
  .lecturer-card h3 {
    margin-bottom: 6px;
    font-size: 18px;
    font-weight: 600;
  }
  .lecturer-card p {
    color: var(--muted);
    font-size: 13px;
    margin-bottom: 18px;
  }
  .lecturer-card span {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    color: var(--brand);
  }
  @media (max-width: 1100px) {
    .lecturer-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
