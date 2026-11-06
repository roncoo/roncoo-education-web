// Run against the local dev server. All business writes are intercepted with fixtures.
// PLAYWRIGHT_MODULE can point to a preinstalled Playwright package outside this project.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const base = process.env.UI_BASE_URL || 'http://localhost:3000'
const output = '.data/ui-review'
fs.mkdirSync(output, { recursive: true })
const cover =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#dbeafe"/><text x="60" y="190" fill="#2563eb" font-size="42">Learning course</text></svg>'
  )
const course = {
  id: 'qa-course',
  courseName: '职业能力提升：从入门到实践的完整学习课程',
  courseLogo: cover,
  coursePrice: 99,
  rulingPrice: 199,
  isFree: 0,
  allowStudy: 0,
  courseCollect: false,
  countBuy: 12,
  countStudy: 8,
  introduce: '<h2>课程介绍</h2><p>循序渐进掌握实践方法。</p>',
  lecturerResp: { id: 'qa-teacher', lecturerName: '张老师', lecturerPosition: '职业教育讲师', lecturerHead: '', introduce: '<p>专注实践教学。</p>' },
  chapterRespList: [
    {
      id: 'chapter',
      chapterName: '开始学习',
      periodRespList: [
        { id: 'p1', periodName: '第一节：认识学习目标', periodType: 10, isFree: true, periodProgress: 0 },
        { id: 'p2', periodName: '第二节：实践与巩固', periodType: 10, periodProgress: 100 }
      ]
    }
  ]
}
const categories = [
  { id: 'cat-a', categoryName: '职业技能', list: [{ id: 'cat-b', categoryName: '职场表达', list: [] }] },
  { id: 'cat-c', categoryName: '互联网技术', list: [] }
]
async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  try {
    const live = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
    const liveErrors = []
    live.on('pageerror', (e) => liveErrors.push(e.message))
    await live.goto(base, { waitUntil: 'networkidle' })
    await live.screenshot({ path: output + '/home-live-1440.png', fullPage: true })
    assert.equal(liveErrors.length, 0, 'Live homepage runtime errors: ' + liveErrors.join('; '))
    await live.close()
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
    const page = await context.newPage(),
      errors = [],
      writes = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('requestfailed', (req) => {
      if (req.url().includes('/_nuxt/')) console.log('FAILED MODULE', req.url(), req.failure()?.errorText)
    })
    page.on('response', (res) => {
      if (res.status() >= 400 && res.url().includes('/_nuxt/')) console.log('BAD MODULE', res.status(), res.url())
    })
    let listFails = false,
      empty = false,
      orderState = 1,
      payFailure = false,
      signFails = false,
      progressFails = false,
      collectCount = 0
    await context.route('**/player.polyv.net/**', (route) => route.fulfill({ contentType: 'text/javascript', body: '' }))
    await context.addInitScript(() => {
      window.__studyHandlers = {}
      window.polyvPlayer = () => ({
        on: (name, handler) => {
          window.__studyHandlers[name] = handler
        },
        destroy() {},
        j2s_getCurrentTime: () => 30,
        j2s_pauseVideo() {}
      })
    })
    await context.route('**/gateway/**', async (route) => {
      const req = route.request(),
        path = new URL(req.url()).pathname.replace('/gateway', ''),
        body = req.postDataJSON() || {}
      let data
      if (path.endsWith('/website/nav/list'))
        data = [
          { navTitle: '首页', navUrl: '/' },
          { navTitle: '全部课程', navUrl: '/course/list' },
          { navTitle: '名师团队', navUrl: '/lecturer/list' }
        ]
      else if (path.endsWith('/sys/config/website')) {
        await route.continue()
        return
      } else if (path.endsWith('/category/list')) data = categories
      else if (path.endsWith('/course/search')) {
        if (listFails) {
          await route.fulfill({ status: 503, body: 'unavailable' })
          return
        }
        data = {
          list: empty ? [] : Array.from({ length: 4 }, (_, i) => ({ ...course, id: 'qa-course-' + i, courseLogo: i === 3 ? 'https://invalid.example/missing.png' : cover })),
          totalCount: empty ? 0 : 36
        }
      } else if (path.endsWith('/lecturer/search')) data = { list: [{ ...course.lecturerResp }], totalCount: 1 }
      else if (path.endsWith('/lecturer/view')) data = { ...course.lecturerResp, courseViewVO: [course] }
      else if (path.endsWith('/course/view')) data = course
      else if (path.endsWith('/users/view')) data = { nickname: '测试学员', mobile: '13800000000', availableAmount: 500, userHead: '' }
      else if (path.endsWith('/user/course/page'))
        data = { list: [{ id: 'learning', courseResp: course, courseProgress: 35, periodName: '第一节：认识学习目标', periodTime: '2026-11-02' }], totalCount: 1 }
      else if (path.endsWith('/user/course/collect/page')) data = { list: [{ courseResp: course }], totalCount: 1 }
      else if (path.endsWith('/order/info/page'))
        data = { list: [{ orderNo: 'QA-ORDER', courseId: course.id, courseName: course.courseName, courseLogo: cover, coursePrice: 99, orderStatus: orderState, payType: 11 }], totalCount: 1 }
      else if (path.endsWith('/pay/create') || path.endsWith('/pay/continue')) {
        writes.push({ path, body })
        data = { orderNo: 'QA-ORDER', orderStatus: payFailure ? 3 : 1, payType: body.payType, coursePrice: 99, payMessage: 'https://example.test/mock-payment' }
      } else if (path.endsWith('/order/info/view')) data = { orderNo: 'QA-ORDER', orderStatus: orderState, payType: 11, coursePrice: 99 }
      else if (path.endsWith('/collect/add')) {
        collectCount++
        data = 'add'
      } else if (path.endsWith('/course/sign')) {
        if (signFails) {
          await route.fulfill({ json: { code: 403, msg: '没有课程学习权限' } })
          return
        }
        data = {
          periodId: body.periodId === 'denied' ? 'p1' : body.periodId || 'p1',
          studyId: 'study-id',
          resourceId: 'resource-id',
          resourceType: 1,
          vodPlatform: 1,
          vodPlayConfig: JSON.stringify({ hdUrl: 'https://example.test/mock-video' })
        }
      } else if (path.endsWith('/study/progress')) {
        writes.push({ path, body })
        if (progressFails) {
          await route.fulfill({ status: 503, body: 'unavailable' })
          return
        }
        data = 'OK'
      } else if (path.endsWith('/course/comment')) data = { list: [], totalCount: 0 }
      else if (path.endsWith('/users/login')) {
        writes.push({ path, body })
        data = { token: 'qa-only' }
      } else if (path.endsWith('/common/code')) data = { img: cover, verToken: 'qa-token' }
      else {
        await route.fulfill({ json: { code: 200, data: [] } })
        return
      }
      await route.fulfill({ json: { code: 200, data } })
    })
    await page.goto(base + '/404', { waitUntil: 'networkidle' })
    await context.addCookies([{ name: 'EDU_OS_TOKEN', value: 'qa-only', url: base }])
    async function go(url) {
      console.log('Check ' + url)
      await page.evaluate((url) => document.querySelector('#__nuxt').__vue_app__.config.globalProperties.$router.push(url), url)
      await page.waitForURL(new URL(url, base).href)
      await page.waitForTimeout(350)
    }
    async function noOverflow(label) {
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), label + ' horizontal overflow')
    }
    await go('/course/list')
    await page.locator('.course-card').first().waitFor()
    await page.locator('.filter-row').first().getByRole('link', { name: '职业技能', exact: true }).click()
    await page.waitForURL(/categoryId=cat-a/)
    assert.equal(await page.locator('.filter-row').count(), 2)
    await page.locator('.el-pager li').filter({ hasText: /^2$/ }).click()
    await page.waitForURL(/page=2/)
    await page.goBack()
    await page.waitForTimeout(200)
    assert(!new URL(page.url()).searchParams.has('page'))
    await page.locator('.course-card').first().getByRole('button', { name: '收藏', exact: true }).click()
    assert.equal(collectCount, 1)
    assert(new URL(page.url()).pathname === '/course/list', 'Collect must not navigate')
    for (const width of [1920, 1440, 1280, 1024]) {
      await page.setViewportSize({ width, height: 1000 })
      await noOverflow('course list ' + width)
      const cols = await page.locator('.course-grid').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length)
      assert.equal(cols, width <= 1100 ? 2 : 4)
      await page.screenshot({ path: output + '/courses-' + width + '.png', fullPage: true })
    }
    await go('/search?kw=表达&type=lecturer&page=2')
    assert.equal(await page.locator('.search-tabs .active').innerText(), '讲师')
    await page.reload({ waitUntil: 'networkidle' })
    assert.equal(await page.locator('.search-tabs .active').innerText(), '讲师')
    await go('/course/list')
    listFails = true
    await page.reload({ waitUntil: 'networkidle' })
    await page.getByRole('heading', { name: '内容加载失败' }).waitFor()
    listFails = false
    await page.getByRole('button', { name: '重新加载', exact: true }).click()
    await page.locator('.course-card').first().waitFor()
    empty = true
    await go('/course/list?categoryId=empty')
    await page.getByRole('heading', { name: '没有找到相关课程' }).waitFor()
    empty = false
    await go('/account/course')
    await page.getByRole('link', { name: '继续学习 →' }).waitFor()
    await noOverflow('learning center')
    const coverSize = await page.locator('.learning-cover').boundingBox()
    assert(Math.abs(coverSize.width / coverSize.height - 16 / 9) < 0.05, 'Learning cover keeps its aspect ratio')
    await page.screenshot({ path: output + '/learning-1024.png', fullPage: true })
    await go('/account/collect')
    await page.locator('.saved-courses .course-card').first().waitFor()
    await noOverflow('saved courses')
    await go('/account/user')
    await page.locator('#nickname').waitFor()
    await noOverflow('profile')
    await go('/lecturer/list')
    await page.locator('.lecturer-card').first().waitFor()
    await go('/lecturer/detail?id=qa-teacher')
    await page.getByRole('heading', { name: '张老师', exact: true }).waitFor()
    await noOverflow('lecturer detail')
    await go('/course/detail?id=qa-course')
    await page.getByRole('button', { name: '立即购买', exact: true }).waitFor()
    for (const width of [1920, 1440, 1280, 1024]) {
      await page.setViewportSize({ width, height: 1000 })
      await noOverflow('detail ' + width)
    }
    await page.screenshot({ path: output + '/detail-1024.png', fullPage: true })
    await page.getByRole('button', { name: '立即购买', exact: true }).click()
    for (const width of [1920, 1440, 1280, 1024]) {
      await page.setViewportSize({ width, height: 1000 })
      await noOverflow('checkout ' + width)
    }
    await page.getByRole('button', { name: /确认支付/ }).click()
    await page.getByRole('heading', { name: '请扫码完成支付' }).waitFor()
    assert.equal(writes.find((x) => x.path.endsWith('/pay/create')).body.payType, 11)
    orderState = 2
    await page.getByRole('button', { name: '刷新支付状态' }).click()
    await page.getByRole('heading', { name: '支付成功', exact: true }).waitFor()
    await page.screenshot({ path: output + '/payment-success.png' })
    await page.getByRole('button', { name: '完成', exact: true }).click()
    orderState = 1
    await go('/account/order')
    await page.getByRole('button', { name: '继续支付' }).click()
    payFailure = true
    await page.getByRole('button', { name: /确认支付/ }).click()
    await page.getByRole('heading', { name: '支付失败', exact: true }).waitFor()
    await page.getByRole('button', { name: '关闭', exact: true }).click()
    payFailure = false
    await go('/account/order?status=1')
    await page.getByRole('button', { name: '继续支付' }).click()
    await page.getByRole('button', { name: /确认支付/ }).click()
    orderState = 4
    await page.getByRole('button', { name: '刷新支付状态' }).click()
    await page.getByRole('heading', { name: '订单已关闭' }).waitFor()
    await page.getByRole('button', { name: '关闭', exact: true }).click()
    await go('/course/study?id=qa-course')
    await page.locator('.study-period.active').waitFor()
    await noOverflow('study')
    for (const width of [1920, 1440, 1280, 1024]) {
      await page.setViewportSize({ width, height: 1000 })
      await noOverflow('study ' + width)
    }
    await page.screenshot({ path: output + '/study-1024.png' })
    await page.getByRole('button', { name: '收起侧栏' }).click()
    assert.equal(await page.locator('.study-panel').count(), 0)
    await page.getByRole('button', { name: '目录', exact: true }).click()
    await page.evaluate(() => window.__studyHandlers.s2j_onPlayOver())
    await page.getByRole('button', { name: '学习下一节 →' }).click()
    await page.waitForTimeout(300)
    assert.equal(await page.locator('.study-period.active').getAttribute('aria-current'), 'step')
    await page.evaluate(() => window.__studyHandlers.s2j_onPlayOver())
    await page.getByRole('heading', { name: '本课程已播放完毕' }).waitFor()
    signFails = true
    await go('/course/study?id=qa-course&periodId=denied')
    await page.getByRole('heading', { name: '暂时无法继续学习' }).waitFor()
    assert(await page.locator('.player-overlay').getByText('没有课程学习权限', { exact: true }).isVisible())
    signFails = false
    await page.getByRole('button', { name: '重新加载', exact: true }).click()
    await page.locator('.player-overlay').waitFor({ state: 'hidden' })
    await page.locator('.study-period.active').waitFor()
    progressFails = true
    await page.evaluate(() => window.__studyHandlers.s2j_onVideoPause())
    await page.getByText('学习进度同步失败，播放已暂停。请重试以继续学习。', { exact: true }).waitFor()
    progressFails = false
    course.isFree = 1
    course.coursePrice = 0
    await go('/course/detail?id=free-test')
    await page.getByRole('button', { name: '登录观看', exact: true }).waitFor()
    course.allowStudy = 1
    await go('/course/detail?id=owned-test')
    await page.getByRole('link', { name: '开始学习 →', exact: true }).waitFor()
    course.isFree = 0
    course.coursePrice = 99
    course.allowStudy = 0
    await context.clearCookies()
    await go('/login')
    await page.locator('.access-heading').waitFor()
    await page.getByRole('button', { name: '登录', exact: true }).click()
    assert(await page.getByText('请输入正确的 11 位手机号', { exact: true }).isVisible())
    assert.equal(await page.locator('#access-mobile').evaluate((el) => document.activeElement === el), true)
    for (const url of ['/login', '/register', '/reset']) {
      await go(url)
      for (const width of [1920, 1440, 1280, 1024]) {
        await page.setViewportSize({ width, height: 1000 })
        await noOverflow(url + ' ' + width)
      }
    }
    await page.screenshot({ path: output + '/auth-1024.png', fullPage: true })
    await page.evaluate(() => document.querySelector('#__nuxt').__vue_app__.config.globalProperties.$router.push('/account/course'))
    await page.waitForURL(/login\?redirect=/)
    await page.locator('#access-mobile').fill('13800000000')
    await page.locator('#access-password').fill('Password123')
    await page.locator('#access-code').fill('1234')
    await page.getByText('我已阅读并同意', { exact: true }).click()
    assert(await page.getByRole('checkbox', { name: '我已阅读并同意' }).isChecked())
    await page.getByRole('button', { name: '登录', exact: true }).click()
    await page.waitForURL(base + '/account/course')
    await page.getByRole('link', { name: '继续学习 →', exact: true }).waitFor()
    await go('/404')
    await page.getByRole('heading', { name: '这个页面暂时找不到了' }).waitFor()
    assert.deepEqual(errors, [], 'Browser runtime errors')
    const result = {
      passed: true,
      widths: [1920, 1440, 1280, 1024],
      scenarios: [
        'live homepage',
        'URL filters and pagination',
        'back navigation',
        'search type reload',
        'collect isolation',
        'list failure and retry',
        'empty results',
        'learning cards',
        'payment success/failure/closed',
        'next/final lesson',
        'sign denied and retry',
        'progress failure',
        'auth validation and focus',
        'auth responsive',
        '404'
      ],
      mockWrites: writes.length
    }
    fs.writeFileSync(output + '/results.json', JSON.stringify(result, null, 2))
    console.log(JSON.stringify(result))
  } finally {
    await browser.close()
  }
}
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
