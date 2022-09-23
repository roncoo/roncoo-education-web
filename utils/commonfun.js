// 列表页刷新选择分类
export const courseChange = function(vueContext) {
  if (vueContext.$route.query.categoryId) {
    vueContext.obj.categoryId = vueContext.$route.query.categoryId
  }
  if (vueContext.$route.query.isFree) {
    vueContext.obj.isFree = vueContext.$route.query.isFree
  } else {
    vueContext.obj.isFree = 0
  }
  vueContext.obj.pageCurrent = 1
}
