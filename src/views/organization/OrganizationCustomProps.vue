<!--
  author: zhengdandan
  date: 2019-05-23
  组件说明:
-->
<template>
  <div class="container">
    <basic-property-config :typeObject="typeObject"></basic-property-config>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import BasicPropertyConfig from "@/components/basic_property_config/BasicPropertyConfig.vue";

@Component({
  components: { BasicPropertyConfig }
})
export default class OrganizationCustomProps extends Vue {
  typeObject: any = {
    name: "组织机构",
    url: "/organization"
  };
}
</script>

<style lang="less" scoped>
.container {
  height: calc(~"100vh - 90px");
}
</style>
