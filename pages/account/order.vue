<template>
  <NuxtLayout name="account">
    <el-tabs v-model="orderStatus" @tab-click="handleTabClick">
      <el-tab-pane v-for="(item, index) in tabPanes" :key="index" :label="item.label" :name="item.orderStatus">
        <account-order v-if="orderStatus === item.orderStatus" :order-status="orderStatus" />
      </el-tab-pane>
    </el-tabs>
  </NuxtLayout>
</template>
<script setup>
  const orderStatus = ref(0)
  function handleTabClick(tab) {
    orderStatus.value = tab.props.name
  }

  const tabPanes = [
    {
      label: '所有订单',
      orderStatus: 0
    },
    {
      label: '待支付订单',
      orderStatus: 1
    },
    {
      label: '已完成订单',
      orderStatus: 2
    }
  ]
</script>
<style lang="scss" scoped></style>
