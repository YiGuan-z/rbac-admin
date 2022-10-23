import request from '@/utils/request'

const api=process.env.VUE_APP_BASE_API

/**
 * 获取员工分页数据
 * @param current 当前页
 * @param limit 页面大小
 * @param keyword 关键字
 * @returns {*}
 */
export const getList = ({ current, limit, keyword }) =>
  request({
    url: `${api}/employee/user`,
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
    url: `${api}/employee/user/${ id }`,
    method: 'delete'
  })
/**
 * 通过一群id删除
 * @param ids
 * @returns {*}
 */
export const deleteByIds = (ids) =>
  request({
    url: `${api}/employee/user`,
    method: 'delete',
    data: ids
  })
/**
 * 保存或更新
 * @param admin
 * @param age
 * @param dept_id
 * @param email
 * @param hireDate
 * @param id
 * @param name
 * @param password
 * @param username
 * @returns {*}
 */
export const saveOrUpdate = ({ admin, age, dept_id, email, hireDate, id, name, password, username }) =>
  request({
    url: `${api}/employee/user`,
    method: 'post',
    data: {
      admin, age, dept_id, email, hireDate, id, name, password, username
    }
  })
