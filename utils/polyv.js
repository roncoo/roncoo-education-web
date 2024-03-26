/**
 * 获取播放器实例
 */
export function getClient(playRes, speedDouble, speedDrag) {
  const params = JSON.parse(playRes.vodPlayConfig)

  // 当speed参数值为boolean类型时，代表是否显示倍速切换的按钮。当参数值为数组时，则代表倍速切换的可选速率。最多可设置6个速率，取值范围：(0,3]。PC端默认值为：[2, 1.5, 1.2, 0.5]，移动端默认值为：[1, 1.5, 2]。
  const speed = speedDouble === 0 ? false : true
  // 是否禁止拖拽进度条，取值：{on,off}。
  const banSeek = speedDrag === 0 ? 'on' : 'off'

  return window.polyvPlayer({
    wrap: '#player',
    height: '100%',
    width: '100%',
    autoplay: true,
    hideSwitchPlayer: true,
    showLine: 'off',
    history_video_duration: 1,
    speed: speed,
    ban_seek: banSeek,
    watchStartTime: playRes.currentDuration,
    playsafe: params.token,
    ...params
  })
}

export function getClientForPri(playRes, speedDouble, speedDrag) {
  const params = JSON.parse(playRes.vodPlayConfig)

  // 当speed参数值为boolean类型时，代表是否显示倍速切换的按钮。当参数值为数组时，则代表倍速切换的可选速率。最多可设置6个速率，取值范围：(0,3]。PC端默认值为：[2, 1.5, 1.2, 0.5]，移动端默认值为：[1, 1.5, 2]。
  const speed = speedDouble === 0 ? false : true
  // 是否禁止拖拽进度条，取值：{on,off}。
  const banSeek = speedDrag === 0 ? 'on' : 'off'

  return window.polyvPlayer({
    wrap: '#player',
    height: '100%',
    width: '100%',
    hideSwitchPlayer: true,
    autoplay: false,
    showLine: 'off',
    url: params.hdUrl,
    speed: speed,
    ban_seek: banSeek,
    watchStartTime: playRes.currentDuration
  })
}
