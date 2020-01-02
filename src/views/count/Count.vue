<!--
 author: xiaokai
 descr: 消防设计审查统计
 -->
<template>
  <el-card class="my-container">
    <div class="header">
      <el-date-picker v-model="date" align="right" type="daterange" unlink-panels range-separator="-"
        value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" size="small">
      </el-date-picker>
      <el-cascader v-model="search.city" :options="regions" :show-all-levels="false" size="small"
      	:props="{ expandTrigger: 'hover', emitPath: false }" placeholder="区县" clearable filterable></el-cascader>
      <el-button size="small" icon="el-icon-search" @click="getTestMessages">查询</el-button>
      <el-button size="small" icon="el-icon-printer" @click="print">打印</el-button>
      <el-button size="small" icon="el-icon-notebook-2" @click="excel" :loading="doLoading">导出</el-button>
    </div>
    <el-table :data="tableData" stripe show-summary :summary-method="getSummaries"
        height="calc(100vh - 180px)" size="mini" tooltip-effect="dark" :span-method="cellMerge"
        v-loading="doLoading" style="width: 100%; text-align: center">
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column prop="area" width="100" label="片区"></el-table-column>
      <el-table-column prop="city" width="100" label="区县"></el-table-column>
      <el-table-column prop="projectCount" width="80" label="项目数量"></el-table-column>
      <el-table-column label="建筑工程">
      	<el-table-column prop="buildingCount" width="60" label="数量"></el-table-column>
      	<el-table-column prop="buildingArea" label="总建筑面积/万㎡">
          <template slot-scope="scope">
            <span>{{scope.row.buildingArea | rounding}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="装修工程">
      	<el-table-column prop="decorationCount" width="60" label="数量"></el-table-column>
      	<el-table-column prop="decorationArea" label="总建筑面积/万㎡">
          <template slot-scope="scope">
            <span>{{scope.row.decorationArea | rounding}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="市政工程">
      	<el-table-column prop="municipalCount" width="60" label="数量"></el-table-column>
      	<el-table-column prop="municipalCost" label="概算总投资/万元">
          <template slot-scope="scope">
            <span>{{scope.row.municipalCost | rounding}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="其他工程">
      	<el-table-column prop="otherCount" width="60" label="数量"></el-table-column>
      	<el-table-column prop="otherArea" label="总建筑面积/万㎡">
          <template slot-scope="scope">
            <span>{{scope.row.otherArea | rounding}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="消防设计审查数">
      	<el-table-column prop="acceptCount" width="90" label="受理/件"></el-table-column>
      	<el-table-column prop="acceptMeetCount" width="90" label="办结个数/件"></el-table-column>
      </el-table-column>
    </el-table>
    <!-- 打印格式 -->
    <section class="printTable" ref="print">
      <h1>{{ title }}</h1>
      <el-table :data="tableData" stripe show-summary :summary-method="getSummaries"
          size="mini" v-loading="doLoading" :span-method="cellMerge" style="width: 100%; text-align: center">
        <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
        <el-table-column prop="area" label="片区" width="120"></el-table-column>
        <el-table-column prop="city" label="区县" width="100"></el-table-column>
        <el-table-column prop="projectCount" label="项目数量" width="100"></el-table-column>
        <el-table-column label="建筑工程">
        	<el-table-column prop="buildingCount" label="数量" width="70"></el-table-column>
        	<el-table-column prop="buildingArea" label="总建筑面积/万㎡">
            <template slot-scope="scope">
              <span>{{scope.row.buildingArea | rounding}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="装修工程">
        	<el-table-column prop="decorationCount" label="数量" width="70"></el-table-column>
        	<el-table-column prop="decorationArea" label="装修面积/万㎡">
            <template slot-scope="scope">
              <span>{{scope.row.decorationArea | rounding}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="decorationCost" label="投资/万元">
            <template slot-scope="scope">
              <span>{{scope.row.decorationCost | rounding}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="市政工程">
        	<el-table-column prop="municipalCount" label="数量" width="70"></el-table-column>
        	<el-table-column prop="municipalCost" label="投资/万元">
            <template slot-scope="scope">
              <span>{{scope.row.municipalCost | rounding}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="消防设计审查数">
        	<el-table-column prop="acceptCount" label="受理/件" width="80"></el-table-column>
        	<el-table-column prop="acceptMeetCount" label="办结个数/件" width="110"></el-table-column>
        </el-table-column>
      </el-table>
    </section>
  </el-card>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import cityJson from "@/assets/json/city.json";
import Http from "@/utils/Http";
import store from "@/store";
import Url from "@/api/url";
import qs from "qs";

@Component({
  components: {},
  filters: {
    // filters过滤器:格式化表格行-数值保留两位小数
    rounding (value) {
      const num: number = Number(value);
      if (!isNaN(num)) {
        // 不四舍五入,保留两位小数
        return Math.floor(value * 100) / 100;
      }
    }
  },
  mounted() {
    this.getTestMessages();
    this.regions = cityJson;
  }
})

export default class Count extends Vue {
  // 表格数据-初始化对象值能保证el-table样式格式能正确渲染
  tableData: any[] = [{
    "area": "",
    "city": "",
    "projectCount": '',
    "buildingCount": '',
    "buildingArea": '',
    "decorationCount": '',
    "decorationArea": '',
    "municipalCount": '',
    "municipalCost": '',
    "acceptCount": '',
    "acceptMeetCount": ''
  }];
  // tableData: Array<any> = [];
  doLoading: Boolean = false;
  // el-date-picker时间段选择控件返回值-[beginingTime, endingTime]
  date: any[] = [];
  // 初始化合并表格行-用于存放每一行记录的合并数
  spanArr: any[] = [];
  // 初始化合并表格行-spanArr的索引
  pos: number = 0;
  title: string = '重庆市消防设计审查统计';
  // 查询参数
  search: any = {
    city: '',
    beginTime: '',
    endTime: ''
  };
  // el-cascader控件初始化数据
  regions: any[] = [];

  // 请求表格数据
  getTestMessages() {
    this.doLoading = true;
    if (this.date && this.date.length > 0) {
      this.search.beginTime = this.date[0];
      this.search.endTime = this.date[1];
    } else {
      this.search.beginTime = '';
      this.search.endTime = '';
    }
    Http.get("api/all/count", this.search).then((res: any) => {
      this.doLoading = false;
      /* if (res.data.success) {
        this.tableData = res.data.list;
      } */
      /* if (res.data.status) { cisdi@123456
        https://www.easy-mock.com/mock/5d00d4625a16a17c32bfc699/sys/count
        this.tableData = res.data.data.records; api/all/count
      }*/
      if (res.data.status) {
        this.tableData = res.data.data;
        // 计算表格行合并数
        this.getSpanArr(this.tableData);
      }
    });
  }

  // 合计行初始化
  getSummaries(param: any) {
    // columns-表格列数据对象;data-表格行数据对象
    const { columns, data } = param;
    const sums: any = [];
    // 循环表格列
    columns.forEach((column: any, index: any) => {
      // 排除非number表格列
      if (index === 0) {
        sums[index] = '合计';
        return;
      }
      if (index === 1 || index === 2) {
        sums[index] = '-';
        return;
      }
      // map()-按照原始数组元素顺序依次处理元素-array.map(function(currentValue))
      // 通过列与行定位唯一单元格
      const values: any = data.map(item => Number(item[column.property]));
      // every()-使用指定函数检测数组中的所有元素-array.every(function(currentValue))
      if (!values.every(value => isNaN(value))) {
        // reduce()-接收一个函数作为累加器,数组中的每个值（从左到右）最终计算为一个值
        // array.reduce(function(total, currentValue), initValue)
        sums[index] = values.reduce((prev: number, curr: number) => {
          const value: any = Number(curr);
          if (!isNaN(value)) {
            // 不做四舍五入,保存两位小数
            return Math.floor((prev + curr) * 100) / 100;
          } else {
            return Math.floor(prev * 100) / 100;
          }
        }, 0);
        //sums[index] += ' 元';
      } else {
        sums[index] = '-';
      }
    });
    return sums;
  }

  // el-table控件挂载合并行方法
  cellMerge({ row, column, rowIndex, columnIndex }) {
    if (columnIndex === 1) {
      const _row = this.spanArr[rowIndex];
      const _col = _row > 0 ? 1 : 0;
      return {
        rowspan: _row,
        colspan: _col
      }
    }
  }

  // 计算表格行合并数
  getSpanArr(data: any[]) {　
    // 初始化表格行合并数
    this.spanArr = [];
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        this.spanArr.push(1);
        this.pos = 0
      } else {
        // 判断当前元素与上一个元素是否相同
        if (data[i].area === data[i - 1].area) {
          this.spanArr[this.pos] += 1;
          this.spanArr.push(0);
        } else {
          this.spanArr.push(1);
          this.pos = i;
        }
      }
    }
  }

  print() {
    this["$print"](this.$refs.print);
  }

  excel() {
    this.doLoading = true;
    this.$axios({
      method: "get",
      url: "api/excel/download",
      responseType: "blob",
      params: this.search,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        accessToken: "Bearer " + store.getters[`getToken`],
        "Content-Type": "multipart/form-data"
      }
    }).then((res: any) => {
      this.doLoading = false;
      if (res.status) {
         if (navigator.msSaveBlob) {
          return navigator.msSaveBlob(new Blob([res.data]), '消防设计审查统计.xlsx');// IE
        } else {
          let blob = new Blob([res.data], {type: 'application/octet-stream;charset=UTF-8'})
          let downloadElement = document.createElement('a');
          let href = window.URL.createObjectURL(blob);
          downloadElement.href = href;
          downloadElement.download = '消防设计审查统计.xlsx';
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement);
          window.URL.revokeObjectURL(href);
        }
      }
    });
  }
}
</script>

<style scoped lang="less">
.my-container {
  margin: 20px;
  overflow: hidden;
  background: #fff;
  height: calc(100vh - 90px);
  .printTable {
    margin-top: 30px;
  }
}

.header {
  display: flex;
  flex-wrap: wrap;
  .el-date-editor,.el-cascader {
    margin-right: 20px;
    margin-bottom: 20px;
  }
  .el-button {
    margin-bottom: 20px;
  }
}
.printTable {
  text-align: center;
  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }
}
.el-date-editor {
  min-width: 240px;
}
</style>
