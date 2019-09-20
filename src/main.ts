import Vue from "vue";
import App from "./App.vue";
import router from "@/router/index";
import store from "@/store/index";

import { NODE_ENV } from "@/config";
import "iview/dist/styles/iview.css";
import "element-ui/lib/theme-chalk/index.css";
import "@/utils/directive";

/**
 * ========== 打印全局环境变量 ============
 */
// console.log(process.env);
import axios from "@/plugins/axios_plugin";
Vue.use(axios);

import http from "@/plugins/http_plugin";
Vue.use(http);

import lf from "@/plugins/lf_plugin";
Vue.use(lf);

import echarts from "@/plugins/echarts_plugin";
Vue.use(echarts);

import moment from "@/plugins/moment_plugin";
Vue.use(moment);

import VueCropper from "vue-cropper";
Vue.use(VueCropper);

// element-ui
import ElementUI from "element-ui";
Vue.use(ElementUI);

import Print from "@/plugins/print";
Vue.use(Print);

// import iview from "iview";

Vue.config.productionTip = false;
Vue.config.performance = NODE_ENV === "development";
Vue.config.devtools = NODE_ENV !== "production";

router.beforeEach((to, from, next) => {
  let paths: any[] = store.getters[`getMenu`];
  if (to.path === "/login") {
    next();
  } else {
    if (Object.keys(paths).length === 0) {
      if (to.path == "/403" || to.path == "/404" || to.path == "/500") {
        next();
      } else {
        next("/403");
      }
    } else {
      if (paths.some((i: any) => i.path === to.path && !i.children)) {
        next();
      } else {
        let subMenu: any[] = [];
        paths.map((i: any) => {
          if (i.children && i.children !== []) {
            subMenu.push(...i.children);
          }
        });
        if (subMenu.some((i: any) => i.path === to.path)) {
          next();
        } else {
          if (to.path == "/403" || to.path == "/404" || to.path == "/500" 
            || to.path == "/mine" || to.path == "/changePassword") {
            next();
          } else {
            next("/403");
          }
        }
      }
    }
  }
})

const vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

export default vm;
