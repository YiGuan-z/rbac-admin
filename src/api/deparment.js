import request from '@/utils/request'

const api = process.env.VUE_APP_BASE_API

/**
 * 获取员工分页数据
 * @param current 当前页
 * @param limit 页面大小
 * @param keyword 关键字
 * @returns {*}
 */
export const getList = ({current, limit, keyword}) =>
  request({
    url: `${api}/deparment/dept`,
    method: 'get',
    params: {
      current,
      limit,
      keyword
    }
  })

/**
 * 通过一个id删除
 * @param id
 * @returns {*}
 */
export const deleteById = (id) =>
  request({
    url: `${api}/deparment/dept/${id}`,
    method: 'delete'
  })
/**
 * 通过一群id删除
 * @param ids
 * @returns {*}
 */
export const deleteByIds = (ids) =>
  request({
    url: `${api}/deparment/dept`,
    method: 'delete',
    data: ids
  })
/**
 * 保存和更新
 * @param id
 * @param name
 * @param sn
 * @returns {*}
 */
export const saveOrUpdate = ({id, name, sn}) =>
  request({
    url: `${api}/deparment/dept`,
    method: 'post',
    data: {
      id, name, sn
    }
  })
