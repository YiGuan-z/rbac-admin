import request from "@/utils/request";

const api = process.env.VUE_APP_BASE_API
const module = '/system'

export const saveRole=({id,menuId})=>
  request({
    url:`${api}${module}/roleMenu`,
    method:'put',
    data:{
      id, menuId
    }
  })

export const deleteById=({id})=>
  request({
    url:`${api}${module}/menu/${id}`,
    method:'delete'
  })
