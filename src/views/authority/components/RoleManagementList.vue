<template>
  <div>
    <div class="header">
      <div class="left">
        <el-input v-model="name" class="input" size="small" placeholder="名称"></el-input>
        <el-input v-model="code" class="input" size="small" placeholder="编码"></el-input>
        <el-button size="small" @click="getTableData">查询</el-button>
      </div>
      <el-button size="small" @click="handleAdd">添加</el-button>
    </div>
    <div v-loading="loading">
      <el-table
        ref="multipleTable"
        :data="tableData"
        stripe
        :header-row-style="{ height: '60px' }"
        height="calc(100vh - 270px)"
        size="mini"
        tooltip-effect="dark"
        style="width: 100%; text-align: center"
      >
        <el-table-column
          align="center"
          prop="id"
          label="序号"
          type="index"
          min-width="60"
          :index="$index => (pagination.current - 1) * pagination.size + $index + 1"
        ></el-table-column>
        <el-table-column align="center" prop="name" label="角色名称" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="code" label="编码" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="roleType" label="角色类型" :formatter="row => ({TENANT_SUPER_ADMIN: '超级管理员', NORMAL: '自定义角色'}[row.roleType])" show-overflow-tooltip></el-table-column>
        <el-table-column
          align="center"
          prop="defaultRole"
          label="默认角色"
          :formatter="row => (row.defaultRole ? '是' : '否')"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" prop="remark" label="描述" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" title="编辑" @click="handleEditRole(scope.row)">
              编辑
            </el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" title="删除" @click="handleDelete(scope.row)">
              删除
            </el-button>
            <el-button size="mini" type="text" icon="el-icon-edit" title="权限" @click="handleEditNav(scope.row)">
              权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @current-change="getTableData"
        :current-page.sync="pagination.current"
        small
        background
        :page-size="pagination.size"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * @Description: 角色管理列表
 * @Author: liuyang
 * @Date: 2019-06-27 14:34
 */
import { Vue, Component, Prop } from "vue-property-decorator";
import Http from "@/utils/Http";
import Url from "@/api/url";

@Component({})
export default class RoleManagementList extends Vue {
  loading: boolean = false;
  tableData: Array<any> = [];
  name: string = "";
  code: string = "";
  pagination: any = {
    current: 1,
    size: 15
  };
  total: number = 0;

  created(): void {
    this.getTableData();
  }

  async getTableData() {
    this.loading = true;
    try {
      let {
        data: { data, status, message }
      } = await Http.post(Url.auth.getRoleList, {
        ...this.pagination,
        query: {
          name: this.name,
          code: this.code
        }
      });
      if (status) {
        this.tableData = data.records;
        this.total = data.total;
      } else {
        this.$message.error(message);
      }
    } finally {
      this.loading = false;
    }
  }

  // 添加角色
  handleAdd() {
    this.$emit("showRole");
  }

  // 修改角色
  handleEditRole(item: any) {
    this.$emit("showRole", item);
  }

  // 删除角色
  handleDelete(item: any) {
    Http.get(Url.auth.deleteRole+"/"+item.id).then((res: any) => {
      if (res.data.status) {
        this.$message.success("删除成功");
        this.getTableData();
      }
    });
  }

  handleEditNav(item: any) {
    this.$emit("showNav", item);
  }
}
</script>

<style scoped lang="less">
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .left {
    display: flex;
  }

  .input {
    margin-right: 20px;
  }
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
