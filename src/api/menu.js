import {get} from "@/utils/api-mock";

export function getRoutes() {
  return get(`/vue-wolfcode-template/menu/routes`)
}
