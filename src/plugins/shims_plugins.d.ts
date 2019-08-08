import Vue from "vue";
import { Message } from "iview/types/message";
declare module "vue/types/vue" {
  interface Vue {
    $axios: any;
    $moment: any;
    $Message: Message;
    $lf: any;
    $http: any;
    $echarts: any;
  }
}
