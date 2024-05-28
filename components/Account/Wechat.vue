<template>
  <el-dialog :append-to-body="true" :model-value="props.modelValue" width="480px" center align-center :destroy-on-close="true" @close="onClose">
    <div class="wx">
      <iframe v-if="wxLoginUrl && !bindSuccess" :src="wxLoginUrl" />
      <div v-if="bindSuccess">
        <img src="@/assets/svg/success.svg" />
        <div class="binding-success">绑定成功</div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose"> 取消 </el-button>
        <el-button type="primary" @click="onClose"> 完成 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { loginApi } from '~/api/login.js'
  import { userApi } from '~/api/user'
  import { indexApi } from '~/api'

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits(['update:modelValue', 'callback'])
  const router = useRouter()
  const route = useRoute()

  const wxCode = ref('')
  const wxLoginUrl = ref('')
  const bindSuccess = ref(false)
  const websiteInfo = ref({})

  watch(
    () => props.modelValue,
    (val) => {
      if (val) {
        if (!wxCode.value) {
          handleBinding()
        } else {
          userBinding()
        }
      }
    }
  )
  onMounted(() => {
    wxCode.value = route.query.code

    // 站点信息
    websiteInfo.value = getStorage('WebsiteInfo')
    if (!websiteInfo.value) {
      indexApi.websiteInfo().then((res) => {
        setStorage('WebsiteInfo', res, 60)
        websiteInfo.value = res
      })
    }
  })

  // 获取微信授权链接
  const handleBinding = () => {
    const redirectUrl = websiteInfo.value.websiteDomain + window.location.pathname
    loginApi.wxLogin({ loginAuthType: 1, redirectUrl: redirectUrl }).then((res) => {
      wxLoginUrl.value = res
    })
  }

  // 用户绑定微信
  const userBinding = () => {
    userApi.userBinding({ code: wxCode.value }).then((res) => {
      if (res) {
        router.push({
          query: Object.assign({ ...route.query }, { code: '', state: '' })
        })
        bindSuccess.value = true
      }
    })
  }

  const onClose = () => {
    emit('update:modelValue', false)
    if (wxCode.value) {
      emit('callback')
    }
  }
</script>

<style lang="scss" scoped>
  .wx {
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    .binding-success {
      margin-top: 20px;
    }
    iframe {
      border: none;
      width: 100%;
      height: 400px;
    }
  }
</style>
