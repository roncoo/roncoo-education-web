<script setup>
  import { loginApi } from '~/api/login'
  const props = defineProps({ modelValue: { type: Boolean, default: false } })
  const emit = defineEmits(['update:modelValue', 'callback'])
  const { data: website } = useWebsite()
  const url = ref(''),
    loading = ref(false),
    error = ref(false)
  async function load() {
    loading.value = true
    error.value = false
    try {
      if (!website.value.websiteDomain) throw new Error('站点配置未就绪')
      url.value = await loginApi.wxLogin({ loginAuthType: 1, redirectUrl: website.value.websiteDomain + 'account/user' })
    } catch {
      error.value = true
    } finally {
      loading.value = false
    }
  }
  watch(
    () => props.modelValue,
    (visible) => {
      if (visible) load()
    }
  )
  function close() {
    emit('update:modelValue', false)
    emit('callback')
  }
</script>
<template>
  <ElDialog :model-value="modelValue" title="绑定微信账号" width="450px" align-center @close="close">
    <CommonState :loading="loading" :error="error" @retry="load" />
    <iframe v-if="url && !error && !loading" :src="url" title="微信账号绑定" class="wechat-frame" />
    <template #footer><ElButton @click="close">关闭</ElButton></template>
  </ElDialog>
</template>
<style scoped>
  .wechat-frame {
    width: 100%;
    height: 400px;
    border: 0;
  }
</style>
