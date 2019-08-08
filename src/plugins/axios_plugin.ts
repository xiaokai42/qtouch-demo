import axios from "@/api/axios";

export default {
  install: function(Vue: any) {
    Object.defineProperty(Vue.prototype, "$axios", { value: axios });
  }
};
