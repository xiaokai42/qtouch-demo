<template>
  <div class="container">
    <form-designer :data="data" ref="formDesigner"></form-designer>
    <div class="btn">
      <el-button type="primary" size="small" @click="handleSave">保存</el-button>
      <el-button size="small" @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * @Author: liuyang
 * @Date: 2019-07-03 10:11
 */
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import FormDesigner from "@/components/form_designer/FormDesigner.vue";
import Http from "@/utils/Http";
import Url from "@/api/url";

@Component({
  components: {
    FormDesigner
  }
})
export default class FormManageAdd extends Vue {
  @Prop({ type: Object, default: () => ({}) })
  data?: any;

  created(): void {
    // this.getEventType();
  }

  handleSave() {
    let formDesigner: any = this.$refs.formDesigner;
    formDesigner.save((formId: string) => {
      if (formId) {
        this.$message.success("保存成功");
        this.handleCancel();
      }
    });
  }

  handleCancel() {
    this.$emit("hidden");
  }
}
</script>

<style scoped lang="less">
.container {
  position: relative;
  min-height: calc(100vh - 130px);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
.btn {
  width: 500px;
  margin: 50px auto 0;
  text-align: right;
}
</style>
