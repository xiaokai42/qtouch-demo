<!--
  author: zhengdandan
  date: 2019-05-23
  组件说明:
-->
<template>
  <div>
    <component :is="whichComponent" @switch="switchComponent" :listRowId="listRowId" :method="method"></component>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import PersonList from "./components/PersonList.vue";
import PersonDetails from "./components/PersonDetails.vue";

@Component({
  components: {
    PersonList,
    PersonDetails
  }
})
export default class PersonIndex extends Vue {
  whichComponent: any = "PersonList";
  listRowId: any = "";
  method: any = "";

  switchComponent(buttonName: String, row: any) {
    switch (buttonName) {
      case "add":
        this.whichComponent = "PersonDetails";
        this.listRowId = "";
        this.method = "add";
        break;
      case "edit":
        this.whichComponent = "PersonDetails";
        this.listRowId = row.id;
        this.method = "edit";
        break;
      default:
        this.whichComponent = "PersonList";
    }
  }
}
</script>

<style lang="less" scoped></style>
