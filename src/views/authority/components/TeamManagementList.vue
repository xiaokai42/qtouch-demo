<template>
  <div class="component">
    <div class="header">
      <div class="left">
        <el-input v-model="name" class="input" size="small" placeholder="名称"></el-input>
        <el-select v-model="tenantType" class="input" size="small" placeholder="全部">
          <el-option v-for="(item, index) in tenantTypeMap" :value="index" :label="item" :key="index"> </el-option>
        </el-select>
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
        height="calc(100vh - 250px)"
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
        <el-table-column align="center" prop="name" label="名称" show-overflow-tooltip></el-table-column>
        <el-table-column
          align="center"
          prop="tenantType"
          label="团队类型"
          :formatter="row => tenantTypeMap[row.tenantType]"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" label="权限信息" width="340">
          <template slot-scope="scope">
            <el-button size="mini" title="菜单" @click="handleEditNav(scope.row)">
              菜单
            </el-button>
            <el-button style="margin-right: 10px;" size="mini" title="app" @click="handleEditApp(scope.row)">
              app
            </el-button>
            <el-button style="margin-right: 10px;" size="mini" title="基础属性" @click="handleEditBaseType(scope.row)">
              基础属性
            </el-button>
            <el-popover placement="top" width="300" trigger="hover" @show="() => handleShowAdmin(scope.row)">
              <el-table :data="scope.row.adminData">
                <el-table-column property="username" label="登录名"></el-table-column>
                <el-table-column property="realName" label="默认名称"></el-table-column>
              </el-table>
              <el-button size="mini" slot="reference">管理员</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" title="编辑" @click="handleEditRole(scope.row)">
              编辑
            </el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" title="删除" @click="handleDelete(scope.row)">
              删除
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
 * @Description: 团队管理列表
 * @Author: liuyang
 * @Date: 2019-06-28 10:16
 */
import { Vue, Component, Prop } from "vue-property-decorator";
import Http from "@/utils/Http";
import Url from "@/api/url";

@Component({})
export default class TeamManagementList extends Vue {
  tenantTypeMap: any = {
    SYSTEM: "系统团队",
    INTENANT: "用户团队"
  };
  loading: boolean = false;
  tableData: Array<any> = [];
  name: string = "";
  tenantType: string = "";
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
      } = await Http.post(Url.auth.getTenantList, {
        ...this.pagination,
        query: {
          name: this.name,
          code: this.tenantType
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

  async handleShowAdmin(item: any) {
    if (item.adminData) return;
    let {
      data: { data, status, message }
    } = await Http.get(Url.auth.getAdminByTenant + item.id);
    if (status) {
      this.$set(item, "adminData", data);
      this.$set(item, "userName", data.map((d: any) => d.username).join(","));
    } else {
      this.$message.error(message);
    }
  }

  // 新增团队
  handleAdd() {
    this.$emit("showTeam");
  }

  // 修改团队
  async handleEditRole(item: any) {
    this.handleShowAdmin(item);
    this.$emit("showTeam", item);
  }

  // 菜单
  handleEditNav(item: any) {
    this.$emit("showNav", item);
  }

  // App
  handleEditApp(item: any) {
    this.$emit("showApp", item);
  }

  // baseType
  handleEditBaseType(item: any) {
    this.$emit("showBaseType", item);
  }
}
</script>

<style scoped lang="less">
.header {
  display: flex;
  justify-content: space-between;

  .left {
    display: flex;
  }

  .input {
    width: 220px;
    margin-right: 20px;
  }
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
