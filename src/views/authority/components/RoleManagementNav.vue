<template>
  <div class="sub-container" v-loading="loading">
    <div class="header">角色名称：{{ data.name }}</div>
    <div class="bottom">
      <el-tree
        :data="allOperationList"
        :props="defaultProps"
        :default-checked-keys="navIdList"
        node-key="id"
        default-expand-all
        show-checkbox
        check-strictly
        :expand-on-click-node="false"
        :render-content="renderContent"
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
 * @Description: 角色权限配置
 * @Author: liuyang
 * @Date: 2019-06-28 9:27
 */
import { Vue, Component, Prop } from "vue-property-decorator";
import Http from "@/utils/Http";
import Url from "@/api/url";

@Component({})
export default class RoleManagementNav extends Vue {
  @Prop({ type: Object, required: true })
  data!: any;
  loading: boolean = false;
  allOperationList: Array<any> = [];
  navIdList: Array<any> = [];
  roleOperationMap: any = {};
  defaultProps = {
    children: "children",
    label: "name"
  };
  styleScopedId: string | undefined = "";
  // 用于保存选中数据 id -> ids[{}]
  treeIdMap: any = {};

  created(): void {
    this.matchOperation();
  }

  mounted() {
    let tree: any = this.$refs.tree;
    this.styleScopedId = Object.keys(tree.$el.dataset).find((d: string) => d.substring(0, 2) === "v-");
  }

  async matchOperation() {
    this.loading = true;
    try {
      await this.getRoleOperationList();
      this.getAllOperationList();
    } finally {
      this.loading = false;
    }
  }

  async getRoleOperationList() {
    let {
      data: { data, status, message }
    } = await Http.get(Url.auth.getRoleOperationList + this.data.id);
    if (status) {
      this.navIdList = data.navigationIds;
      this.roleOperationMap = {};
      data.navigationOperationIds.forEach((id: string) => {
        this.roleOperationMap[id] = true;
      });
    } else {
      this.$message.error(message);
    }
  }

  async getAllOperationList() {
    let {
      data: { data, status, message }
    } = await Http.get(Url.auth.getAllOperationList);
    if (status) {
      this.allOperationList = data;
    } else {
      this.$message.error(message);
    }
  }

  renderContent(h: any, { node, data, store }: { node: any; data: any; store: any }) {
    // 给每一个节点添加当前组件的样式作用域hash值 data-v-xxxx
    const assignScopedId = (obj: any) => {
      if (this.styleScopedId) {
        obj.attrs = obj.attrs || {};
        obj.attrs["data-" + this.styleScopedId] = true;
      }
      return obj;
    };
    if (!this.treeIdMap[data.id]) {
      this.treeIdMap[data.id] = data.oparations.map((item: any) => {
        return {
          id: item.id,
          checked: this.roleOperationMap[item.id]
        };
      });
    }
    return h(
      "div",
      assignScopedId({
        class: "tree-item"
      }),
      [
        data.name,
        h(
          "div",
          assignScopedId({
            class: "right"
          }),
          data.oparations.map((item: any, index: number) => {
            return h(
              "div",
              assignScopedId({
                class: "item",
                props: {
                  key: index
                }
              }),
              [
                h("el-checkbox", {
                  style: { marginRight: "8px" },
                  props: {
                    disabled: !node.checked,
                    checked: this.treeIdMap[data.id][index].checked
                  },
                  on: {
                    input: (val: boolean) => {
                      this.treeIdMap[data.id][index].checked = val;
                    }
                  }
                }),
                item.operationName
              ]
            );
          })
        )
      ]
    );
  }

  async handleSave() {
    let checkedNodeIdMap: any = {};
    let tree: any = this.$refs.tree;
    tree.getCheckedNodes().forEach((item: any) => {
      checkedNodeIdMap[item.id] = true;
    });
    let requestBody = Object.keys(this.treeIdMap)
      .filter((id: string) => checkedNodeIdMap[id])
      .map((id: any) => {
        return {
          navigationId: id,
          operationIds: this.treeIdMap[id].filter((d: any) => d.checked).map((d: any) => d.id)
        };
      });
    this.loading = true;
    try {
      let {
        data: { data, status, message }
      } = await Http.post(Url.auth.updateRoleNavOperation + this.data.id, requestBody);
      if (status) {
        this.$message.success("保存成功");
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

.tree-item {
  display: flex;
  align-items: center;
  .right {
    display: flex;
    align-items: center;
    margin-left: 50px;
  }
  .item {
    margin-right: 20px;
  }
}

.btn {
  position: absolute;
  right: 20px;
  bottom: 12px;
}
</style>
