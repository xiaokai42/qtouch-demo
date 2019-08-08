import moment from "moment";

export default {
  install: function(Vue: any) {
    Object.defineProperty(Vue.prototype, "$moment", { value: moment });
  }
};
