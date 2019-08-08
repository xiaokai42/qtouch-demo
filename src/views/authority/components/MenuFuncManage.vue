<template>
  <div>
    <div class="custom-attribute">
      <div class="custom-attribute-header">
        <div class="attribute-title">
          <icon class="el-icon-menu icon-blue"></icon>功能列表
          <span class="add" v-show="currentId" @click="handleAddFunc"><i class="el-icon-plus"></i>添加功能</span>
        </div>
      </div>
      <div class="custom-attribute-body">
        <el-table
          ref="multipleTable"
          :data="funcData"
          stripe
          :header-row-style="{ height: '60px' }"
          size="mini"
          tooltip-effect="dark"
          style="width: 100%; text-align: center"
        >
          <el-table-column align="center" label="序号" type="index" width="60"> </el-table-column>
          <el-table-column prop="name" label="功能名称"> </el-table-column>
          <el-table-column prop="code" label="编码"> </el-table-column>
          <el-table-column align="center" prop="mustInput" label="相关接口">
            <template slot-scope="scope">
              <el-popover placement="right" width="450" trigger="click">
                <el-table :data="scope.row.interfaces">
                  <el-table-column width="140" property="name" label="名称"></el-table-column>
                  <el-table-column width="180" property="uri" label="接口"></el-table-column>
                  <el-table-column width="100" property="subsystemCode" label="所属系统"></el-table-column>
                </el-table>
                <el-button type="text" slot="reference">详情</el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleInterAdd(scope.row)">关联接口</el-button>
              <el-button type="text" size="small" @click="handleDelFunc(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div class="block">
          <el-pagination
            @current-change="getCustomAttributeList"
            :current-page.sync="pagination.currentPage"
            small
            background
            :page-size="pagination.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="pagination.total"
          >
          </el-pagination>
        </div> -->
      </div>
    </div>
    <!-- 功能选择 -->
    <el-dialog title="添加功能" :visible.sync="addFuncDialog">
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
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="allFuncTableData"
          stripe
          border
          size="mini"
          tooltip-effect="dark"
          style="width: 100%; text-align: center"
        >
          <!-- <el-table-column
            type="selection"
            align="center"
            width="60"
          ></el-table-column> -->
          <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="code" label="编码"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleFuncChoose(scope.row, scope.$index)">添加</el-button>
            </template>
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
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addFuncDialog = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 接口选择 -->
    <el-dialog title="添加接口" :visible.sync="interAddDialog">
      <div v-loading="loading">
        <el-form :inline="true" size="small">
          <el-form-item>
            <el-input
              v-model="interForm.name"
              :maxlength="100"
              placeholder="名称"
              clearable
              @keyup.enter.native="interSearch"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="interForm.uri"
              :maxlength="200"
              placeholder="接口"
              clearable
              @keyup.enter.native="interSearch"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="interSearch">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="interTabeleData"
          stripe
          border
          size="mini"
          tooltip-effect="dark"
          style="width: 100%; text-align: center"
        >
          <!-- <el-table-column
            type="selection"
            align="center"
            width="60"
          ></el-table-column> -->
          <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="uri" label="接口"></el-table-column>
          <el-table-column prop="remark" label="备注" width="120"></el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleInterChoose(scope.row, scope.$index)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="div-page">
          <el-pagination
            @size-change="handleInterSizeChange"
            @current-change="handleInterCurrentChange"
            :current-page.sync="interPageNum"
            :page-size="interPageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, prev, pager, next"
            :total="interTotal"
          >
          </el-pagination>
        </div>
        <div class="inter-name">已选接口</div>
        <el-table
          :data="currentInterData"
          stripe
          border
          size="mini"
          tooltip-effect="dark"
          style="width: 100%; text-align: center"
        >
          <!-- <el-table-column
            type="selection"
            align="center"
            width="60"
          ></el-table-column> -->
          <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="uri" label="接口"></el-table-column>
          <el-table-column prop="remark" label="备注" width="120"></el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleInterDelete(scope.row, scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="interAddDialog = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
/**
 *
 * @author fqq
 */
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import { State, Getter, Action, Mutation } from "vuex-class";

import Http from "@/utils/Http";
import Url from "@/api/url";
@Component({
  components: {}
})
export default class MenuFuncManage extends Vue {
  @Prop({ type: [String, Number], default: "" })
  currentId!: string;

  @Prop({ type: Array, default: [] })
  funcData!: Array<any>;

  loading = false;
  // 添加功能
  addFuncDialog = false;
  tableForm = {
    name: "",
    code: ""
  };
  allFuncTableData: Array<any> = [];
  total = 0;
  pageNum = 1;
  pageSize = 10;

  // 添加接口
  interForm = {
    name: "",
    uri: ""
  };
  interAddDialog = false;
  currentFuncId = "";
  interTabeleData: Array<any> = [];
  currentInterData: Array<any> = [];
  interPageNum = 1;
  interPageSize = 10;
  interTotal = 0;

  // 添加功能
  handleAddFunc() {
    this.tableForm = {
      name: "",
      code: ""
    };
    this.pageNum = 1;
    this.pageSize = 10;
    this.getFuncData();
    this.addFuncDialog = true;
  }
  search() {
    this.pageNum = 1;
    this.getFuncData();
  }
  // 获取功能数据
  getFuncData() {
    this.loading = true;
    Http.post(Url.auth.getFunctionList, {
      query: this.tableForm,
      current: this.pageNum,
      size: this.pageSize
    })
      .then((res: any) => {
        this.loading = false;
        if (res.data.status) {
          this.allFuncTableData = res.data.data.records;
          this.total = res.data.data.total;
          if (this.funcData.length) {
            let funcMap: Array<any> = [];
            this.funcData.forEach((li: any) => {
              funcMap[li.code] = true;
            });
            this.allFuncTableData = this.allFuncTableData.filter((li: any) => !funcMap[li.code]);
          }
        } else {
          this.$message.error(res.data.message);
        }
      })
      .catch(() => {
        this.loading = false;
      });
  }
  handleCurrentChange(val: number) {
    this.pageNum = val;
    this.getFuncData();
  }
  handleSizeChange(val: number) {
    this.pageSize = val;
    this.getFuncData();
  }
  // 添加功能
  handleFuncChoose(row: any, index: number) {
    Http.post(Url.auth.addMenuFunc, {
      navigationId: this.currentId,
      operationCode: row.code
    }).then((res: any) => {
      if (res.data.status) {
        this.$message.success("添加成功");
        this.allFuncTableData.splice(index, 1);
        this.total--;
        if (this.currentId) {
          this.$emit("update");
        }
      } else {
        this.$message.error(res.data.message);
      }
    });
  }
  // 删除功能
  handleDelFunc(row: any) {
    this.$confirm("确认删除该功能?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      Http.get(Url.auth.deleteMenuFunc + "/" + row.id).then((res: any) => {
        if (res.data.status) {
          this.$message.success("删除成功");
          if (this.currentId) {
            this.$emit("update");
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    });
  }
  // 添加接口
  handleInterAdd(row: any) {
    this.currentFuncId = row.code;
    this.currentInterData = row.interfaces;
    this.interForm = {
      name: "",
      uri: ""
    };
    this.interPageNum = 1;
    this.interPageSize = 10;
    this.getInterData();
    this.interAddDialog = true;
  }
  interSearch() {
    this.interPageNum = 1;
    this.getInterData();
  }
  // 获取接口数据
  getInterData() {
    this.loading = true;
    Http.post(Url.auth.getInterfaceList, {
      query: this.interForm,
      current: this.interPageNum,
      size: this.interPageSize
    })
      .then((res: any) => {
        this.loading = false;
        if (res.data.status) {
          this.interTabeleData = res.data.data.records;
          this.interTotal = res.data.data.total;
          // 数组去重，去掉已有的接口
          if (this.currentInterData.length) {
            // 哈希map
            let interMap: Array<any> = [];
            this.currentInterData.forEach((li: any) => {
              interMap[li.id] = true;
            });
            this.interTabeleData = this.interTabeleData.filter((li: any) => !interMap[li.id]);
          }
        } else {
          this.$message.error(res.data.message);
        }
      })
      .catch(() => {
        this.loading = false;
      });
  }
  handleInterCurrentChange(val: number) {
    this.interPageNum = val;
    this.getInterData();
  }
  handleInterSizeChange(val: number) {
    this.interPageSize = val;
    this.getInterData();
  }
  // 添加接口
  handleInterChoose(row: any, index: number) {
    Http.post(Url.auth.addMenuInter, {
      navigationId: this.currentId,
      operationCode: this.currentFuncId,
      interfaceId: row.id
    }).then((res: any) => {
      if (res.data.status) {
        this.$message.success("添加成功");
        this.currentInterData.push(row);
        this.interTabeleData.splice(index, 1);
        this.interTotal--;
        this.$emit("update");
      } else {
        this.$message.error(res.data.message);
      }
    });
  }
  // 删除接口
  handleInterDelete(row: any, index: number) {
    this.$confirm("确认删除该接口?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      Http.post(Url.auth.deleteMenuInter, {
        navigationId: this.currentId,
        operationCode: this.currentFuncId,
        interfaceId: row.id
      }).then((res: any) => {
        if (res.data.status) {
          this.$message.success("删除成功");
          this.interTabeleData.push(row);
          this.interTotal++;
          this.currentInterData.splice(index, 1);
          this.$emit("update");
        } else {
          this.$message.error(res.data.message);
        }
      });
    });
  }
}
</script>
<style lang="scss" scoped>
.custom-attribute {
  height: 80%;
  .custom-attribute-header {
    height: 40px;
    font-size: 16px;
  }
  .custom-attribute-body {
    height: 90%;
    .block {
      position: absolute;
      right: 20px;
      bottom: 10px;
    }
  }
}
.attribute-title .add {
  margin-left: 10px;
  padding: 0 10px;
  font-size: 14px;
  color: #409eff;
  cursor: pointer;
}
.div-page {
  display: flex;
  justify-content: flex-end;
}
</style>
