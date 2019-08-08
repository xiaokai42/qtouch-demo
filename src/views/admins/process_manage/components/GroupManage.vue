<template>
  <div class="my-main">
    <div class="header">
      <div class="left"></div>
      <div class="left">
        <el-button size="small" type="primary" @click="handleAdd">添加</el-button>
        <el-button size="small" @click="handleBack">返回</el-button>
      </div>
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
        <el-table-column align="center" prop="id" label="序号" type="index" min-width="60"></el-table-column>
        <el-table-column align="center" prop="id" label="流程分类ID" show-overflow-tooltip></el-table-column>
        <el-table-column
          align="center"
          prop="procdefTypeName"
          label="流程分类名称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          prop="updateTime"
          label="修改日期"
          :formatter="row => $moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss')"
          show-overflow-tooltip
        ></el-table-column>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialog" width="420px">
      <div v-loading="dialogLoading">
        <el-form ref="form" :model="form" :rules="formRules" label-width="120px" style="width: 100%;" size="small">
          <el-form-item label="流程分类名称：" prop="procdefTypeName">
            <el-input v-model.trim="form.procdefTypeName" placeholder="请输入流程分类名称"></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-btn">
          <el-button size="small" @click="dialog = false">返回</el-button>
          <el-button size="small" type="primary" @click="handleSureSave">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
/**
 * @Author: liuyang
 * @Date: 2019-07-03 15:49
 */
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import Http from "@/utils/Http";
import Url from "@/api/url";

@Component({})
export default class GroupManage extends Vue {
  loading: boolean = false;
  tableData: Array<any> = [];
  dialog: boolean = false;
  dialogLoading: boolean = false;
  dialogTitle: string = "";
  form: any = {};
  formRules: any = {
    procdefTypeName: {
      required: true,
      message: "该选项为必填项",
      trigger: "change"
    }
  };
  created(): void {
    this.getTableData();
  }

  async getTableData() {
    this.loading = true;
    try {
      let {
        data: { data, status, message }
      } = await Http.get(Url.admin.getAllProcessType);
      if (status) {
        this.tableData = data;
      } else {
        this.$message.error(message);
      }
    } finally {
      this.loading = false;
    }
  }

  handleAdd() {
    this.dialog = true;
    this.dialogTitle = "添加流程分类";
    this.form = {};
    this.$nextTick(() => {
      let form: any = this.$refs.form;
      form.clearValidate();
    });
  }

  handleEdit(item: any) {
    this.dialog = true;
    this.dialogTitle = "修改流程分类";
    this.form = JSON.parse(JSON.stringify(item));
    this.$nextTick(() => {
      let form: any = this.$refs.form;
      form.clearValidate();
    });
  }

  handleSureSave() {
    let form: any = this.$refs.form;
    form.validate((flag: boolean) => {
      if (flag) {
        this.saveProcessType();
      }
    });
  }

  async saveProcessType() {
    this.dialogLoading = true;
    try {
      let {
        data: { data, status, message }
      } = await Http.post(Url.admin.addProcessType, this.form);
      if (status) {
        this.$message.success(this.form.id ? "修改成功" : "添加成功");
        this.getTableData();
        this.dialog = false;
      } else {
        this.$message.error(message);
      }
    } finally {
      this.dialogLoading = false;
    }
  }

  handleBack() {
    this.$emit("hidden");
  }

  handleDelete(item: any) {
    this.$confirm("将要删除流程分类：" + item.procdefTypeName + "，是否继续？", "确认", {
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    }).then(() => {
      this.deleteItem(item);
    });
  }

  async deleteItem(item: any) {
    let {
      data: { data, status, message }
    } = await Http.get(Url.admin.deleteProcessType + item.id);
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
.my-main {
  min-height: calc(100vh - 130px);
  background: #fff;
  padding: 20px;
}
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
.dialog-btn {
  display: flex;
  justify-content: flex-end;
}
</style>
