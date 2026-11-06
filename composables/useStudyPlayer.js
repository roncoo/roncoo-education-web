import { courseApi } from '~/api/course'
import { getClient, getClientForPri } from '~/utils/polyv'
export function useStudyPlayer() {
  const route = useRoute()
  const course = ref(null),
    loading = ref(true),
    error = ref(''),
    completed = ref(false),
    activeId = ref(''),
    panel = ref('chapter')
  const periods = computed(() => course.value?.chapterRespList?.flatMap((chapter) => chapter.periodRespList || []) || [])
  const nextPeriod = computed(() => {
    const index = periods.value.findIndex((period) => period.id === activeId.value)
    return index >= 0 ? periods.value[index + 1] : undefined
  })
  let player = null,
    interval = null,
    study = null,
    sequence = 0,
    destroyed = false,
    lastPeriod = {},
    progressBusy = false
  function stop() {
    clearInterval(interval)
    interval = null
  }
  async function record(status = 1) {
    if (!player || !study || progressBusy) return
    const instance = player,
      payload = { ...study, currentDuration: player.j2s_getCurrentTime(), studyStatus: status }
    progressBusy = true
    try {
      const result = await courseApi.studyProgress(payload)
      if (player === instance && result === 'OK') stop()
    } catch {
      if (player === instance && !destroyed) {
        stop()
        player.j2s_pauseVideo()
        error.value = '学习进度同步失败，播放已暂停。请重试以继续学习。'
      }
    } finally {
      progressBusy = false
    }
  }
  function clear() {
    stop()
    if (player) {
      record(2)
      player.destroy()
      player = null
    }
    study = null
    const node = document.getElementById('player')
    if (node) node.replaceChildren()
  }
  async function select(period = {}) {
    if (loading.value && lastPeriod.id && period.id === lastPeriod.id) return
    const ticket = ++sequence
    lastPeriod = period
    loading.value = true
    error.value = ''
    completed.value = false
    clear()
    try {
      const detail = await courseApi.userCourseDetail({ courseId: route.query.id })
      if (ticket !== sequence) return
      course.value = detail
      const signed = await courseApi.studySign({ periodId: period.id, courseId: route.query.id })
      if (ticket !== sequence) return
      if (!signed?.periodId) throw new Error('当前课程还没有可学习的课时。')
      activeId.value = signed.periodId
      study = { studyId: signed.studyId, resourceId: signed.resourceId }
      await nextTick()
      if (ticket !== sequence) return
      if (signed.resourceType <= 2) {
        for (let attempt = 0; !window.polyvPlayer && attempt < 50; attempt++) {
          await new Promise((resolve) => setTimeout(resolve, 100))
          if (ticket !== sequence) return
        }
        if (!window.polyvPlayer) throw new Error('播放器加载失败，请检查网络后重试。')
        if (![1, 2].includes(signed.vodPlatform)) throw new Error('当前资源暂不支持播放，请联系管理员。')
        player = signed.vodPlatform === 1 ? getClientForPri(signed, detail.speedDouble, detail.speedDrag) : getClient(signed, detail.speedDouble, detail.speedDrag)
        player.on('s2j_onVideoPlay', () => {
          if (ticket !== sequence) return
          stop()
          interval = setInterval(() => record(1), 3000)
        })
        player.on('s2j_onVideoPause', () => {
          if (ticket !== sequence) return
          stop()
          record(2)
        })
        player.on('s2j_onPlayOver', () => {
          if (ticket !== sequence) return
          stop()
          record(1)
          completed.value = true
        })
      } else if ([3, 4].includes(signed.resourceType)) {
        const config = JSON.parse(signed.resourceType === 3 ? signed.docStudyConfig : signed.picStudyConfig)
        const url = new URL(config.previewUrl, window.location.origin)
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error('资源预览地址无效，请联系管理员。')
        const iframe = document.createElement('iframe')
        iframe.src = url.href
        iframe.title = '课程资料预览'
        iframe.style.cssText = 'width:100%;height:100%;border:0;background:white'
        document.getElementById('player').append(iframe)
        await courseApi.studyProgress({ ...study, currentPage: 1 })
      } else throw new Error('当前资源类型暂不支持在线学习。')
    } catch (cause) {
      if (ticket === sequence) error.value = cause?.response?.data?.msg || cause?.data?.msg || cause?.message || '课程暂时无法播放，请确认已登录并拥有学习权限。'
    } finally {
      if (ticket === sequence) loading.value = false
    }
  }
  function retry() {
    return select(lastPeriod)
  }
  onMounted(() => select({ id: route.query.periodId }))
  watch(
    () => [route.query.id, route.query.periodId],
    () => select({ id: route.query.periodId })
  )
  onBeforeUnmount(() => {
    destroyed = true
    sequence++
    clear()
  })
  return { course, loading, error, completed, activeId, panel, nextPeriod, select, retry }
}
