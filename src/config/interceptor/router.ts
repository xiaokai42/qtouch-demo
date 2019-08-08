import Vue from "vue";
import iView from "iview";
import { NavigationGuard, Route } from "vue-router/types/router";
Vue.use(iView);
import store from "@/store";
import router from "@/router";
import { APP_TITLE } from "@/config/index";
import vm from "@/main";
/**
 * 路由跳转前的钩子函数
 * @param to 前往的路由对象
 * @param from 离开的路由对象
 * @param next 路由跳转函数
 */
export const rootRouteBeforeGuard: NavigationGuard = (to: Route, from: Route, next: any): void => {
  // 设置浏览器窗口 title
  setDocTitle(to);
  iView.LoadingBar.start();
  next();
};

export const rootRouteBeforeResolve: NavigationGuard = (to: Route, from: Route, next: any): void => {
  next();
};

/**
 * 路由跳转完成后的钩子函数
 * @param to 前往的路由对象
 * @param from 离开的路由对象
 */
export const rootRouteAfterGuard = (to: Route, from: Route): void => {
  iView.LoadingBar.finish();
};

export const rootRouteEnterGuard = (to: Route, from: Route, next: Function): void => {
  next();
};

export const routerReadyCallBack = (): void => {};

/**
 * 设置窗口题目
 * @param {Route} to
 */
function setDocTitle(to: Route): void {
  if (to.meta.title) {
    document.title = to.meta.title + "——" + APP_TITLE;
  } else {
    document.title = APP_TITLE;
  }
}
