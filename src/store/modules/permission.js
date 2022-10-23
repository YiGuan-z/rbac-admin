import { constantRoutes } from '@/router'
import Layout from '@/layout/index'
import { getRoutes } from '@/api/menu'

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, permissions) {
    return new Promise(resolve => {
      // 请求后端获取所有路由
      getRoutes().then(res => {
        let asyncRoutes = res.data

        let accessedRoutes
        accessedRoutes = filterAsyncRouter(asyncRoutes, permissions)

        // 追加默认路由
        accessedRoutes.push({
          path: '/layout',
          children: [
            {
              path: 'https://www.wolfcode.cn',
              meta: { title: '叩丁狼官网', icon: 'link' }
            }
          ]
        })
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  }
}

function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.map(menu => {
    // 对象转换
    let route = {
      path: menu.type === 0 ? `/${menu.path}` : menu.path,
      component: menu.component,
      permissions: menu.expression,
      name: menu.path,
      meta: { title: menu.title, icon: menu.icon},
      children: menu.children
    }

    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return route
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  let children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

export const loadView = (view) => {
  if (process.env.NODE_ENV === 'development') {
    return (resolve) => require([`@/views/${view}/index`], resolve)
  } else {
    // 使用 import 实现生产环境的路由懒加载
    return () => import(`@/views/${view}`)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
