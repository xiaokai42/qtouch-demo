<template>
  <div class="container">
    <form-manage-list v-if="!addVisible" @showAdd="handleShowAdd"></form-manage-list>
    <form-manage-add v-if="addVisible" :data="formItem" @hidden="handleHiddenAdd"></form-manage-add>
  </div>
</template>

<script lang="ts">
/**
 * @Author: liuyang
 * @Date: 2019-07-03 9:25
 */
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import FormManageList from "./components/FormManageList.vue";
import FormManageAdd from "./components/FormManageAdd.vue";

@Component({
  components: {
    FormManageList,
    FormManageAdd
  }
})
export default class FormManage extends Vue {
  addVisible: boolean = false;
  formItem: any = {};

  handleShowAdd(item: any) {
    this.addVisible = true;
    this.formItem = item;
  }

  handleHiddenAdd() {
    this.addVisible = false;
  }
}
</script>

<style scoped lang="less">
.container {
  padding: 20px;
}
</style>
