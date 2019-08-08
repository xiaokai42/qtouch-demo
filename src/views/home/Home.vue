<!--
 author: 彭鑫
 descr: 首页主文件
 -->
<template>
  <div id="a_map">

  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Http from "@/utils/Http";
import Url from "@/api/url";

@Component({
  components: {}
})
export default class Home extends Vue {

}
</script>

<style scoped lang="less">
#a_map {
  width: 100%;
  padding: 24px;
  height: calc(~"100vh - 50px");
}
</style>
