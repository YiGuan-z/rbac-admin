import request from "@/utils/request";

const api = process.env.VUE_APP_BASE_API
const module = '/system'

export const getSysMenuData = ({current, limit, keyword}) =>
  request({
    url: `${api}${module}/menu`,
    method: 'get',
    params: {
      current, limit, keyword
    }
  })
export const saveOrUpdate = ({
                               id,
                               title,
                               icon,
                               path,
                               type,
                               expression,
                               component,
                               status,
                               parent_id,
                               seq,
                               created_time,
                               updated_time
                             }) =>
  request({
    url: `${api}${module}/menu`,
    method: 'post',
    data: {
      id, title, icon, path, type, expression, component, status, parent_id, seq, created_time, updated_time
    }
  })
export const getSysMenuById=({id})=>
  request({
    url:`${api}${module}/menu/${id}`,
    method:'get'
  })

export const deleteById=({id})=>
  request({
    url:`${api}${module}/menu/${id}`,
    method:'delete'
  })
