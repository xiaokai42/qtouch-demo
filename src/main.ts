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

const vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

export default vm;
