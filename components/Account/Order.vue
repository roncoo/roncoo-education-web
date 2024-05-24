<template>
  <el-table v-loading="page.loading" :border="false" :data="page.list" :show-header="false">
    <el-table-column label="课程">
      <template #default="scope">
        <div class="order-no">
          <span>订单号：{{ scope.row.orderNo }}</span>
          <span>
            支付状态：
            <b v-if="scope.row.orderStatus === 1">待支付</b>
            <b v-else-if="scope.row.orderStatus === 2">已支付</b>
            <b v-else-if="scope.row.orderStatus === 3">支付失败</b>
            <b v-else-if="scope.row.orderStatus === 4">已关闭</b>
          </span>
          <span>
            支付方式：
            <b v-if="scope.row.payType === 1">微信支付</b>
            <b v-else-if="scope.row.payType === 2">支付宝支付</b>
            <b v-else-if="scope.row.payType === 100">余额支付</b>
          </span>
        </div>
        <div class="order-info">
          <div class="order-info-title">
            <nuxt-link v-if="scope.row.courseId" :to="{ name: 'course-study', query: { id: scope.row.courseId } }" link plain type="primary">
              <img v-if="scope.row.courseLogo" :src="scope.row.courseLogo" :alt="scope.row.courseName" />
            </nuxt-link>
            <div class="order-info-course">
              {{ scope.row.courseName }}<br /><br />
              <span>原价：￥{{ scope.row.rulingPrice }} </span><span>实付：￥{{ scope.row.coursePrice }}</span>
            </div>
          </div>
          <div class="order-info-opt">
            <div v-if="scope.row.orderStatus === 1 || scope.row.orderStatus === 3">
              <el-button type="primary" @click="handlePay(scope.row)"> 继续支付 </el-button>
              <br />
              <br />
              <el-button @click="handleCancel(scope.row)"> 取消订单 </el-button>
            </div>
          </div>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <div v-if="page.totalCount >= 1" class="pagination">
    <common-pagination v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" :total="page.totalCount" @pagination="handlePage" />
  </div>

  <common-pay ref="commonPayRef" />
</template>
<script setup>
  import useTable from '~/utils/table.js'
  import { userApi } from '~/api/user.js'

  const props = defineProps({
    orderStatus: {
      type: Number,
      default: 0
    }
  })

  const orderStatus = ref(props.orderStatus)
  const commonPayRef = ref()
  function handlePay(row) {
    commonPayRef.value.onOpen(row)
  }

  function handleCancel(row) {
    ElMessageBox.confirm('是否取消订单？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      userApi.cancelOrder({ orderNo: row.orderNo }).then((res) => {
        ElMessage.success(res)
        handlePage()
      })
    })
  }

  const { page, handlePage } = useTable(
    {
      page: userApi.orderPage
    },
    {
      orderStatus: orderStatus.value === 0 ? '' : orderStatus.value
    }
  )
</script>
<style lang="scss" scoped>
  .order-no {
    padding: 0 20px;
    margin: 10px 0;
    line-height: 25px;
  }
  .order-info {
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
      height: 100px;
      width: auto;
      margin-right: 20px;
    }
    .order-info-title {
      display: flex;
      align-items: center;
    }
    .order-info-opt {
      margin-right: 0;
    }
    .order-info-course {
      max-width: 400px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  span {
    margin-right: 50px;
  }
</style>
