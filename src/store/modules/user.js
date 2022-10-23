import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  // user login
  // 自定义的 action 方法
  // 第一个参数是 state 参数, 第二个参数是被调用时传入的参数
  // commit 是访问 mutations 中方法的函数
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // 发起登录请求到后端, 将用户名和密码传递过期
      login({ username: username.trim(), password: password }).then(response => {
        // response = {code: 200, msg: '', data: {token: 'xxxxx'}}
        // response = {code: 200, msg: '', data: 'xxxxx'}
        // 处理后端响应的数据, 此时 data == token
        const { data } = response
        // 调用 mutations 中的 SET_TOKEN 函数, 并将 token 传递过去
        // 本质是将 token 作为数据(state)存储到 vuex 中
        commit('SET_TOKEN', data)
        // 通过工具方法将 token 存入 cookie
        setToken(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit }) {
    // 创建 promise 对象, 避免回调地狱
    return new Promise((resolve, reject) => {
      const token = getToken()
      // 调用后台获取用户信息的接口, 获取用户信息
      getInfo(token).then(response => {
        // response = {code: 200, msg: 'success', data: {userInfo}}
        const { data } = response

        // 如果获取不到用户信息
        if (!data) {
          return reject('验证失败, 请重新登录')
        }

        // 从用户对象中获取用户名与头像
        const { name, avatar, roles, permissions } = data

        if (roles && roles.length > 0) { // 验证返回的roles是否是一个非空数组
          commit('SET_ROLES', roles)
          commit('SET_PERMISSIONS', permissions)
        } else {
          commit('SET_ROLES', ['ROLE_DEFAULT'])
        }

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出系统
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

