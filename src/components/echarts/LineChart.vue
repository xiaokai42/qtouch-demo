<template>
  <div v-bind:id="id" style="width: 100%" v-bind:style="{ height: height + 'px' }"></div>
</template>

<script lang="ts">
// import echarts from "echarts";
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";

@Component
export default class LineChart extends Vue {
  @Prop({ type: String, default: "line" })
  id!: String;

  @Prop({ type: Array, required: true })
  legendData!: Array<String>;

  @Prop({ type: Array, required: true })
  xData!: Array<String>;

  @Prop({ type: Array, required: true })
  series!: Array<Object>;

  @Prop({ type: Number, default: 180, required: true })
  height!: Number;

  lineChart: any = "";

  getChart() {
    let div: any;
    div = document.getElementById(this.id.toString());
    this.lineChart = this.$echarts.init(div);
    this.lineChart.setOption({
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
        itemStyle: {
          fontWeight: "lighter"
        },
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
            color: "#E7E3E3"
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
    this.lineChart.setOption({
      legend: {
        data: newVal
      }
    });
  }

  @Watch("xData", { deep: true })
  setXData(newVal: any) {
    this.lineChart.setOption({
      xAxis: {
        data: newVal
      }
    });
  }

  @Watch("series", { deep: true })
  setSeries(newVal: any) {
    this.lineChart.setOption({
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
