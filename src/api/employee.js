import request from "@/utils/request";

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
    method: 'delete',
  })
export const deleteByIds = (ids) =>
  request({
    url: `/employee/user`,
    method: 'delete',
    data:ids
  })
