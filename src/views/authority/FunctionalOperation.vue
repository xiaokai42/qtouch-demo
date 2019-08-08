<template>
  <div class="main-wrap">
    <div class="body-main" v-if="dataVisible">
      <div v-loading="loading">
        <el-form :inline="true" size="small">
          <el-form-item>
            <el-input
              v-model="tableForm.name"
              :maxlength="100"
              placeholder="名称"
              clearable
              @keyup.enter.native="search"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="tableForm.code"
              :maxlength="200"
              placeholder="编码"
              clearable
              @keyup.enter.native="search"
            ></el-input>
          </el-form-item>
          <el-button class="add-text" size="small" @click="handleAdd">添加</el-button>
        </el-form>
        <el-table
          :data="tableData"
          stripe
          :header-row-style="{ height: '60px' }"
          height="calc(100vh - 230px)"
          size="mini"
          tooltip-effect="dark"
          style="width: 100%; text-align: center"
        >
          <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="code" label="编码"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column label="操作" align="center">
            <div slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                title="编辑"
                @click="handleEdit(scope.row)"
              ></el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                title="删除"
                @click="handleDelete(scope.row.id)"
              ></el-button>
            </div>
          </el-table-column>
        </el-table>
        <div class="div-page">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pageNum"
            :page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, prev, pager, next"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 添加，编辑 -->
    <div class="dialog-body" v-else>
      <el-form :model="addForm" :rules="addRules" size="small" label-width="150px" ref="addForm" v-loading="addLoading">
        <el-form-item label="名称：" prop="name">
          <el-input v-model="addForm.name" :maxlength="100" clearable class="inpW"></el-input>
        </el-form-item>
        <el-form-item label="编码：" prop="code">
          <el-input v-model="addForm.code" :maxlength="200" clearable class="inpW"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input type="textarea" v-model="addForm.remark" :rows="3" :maxlength="1000" class="inpW"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button size="small" @click="dataVisible = true">取消</el-button>
        <el-button type="primary" size="small" @click="handleAddSubmit">{{ addForm.id ? "保存" : "添加" }}</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
/**
 *
 * @author
 */
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import { State, Getter, Action, Mutation } from "vuex-class";

import Http from "@/utils/Http";
import Url from "@/api/url";
import utils from "@/utils/utils";

@Component({
  components: {}
})
export default class InterfaceManagement extends Vue {
  tableForm = {
    name: "",
    code: ""
  };
  loading = false;
  tableData = [];
  total = 0;
  pageNum = 1;
  pageSize = 10;

  dataVisible = true;
  addLoading = false;
  addForm = {
    id: "",
    name: "",
    code: "",
    remark: ""
  };
  addRules = {
    name: { required: true, trigger: "blur", message: "请输入名称" },
    code: { required: true, trigger: "blur", message: "请输入编码" }
  };

  getTableData() {
    this.loading = true;
    Http.post(Url.auth.getFunctionList, {
      query: this.tableForm,
      current: this.pageNum,
      size: this.pageSize
    })
      .then((res: any) => {
        this.loading = false;
        if (res.data.status) {
          this.tableData = res.data.data.records;
          this.total = res.data.data.total;
        } else {
          this.$message.error(res.data.message);
        }
      })
      .catch(() => {
        this.loading = false;
      });
  }
  search() {
    this.pageNum = 1;
    this.getTableData();
  }

  handleCurrentChange(val: number) {
    this.pageNum = val;
    this.getTableData();
  }
  handleSizeChange(val: number) {
    this.pageSize = val;
    this.getTableData();
  }

  handleAdd() {
    this.addForm = {
      id: "",
      name: "",
      code: "",
      remark: ""
    };
    this.dataVisible = false;
  }
  handleEdit(row: any) {
    utils.mapValue(this.addForm, row);
    this.dataVisible = false;
  }
  handleAddSubmit() {
    let rest: any = this.$refs.addForm;
    rest.validate((valid: any) => {
      if (valid) {
        this.addLoading = true;
        let url = this.addForm.id ? Url.auth.editFunction : Url.auth.addFunction;
        Http.post(url, this.addForm)
          .then((res: any) => {
            this.addLoading = false;
            if (res.data.status) {
              this.$message.success(this.addForm.id ? "编辑成功" : "添加成功");
              this.search();
              this.dataVisible = true;
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch(() => {
            this.addLoading = false;
          });
      } else {
        return false;
      }
    });
  }
  handleDelete(id: number) {
    this.$confirm("确认删除？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        //
      })
      .catch(() => {});
  }

  created() {
    this.getTableData();
  }
}
</script>
<style lang="scss" scoped>
.main-wrap {
  padding: 20px;
  .body-main {
    width: 100%;
    .add-text {
      float: right;
    }
    .div-page {
      display: flex;
      justify-content: flex-end;
    }
  }
}
.dialog-body {
  position: relative;
  padding: 20px;
  min-height: calc(100vh - 150px);
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
  .inpW {
    width: 360px;
  }
  .dialog-footer {
    position: absolute;
    right: 20px;
    bottom: 12px;
  }
}
</style>
