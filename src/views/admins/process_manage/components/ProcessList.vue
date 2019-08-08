<template>
  <div class="my-main">
    <div class="header">
      <div class="left">
        <el-input size="small" v-model="processName" placeholder="流程名称" style="width: 220px;"></el-input>
        <el-select
          placeholder="请选择"
          v-model="typeId"
          @change="getTableData"
          size="small"
          clearable
          style="width: 220px;margin-left: 20px;"
        >
          <el-option
            v-for="(item, index) in typeOptions"
            :key="index"
            :label="item.procdefTypeName"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button size="small" @click="getTableData" style="margin-left: 20px;">查询</el-button>
      </div>
      <div class="left">
        <el-button size="small" icon="el-icon-menu" @click="handleShowGroup">分类管理</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleNew">创建新流程 </el-button>
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
        <el-table-column align="center" prop="procdefName" label="流程名称" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="procdefKey" label="流程标识" show-overflow-tooltip></el-table-column>
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
 * @Description: 流程管理
 * @Author: liuyang
 * @Date: 2019-07-02 14:46
 */
import { Component, Vue, Emit } from "vue-property-decorator";
import Http from "@/utils/Http";
import Url from "@/api/url";

@Component({
  components: {}
})
export default class ProcessList extends Vue {
  processName: string = "";
  // 分页信息
  pagination: any = {
    pageSize: 10,
    pageNum: 1
  };
  total: number = 0;
  typeOptions: Array<any> = [];
  typeId: string = "";

  tableData: Array<any> = [];
  loading: boolean = false;

  created() {
    this.getAllProcessType();
    this.getTableData();
  }

  handleShowGroup() {
    this.$emit("showGroup");
  }

  handleNew() {
    this.$emit("showNew");
  }

  handleEdit(item: any) {
    this.$emit("showNew", item);
  }
  async getAllProcessType() {
    this.loading = true;
    try {
      let {
        data: { data, status, message }
      } = await Http.get(Url.admin.getAllProcessType);
      if (status) {
        this.typeOptions = data;
      } else {
        this.$message.error(message);
      }
    } finally {
      this.loading = false;
    }
  }

  //根据关键字，每页查询数量，当前页获得所有链表
  async getTableData() {
    this.loading = true;
    try {
      let {
        data: { data, status, message }
      } = await Http.get(Url.admin.getPageProcess, {
        processName: this.processName,
        typeId: this.typeId,
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

  //切换到流程详情页面（添加和编辑）
  @Emit("switch")
  switchToProcessDetails() {}

  //根据ID删除流程
  handleDelete(row: any) {
    this.$confirm("是否删除流程相关数据？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(async () => {
      let {
        data: { data, status, message }
      } = await Http.delete(Url.admin.deleteProcdefInfo, {
        params: {
          id: row.id
        }
      });
      if (status) {
        this.$message.success("删除成功");
        this.getTableData();
      } else {
        this.$message.error(message);
      }
    });
  }
}
</script>

<style lang="less" scoped>
.my-main {
  min-height: calc(100vh - 130px);
  background: #fff;
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  background: #fff;
  .left {
    display: flex;
  }
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
