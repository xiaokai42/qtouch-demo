import Http from "@/utils/Http";

export default {
  install: function(Vue: any) {
    Object.defineProperty(Vue.prototype, "$http", { value: Http });
  }
};
