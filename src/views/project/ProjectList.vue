<template>
  <el-card class="my-container">
    <div class="box-header">
      <el-checkbox-group v-model="types" size="small" @change="changeType">
        <el-checkbox-button label="建筑工程"></el-checkbox-button>
        <el-checkbox-button label="装修工程"></el-checkbox-button>
        <el-checkbox-button label="市政工程"></el-checkbox-button>
        <el-checkbox-button label="其他工程"></el-checkbox-button>
      </el-checkbox-group>
      <el-date-picker v-model="date" align="right" type="daterange" unlink-panels range-separator="-"
        value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" size="small">
      </el-date-picker>
      <el-cascader v-model="pagination.query.city" :options="regions" :show-all-levels="false" size="small"
        :props="{ expandTrigger: 'hover', emitPath: false }" placeholder="区县" clearable filterable></el-cascader>
      <el-button size="small" icon="el-icon-search" @click="getTableList">查询</el-button>
    </div>
    <el-table :data="tableData" height="calc(100vh - 300px)" v-loading="loading"
      size="mini" stripe style="width: 100%; text-align: center">
      <el-table-column align="center" prop="id" label="序号" type="index" width="60">
        <template slot-scope="scope">
          <span>{{ scope.$index + (pagination.current - 1) * pagination.size + 1 }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="projectName" label="项目名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="developmentOrganization" label="建设单位" show-overflow-tooltip></el-table-column>
      <el-table-column prop="architect" label="设计单位" show-overflow-tooltip></el-table-column>
      <el-table-column prop="projectType" label="项目类型" width="90"></el-table-column>
      <el-table-column prop="area" label="区域" width="120"></el-table-column>
      <el-table-column prop="city" label="区县" width="100"></el-table-column>
      <el-table-column prop="status" label="办理状态" width="90"></el-table-column>
      <el-table-column prop="receiveTime" label="受理时间" width="90"></el-table-column>
      <el-table-column prop="finishTime" label="审批时间" width="90"></el-table-column>
      <el-table-column align="center" label="操作" width="80">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-document"
            title="详情" @click="switchToDetails(scope.row)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-nav">
      <el-pagination :current-page.sync="pagination.current" :page-size="pagination.pageSize" :total="pagination.total"
        small background layout="total, prev, pager, next, jumper" @current-change="getTableList">
      </el-pagination>
    </div>

    <el-dialog title="项目详情" :visible.sync="dialog.visible" v-dialogDrag width="30%">
      <el-form :model="dialog.form" label-width="100px" size="mini">
      	<el-form-item label="项目类型">{{ dialog.form.projectType }}</el-form-item>
      	<el-form-item label="项目名称">{{ dialog.form.projectName }}</el-form-item>
      	<el-form-item label="建设单位">{{ dialog.form.developmentOrganization }}</el-form-item>
      	<el-form-item label="设计单位">{{ dialog.form.architect }}</el-form-item>
      	<el-form-item label="项目地址">{{ dialog.form.projectAddress }}</el-form-item>
        <el-form-item label="审查编号">{{ dialog.form.reviewNumbers }}</el-form-item>
        <el-form-item label="审查机构">{{ dialog.form.figureWhoseInstitutions }}</el-form-item>
        <el-form-item label="建筑总面积" v-show="dialog.typeShow1">{{ dialog.form.overallFloorage }} 万㎡</el-form-item>
        <el-form-item label="概算总投资" v-show="dialog.typeShow3">{{ dialog.form.totalMoney }} 万元</el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import cityJson from "@/assets/json/city.json";
import Http from "@/utils/Http";
import Utils from "@/utils/utils";
import Url from "@/api/url";

@Component({
  components: {},
  mounted () {
    this.getTableList();
    this.regions = cityJson;
  }
})

export default class ProjectList extends Vue {
  loading: Boolean = false;
  tableData: any = [];
  // el-date-picker时间段选择控件返回值-[beginingTime, endingTime]
  date: any[] = [];
  // 初始化合并表格行-用于存放每一行记录的合并数
  spanArr: any[] = [];
  // el-cascader控件初始化数据
  regions: any[] = [];
  types: any[] = [];
  // 分页信息
  pagination: any = {
    current: 1,
    size: 10,
    total: 0,
    query: {
      city: '',
      beginTime: '',
      endTime: '',
      projectType: ''
    }
  };
  dialog: any = {
    // 弹窗显隐
    visible: false,
    // 控制工程类型字段显隐
    typeShow1: false,
    typeShow3: false,
    form: {
      projectType: '',
      projectName: '',
      developmentOrganization: '',
      architect: '',
      projectAddress: '',
      overallFloorage: '',
      decorateArea: '',
      decorationInvestment: '',
      totalMoney: '',
      figureWhoseInstitutions: '',
      reviewNumbers: ''
    }
  };

  getTableList() {
    this.loading = true;
    if (this.types && this.types.length > 0) {
      this.pagination.query.projectType = this.types.join(",");
    } else {
      this.pagination.query.projectType = '';
    }
    if (this.date && this.date.length > 0) {
      this.pagination.query.beginTime = this.date[0];
      this.pagination.query.endTime = this.date[1];
    } else {
      this.pagination.query.beginTime = '';
      this.pagination.query.endTime = '';
    }
    let projectCode = this.$route.params.projectCode;
    let projectSubCode = this.$route.params.projectSubCode;
    if (projectCode && projectSubCode) {
      this.pagination.query.projectCode = projectCode;
      this.pagination.query.projectSubCode = projectSubCode;
    }
    Http.post("api/project/info", this.pagination).then((res: any) => {
      this.loading = false;
      if (res.status) {
        if (res.data.status) {
          this.tableData = res.data.data.records;
          this.pagination.total = res.data.data.total;
        }
      }
    });
  }

  changeType() {
    this.getTableList();
  }

  switchToDetails(row) {
    if (row.projectType == "市政工程") {
      this.dialog.typeShow1 = false;
      this.dialog.typeShow3 = true;
    } else {
      this.dialog.typeShow1 = true;
      this.dialog.typeShow3 = false;
    }
    Http.get("api/project/detail?id=" + row.id).then((res: any) => {
      this.dialog.visible = true;
      Utils.mapValue(this.dialog.form, res.data.data);
    });
  }
}
</script>

<style scoped lang="less">
.my-container {
  margin: 20px;
  height: calc(100vh - 130px);
  .box-header {
    display: flex;
    flex-wrap: wrap;
    .el-date-editor,.el-cascader,
    .el-checkbox-group,.el-button {
      margin-right: 20px;
      margin-bottom: 20px;
    }
  }
  .page-nav {
    display: flex;
    margin-top: 12px;
    justify-content: flex-end;
  }
}
.el-table::before {
  height: 0;
}
.el-checkbox-group,.el-date-editor {
  min-width: 240px;
}
</style>
