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
export const save=({employeeId,roleId})=>
  request({
    url:`${api}/employee/role`,
    method:'post',
    data:{
      employee_id:employeeId,
      role_id:roleId
    }
  })
