import request from '@/utils/request'

export function getList({current, limit, keyword}) {
  return request({
    url: '/employee/user',
    method: 'get',
    params: {
      current,
      limit,
      keyword
    }
  })
}

export const deleteById = (id) =>
  request({
    url: `/employee/user/${id}`,
    method: 'delete'
  })
export const deleteByIds = (ids) =>
  request({
    url: `/employee/user`,
    method: 'delete',
    data: ids
  })
export const saveOrUpdate = ({admin, age, dept_id, email, hireDate, id, name, password, username}) =>
  request({
    url: `/employee/user`,
    method: 'post',
    data: {
      admin, age, dept_id, email, hireDate, id, name, password, username
    }
  })
