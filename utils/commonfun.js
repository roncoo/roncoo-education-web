// 列表页刷新选择分类
export const courseChange = function(vueContext) {
  const query = vueContext.$route.query
  if (query.categoryId) {
    vueContext.obj.categoryId = query.categoryId
  } else if (query.categoryTwoId) {
    vueContext.obj.categoryId = query.categoryTwoId
  } else if (query.categoryThreeId) {
    vueContext.obj.categoryId = query.categoryThreeId
  } else {
    vueContext.obj.categoryId = ''
  }
  if (query.isFree !== '') {
    vueContext.obj.isFree = query.isFree
  }
  vueContext.obj.pageCurrent = 1
}
