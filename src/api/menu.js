import request from "@/utils/request";

const api = process.env.VUE_APP_BASE_API

export const getRoutes = () => request({url: `${api}/system/menu/routers`, method: 'get'})
