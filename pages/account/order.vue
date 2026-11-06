<script setup>
  const route = useRoute(),
    router = useRouter()
  const status = computed(() => ([1, 2].includes(Number(route.query.status)) ? Number(route.query.status) : 0))
</script>
<template>
  <NuxtLayout name="account">
    <div class="order-tabs surface">
      <ElTabs :model-value="status" @update:model-value="(value) => router.push({ query: { status: value || undefined } })">
        <ElTabPane label="全部订单" :name="0" />
        <ElTabPane label="待支付" :name="1" />
        <ElTabPane label="已完成" :name="2" />
      </ElTabs>
    </div>
    <AccountOrder :key="status" :order-status="status" />
  </NuxtLayout>
</template>
<style scoped>
  .order-tabs {
    padding: 4px 20px 0;
    margin-bottom: 20px;
  }
  .order-tabs :deep(.el-tabs__header) {
    margin: 0;
  }
</style>
