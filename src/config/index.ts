/*
 * 应用配置统一管理文件
 * @author
 */
// const win: any = window;

export const NODE_ENV: string = process.env.NODE_ENV || "production";

export const APP_TITLE: string = process.env.VUE_APP_TITLE || "重庆市住房和城乡建设委员会";
/*
 * 前端路由模式
 * 开发模式为 "hash"
 * 发布的时候为 "history"
 * @const
 * @typeof {string}
 * @return  "hash" | "history"
 */
const ROUTER_MODE: string = process.env.VUE_APP_ROUTER_MODE || "history";

/*
 * 前端路由基路径
 * @const
 * @typeof {string}
 * @default "/"
 */
const ROUTER_BASE: string = process.env.BASE_URL || "/";

/*
 * 前端路由默认配置
 */
export const ROUTER_DEFAULT_CONFIG: any = {
  mode: ROUTER_MODE,
  base: ROUTER_BASE
};

// 此方式需后台配置cors
const API_URL = NODE_ENV === "production" ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL;

// const baseURL: string | undefined = NODE_ENV === "production" ? "" : process.env.VUE_APP_API_URL;
export const baseURL = API_URL ? API_URL : "";

export const AXIOS_DEFAULT_CONFIG = {
  // baseURL,
  // headers: {
  //   "Content-Type": "application/json; charset=UTF-8"
  // }
};
