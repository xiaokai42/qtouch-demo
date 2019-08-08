<template>
  <div class="container">
    <process-list
      v-if="!newVisible && !groupVisible"
      @showNew="handleShowNew"
      @showGroup="handleShowGroup"
    ></process-list>
    <process-new v-if="newVisible" :data="processItem" @hidden="handleHiddenNew"></process-new>
    <group-manage v-if="groupVisible" @hidden="handleHiddenGroup"></group-manage>
    <!--    <process-list @switch="switchComponent"></process-list>-->
    <!--    <process-details></process-details>-->
  </div>
</template>

<script lang="ts">
/**
 * @Description: 流程管理
 * @Author: liuyang
 * @Date: 2019-07-02 14:10
 */
import { Vue, Component } from "vue-property-decorator";
import ProcessList from "./components/ProcessList.vue";
import ProcessNew from "./components/ProcessNew.vue";
import ProcessDetails from "./components/ProcessDetails.vue";
import GroupManage from "./components/GroupManage.vue";

@Component({
  components: {
    ProcessList,
    ProcessNew,
    ProcessDetails,
    GroupManage
  }
})
export default class ProcessIndex extends Vue {
  newVisible: boolean = false;
  groupVisible: boolean = false;
  processItem: any = null;

  handleShowNew(item: any) {
    this.newVisible = true;
    this.processItem = item;
  }

  handleHiddenNew() {
    this.newVisible = false;
  }

  handleShowGroup() {
    this.groupVisible = true;
  }

  handleHiddenGroup() {
    this.groupVisible = false;
  }
}
</script>

<style lang="less" scoped>
.container {
  background: #f0f2f5;
  padding: 20px;
}
</style>
