import request from "@/utils/request";
import * as url from "url";

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
export const selectByPrimaryKey=({id})=>request({url:`${api}${module}/roleMenu/${id}`,method:'get'})

