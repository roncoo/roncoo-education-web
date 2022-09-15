// 列表页刷新选择分类
export const courseChange = function(vueContext) {
  if (vueContext.$route.query.categoryId || vueContext.$route.query.categoryId === '') {
    vueContext.obj.categoryId = vueContext.$route.query.categoryId
  }
  if (vueContext.$route.query.four) {
    const four = vueContext.$route.query.four
    if (parseInt(four) === 3) {
      vueContext.obj.isFree = ''
      vueContext.free = 3
    } else if (parseInt(four) === 2) {
      vueContext.obj.isFree = 0
      vueContext.free = 2
    } else if (parseInt(four) === 1) {
      vueContext.obj.isFree = 1
      vueContext.free = 1
    } else if (parseInt(four) === 4) {
      vueContext.free = 4
      vueContext.obj.isFree = ''
    }
  } else {
    vueContext.obj.isFree = ''
    vueContext.free = 3
  }
  vueContext.obj.pageCurrent = 1
}
