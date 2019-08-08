import Vue from "vue";
import iView from "iview";
Vue.use(iView);
import vm from "@/main";
import router from "@/router";
import * as Code from "@/api/code";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import Message from "@/plugins/message_plugin";

// loading框设置局部刷新，且所有请求完成后关闭loading框
let loading: any = {};
let needLoadingRequestCount = 0; // 声明一个对象用于存储请求个数
iView.LoadingBar.config({
  color: "#0147b0"
});

function startLoading() {
  Array.from(document.querySelectorAll(".loading-area")).forEach((item: any, index: any) => {
    loading[index] = Vue.prototype.$loading({
      lock: true,
      text: "努力加载中...",
      // background: 'rgba(0,0,0,0.5)',
      target: item // 设置加载动画区域
    });
  });
}
function endLoading() {
  Array.from(document.querySelectorAll(".loading-area")).forEach((item: any, index: any) => {
    loading[index].close();
    // setTimeout(() => {
    //   loading[index].close();
    // }, 300);
  });
}
function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading();
  }
  needLoadingRequestCount++;
}
function hideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return;
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    endLoading();
  }
}

/**
 *  HTTP 请求发送之前的拦截操作
 * @param { Object } config
 */
export const requestInterceptor = (config: AxiosRequestConfig) => {
  // console.log("requestInterceptor");
  // console.log(config);
  // if (config.isLoading !== false) { // 如果配置了isLoading: false，则不显示loading
  showFullScreenLoading();
  // }
  iView.LoadingBar.start();
  return config;
};

/**
 * HTTP 请求错误时的回调函数
 * @param { Object } error
 */
export const requestErrorInterceptor = (error: any) => {
  // console.log("requestErrorInterceptor");
  // console.log(error);
  vm.$Message.error({
    content: error
  });
  iView.LoadingBar.error();
  return Promise.reject(error);
};

/**
 * 接收到 HTTP 响应时的拦截操作
 *
 */
export const responseInterceptor = (response: AxiosResponse) => {
  // console.log("responseInterceptor");
  // console.log(response);
  hideFullScreenLoading();
  // const win: any = window;
  // const NODE_ENV = process.env.NODE_ENV;
  if (response.data.status && response.data.code !== Code.SUCCESS) {
    // if (
    //   response.data.code === Code.TOKEN_EXPIRED ||
    //   response.data.code === Code.TOKEN_FAILED
    // ) {
    //   const origin =
    //     NODE_ENV === "production"
    //       ? win.process.env.VUE_APP_API_URL
    //       : process.env.VUE_APP_API_URL;
    //   const href = `${origin}#/login`;
    //   location.assign(href);
    // } else {
    //   const errCode = response.data.code;
    //   const errMsg = response.data.msg;
    // 解决下载文件时，也会弹出提示框的问题
    // if (errCode || errMsg) {
    //   vm.$Message.error({
    //     content: `${errCode}: ${errMsg}`,
    //     duration: 5
    //   });
    // }
    // }
  }
  iView.LoadingBar.finish();
  return response;
};

/**
 * 响应错误拦截器
 * @param error 响应错误对象
 */
export const responseErrorInterceptor = (error: any) => {
  // console.log("responseErrorInterceptor");
  // console.log(error);

  if (error.response.status == 401) {
    localStorage.clear();
    router.replace({
      name: "login",
      query: { redirect: router.currentRoute.fullPath }
    });
  } else if (error.response.status == 403) {
    router.replace({ path: "/403" });
  } else {
    Message.warning("请求错误，请重试");
  }

  error = handleError(error);
  iView.LoadingBar.finish();
  return Promise.reject(error);
};

const handleError: any = (error: any) => {
  switch (error.toString()) {
    case "Error: Network Error":
      error = "网络错误，请检查你的网络连接";
      break;
    case "Error: Request failed with status code 404":
      error = "请求错误，没有发现该网络地址";
      // router.push({
      //   name: "404"
      // });
      break;
    default:
      break;
  }
  return error;
};
