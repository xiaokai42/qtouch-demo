import axios from "@/api/axios";
import store from "@/store";
import { baseURL } from "@/config";
/**
 * 检查结果状态
 * @returns {*}
 * @param response
 */
function checkStatus(response: any) {
  if (response.status) {
    return response;
  }
  return {
    data: {
      code: -404,
      message: response.statusText,
      data: response.statusText
    }
  };
}

function checkCode(response: any) {
  return response;
}

export default class Http {
  /**
   * 提交数据
   * @param url { string }
   * @param data? { object }
   * @returns {Promise.<TResult>|*}
   */
  [key: string]: any;
  static post = (url: string, data?: any) => {
    if (!data) {
      data = {};
    }
    delete data.template;
    return axios({
      method: "post",
      url: url,
      data: data,
      timeout: 1000 * 60 * 2,
      xhrFields: {
        withCredentials: true
      },
      withCredentials: true,
      headers: {
        // "X-Requested-With": "XMLHttpRequest",
        // "Content-Type": "application/Json; charset=UTF-8"
        // "Access-Control-Allow-Headers": "access-token, auth-token"
        accessToken: "Bearer " + store.getters[`getToken`]
      }
    })
      .then(checkStatus)
      .then(checkCode);
  };

  static put = (url: string, data: any = {}) => {
    if (!data) {
      data = {};
    }
    delete data.template;
    return axios({
      method: "put",
      url: url,
      data: data,
      timeout: 1000 * 60 * 2,
      xhrFields: {
        withCredentials: true
      },
      withCredentials: true,
      headers: {
        // "X-Requested-With": "XMLHttpRequest",
        // "Content-Type": "application/Json; charset=UTF-8"
        // "Access-Control-Allow-Headers": "access-token, auth-token"
        // accessToken: "Bearer " + store.getters[`getToken`]
      }
    })
      .then(checkStatus)
      .then(checkCode);
  };
  /**
   * 获取数据
   * @param url
   * @param params
   * @returns {Promise.<TResult>|*}
   */
  static get = (url: string, data?: any) => {
    let params = new Object();
    if (!data) {
      data = {};
    }
    delete data.template;
    params = data;
    return axios({
      method: "get",
      url: url,
      params: params,
      // timeout: 30000,
      dataType: "json",
      xhrFields: {
        withCredentials: true
      },
      withCredentials: true,
      headers: {
        // "Access-Control-Allow-Origin": "*",
        // "X-Requested-With": "XMLHttpRequest"
        // "Access-Control-Allow-Headers": "access-token, auth-token",
        accessToken: "Bearer " + store.getters[`getToken`]
      }
    })
      .then(checkStatus)
      .then(checkCode)
      .catch(function() {});
  };

  static delete = (url: string, data: any = {}) => {
    return axios({
      method: "delete",
      url: url,
      // timeout: 30000,
      dataType: "json",
      xhrFields: {
        withCredentials: true
      },
      withCredentials: true,
      headers: {
        // "Access-Control-Allow-Origin": "*",
        // "X-Requested-With": "XMLHttpRequest"
        // "Access-Control-Allow-Headers": "access-token, auth-token",
        // accessToken: "Bearer " + store.getters[`getToken`]
      },
      ...data
    })
      .then(checkStatus)
      .then(checkCode)
      .catch(function() {});
  };

  /**
   *
   * @param url
   * @param data
   * @param toJsonFlag:是否转json
   * @returns {Promise<AxiosResponse<any>>}
   */
  static postFile = (url: string, data: any, toJsonFlag: boolean) => {
    let params: any = new FormData();
    data.template = "";
    for (let key in data) {
      if (key == "attach") {
        let attachFileName = [];
        for (let i = 0; i < data[key].length; i++) {
          attachFileName.push(data[key][i].name);
          params.append(key, data[key][i]);
        }
        params.append("attachFileName", attachFileName);
      } else {
        if (toJsonFlag) {
          data[key] = JSON.stringify(data[key]);
        }
        params.append(key, data[key]);
      }
    }
    for (let key in data) {
      if (typeof data[key] == "string") {
        data[key] = data[key].trim();
      }
    }
    delete data["template"];

    return axios({
      method: "post",
      url: url,
      data: params,
      params: [],
      timeout: 30000,
      xhrFields: {
        withCredentials: true
      },
      withCredentials: true,
      //end 处理跨域代码
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        // "Access-Control-Allow-Headers": "access-token, auth-token",
        accessToken: "Bearer " + store.getters[`getToken`],
        "Content-Type": "multipart/form-data"
      }
    })
      .then(checkStatus)
      .then(checkCode)
      .catch(function() {});
  };

  static downloadFile = (url: string, data?: any) => {
    if (!data) {
      data = {};
    }
    delete data.template;
    return axios({
      method: "post",
      url: url,
      data: JSON.stringify(data),
      timeout: 60000,
      responseType: "blob",
      xhrFields: {
        withCredentials: true
      },
      withCredentials: true,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/Json; charset=UTF-8",
        // "Access-Control-Allow-Headers": "x-auth-token",
        accessToken: "Bearer " + store.getters[`getToken`]
      }
    })
      .then((response: any) => {
        if (navigator.msSaveBlob) {
          //IE
          return navigator.msSaveBlob(new Blob([response.data]), data.fileName);
        } else {
          let url = window.URL.createObjectURL(new Blob([response.data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.target = "_blank";
          link.setAttribute("download", data.fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      })
      .catch(function() {});
    /*
      .then(checkStatus)
          .then(checkCode)*/
  };
}
