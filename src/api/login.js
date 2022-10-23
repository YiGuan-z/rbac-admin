import request from '@/utils/request'
const api=process.env.VUE_APP_BASE_API

export function login(data) {
  return request({
    url: `${api}/employee/login`,
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: `${api}/employee/info`,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: `${api}/employee/logout`,
    method: 'get'
  })
}
