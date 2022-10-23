import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import RightToolbar from '@/components/RightToolbar'
import '@/assets/styles/element-variables.scss'
import '@/assets/styles/index.scss'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import {resetForm} from './utils'
import plugins from './plugins' // plugins

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import SlideVerify from 'vue-monoplasty-slide-verify';

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// 全局挂载组件
Vue.component('RightToolbar', RightToolbar)

// 全局方法挂载
Vue.prototype.resetForm = resetForm

Vue.use(ElementUI, { locale })
Vue.use(plugins)
Vue.use(SlideVerify)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
