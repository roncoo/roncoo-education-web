/**
 * 获取播放器实例
 */
export function getClient(playRes) {
  const params = JSON.parse(playRes.vodPlayConfig)
  return window.polyvPlayer({
    wrap: '#player',
    height: '100%',
    width: '100%',
    autoplay: true,
    hideSwitchPlayer: true,
    showLine: 'off',
    history_video_duration: 1,
    watchStartTime: playRes.currentDuration,
    playsafe: params.token,
    ...params
  })
}

export function getClientForPri(playRes) {
  const params = JSON.parse(playRes.vodPlayConfig)
  return window.polyvPlayer({
    wrap: '#player',
    height: '100%',
    width: '100%',
    hideSwitchPlayer: true,
    autoplay: false,
    showLine: 'off',
    url: params.hdUrl,
    watchStartTime: playRes.currentDuration
  })
}
