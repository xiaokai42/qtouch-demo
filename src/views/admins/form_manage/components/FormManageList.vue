<template>
  <div>
    <div class="header">
      <div class="left">
        <el-input v-model="formName" class="input" size="small" placeholder="表单名称" clearable></el-input>
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
        height="calc(100vh - 210px)"
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
          :index="$index => (pagination.pageNum - 1) * pagination.pageSize + $index + 1"
        ></el-table-column>
        <el-table-column align="center" prop="id" label="表单ID" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="formName" label="表单名称" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" title="编辑" @click="handleEdit(scope.row)">
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
        :current-page.sync="pagination.pageNum"
        small
        background
        :page-size="pagination.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * @Author: liuyang
 * @Date: 2019-07-03 9:28
 */
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import Http from "@/utils/Http";
import Url from "@/api/url";

@Component({})
export default class FormManageList extends Vue {
  loading: boolean = false;
  tableData: Array<any> = [];
  formName: string = "";
  pagination: any = {
    pageSize: 15,
    pageNum: 1
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
      } = await Http.get(Url.admin.getFormList, {
        formName: this.formName,
        ...this.pagination
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

  handleAdd() {
    this.$emit("showAdd");
  }

  handleEdit(item: any) {
    this.$emit("showAdd", item);
  }

  handleDelete(item: any) {
    this.$confirm("将要删除表单:" + item.formName + ",是否继续？", "确认", {
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    }).then(() => {
      this.deleteForm(item);
    });
  }

  async deleteForm(item: any) {
    let {
      data: { data, status, message }
    } = await Http.delete(Url.admin.deleteFormDefine, {
      params: {
        formId: item.id
      }
    });
    if (status) {
      this.$message.success("删除成功");
      this.getTableData();
    } else {
      this.$message.error(message);
    }
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
