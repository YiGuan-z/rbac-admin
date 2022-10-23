import router from './router'
import store from './store'
import {Message} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getToken} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({showSpinner: false}) // NProgress Configuration

/**
 * 白名单配置
 * 配置在白名单中的路由可以直接访问, 不会被重定向到登录页
 */
const whiteList = ['/login']

/* 登录拦截器 => 路由守卫 */
router.beforeEach(async (to, from, next) => {
  // 进度条开始
  NProgress.start()

  // 将当前路由的 meta 中配置的 title 设置到文档的标题中
  document.title = getPageTitle(to.meta.title)

  // 从 cookie 中获取当前已经登录的 token 信息
  const hasToken = getToken()

  /* 如果有 token */
  if (hasToken) {
    if (to.path === '/login') {
      // 如果当前有 token, 并且要去的页面是登录页面, 将其转发到系统首页
      next({path: '/'})
      NProgress.done()
    } else {
      // 如果去的不是登录页面

      // 判断 vuex 中是否已经有角色信息(说明已经加载过了)
      const hasRoles = store.getters.roles && store.getters.roles.length > 0

      if (hasRoles) {
        // 如果已经加载过, 则直接跳过
        next()
      } else {
        // 如果没有获取过用户信息
        try {
          // 同步等待 vuex 中获取用户信息
          // 调用 actions 中的方法
          // 调用 user 模块中的 actions.getInfo
          const {permissions} = await store.dispatch('user/getInfo')

          // 基于用户权限动态生成路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', permissions)

          // 将可访问的路由信息加入到当前路由中
          router.addRoutes(accessRoutes)

          // 获取到以后, 才放行
          next({...to, replace: true})
        } catch (error) {
          // 如果获取用户信息出错了, 就直接跳回到登录页面, 并重置 token 信息
          await store.dispatch('user/resetToken')
          Message.error(error || '用户认证失败')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 没有 token */
    // 如果你要访问的目标路径在百名单中, 就直接放行
    if (whiteList.indexOf(to.path) !== -1) {
      // 如果在百名单中, 就不会被重定向到登录页, 并且直接放行
      next()
    } else {
      // 不在百名单中, 并且没有登录, 就直接跳转回登录页面
      // 在 /login 路径后面追加了一个 redirect 参数, 并将当前要访问的路径追加在里面
      // 作用是进入登录页后, 如果登录成功, 会自动跳转到 redirect 所在的路径
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
