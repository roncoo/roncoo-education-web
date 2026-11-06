<script setup lang="ts">
  const props = defineProps<{ mode: 'login' | 'register' | 'reset' }>()
  const { data: website } = useWebsite()
  const { form, errors, busy, message, captcha, countdown, validate, loadCaptcha, sendCode, submit } = useAccessForm(props.mode, website)
  const privacy = shallowRef(false)
  const title = computed(() => ({ login: '欢迎回来', register: '创建学习账号', reset: '重置登录密码' })[props.mode])
</script>
<template>
  <div>
    <header class="access-heading">
      <h2>{{ title }}</h2>
      <p>{{ mode === 'login' ? '登录后，继续你的学习旅程' : mode === 'register' ? '从这里开始，探索更多可能' : '验证手机号后，设置新的登录密码' }}</p>
    </header>
    <ElAlert v-if="message" class="form-alert" :title="message" type="error" :closable="false" show-icon />
    <form novalidate @submit.prevent="submit">
      <div class="field">
        <label for="access-mobile">手机号</label>
        <ElInput
          id="access-mobile"
          v-model="form.mobile"
          name="mobile"
          type="tel"
          inputmode="tel"
          autocomplete="username"
          placeholder="请输入手机号…"
          :aria-invalid="!!errors.mobile"
          aria-describedby="error-mobile"
          @blur="validate('mobile')"
        />
        <p v-if="errors.mobile" id="error-mobile" class="field-error">{{ errors.mobile }}</p>
      </div>
      <div class="field">
        <label for="access-password">{{ mode === 'reset' ? '新密码' : '密码' }}</label>
        <ElInput
          id="access-password"
          v-model="form.password"
          name="password"
          type="password"
          :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
          show-password
          :placeholder="mode === 'login' ? '请输入密码…' : '6–20 位字母和数字…'"
          :aria-invalid="!!errors.password"
          aria-describedby="error-password"
          @blur="validate('password')"
        />
        <p v-if="errors.password" id="error-password" class="field-error">{{ errors.password }}</p>
      </div>
      <div v-if="mode !== 'login'" class="field">
        <label for="access-repeat">确认密码</label>
        <ElInput
          id="access-repeat"
          v-model="form.repeat"
          name="repeat-password"
          type="password"
          autocomplete="new-password"
          show-password
          placeholder="再次输入密码…"
          :aria-invalid="!!errors.repeat"
          aria-describedby="error-repeat"
          @blur="validate('repeat')"
        />
        <p v-if="errors.repeat" id="error-repeat" class="field-error">{{ errors.repeat }}</p>
      </div>
      <div class="field">
        <label for="access-code">{{ mode === 'login' ? '图形验证码' : '短信验证码' }}</label>
        <div class="code-row">
          <ElInput
            id="access-code"
            v-model="form.code"
            name="code"
            autocomplete="one-time-code"
            placeholder="请输入验证码…"
            :aria-invalid="!!errors.code"
            aria-describedby="error-code"
            @blur="validate('code')"
          />
          <button v-if="mode === 'login'" type="button" class="captcha-button" aria-label="刷新图形验证码" @click="loadCaptcha">
            <img v-if="captcha" :src="captcha" alt="图形验证码" width="96" height="42" />
            <span v-else>刷新验证码</span>
          </button>
          <ElButton v-else :disabled="countdown > 0 || busy" @click="sendCode">{{ countdown > 0 ? countdown + ' 秒后重发' : '获取验证码' }}</ElButton>
        </div>
        <p v-if="errors.code" id="error-code" class="field-error">{{ errors.code }}</p>
      </div>
      <template v-if="mode === 'login'">
        <div class="agreement-row">
          <ElCheckbox id="access-agreement" v-model="form.agreement" @change="validate('agreement')">我已阅读并同意</ElCheckbox>
          <button type="button" class="text-button" @click="privacy = true">协议与隐私政策</button>
        </div>
        <p v-if="errors.agreement" class="field-error">{{ errors.agreement }}</p>
      </template>
      <ElButton class="submit-button" native-type="submit" type="primary" size="large" :loading="busy">{{ mode === 'login' ? '登录' : mode === 'register' ? '注册账号' : '确认重置' }}</ElButton>
    </form>
    <div class="access-links">
      <NuxtLink v-if="mode === 'login'" to="/reset">忘记密码？</NuxtLink>
      <NuxtLink :to="mode === 'login' ? '/register' : '/login'">{{ mode === 'login' ? '创建账号' : '返回账号登录' }} <CommonIcon name="arrow" :size="16" /></NuxtLink>
    </div>
    <ElDialog v-model="privacy" title="用户协议与隐私政策" width="680px">
      <div class="policy-content rich-content">
        <h3>用户协议</h3>
        <div v-html="website?.websiteUserAgreement" />
        <h3>隐私政策</h3>
        <div v-html="website?.websitePrivacyPolicy" />
      </div>
    </ElDialog>
  </div>
</template>
<style scoped>
  .access-heading h2 {
    font-size: 26px;
    margin-bottom: 6px;
  }
  .access-heading p {
    color: var(--muted);
    margin-bottom: 28px;
  }
  .field {
    margin-bottom: 18px;
  }
  .field label {
    display: block;
    margin-bottom: 7px;
    font-weight: 500;
  }
  .field-error {
    color: #b91c1c;
    font-size: 12px;
    margin: 5px 0 0;
  }
  .code-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .code-row > .el-input {
    min-width: 0;
    flex: 1;
  }
  .captcha-button {
    width: 100px;
    padding: 0;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: var(--canvas);
    height: 42px;
    flex-shrink: 0;
    font-size: 12px;
  }
  .captcha-button img {
    width: 96px;
    height: 40px;
  }
  .agreement-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
  }
  .agreement-row :deep(.el-checkbox__label) {
    font-size: 12px;
  }
  .text-button {
    border: 0;
    background: none;
    color: var(--brand);
    padding: 0;
    font-size: 12px;
  }
  .submit-button {
    width: 100%;
    margin-top: 24px;
  }
  .access-links {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-top: 20px;
    font-size: 13px;
    color: var(--brand);
  }
  .form-alert {
    margin-bottom: 20px;
  }
  .access-links a {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }
  .policy-content {
    max-height: 60vh;
    overflow: auto;
  }
</style>
