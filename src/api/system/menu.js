import request from "@/utils/request";
const api=process.env.VUE_APP_BASE_API
const module='/system'
export const getMenuData=({current,limit,keyword})=>
  request({
    url:`${api}${module}/menu`,
    method:'get',
    params:{
      current,limit,keyword
    }
  })
export const deleteById = (id) =>
  request({
    url: `${api}${module}/menu/${id}`,
    method: 'delete'
  })
export const save=({roleId,menuId})=>
  request({
    url:`${api}${module}/menu`,
    method:'post',
    data:{
      rele_id:roleId,
      rmenu_id:menuId
    }
  })

