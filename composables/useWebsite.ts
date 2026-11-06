import { indexApi } from '~/api'
export function useWebsite() {
  return useAsyncData('website', () => indexApi.websiteInfo(), { default: () => ({}) })
}
