<script setup>
  import useTable from '~/utils/table'
  import { userApi } from '~/api/user'
  const props = defineProps({ orderStatus: { type: Number, default: 0 } })
  const { page, handlePage } = useTable({ page: userApi.orderPage }, { orderStatus: props.orderStatus || '' })
  const pay = ref()
  const labels = { 1: '待支付', 2: '已支付', 3: '支付失败', 4: '已关闭' }
  const methods = { 11: '微信支付', 21: '支付宝', 100: '余额支付' }
  const money = (value) => new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(Number(value) || 0)
  async function cancel(row) {
    try {
      await ElMessageBox.confirm('取消后将无法使用当前订单支付。', '确认取消订单', { confirmButtonText: '取消订单', cancelButtonText: '保留订单', type: 'warning' })
      await userApi.cancelOrder({ orderNo: row.orderNo })
      await handlePage()
    } catch {
      /* Cancellation leaves the order unchanged. */
    }
  }
</script>
<template>
  <CommonState :loading="page.loading" :error="page.error" :empty="!page.list.length" title="这里还没有订单" description="找到感兴趣的课程后，你的订单会展示在这里。" @retry="handlePage" />
  <template v-if="!page.loading && !page.error">
    <article v-for="row in page.list" :key="row.orderNo" class="order-card surface">
      <header>
        <span>订单号 {{ row.orderNo }}</span>
        <ElTag :type="row.orderStatus === 2 ? 'success' : row.orderStatus === 1 ? 'warning' : 'info'">{{ labels[row.orderStatus] || '处理中' }}</ElTag>
      </header>
      <div class="order-content">
        <NuxtLink :to="{ path: '/course/detail', query: { id: row.courseId } }"><CommonImage class="order-cover" :src="row.courseLogo" :alt="row.courseName" /></NuxtLink>
        <div class="order-details">
          <h3>{{ row.courseName }}</h3>
          <p>{{ methods[row.payType] || '支付方式待确认' }}</p>
          <strong>{{ money(row.coursePrice) }}</strong>
        </div>
        <div class="order-actions">
          <template v-if="row.orderStatus === 1 || row.orderStatus === 3">
            <ElButton type="primary" @click="pay.onOpen(row)">继续支付</ElButton>
            <ElButton link @click="cancel(row)">取消订单</ElButton>
          </template>
          <NuxtLink v-else-if="row.orderStatus === 2" class="button-link" :to="{ path: '/course/study', query: { id: row.courseId } }">开始学习 <CommonIcon name="arrow" :size="16" /></NuxtLink>
        </div>
      </div>
    </article>
    <div v-if="page.list.length > 0 && page.totalCount > 0" class="pagination">
      <CommonPagination v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" :total="page.totalCount" @pagination="handlePage" />
    </div>
  </template>
  <CommonPay ref="pay" @refresh="handlePage" />
</template>
<style scoped>
  .order-card {
    padding: 0;
    margin-bottom: 20px;
    overflow: hidden;
  }
  .order-card header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    background: #fafbfd;
    border-bottom: 1px solid var(--line);
    padding: 14px 20px;
    font-size: 12px;
    color: var(--muted);
  }
  .order-content {
    display: flex;
    gap: 20px;
    align-items: center;
    padding: 20px;
  }
  .order-cover {
    width: 160px;
    height: 90px;
    border-radius: 8px;
    object-fit: cover;
  }
  .order-details {
    flex: 1;
    min-width: 0;
  }
  .order-details h3 {
    font-size: 16px;
    margin-bottom: 6px;
  }
  .order-details p {
    font-size: 12px;
    color: var(--muted);
    margin-bottom: 6px;
  }
  .order-details strong {
    color: #c2410c;
    font-size: 18px;
  }
  .order-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .order-actions .el-button {
    margin: 0;
  }
  @media (max-width: 1100px) {
    .order-cover {
      width: 130px;
      height: 74px;
    }
    .order-content {
      gap: 16px;
    }
  }
</style>
