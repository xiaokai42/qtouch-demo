<template>
  <div class="my-container">
    <subsystem-list v-if="listVisible" @hidden="handleHiddenList"></subsystem-list>
    <subsystem-detail v-else :data="subsystemItem" @hidden="handleHiddenDetail"></subsystem-detail>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Emit, Watch } from "vue-property-decorator";
import SubsystemList from "./components/SubsystemList.vue";
import SubsystemDetail from "./components/SubsystemDetail.vue";

@Component({
  components: {
    SubsystemList,
    SubsystemDetail
  }
})
export default class Subsystem extends Vue {
  listVisible: boolean = true;
  subsystemItem: any = {};

  handleHiddenList(item: any) {
    this.listVisible = false;
    this.subsystemItem = item;
  }

  handleHiddenDetail() {
    this.listVisible = true;
  }
}
</script>

<style scoped lang="less">
.my-container {
  margin: 20px;
  padding: 20px;
  background: #fff;
}
</style>
