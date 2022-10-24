import request from "@/utils/request";

const api = process.env.VUE_APP_BASE_API
//规则权限页
export const getRole = ({current, limit, keyword}) =>
  request({
    url: `${api}/role/info`,
    method: 'get',
    params: {
      current, limit, keyword
    }
  })
export const saveOrUpDate = ({id, name, sn}) =>
  request({
    url: `${api}/role/info`,
    method: 'post',
    data: {
      id, name, sn
    }
  })
export const deleteById = ({id}) =>
  request({
    url: `${api}/role/info/${id}`,
    method: 'delete'
  })
export const getRoleById = ({id}) =>
  request({
    url: `${api}/role/info/${id}`,
    method: 'get'
  })
