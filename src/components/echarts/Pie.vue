<template>
  <div v-bind:id="id" style="width: 100%" v-bind:style="{ height: height + 'px' }"></div>
</template>

<script lang="ts">
// import echarts from "echarts";
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Pie extends Vue {
  @Prop({ type: String, default: "pie" })
  id!: String;

  @Prop({ type: String, default: "" })
  name!: String;

  @Prop({ type: String, default: "" })
  title!: String;

  @Prop({
    type: Array,
    default: () => ["#4AAFDE", "#D17774", "#7DD0A7", "#D2A84F", "#0ED3D6", "#6F86A0"]
  })
  color!: Array<String>;

  @Prop({ type: Array, default: [0, "100%"] })
  radius!: Array<String>;

  @Prop({ type: Array, required: true })
  data!: Array<Object>;

  @Prop({ type: Number, default: 180, required: true })
  height!: Number;

  pieChart: any = "";

  getChart() {
    let div: any;
    div = document.getElementById(this.id.toString());
    this.pieChart = this.$echarts.init(div);
    this.pieChart.setOption({
      title: {
        text: this.title,
        x: "center",
        y: "40",
        textStyle: {
          width: 35,
          height: 11,
          fontFamily: "PingFangSC-Light",
          fontSize: 12,
          fontWeight: "normal",
          color: "#CDCECF"
        }
      },
      series: [
        {
          color: this.color,
          name: this.name,
          type: "pie",
          selectedMode: "single",
          radius: this.radius,
          center: ["50%", "50%"],
          label: {
            normal: {
              show: true,
              align: "center",
              position: "inner",
              distance: 0,
              fontWeight: "lighter",
              fontSize: 8
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: 12,
                fontWeight: "bold"
              },
              formatter: "{b} {d}%)"
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: this.data,
          itemStyle: {
            normal: {
              borderColor: "#13141648",
              borderWidth: 2
            }
          }
        }
      ]
    });
  }

  mounted() {
    this.getChart();
  }

  @Watch("color", { deep: true })
  setColor(newVal: any) {
    this.pieChart.setOption({
      color: newVal
    });
  }

  @Watch("name", { deep: true })
  setName(newVal: any) {
    this.pieChart.setOption({
      series: [
        {
          name: newVal
        }
      ]
    });
  }

  @Watch("title", { deep: true })
  setTitle(newVal: any) {
    this.pieChart.setOption({
      title: [
        {
          text: newVal
        }
      ]
    });
  }

  @Watch("radius", { deep: true })
  setRadius(newVal: any) {
    this.pieChart.setOption({
      series: [
        {
          radius: newVal
        }
      ]
    });
  }

  @Watch("data", { deep: true })
  setData(newVal: any) {
    this.pieChart.setOption({
      series: [
        {
          data: newVal
        }
      ]
    });
  }

  @Watch("height", { deep: true })
  setHeight(newVal: any) {
    this.height = newVal;
  }
}
</script>

<style scoped lang="less"></style>
