// 列表页刷新选择分类
export const courseChange = function (vueContext) {
  if (vueContext.$route.query.categoryno1 || vueContext.$route.query.categoryno1 === '') {
    vueContext.obj.categoryId1 = vueContext.$route.query.categoryno1
  }
  if (vueContext.$route.query.categoryno2 || vueContext.$route.query.categoryno2 === '') {
    vueContext.obj.categoryId2 = vueContext.$route.query.categoryno2
  }
  if (vueContext.$route.query.categoryno3 || vueContext.$route.query.categoryno3 === '') {
    vueContext.obj.categoryId3 = vueContext.$route.query.categoryno3
  }
  if (vueContext.$route.query.four) {
    let four = vueContext.$route.query.four
    if (parseInt(four) === 3) {
      vueContext.obj.isFree = ''
      vueContext.obj.isVipFree = ''
      vueContext.free = 3
    } else if (parseInt(four) === 2) {
      vueContext.obj.isFree = 0
      vueContext.obj.isVipFree = ''
      vueContext.free = 2
    } else if (parseInt(four) === 1) {
      vueContext.obj.isFree = 1
      vueContext.obj.isVipFree = ''
      vueContext.free = 1
    } else if (parseInt(four) === 4) {
      vueContext.obj.isVipFree = 1
      vueContext.free = 4
      vueContext.obj.isFree = ''
    }
  } else {
    vueContext.obj.isFree = ''
    vueContext.free = 3
  }
  vueContext.obj.pageCurrent = 1
}
