<template>
  <!--<div id="bar" style="width: 200px; height: 200px"></div>-->
  <div v-bind:id="id" style="width: 100%" v-bind:style="{ height: height + 'px' }"></div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
// import echarts from "echarts";

@Component
export default class Bar extends Vue {
  @Prop({ type: String, default: "bar" })
  id!: String;

  @Prop({ type: Array, required: true })
  legendData!: Array<String>;

  @Prop({ type: Array, required: true })
  xData!: Array<String>;

  @Prop({ type: Array, required: true })
  series!: Array<Object>;

  @Prop({ type: Number, default: 180, required: true })
  height!: Number;

  barChart: any = "";

  getChart() {
    let div: any;
    div = document.getElementById(this.id.toString());
    this.barChart = this.$echarts.init(div);
    this.barChart.setOption({
      color: ["#45EFEC", "#4FBDC7", "#2592A1", "#29757C"],
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "20%",
        containLabel: true
      },
      legend: {
        data: this.legendData,
        itemWidth: 12,
        itemHeight: 6,
        textStyle: {
          color: "#E7E3E3",
          fontSize: 12,
          fontWeight: "lighter"
        }
      },
      xAxis: [
        {
          type: "category",
          data: this.xData,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#2C6788"
            }
          },
          axisLabel: {
            color: "#E7E3E3",
            interval: 0
          }
        }
      ],
      yAxis: [
        {
          type: "value",
          splitNumber: 4,
          minInterval: 2,
          axisLine: {
            show: false,
            lineStyle: {}
          },
          axisLabel: {
            color: "#E7E3E3"
          },
          splitLine: {
            lineStyle: {
              color: "#2C6788"
            }
          }
        }
      ],
      series: this.series
    });
  }

  mounted() {
    this.getChart();
  }

  @Watch("legendData", { deep: true })
  setLegend(newVal: any) {
    this.barChart.setOption({
      legend: {
        data: newVal
      }
    });
  }

  @Watch("xData", { deep: true })
  setXData(newVal: any) {
    this.barChart.setOption({
      xAxis: {
        data: newVal
      }
    });
  }

  @Watch("series", { deep: true })
  setSeries(newVal: any) {
    this.barChart.setOption({
      series: newVal
    });
  }

  @Watch("height", { deep: true })
  setHeight(newVal: any) {
    this.height = newVal;
  }
}
</script>

<style scoped lang="less"></style>
