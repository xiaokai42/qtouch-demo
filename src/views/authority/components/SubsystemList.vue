<template>
  <div class="component">
    <div class="header">
      <el-button size="small" @click="handleAdd">添加</el-button>
    </div>
    <div v-loading="loading">
      <el-table
        ref="multipleTable"
        :data="tableData"
        stripe
        :header-row-style="{ height: '60px' }"
        height="calc(100vh - 210px)"
        size="mini"
        tooltip-effect="dark"
        style="width: 100%; text-align: center"
      >
        <el-table-column align="center" prop="id" label="序号" type="index" min-width="60"></el-table-column>
        <el-table-column align="center" prop="subsystemName" label="名称" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="code" label="系统编码" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="subsystemVersion" label="版本" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" title="编辑" @click="handleEdit(scope.row)">
            </el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" title="删除" @click="handleDelete(scope.row)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * @Description: 子系统列表
 * @Author: liuyang
 * @Date: 2019-06-27 13:43
 */
import { Vue, Component, Prop } from "vue-property-decorator";
import Http from "@/utils/Http";
import Url from "@/api/url";

@Component({})
export default class SubsystemList extends Vue {
  loading: boolean = false;
  tableData: Array<any> = [];

  created() {
    this.getTableData();
  }

  // 获取表格数据
  async getTableData() {
    this.loading = true;
    try {
      let {
        data: { data, status, message }
      } = await Http.get(Url.auth.getSubsystemList);
      if (status) {
        this.tableData = data || [];
      } else {
        this.$message.error(message);
      }
    } finally {
      this.loading = false;
    }
  }

  // 添加
  handleAdd() {
    this.$emit("hidden");
  }

  // 修改
  handleEdit(item: any) {
    this.$emit("hidden", item);
  }

  // 删除
  handleDelete(item: any) {
    this.$confirm("确认删除?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });
  }
}
</script>

<style scoped lang="less">
.header {
  display: flex;
  justify-content: flex-end;
}
</style>
