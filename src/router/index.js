import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * 公共路由配置
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/403',
    component: () => import('@/views/error/403'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'el-icon-s-home', affix: true}
    }]
  }
]

export const asyncRoutes = [
  {
    path: '/system',
    component: 'Layout',
    name: 'System',
    meta: { title: '系统管理', icon: 'el-icon-s-operation' },
    children: [
      {
        path: 'department',
        name: 'Department',
        component: 'system/department',
        meta: { title: '部门管理', icon: 'tree' }
      },
      {
        path: 'employee',
        name: 'Employee',
        component: 'system/employee',
        meta: { title: '员工管理', icon: 'user' }
      },
      {
        path: 'role',
        name: 'Role',
        component: 'system/role',
        meta: { title: '角色管理', icon: 'peoples' }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: 'system/menu',
        meta: { title: '菜单管理', icon: 'tree-table' }
      }
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // 修改路由模式
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
