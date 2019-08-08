import Vue from "vue";
import el from "element-ui";
Vue.use(el);
const vm = new Vue();
vm.$Message;

export default class Message {
  static info = (content?: string, duration?: number, onClose?: any, render?: any) => {
    return vm.$Message.info({
      content,
      duration,
      onClose,
      render
    });
  };
  static success = (content?: string, duration?: number, onClose?: any, render?: any) => {
    return vm.$Message.success({
      content,
      duration,
      onClose,
      render
    });
  };
  static error = (content?: string, duration?: number, onClose?: any, render?: any) => {
    return vm.$Message.error({
      content,
      duration,
      onClose,
      render
    });
  };
  static warning = (content?: string, duration?: number, onClose?: any, render?: any) => {
    return vm.$Message.warning({
      content,
      duration,
      onClose,
      render
    });
  };
}
