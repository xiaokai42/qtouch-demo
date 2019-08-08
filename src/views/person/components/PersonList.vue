<!--
  author: zhengdandan
  date: 2019-05-23
  组件说明:
-->
<template>
  <div class="container">
    <div class="main" v-loading="loading">
      <div class="content">
        <el-row :gutter="10" class="filter" style="padding: 0 0 20px 0">
          <el-col :span="5">
            <el-cascader
              :options="orgOptions"
              v-model="filterOrgId"
              filterable
              :props="typeDetailProps"
              style="width: 100%"
            ></el-cascader>
          </el-col>
          <el-col :span="5">
            <el-input size="small" @clear="getList" v-model="pagination.query.name" placeholder="姓名" clearable>
              <el-button @click="getList" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="14">
            <div class="button-group">
              <el-button size="small" @click="switchToDetails('add')">添加 </el-button>
            </div>
          </el-col>
        </el-row>
        <el-table
          ref="multipleTable"
          @selection-change="getAllSelected"
          :data="tableData"
          stripe
          :header-row-style="{ height: '60px' }"
          height="calc(100vh - 220px)"
          size="mini"
          tooltip-effect="dark"
          style="width: 100%; text-align: center"
        >
          <el-table-column align="center" type="selection" min-width="60"> </el-table-column>
          <el-table-column align="center" prop="id" label="序号" type="index" min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.$index + (pagination.current - 1) * pagination.size + 1 }} </span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="realName" label="姓名" min-width="" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="mobile" label="手机" min-width="" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="typeName" label="人员类型" min-width="" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="gender" label="性别" min-width="" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="birthDay" label="生日" min-width="" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="email" label="邮箱" min-width="" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="telPhone" label="电话" min-width="" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                title="编辑"
                @click="switchToDetails('edit', scope.row)"
              >
              </el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" title="删除" @click="handleDelete(scope.row)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @current-change="getList"
            :current-page.sync="pagination.current"
            small
            background
            :page-size="pagination.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="pagination.total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Emit, Watch } from "vue-property-decorator";
import Http from "@/utils/Http";
import Url from "@/api/url";
import Utils from "@/utils/utils";

@Component({})
export default class PersonList extends Vue {
  // 表格信息
  tableData: any = [];
  loading: any = false;
  // 分页信息
  pagination: any = {
    current: 1,
    size: 15,
    total: 0,
    query: {
      name: "",
      typeId: "",
      organizationId: "",
      mobile: "",
      tel: ""
    }
  };
  // 复选框选中行数据
  multipleSelection: Array<any> = [];
  // 组织机构数据
  orgOptions: any = [];
  //筛选组织
  filterOrgId: any = "";
  // 通用适配prop
  typeDetailProps: any = {
    label: "name",
    value: "id",
    checkStrictly: true
  };

  created() {
    this.getList(); //获取表格
    this.getOrgInfo(); //获取组织机构，查询条件
  }
  // 切换到详情页面（添加和编辑）
  @Emit("switch")
  switchToDetails() {}
  @Watch("filterOrgId")
  WatchFilterOrg(newParam: any, oldParam: any) {
    this.pagination.query.organizationId = Utils.lastOfArr(this.filterOrgId);
  }
  // 获取组织机构
  getOrgInfo() {
    Http.get(Url.organizaition.getOrgTreeData).then((res: any) => {
      if (res.status) {
        if (res.data.status) {
          this.orgOptions = res.data.data;
          Utils.removeEmptyChildren(this.orgOptions);
        }
      }
    });
  }
  // 根据关键字，每页查询数量，当前页获得所有列表
  getList() {
    this.loading = true;
    Http.post(Url.person.getPaging, this.pagination).then((res: any) => {
      this.loading = false;
      if (res.status) {
        if (res.data.status) {
          this.tableData = res.data.data.records;
          this.pagination.total = res.data.data.total;
        }
      }
    });
  }
  // 删除部件信息
  deletePersons(ids: any) {
    let _this = this;
    if (ids.length !== 0) {
      _this
        .$confirm("确认删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          Http.post(Url.person.multipleDelete, ids).then((response: any) => {
            if (response.data.status) {
              _this.$message.success(response.data.message);
              _this.getList();
            } else {
              _this.$message.error(response.data.message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消操作"
          });
        });
    } else {
      _this.$message.warning("请选择要删除的数据！");
    }
  }
  // 单个删除
  handleDelete(row: any) {
    let ids: any = [];
    ids.push(row.id);
    this.deletePersons(ids);
  }
  // 批量删除
  multipleDelete() {
    let ids: any = [];
    this.multipleSelection.forEach(item => {
      ids.push(item.id);
    });
    this.deletePersons(ids);
  }
  // 获得所有复选框选中数据
  getAllSelected(val: Array<any>) {
    this.multipleSelection = val;
  }
}
</script>
<style lang="less" scoped>
@import "~assets/style/modelList.less";

/deep/ .filter .el-cascader,
/deep/ .filter .el-cascader .el-input__inner,
/deep/ .filter .el-cascader .el-cascader__label,
/deep/ .filter .el-cascader .el-input__suffix,
/deep/ .filter .el-cascader .el-input--suffix {
  height: 32px;
  line-height: 32px;
}
</style>
