<template>
  <NuxtLayout>
    <el-result status="404" title="对不起，您访问的内容不存在！">
      <template #extra>
        <el-button type="primary" @click="goHome"> 前往首页 </el-button>
        <el-button type="success" @click="goBack"> 返回上一页 </el-button>
      </template>
    </el-result>
  </NuxtLayout>
</template>
<script setup>
  const router = useRouter()

  function goBack() {
    router.go(-1)
  }

  function goHome() {
    router.push({ path: '/' })
  }
</script>
