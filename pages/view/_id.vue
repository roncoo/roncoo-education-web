<template>
  <div class="course_detail">
    <div class="">
      <y-watch-video  v-if="isbuy" :courseInfo="courseInfo" :chapterList="chapterList" :teacherInfo="teacherInfo" @playfunc="videoPlay" :nowNo="nowPeriodNo"></y-watch-video>
      <y-display v-else :courseInfo="courseInfo" :courseData="courseData" :teacherInfo="teacherInfo" @buyClick="buyCourse"></y-display>
    </div>
    <div class=" detail_info detail_box clearfix">
      <div class="info_left">
        <ul class="left_header clearfix">
          <li :class="{now: tab == 'info'}"><a href="javascript:" @click="tab = 'info'">课程介绍</a></li>
          <li :class="{now: tab == 'big'}"><a href="javascript:" @click="tab = 'big'">录播课程</a></li>
        </ul>
        <div class="left_info" v-if="tab == 'info'">
          <div class="info_body">
            <div class="info_p" v-html="courseInfo.courseIntroduce">
            </div>
          </div>
          <y-syllabus @playfunc="videoPlay" :list="chapterList" :nowNo="nowPeriodNo" :courseData="courseData"></y-syllabus>
          <div class="big_load_more" v-if="pageCurrent < totalPage">
            <a href="javascript:">加载中...</a>
          </div>
        </div>
        <div class="left_info" v-if="tab == 'big'">
          <y-syllabus @playfunc="videoPlay" :list="chapterList" :nowNo="nowPeriodNo" :courseData="courseData"></y-syllabus>
          <div class="big_load_more" v-if="pageCurrent < totalPage">
            <a href="javascript:">加载中...</a>
          </div>
        </div>
      </div>
      <div class="info_right">
        <div class="teacher_info clearfix">
          <span class="info_header">讲师简介</span>
          <div class="teacher_msg">
            <!-- <div class="teacher_phone">
              <img v-if="teacherInfo.imgLogo" :src="teacherInfo.imgLogo" alt="">
            </div> -->
            <div class="teacher_msg_right">
              <img class="teacher_phone" v-if="teacherInfo.imgLogo" :src="teacherInfo.imgLogo" alt="">
              <img class="teacher_phone" v-else src="~/assets/image/friend.jpg" alt="">
              <div class="teacher_name">
                {{teacherInfo.lecturerName}}
                <a href="javascript:" @click="setAttention" :class="{atten_btn: true, c_red: isAttention}"><span class="iconfont">&#xe670;</span>&nbsp;关注</a>
              </div>
              <div v-html="teacherInfo.introduce" class="info_box"></div>
            </div>
          </div>
        </div>
        <recommend-block :categoryNo="courseInfo.categoryNo1"></recommend-block>
      </div>
    </div>
    <y-footer></y-footer>
    <d-pay :isCourse="true" @hidefun="showPay = false" :data="payData" v-if="showPay"></d-pay>
    <right-tap></right-tap>
    <div class="float_top" v-show="showTop">
      <div class="container">
        <ul class="left_header clearfix">
          <li :class="{now: tab == 'info'}"><a href="javascript:" @click="goTop('info')">课程介绍</a></li>
          <li :class="{now: tab == 'big'}"><a href="javascript:" @click="goTop('big')">录播课程</a></li>
          <li class="fr">
            <button class="buy_btn" id="buyBtn" v-if="isbuy && courseInfo.isPutaway === 1" @click="buyCourse">立即购买</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import YHeader from '~/components/common/Header'
import YFooter from '~/components/common/Footer'
import DPay from '~/components/PayModal'
import RightTap from '~/components/common/RightTap'
import YSyllabus from '~/components/course/Syllabus'
import YDisplay from '~/components/course/Display'
import YWatchVideo from '~/components/course/WatchVideo'
import RecommendBlock from '~/components/course/RecommendBlock'
import {courseDetail, chapterSign, chapterDetail, changeUrl} from '~/api/course.js'
import {userCourseDetail, addCollection, attentionSave, downAcc, getUserInfo} from '~/api/user.js'
export default {
  components: {
    YHeader,
    YFooter,
    YSyllabus,
    YDisplay,
    YWatchVideo,
    DPay,
    RightTap,
    RecommendBlock
  },
  head () {
    return {
      title: this.courseInfo.courseName,
      meta: [
          {
              name: 'keywords',
              content: this.courseInfo.keywords
          },
          {
              name: 'description',
              content: this.courseInfo.description
          }
      ],
    script: [
      { src: 'https://player.polyv.net/script/polyvplayer.min.js' }
    ]
    }
  },
  data () {
    return {
      isResetVideo: false,
      showTop: false,
      isPlay: false,
      // actId: '',
      // activityText: '',
      // minus: '',
      // discountType: '',
      showActivityPay: false,
      activityPay: {},  //活动购信息
      isVip: false,
      openVip: false,   //是否开启vip
      // courseName: '',
      categoryNo: '',
      // courseValidity: '',
      // isPay: 0,
      showPay: false,
      isbuy: true, //是否无需购买观看
      payData: null,
      tab: 'info',
      player: null,
      nowPeriodNo: '',
      cateType: 0,
      isCollect: false,
      isAttention: false,
      pageCurrent: 1, //章节页数
      totalPage: 1,
      chapterList: [] //章节列表
    }
  },
  validate ({ params }) {
    // 必须是number类型
    return /^\d+$/.test(params.id)
  },
  async asyncData(context) {
    let clientNo = context.store.state.clientData.no;
    let tk = context.store.state.tokenInfo;
    try {
    let result = {
    };
      if (tk) {
        let {data} = await userCourseDetail({id: context.params.id},tk)
        console.log(data)
        if (data.code == 200) {
          result.courseInfo = data.data.courseInfoDTO;
          result.teacherInfo = data.data.courseLecturerInfoDTO;
          result.courseValidity = data.data.courseValidity;
          result.courseData = data.data;
          result.isLogin = true;
          result.isbuy = data.data.isPay ? true : false;
        } else if(data.code >= 300 && data.code < 400) {
          context.redirect('/login?t=login')
        }
      }else {
        console.log(context.route)
        let {data} = await courseDetail({courseId: context.params.id})
        console.log(data)
        if (data.code == 200) {
          result.courseInfo = data.data.courseInfoDTO;
          result.teacherInfo = data.data.courseLecturerInfoDTO;
          result.courseValidity = data.data.courseValidity;
          result.courseData = data.data;
          result.isLogin = false;
          if (result.courseInfo.isPutaway == 1 && result.courseInfo.isFree == 1 ) {
            result.isbuy = true;
          }else{
            result.isbuy = false;
          }
        }
      }
      return result
    } catch (e) {
      context.error({ message: 'User not found', statusCode: 404 })
    }
  },
  watch: {
    '$route' (newRouter, oldRouter) {
      this.no = this.$route.params.id
      if (this.userInfo && this.tokenInfo) {
        this.isLogin = true
        this.getUserCourse();
      } else {
        this.isLogin = false
        this.getCourse()
      }
    }
  },
  methods: {
    goTop (str) {
      this.tab = str
      if (this.isbuy) {
        window.scrollTo(0, 516);
      } else {
        window.scrollTo(0, 700);
      }
    },
    // 校验token
    checkToken () {
      console.log(1)
      window.setTimeout(() => {
        let url = this.$route.path
        if (url.startsWith('/view')) {
          getUserInfo({orgNo: this.clientData.no}).then(res => {
            console.log(res)
            if (res.code >= 300 && res.code < 400) {
              this.SIGN_OUT();
            } else if (res.code === 200) {
              this.checkToken()
            }
          })
        }
      }, 1800000)
    },
    // 关注讲师
    setAttention () {
      if (!this.isLogin) {
        this.$msgBox({
          content: '登录后才可以关注'
        }).then(res => {
          this.$store.dispatch('REDIRECT_LOGIN');
        }).catch(() => {
        })
        return false;
      }
      attentionSave({
        lecturerUserNo: this.teacherInfo.lecturerUserNo,
      }).then(res => {
        res = res.data;
        console.log(res)
        if (res.code === 200) {
          this.$msgBox({
            content: '关注成功',
            isShowCancelBtn: false
          })
          this.isAttention = true
        } else {
          this.$msgBox({
            content: res.msg,
            isShowCancelBtn: false
          })
          if (res.code === 508) {
            this.isAttention = true
          }
        }
      })
    },
    buyCourse () {
      console.log('buy')
      if (!this.isLogin) {
        this.$msgBox({
          content: '请登录后再购买',
          isShowCancelBtn: false
        }).then(() => {
          this.$store.dispatch('REDIRECT_LOGIN');
        })
        return
      }
      if (this.$store.state.activityData) {
        let activityData = this.$store.state.activityData;
        this.showActivityPay = true
        this.activityPay = Object.assign(this.courseInfo, {discountType: activityData.discountType, discountPrice: activityData.minus, actId: activityData.actId})
      } else {
        this.showPay = true;
        this.payData = {course: this.courseInfo, payType: 'course'};
      }
    },
    newCourse (courseUuid) {
      changeUrl({courseUuid}).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.$router.push({name: 'courselDetail', params: {id: res.data.courseInfoDTO.id}})
          this.courseValidity = res.data.courseValidity;
          this.isShowBuyCount = res.data.isShowBuyCount;
          this.isShowStudyCount = res.data.isShowStudyCount;
          this.courseInfo = res.data.courseInfoDTO;
          this.courseName = res.data.courseInfoDTO.courseName;
          this.teacherInfo = res.data.courseLecturerInfoDTO;
          this.categoryNo = res.data.courseInfoDTO.categoryNo1
        } else {
          this.$msgBox.showMsgBox({
            content: res.msg,
            isShowCancelBtn: false
          })
        }
      }).catch(() => {
        this.load = false
      })
    },
    getChapterDetail () {
      let courseNo = this.courseInfo.courseNo
      chapterDetail({
        courseNo,
        pageSize: 1,
        pageCurrent: this.pageCurrent
      }).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.totalPage = res.data.data.totalPage
          if (res.data.data.list && res.data.data.list.length) {
            this.chapterList.push(res.data.data.list[0])
          }
          this.pageCurrent = this.pageCurrent + 1
          if (this.pageCurrent <= this.totalPage) {
            this.getChapterDetail()
          }
        } else {
          this.$msgBox({
            content: res.data.msg,
            isShowCancelBtn: false
          })
        }
      }).catch(() => {
        this.$msgBox({
          content: '数据加载失败，请稍后重试',
          isShowCancelBtn: false
        })
      })
    },
    videoPlay (data) {
      let vid;
      if (data.gmtCreate) {
        vid = data.vid
      } else {
        if (!data.periodVideoDTOList || !data.periodVideoDTOList.length) {
          this.$msgBox({
            content: '该节未更新',
            isShowCancelBtn: false
          }).catch(() => {})
          return
        }
        vid = data.periodVideoDTOList[0].vid;
      }
      window.scrollTo(0, 0)
      console.log(data)
      this.nowPeriodNo = data.periodNo
      chapterSign({
        courseCategory: 1,
        periodNo: data.periodNo,
        vid: vid
      }).then(res => {
        res = res.data
        this.isResetVideo = false
        console.log(res)
        console.log("res==========")
        if (res.code === 200) {
          this.play(Object.assign({vid: vid}, res.data));
        } else if (res.code === 402) {
          this.$msgBox({
            content: '购买后才可以观看',
            isShowCancelBtn: false
          })
        }
      }).catch(() => {
        this.isResetVideo = false
      })
    },
    play (data) {
    /* eslint-disable*/
      let top = document.documentElement.scrollTop
      this.playData = data
      console.log(data)
      console.log("play==========")
      this.isPlay = true
      if (this.player) {
        this.player.changeVid({
          vid: data.vid,
          playsafe: data.token,
          ts: data.ts,
          sign: data.sign,
          autoplay: true
        });
      } else {
        let w = 600, h = 295;
        if (this.isbuy) {
          w = 1120;
          h = 595;
        }
        if (top > 720) {
          w = 600
          h = 295
          this.isResetVideo = true
        }
        this.player = polyvObject('#player').videoPlayer({
            'width': w,
            'height': h,
            'forceH5': true,
            'code': data.code,
            'playsafe': data.token,
            'ts': data.ts,
            'sign': data.sign,
            'vid': data.vid
        });
      }
    },
    stopVideo () {
      this.isPlay = false
      if (!this.isbuy) {
        this.player = polyvObject('#player').videoPlayer({
            'width': 1120,
            'height': 595,
            'forceH5': true,
            'code': this.playData.code,
            'playsafe': this.playData.token,
            'ts': this.playData.ts,
            'sign': this.playData.sign,
            'vid': this.playData.vid
        });
      }
    },
    scrollFun () {
      window.addEventListener('scroll', (e) => {
        let top = e.target.scrollingElement.scrollTop
        // console.log(top)
        if (this.isbuy) {
          if (top > 516) {
            this.showTop = true
          } else {
            this.showTop = false
          }
        } else {
          if (top > 720) {
            this.showTop = true
            if (this.isPlay && !this.isResetVideo) {
              this.player = polyvObject('#player').videoPlayer({
                  'width': 600,
                  'height': 295,
                  'forceH5': true,
                  'code': this.playData.code,
                  'playsafe': this.playData.token,
                  'ts': this.playData.ts,
                  'sign': this.playData.sign,
                  'vid': this.playData.vid
              });
              this.isResetVideo = true
            }
          } else {
            this.showTop = false
            if (this.isPlay && this.isResetVideo) {
              this.player = null
              this.play(this.playData)
              this.isResetVideo = false
            }
          }
        }
      })
    }
  },
  mounted () {
    this.getChapterDetail();
    // console.log(this.courseData)
    // 历史播放记录
    let studyLog = this.courseData.periodUserStudyLogDTO;
    // console.log(studyLog)
    if (studyLog) {
      this.videoPlay(studyLog)
    }
    if (!this.courseInfo) {
      this.$msgBox({
        content: '获取课程信息失败',
        isShowCancelBtn: false
      })
    }

    /* eslint-disable*/
    // this.scrollFun()
    // if (this.webInfo && this.webInfo.isEnableVip) {
    //   this.openVip = true
    //   if (this.userInfo && this.userInfo.isVip && this.userInfo.expireTime && new Date(this.userInfo.expireTime).getTime() > new Date().getTime()) {
    //     this.isVip = true
    //   }
    // }
    // console.log(this.userInfo)
    // console.log(this.$route.params.id)
    // console.log(this.visitorInfo)
    // console.log(this.$route.path)
    // if (this.userInfo && this.tokenInfo) {
    //   this.isLogin = true
    // } else {
    //   this.isLogin = false
    // }
    // if (this.$route.path.startsWith('/course')) {
    //   console.log(this.$route.path)
    //   this.newCourse(this.$route.params.id)
    // } else {
    //   console.log(this.$route.path)
    //   if (this.isLogin) {
    //     this.getUserCourse();
    //   } else {
    //     this.getCourse()
    //   }
    // }
    // this.checkToken()
    // this.getVisitor()
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
  .course_detail {
    background: rgb(245, 245, 245);
    .detail_content {
      background: rgb(51, 51, 51);
      .detail_body {
        width: 1200px;
        margin: 0 auto;
        height: 373px;
      }
    }
    .float_top {
      position: fixed;
      top: 0;
      width: 100%;
      height: 60px;
      z-index: 9999;
      background: #fff;
      .left_header {
        padding-left: 30px;
        background: #fff;
        border-radius: 8px;
        margin-bottom: 20px;
        li {
          float: left;
          height: 58px;
          line-height: 60px;
          margin-right: 80px;
          &.now {
            border-bottom: 2px solid #D51423;
            a {
              color: #D51423;
            }
          }
          &.fr {
            float: right;
          }
          a {
            color: #000;
            font-size: 14px;
            font-weight: 700;
            &:hover {
              text-decoration: none;
              color: #D51423;
            }
          }
        }
      }
      .buy_btn {
        display: block;
        width: 136px;
        height: 36px;
        color: #fff;
        background: #D51423;
        border: none;
        border-radius: 6px;
        line-height: 36px;
        text-align: center;
        font-size: 14px;
        // position: absolute;
        // bottom: 0px;
        margin-top: 12px;
        &:hover {
          text-decoration: none;
          color: #fff;
          cursor: pointer;
        }
      }
    }
    .video_box {
      width: 600px;
      height: 295px;
      float: left;
      background: rgb(102, 102, 102);
      background-size: 100%;
    }
    .close_video {
      position: fixed;
      right: 10px;
      bottom: 325px;
      background: #000;
      color: #fff;
      cursor: pointer;
      z-index: 9999
    }
    .detail_info {
      margin: 20px auto 60px;
      width: 1200px;
    }
    .info_left {
      width: 920px;
      float: left;
      .info_body {
        margin-bottom: 30px;
      }
      .left_header {
        padding-left: 30px;
        background: #fff;
        border-radius: 8px;
        margin-bottom: 20px;
        li {
          float: left;
          height: 66px;
          line-height: 66px;
          margin-right: 80px;
          &.now {
            border-bottom: 2px solid #D51423;
            a {
              color: #D51423;
            }
          }
          a {
            color: #000;
            font-size: 14px;
            font-weight: 700;
            &:hover {
              text-decoration: none;
              color: #D51423;
            }
          }
        }
      }
    }
    .left_info {
      padding: 30px;
      background: #fff;
      border-radius: 8px;
      min-height: 400px;
      .info_title {
        font-size: 16px;
        color: #000;
        font-weight: 700;
        margin-bottom: 25px;
      }
      .info_title {
        span {
          display: inline-block;
          width: 4px;
          height: 14px;
          background: #000;
          position: relative;
          top: 2px;
          margin-right: 8px;
        }
      }
      .info_p {
        font-size: 14px;
        line-height: 30px;
        color: #333;
        padding-left: 8px;
      }
      .big_load_more {
        text-align: center;
        font-size: 16px;
      }
    }
    .info_right {
      width: 260px;
      float: right;
    }
    .teacher_info {
      background: #fff;
      border-radius: 8px;
      position: relative;
      min-height: 180px;
      .info_header {
        display: block;
        line-height: 60px;
        height: 60px;
        padding-left: 20px;
        font-size: 14px;
        color: #333;
        border-bottom: 1px solid rgb(228, 228, 228);
      }
      .teacher_phone {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: rgb(228, 228, 228);
        text-align: center;
        line-height: 46px;
        font-size: 13px;
        color: #999;
        float:left;
        margin: 0px 10px 0 10px;
        img {
          width: 46px;
          height: 46px;
          border-radius: 50%;
        }
      }
      .teacher_msg_right {
        width: 235px;
        float: right;
        margin: 12px 15px 12px 12px;
        line-height: 20px;
      }
      .teacher_name {
        font-size: 14px;
        font-weight: 700;
        color: #333;
        margin-bottom: 10px;
      }
    }
    .firend {
      margin-top: 20px;
      padding-bottom: 20px;
      li {
        float: left;
        width: 46px;
        margin: 20px 20px 0;
        .friend_phone {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: rgb(228, 228, 228);
          text-align: center;
          line-height: 46px;
          font-size: 13px;
          color: #999;
          img {
            width: 46px;
            height: 46px;
            border-radius: 50%;
          }
        }
        .friend_name {
          text-align: center;
          margin-top: 10px;
          font-size: 12px;
          color: #333;
        }
      }
    }
  }
</style>
