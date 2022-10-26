import request from "@/utils/request";

const api = process.env.VUE_APP_BASE_API
const module = '/system'
export const getList = ({current, limit, keyword}) =>
  request({
    url: `${api}${module}/menu`,
    method: 'get',
    params: {
      current, limit, keyword
    }
  })
export const deleteById = (id) =>
  request({
    url: `${api}${module}/menu/${id}`,
    method: 'delete'
  })
export const saveOrUpdate = ({
                               component,
                               created_time,
                               expression,
                               icon,
                               id,
                               parent_id,
                               path,
                               seq,
                               status,
                               title,
                               type,
                               updated_time
                             }) =>
  request({
    url: `${api}${module}/menu`,
    method: 'post',
    data: {
      component, created_time, expression, icon, id, parent_id, path, seq, status, title, type, updated_time
    }
  })

export const changeStatus = ({id}) => request({
  url:`${api}${module}/menu${id}`,
  method:'patch'
})

