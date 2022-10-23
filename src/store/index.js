import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// 获取当前 modules 下所有的 .js 文件
const modulesFiles = require.context('./modules', true, /\.js$/)

// 将所有模块进行转换, 并得到模块名
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // 转换 './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  modules,
  getters
})

export default store
