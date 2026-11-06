module.exports = (async () => {
  const { createConfigForNuxt } = await import('@nuxt/eslint-config/flat')
  return createConfigForNuxt({ features: { typescript: true, stylistic: false } }).append(
    { ignores: ['.data/**', '.nuxt/**', '.output/**', 'distribution/**', 'dist/**'] },
    {
      rules: {
        'vue/multi-word-component-names': 'off',
        'vue/html-self-closing': 'off',
        'vue/require-default-prop': 'off',
        'no-undef': 'off'
      }
    }
  )
})()
