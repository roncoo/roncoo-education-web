<script setup>
  useHead({ title: '账号登录' })
</script>
<template>
  <NuxtLayout>
    <AccountAuthShell>
      <AccountAccessForm mode="login" />
      <AccountWechatLogin />
    </AccountAuthShell>
  </NuxtLayout>
</template>
