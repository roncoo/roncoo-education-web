<template>
  <NuxtLayout name="account">
    <el-form :model="userInfo" label-width="60px" style="max-width: 600px">
      <el-row>
        <el-col :span="16">
          <el-form-item label="手机：">
            {{ userInfo.mobile }}
          </el-form-item>
          <el-form-item label="昵称：">
            <el-input v-model="userInfo.nickname" size="large" />
          </el-form-item>
          <el-form-item label="年龄：">
            <el-input-number v-model="userInfo.userAge" size="large" />
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" size="large" @click="onSubmit"> 保存设置 </el-button>
          </el-form-item>
        </el-col>
        <el-row>
          <el-row>
            <el-col :span="4">
              <el-form-item>
                <img :src="userInfo.userHead" style="height: 100px; width: auto" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
      </el-row>
    </el-form>
  </NuxtLayout>
</template>
<script setup>
  import { userApi as usersApi } from '~/api/user.js'
  import { ElMessage } from 'element-plus'

  const userInfo = ref({})

  onMounted(() => {
    usersApi.getUserInfo().then((res) => {
      userInfo.value = res
    })
  })

  const onSubmit = () => {
    usersApi.usersUpdata(userInfo.value).then((res) => {
      ElMessage.info(res)
    })
  }
</script>
<style lang="scss" scoped>
  .el-form {
    margin: 20px;
    .el-form-item {
      margin: 20px;
    }
  }
</style>
