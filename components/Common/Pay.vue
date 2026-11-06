<script setup>
  import QRCode from 'qrcode'
  import { courseApi } from '~/api/course'
  import { userApi } from '~/api/user'
  const emit = defineEmits(['refresh'])
  const visible = ref(false),
    loading = ref(false),
    error = ref(''),
    course = ref({}),
    order = ref({ orderStatus: 0 }),
    canvas = ref(),
    available = ref(null)
  const model = reactive({ payType: 11, remark: '' })
  const payTypes = [
    { code: 11, desc: '微信支付' },
    { code: 21, desc: '支付宝' },
    { code: 100, desc: '余额支付' }
  ]
  const money = (value) => new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(Number(value) || 0)
  let timer = null,
    session = 0,
    notified = false,
    pendingPoll = null
  function stop() {
    clearTimeout(timer)
    timer = null
  }
  function notify() {
    if (!notified) {
      notified = true
      emit('refresh')
    }
  }
  function refreshPayment() {
    stop()
    return poll(session)
  }
  async function poll(ticket) {
    if (ticket !== session || !visible.value || pendingPoll === ticket) return
    pendingPoll = ticket
    try {
      const result = await courseApi.orderInfoView(order.value.orderNo)
      if (ticket !== session) return
      order.value = result
      error.value = ''
      if (result.orderStatus === 2) notify()
    } catch {
      if (ticket === session) error.value = '暂时无法确认支付结果，请稍后刷新状态。'
    } finally {
      if (pendingPoll === ticket) pendingPoll = null
    }
    if (ticket === session && visible.value && order.value.orderStatus === 1) timer = setTimeout(() => poll(ticket), 2000)
  }
  async function balance() {
    if (model.payType !== 100) return
    try {
      available.value = (await userApi.getUserInfo()).availableAmount
    } catch {
      error.value = '余额加载失败，请重试或选择其他支付方式。'
    }
  }
  async function submit() {
    if (loading.value) return
    loading.value = true
    error.value = ''
    const ticket = session
    try {
      const result = course.value.orderNo
        ? await userApi.continuePay({ orderNo: course.value.orderNo, payType: model.payType })
        : await courseApi.createOrder({ courseId: course.value.id, payType: model.payType, remark: model.remark })
      if (ticket !== session) return
      order.value = result
      if (result.orderStatus === 2) notify()
      if (result.orderStatus === 1) {
        await nextTick()
        if (ticket !== session) return
        if (result.payMessage && canvas.value) await QRCode.toCanvas(canvas.value, result.payMessage, { width: 240, margin: 2 })
        stop()
        timer = setTimeout(() => poll(ticket), 2000)
      }
    } catch {
      if (ticket === session) error.value = '支付请求未完成，请检查订单状态后重试。'
    } finally {
      if (ticket === session) loading.value = false
    }
  }
  function onOpen(item) {
    stop()
    session++
    notified = false
    course.value = { ...item }
    order.value = { orderStatus: 0 }
    model.payType = 11
    model.remark = ''
    error.value = ''
    available.value = null
    loading.value = false
    visible.value = true
  }
  function onClose() {
    stop()
    session++
    visible.value = false
    if (order.value.orderStatus === 2) notify()
  }
  onUnmounted(() => {
    stop()
    session++
  })
  defineExpose({ onOpen })
</script>
<template>
  <ElDialog :model-value="visible" title="确认课程订单" width="540px" align-center :close-on-click-modal="false" :close-on-press-escape="!loading" :show-close="!loading" @close="onClose">
    <div class="checkout-course">
      <CommonImage :src="course.courseLogo" :alt="course.courseName" :width="120" :height="68" />
      <div>
        <strong>{{ course.courseName }}</strong>
        <p>
          应付金额
          <b>{{ money(order.coursePrice ?? course.coursePrice) }}</b>
        </p>
      </div>
    </div>
    <ElAlert v-if="error" :title="error" type="error" :closable="false" show-icon class="payment-error" />
    <ElForm v-if="order.orderStatus === 0" label-position="top">
      <ElFormItem label="支付方式">
        <ElRadioGroup v-model="model.payType" @change="balance">
          <ElRadioButton v-for="item in payTypes" :key="item.code" :value="item.code">{{ item.desc }}</ElRadioButton>
        </ElRadioGroup>
      </ElFormItem>
      <p v-if="model.payType === 100" class="balance">可用余额：{{ available === null ? '正在加载…' : money(available) }}</p>
      <ElFormItem label="订单备注（选填）"><ElInput v-model="model.remark" name="remark" maxlength="25" placeholder="填写订单备注…" show-word-limit /></ElFormItem>
    </ElForm>
    <div v-else-if="order.orderStatus === 1" class="payment-result">
      <h3>请扫码完成支付</h3>
      <canvas ref="canvas" aria-label="付款二维码" />
      <p>正在等待支付结果…</p>
      <ElButton @click="refreshPayment">刷新支付状态</ElButton>
    </div>
    <div v-else class="payment-result" role="status">
      <span :class="['result-mark', { success: order.orderStatus === 2 }]">{{ order.orderStatus === 2 ? '✓' : '!' }}</span>
      <h3>{{ order.orderStatus === 2 ? '支付成功' : order.orderStatus === 4 ? '订单已关闭' : '支付失败' }}</h3>
      <p>{{ order.orderStatus === 2 ? '课程已解锁，现在开始学习吧。' : '请返回订单列表查看状态或继续支付。' }}</p>
      <NuxtLink v-if="order.orderStatus === 2" class="button-link primary" :to="{ path: '/course/study', query: { id: course.id || course.courseId } }" @click="onClose">开始学习 <CommonIcon name="arrow" :size="16" /></NuxtLink>
      <NuxtLink v-else class="button-link" to="/account/order" @click="onClose">查看我的订单</NuxtLink>
    </div>
    <template #footer>
      <ElButton :disabled="loading" @click="onClose">{{ order.orderStatus === 2 ? '完成' : '关闭' }}</ElButton>
      <ElButton v-if="order.orderStatus === 0" type="primary" :loading="loading" @click="submit">确认支付 {{ money(course.coursePrice) }}</ElButton>
    </template>
  </ElDialog>
</template>
<style scoped>
  .checkout-course {
    display: flex;
    gap: 16px;
    align-items: center;
    padding: 8px 0 24px;
    border-bottom: 1px solid var(--line);
    margin-bottom: 24px;
  }
  .checkout-course :deep(img),
  .checkout-course :deep(.image-placeholder) {
    width: 120px;
    height: 68px;
    border-radius: 8px;
    flex-shrink: 0;
  }
  .checkout-course p {
    margin: 8px 0 0;
    color: var(--muted);
  }
  .checkout-course b {
    color: #c2410c;
    font-size: 20px;
    margin-left: 8px;
  }
  .payment-result {
    text-align: center;
    padding: 12px 0 24px;
  }
  .payment-result p,
  .balance {
    color: var(--muted);
  }
  .payment-error {
    margin-bottom: 20px;
  }
  .result-mark {
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #fff7ed;
    color: #c2410c;
    font-size: 32px;
    margin: 0 auto 20px;
  }
  .result-mark.success {
    background: #f0fdf4;
    color: #15803d;
  }
</style>
