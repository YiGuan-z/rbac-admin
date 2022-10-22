import request from "@/utils/request";

export const getList = (data) =>
  request({
    url: '/employee/user',
    method: 'get',
    data
  })
