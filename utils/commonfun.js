import {avtivityTitle} from '../api/activity.js'

// 列表页刷新选择分类
export const courseChange = function (vueContext) {
  console.log(vueContext)
  if (vueContext.$route.query.categoryno1 || vueContext.$route.query.categoryno1 === '') {
    vueContext.obj.categoryNo1 = vueContext.$route.query.categoryno1
  }
  if (vueContext.$route.query.categoryno2 || vueContext.$route.query.categoryno2 === '') {
    vueContext.obj.categoryNo2 = vueContext.$route.query.categoryno2
  }
  if (vueContext.$route.query.categoryno3 || vueContext.$route.query.categoryno3 === '') {
    vueContext.obj.categoryNo3 = vueContext.$route.query.categoryno3
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

// 列表页获取活动标
export const getActivityList = function (courseNoList, vueContext) {
  avtivityTitle({
    courseNoList: courseNoList,
    orgNo: vueContext.clientNo
  }).then(res => {
    console.log(res)
    let result = res.data
    if (result.code === 200) {
      if (result.data.list && result.data.list.length) {
        let list = result.data.list || []
        let actList = []
        list.forEach(item => {
          let act = item.actList || []
          actList.push(act)
        })
        // console.log(actList)
        let actObjArr = []
        actList.forEach(item => {
          // console.log(item)
          let actObj = ''
          item.forEach(that => {
            if (that.act && that.act.actType === 1) {
              actObj = that.actDiscountShow || ''
            }
          })
          actObjArr.push(actObj)
        })
        // console.log(actObjArr)
        vueContext.activityList = actObjArr
      }
    }
  }).catch(() => {
    console.log('活动角标问题')
  })
}

// 列表页初次加载活动标
export const getActivityFirstList = function (titleList, dataObj) {
  let actList = []
  titleList.forEach(item => {
    let act = item.actList || []
    actList.push(act)
  })
  console.log('aaaaa'+actList)
  let actObjArr = []
  actList.forEach(item => {
    let actObj = ''
    item.forEach(that => {
      if (that.act && that.act.actType === 1) {
        actObj = that.actDiscountShow || ''
      }
    })
    actObjArr.push(actObj)
  })
  dataObj.activityList = actObjArr
}