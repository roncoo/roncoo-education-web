<template>
  <client-only>
    <el-dialog :model-value="visible" :destroy-on-close="true" :append-to-body="true" title="收银台" width="500px" align-center @close="onClose">
      <el-form ref="formRef" :model="passwdModel">
        <el-form-item label="手机号：" prop="mobile"> 1111 </el-form-item>
        <el-form-item prop="verificationCode">
          <el-input v-model="passwdModel.code" placeholder="验证码">
            <template #suffix>
              <el-button link type="primary" @click="getCode"> 获取验证码 </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="loginPwd">
          <el-input v-model="passwdModel.mobilePwd" type="password" show-password placeholder="密码由6-20位大写和小写字母和数字组成" />
        </el-form-item>
        <el-form-item prop="repeatPwd">
          <el-input v-model="passwdModel.mobilePwdRepeat" type="password" show-password placeholder="确认密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="danger" @click="onClose">关闭</el-button>
          <el-button v-loading="loading" type="primary" @click="onSubmit">确认购买</el-button>
        </span>
      </template>
    </el-dialog>
  </client-only>
</template>
<script setup>
  // 表单
  import { courseApi } from '~/api/course.js'
  import QRCode from 'qrcode'
  import { userApi } from '~/api/user'
  import { useUserStore } from '~/store/modules/user'
  import { loginApi } from '~/api/login'

  const password = ref({})
  // 订单
  const passwdModel = ref({
    //mobilePwdEncrypt: 2,
    mobilePwd: '',
    mobilePwdRepeat: ''
  })
  const orderInfo = ref({
    // 0订单没生成，1待支付，2成功支付，3支付失败，4关闭支付
    orderStatus: 0
  })
  const payTypes = ref([
    { code: 1, desc: '微信' },
    { code: 2, desc: '支付宝' },
    { code: 100, desc: '余额' }
  ])
  let orderQueryInterval = null

  const availableAmount = ref(0)
  const handleChange = (item) => {
    if (item === 100) {
      availableAmount.value = useUserStore().getInfo.availableAmount
    }
  }

  // 下单
  const onSubmit = async () => {
    if (loading.value === true) {
      ElMessage.warning('正在处理...')
      return
    }
    loading.value = true
    try {
      let res
      if (courseInfo.value.orderNo) {
        // 继续支付
        res = await userApi.continuePay({ orderNo: courseInfo.value.orderNo, payType: orderModel.value.payType })
      } else {
        // 下单
        orderModel.value.courseId = courseInfo.value.id
        res = await courseApi.createOrder(orderModel.value)
      }
      orderInfo.value = res

      if (orderInfo.value.orderStatus === 2) {
        ElMessage.success('支付成功')
      } else {
        await nextTick(() => {
          QRCode.toCanvas(document.getElementById('canvas'), res.payMessage, { width: 250, height: 250 })
        })

        orderQueryInterval = setInterval(() => {
          if (orderInfo.value.orderStatus === 1) {
            orderQuery(orderInfo.value.orderNo)
          }
        }, 2000)
      }
    } finally {
      loading.value = false
    }
  }

  // 获取验证码
  async function getCode() {
    if (!registerForm.mobile) {
      ElMessage.error('请输入手机号')
      return
    }
    if (!/^1[3456789]\d{9}$/.test(registerForm.mobile)) {
      ElMessage.error('请输入正确的手机号')
      return
    }
    loading.value = true
    try {
      const res = await loginApi.getMobileCode({ mobile: registerForm.mobile })
      ElMessage.success(res)
    } finally {
      loading.value = false
    }
  }

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
    courseInfo.value = {}
    if (orderInfo.value.orderStatus === 2) {
      emit('refresh')
    }
    orderInfo.value.orderStatus = 0
    clearInterval(orderQueryInterval)
  }
  const emit = defineEmits(['refresh'])
  const visible = ref(false)
  const loading = ref(false)
</script>
<style lang="scss" scoped>
  .el-form {
    padding: 10px 20px;
  }
  .course-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0 30px;
    div {
      padding: 0 10px;
    }
    .course-info-img {
      height: 100px;
      width: auto;
    }
  }

  .course-qrcode {
    padding: 0 20px;
    text-align: center;
    .course-qrcode-desc {
      margin: 0 auto;
      width: 160px;
      padding: 13px 0 13px 70px;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      color: #fff;
      background: url(data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABGAAD/4QMsaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MCA3OS4xNjA0NTEsIDIwMTcvMDUvMDYtMDE6MDg6MjEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBQUJFOEQ1MjRBQUExMUU4OEJBREIyOUE3Mjg5MjBCRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBQUJFOEQ1MzRBQUExMUU4OEJBREIyOUE3Mjg5MjBCRCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjMyOURBNEZGNEE4ODExRTg4QkFEQjI5QTcyODkyMEJEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjMyOURBNTAwNEE4ODExRTg4QkFEQjI5QTcyODkyMEJEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQABAMDAwMDBAMDBAYEAwQGBwUEBAUHCAYGBwYGCAoICQkJCQgKCgwMDAwMCgwMDQ0MDBERERERFBQUFBQUFBQUFAEEBQUIBwgPCgoPFA4ODhQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAKQApAwERAAIRAQMRAf/EAIAAAAICAwEAAAAAAAAAAAAAAAYHAwQBAggFAQACAwEAAAAAAAAAAAAAAAABBAADBQIQAAEDAwMDAwQABwAAAAAAAAIBAwQRBQYAEgchMRNRIjJBUiMUYXGBkUIzFREAAgMAAQMEAwEAAAAAAAAAAQIAEQMxIUESYSIyE/BRcQT/2gAMAwEAAhEDEQA/AGXaIHE+IcNYpmWW4iN6nXUzjPOtLR0nN76oRbjFKILdOmtpjq+rKrVUzQEXMMRcXnIGY8S32wJBwrDXLDefO24s4yFU8IoW8Ojhd6p9NM456q1s1iUaOhHtFGK3cPqmnIvD/jXJuOseG5JnuMHkRSFZWAoKKeFAQ/JXcYfKo/20tsmjV4GpdkyD5C46cODhLki25MFjwUbbLs9uclo9IWvuID2qOxwuqKNeukNPuzItrsxtPrcGl4nJ+8/uXWzM2Gl05Cv13wq0YFLGOlksrqvwzACR9TXyfM1JUVPyl/imqFxUOX7mWnQlQvYStFjWyy2xm7XRlJtzmop223HVGQaRaed+lFJFVFQAr1pVenckljQ4gAAFmYTMco8ZEzIRqGCoJMsx2QjCpV2iooG3rRaJqfWsnm0maG35Uw82EduDk7Qk6ykcUbjzRBKkHjToDqIiqO32l2pXQ6p/Iejf2b4VyFfsDC7hZBjkN6jfpzP2QJyjXuT2bSGi+5fXU1xXSr7SJoUuu8EPCPqurpVJC+K09NSGEOYbEv8A46qkQI8MGVFK0Z/Xb+KVRPXVWfxnb8xiWO3ccFx7cSOY8UQnmCuEl1lkJjckAl+FAbSX6UpRFrVf47VWbT7B+fr0l6hPCLG1qDOSwFtDjroDLY/WcdAWnV949wAzRFr6EunG+JuLjnpK16Bhu83II1P1hlPizTt40dJBp/TRXgQNzKWuoIb3rjabZeO7FyG7Padh315Y7UEQJHW1Ty9SJVov+pe3rpddg2hSuJa2dIG/c81hIeS22PDdfCLkUAEZim8SAzLjJ8G1NeguBWg7uhD07p17Nqb7QfIesqrj2Wstu25LZNRh4wcdbBkybI2kJAJSFFFaIZUWv10fNebEHi0vRYzOIgdxuLglkqIo263NkhrGMkp531GqCo19gd69VpTryT59BxCB49TzL3HnG03kNu+uRJ7UL/hRP3nvMBOK6NDXaO1Uovs+uudthnXTmHPMvfpAPzJ9umZTOprbYcW5B4Mw7GJmYW2wzrc65KeGS6ybie+QCATZPNqNUOvXWOztnszBSbmiFV8wLqLDkLibH8LsCXm2Zvb8hkq+2x/z4ni8u1xCVT9j7i0Gn26bx/0M7UVIi+mQUWDcWgTpzbfhblPCz28YuGg0/ki003QlFmHHGnHdnzwbkV1yuFjKwVZRpJuz8/m31Ud7zXx29e/fS++xzql8pblmH5NR7YBhmH8X2zLJCZ7abw5drY5GbZbdYZISAHFSn53NyrupSms7XR9SvtIoxzNFQH3A9JyBtX0XW3MySl8l1IZkO+pJJNCSRn9NGSa6kkm0JJ//2Q==)
        no-repeat 20px center #445f85;
    }

    .order-info-img {
      height: 100px;
      width: auto;
    }
    .course-qrcode-tips {
      margin-top: 30px;
      text-align: left;
    }

    .order-info-title {
      margin: 60px 0;
    }
  }
</style>
