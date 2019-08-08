/**
 * 按需引入 echarts,
 * 按需引入列表：@see https://github.com/apache/incubator-echarts/blob/master/index.js
 */
// @ts-ignore
import echarts from "echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/legend";
import "echarts/lib/component/markLine";

// 整体引入grid组件
import "echarts/lib/component/grid";

export default {
  install: function(Vue: any) {
    Object.defineProperty(Vue.prototype, "$echarts", { value: echarts });
  }
};
