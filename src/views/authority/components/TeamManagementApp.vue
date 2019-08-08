<template>
  <div class="sub-container">
    <div class="header">
      <el-input v-model="name" class="input" size="small" placeholder="名称"></el-input>
      <el-button size="small" @click="getTableData">查询</el-button>
    </div>
    <div v-loading="loading">
      <el-table
        ref="multipleTable"
        @select="handleSelectTable"
        @select-all="handleSelectAllTable"
        :data="tableData"
        stripe
        :header-row-style="{ height: '60px' }"
        height="calc(100vh - 290px)"
        size="mini"
        tooltip-effect="dark"
        style="width: 100%; text-align: center"
      >
        <el-table-column align="center" type="selection" min-width="60" />
        <el-table-column
          align="center"
          prop="id"
          label="序号"
          type="index"
          min-width="60"
          :index="$index => (pagination.current - 1) * pagination.size + $index + 1"
        ></el-table-column>
        <el-table-column align="center" prop="name" label="名称" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="remark" label="描述" show-overflow-tooltip></el-table-column>
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
    <div class="btn">
      <el-button size="small" @click="handleBack">返回</el-button>
      <el-button type="primary" size="small" @click="handleSave">{{ data ? "保存" : "添加" }} </el-button>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * @Description: 团队管理app表单
 * @Author: liuyang
 * @Date: 2019-07-01 10:07
 */
import { Vue, Component, Prop } from "vue-property-decorator";
import Http from "@/utils/Http";
import Url from "@/api/url";

@Component({})
export default class TeamManagementApp extends Vue {
  @Prop({ type: Object, required: true })
  data!: any;
  loading: boolean = false;
  tableData: Array<any> = [];
  allAppIdMap: any = {};
  name: string = "";
  pagination: any = {
    current: 1,
    size: 15
  };
  total: number = 0;

  async created() {
    await this.getAllAppList();
    this.getTableData();
  }

  async getTableData() {
    this.loading = true;
    try {
      let {
        data: { data, status, message }
      } = await Http.post(Url.auth.getAPPManagementList, {
        ...this.pagination,
        query: {
          name: this.name
        }
      });
      if (status) {
        this.tableData = data.records;
        this.total = data.total;
        this.$nextTick(() => {
          this.tableData
            .filter((d: any) => this.allAppIdMap[d.id])
            .forEach(row => {
              let multipleTable: any = this.$refs.multipleTable;
              multipleTable.toggleRowSelection(row, true);
            });
        });
      } else {
        this.$message.error(message);
      }
    } finally {
      this.loading = false;
    }
  }

  async getAllAppList() {
    let {
      data: { data, status, message }
    } = await Http.get(Url.auth.getAllAppList + this.data.id);
    if (status) {
      data.forEach((item: any) => {
        this.allAppIdMap[item.id] = true;
      });
    } else {
      this.$message.error(message);
    }
  }

  // 获得所有复选框选中数据
  handleSelectTable(arr: Array<any>, item: any) {
    if (arr.includes(item)) {
      this.allAppIdMap[item.id] = true;
    } else {
      delete this.allAppIdMap[item.id];
    }
  }

  handleSelectAllTable(arr: Array<any>) {
    if (arr.length) {
      this.tableData.forEach((item: any) => {
        this.allAppIdMap[item.id] = true;
      });
    } else {
      this.tableData.forEach((item: any) => {
        delete this.allAppIdMap[item.id];
      });
    }
  }

  async handleSave() {
    this.loading = true;
    try {
      let {
        data: { data, status, message }
      } = await Http.post(Url.auth.updateMobileApp + this.data.id, Object.keys(this.allAppIdMap));
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
.sub-container {
  position: relative;
  min-height: calc(100vh - 180px);
  padding-bottom: 62px !important;
}

.header {
  display: flex;

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

.btn {
  position: absolute;
  right: 20px;
  bottom: 12px;
}
</style>
