<template>
  <el-dialog :append-to-body="true" :model-value="visible" title="收银台" width="600px" :destroy-on-close="true" @close="onClose">
    <el-form ref="formRef" :model="order" :rules="rules" @submit.prevent>
      <img :src="courseInfo.courseLogo" width="200px" />
      <span>{{ courseInfo.courseName }}</span>
      <span>{{ courseInfo.coursePrice }}</span>

      <el-form-item class="form-group" prop="payType">
        <el-radio-group v-model="order.payType" size="large">
          <el-radio-button label="支付宝" value="2" />
          <el-radio-button label="微信" value="1" />
        </el-radio-group>
      </el-form-item>

      <el-form-item class="form-group" prop="remark">
        <el-input v-model="order.remark" maxlength="25" placeholder="若需备注，请在这里输入" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="onSubmit()">下一步</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
  // 打开和关闭
  const onOpen = (item) => {
    if (item) {
      Object.assign(courseInfo.value, item)
    }
    visible.value = true
  }
  defineExpose({ onOpen })
  const onClose = () => {
    visible.value = false
  }

  // 表单
  const courseInfo = ref({})
  const order = ref({
    payType: 2,
    remark: ''
  })
  const onSubmit = async () => {
    if (loading.value === true) {
      ElMessage({ type: 'warning', message: '正在处理...' })
      return
    }

    loading.value = true
    try {
      if (courseInfo.value.id) {
        await usersApi.usersEdit(courseInfo.value)
        ElMessage({ type: 'success', message: '修改成功' })
      } else {
        ElMessage({ type: 'warning', message: '不支持后台添加，请在门户注册' })
      }
      emit('refresh')
      onClose()
    } finally {
      loading.value = false
    }
  }

  const emit = defineEmits(['refresh'])
  const visible = ref(false)
  const loading = ref(false)
</script>
<style lang="scss" scoped></style>
