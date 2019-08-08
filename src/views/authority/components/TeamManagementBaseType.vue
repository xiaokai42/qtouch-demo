<template>
  <div class="sub-container" v-loading="loading">
    <div class="header">团队名称：{{ data.name }}</div>
    <div style="margin-top: 20px;">
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="(item, index) in dataList" :label="item.id" :key="index">{{
          item.baseTypeName
        }}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="btn">
      <el-button size="small" @click="handleBack">返回</el-button>
      <el-button type="primary" size="small" @click="handleSave">{{ data ? "保存" : "添加" }} </el-button>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * @Author: liuyang
 * @Date: 2019-07-10 14:06
 */
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import Http from "@/utils/Http";
import Url from "@/api/url";

@Component({})
export default class TeamManagementBaseType extends Vue {
  @Prop({ type: Object, required: true })
  data!: any;

  loading: boolean = false;
  dataList: Array<any> = [];
  checkList: Array<any> = [];

  async created() {
    this.loading = true;
    try {
      await Promise.all([this.getDataList(), this.getCheckList()]);
    } finally {
      this.loading = false;
    }
  }

  async getDataList() {
    let {
      data: { data, status, message }
    } = await Http.get(Url.admin.getBaseTypeList);
    if (status) {
      this.dataList = data;
    } else {
      this.$message.error(message);
    }
  }

  async getCheckList() {
    let {
      data: { data, status, message }
    } = await Http.get(Url.auth.getTeamBaseType + this.data.id);
    if (status) {
      this.checkList = data.map((d: any) => d.id);
    } else {
      this.$message.error(message);
    }
  }

  async handleSave() {
    this.loading = true;
    try {
      let {
        data: { data, status, message }
      } = await Http.post(Url.auth.saveTeamBaseType + this.data.id, this.checkList);
      if (status) {
        this.$message.success("保存成功");
        this.handleBack();
      } else {
        this.$message.error(message);
      }
    } finally {
      this.loading = false;
    }
  }

  handleBack() {
    this.$emit("hidden");
  }
}
</script>

<style scoped lang="scss">
.sub-container {
  position: relative;
  min-height: calc(100vh - 180px);
  padding-bottom: 62px !important;
}

.btn {
  position: absolute;
  right: 20px;
  bottom: 12px;
}
</style>
