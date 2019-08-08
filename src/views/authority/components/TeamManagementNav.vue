<template>
  <div class="sub-container" v-loading="loading">
    <div class="header">团队名称：{{ data.name }}</div>
    <div class="bottom">
      <el-tree
        :data="allNavTree"
        :props="defaultProps"
        :default-checked-keys="teamNavIdList"
        node-key="id"
        default-expand-all
        show-checkbox
        :expand-on-click-node="false"
        ref="tree"
      >
      </el-tree>
    </div>
    <div class="btn">
      <el-button size="small" @click="handleBack">返回</el-button>
      <el-button type="primary" size="small" @click="handleSave">{{ data ? "保存" : "添加" }} </el-button>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * @Description: 团队管理菜单表单
 * @Author: liuyang
 * @Date: 2019-06-28 11:39
 */
import { Vue, Component, Prop } from "vue-property-decorator";
import Http from "@/utils/Http";
import Url from "@/api/url";

@Component({})
export default class TeamManagementNav extends Vue {
  @Prop({ type: Object, required: true })
  data!: any;
  loading: boolean = false;
  allNavTree: Array<any> = [];
  teamNavIdList: Array<string> = [];
  defaultProps = {
    children: "children",
    label: "name"
  };

  created(): void {
    this.matchOperation();
  }

  async matchOperation() {
    this.loading = true;
    try {
      await Promise.all([this.getTeamNavList(), this.getAllNavList()]);
    } finally {
      this.loading = false;
    }
  }

  async getAllNavList() {
    let {
      data: { data, status, message }
    } = await Http.get(Url.auth.getMenuList);
    if (status) {
      this.allNavTree = data;
    } else {
      this.$message.error(message);
    }
  }

  async getTeamNavList() {
    let {
      data: { data, status, message }
    } = await Http.get(Url.auth.getTenantNavList + this.data.id);
    if (status) {
      this.teamNavIdList = data.map((d: any) => d.id);
    } else {
      this.$message.error(message);
    }
  }

  async handleSave() {
    this.loading = true;
    const tree: any = this.$refs.tree;
    try {
      let {
        data: { data, status, message }
      } = await Http.post(Url.auth.updateTenantNav + this.data.id, tree.getCheckedNodes().map((d: any) => d.id));
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

<style scoped lang="less">
.header {
  display: flex;
}

.sub-container {
  position: relative;
  min-height: calc(100vh - 180px);
  padding-bottom: 62px !important;
}

.bottom {
  margin-top: 20px;
}

.name {
  font-size: 16px;
}

.operation {
  margin-left: 20px;
}

.btn {
  position: absolute;
  right: 20px;
  bottom: 12px;
}
</style>
