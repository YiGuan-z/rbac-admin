import request from "@/utils/request";

const api = process.env.VUE_APP_BASE_API
export const getEmployeeRole=({current,limit,keyword})=>
  request({
    url:`${api}/employee/role`,
    method:'get',
    params:{
      current,limit,keyword
    }
  })
export const selectByPrimaryKey=({id})=>request({url:`${api}/employee/role/${id}`,method:'get'})
export const selectAll=()=>request({url:`${api}/employee/role`})
