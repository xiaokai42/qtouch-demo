<!--
  author: zhengdandan
  date: 2019-05-11
  组件说明: 基础属性类型管理
-->
<template>
  <div class="container">
    <!--内容主体-->
    <div class="main">
      <!--基础属性类型列表-->
      <el-card class="submenu">
        <el-row class="submain-title">基础属性类型</el-row>
        <el-row class="type-list">
          <div v-for="(type, index) in typeList" :key="index">
            <el-input
              class="list-item"
              :class="{ 'type-active': selectIdx == index }"
              readonly="readonly"
              v-model="type.baseTypeName"
              v-bind:pidx="index"
              :key="type.id"
              :sort="type.sort"
              :id="type.id"
              @click.native="baseTypeClick(type, index)"
            >
            </el-input>
          </div>
        </el-row>
        <el-row class="tool-bar">
          <el-button type="text" icon="el-icon-plus" title="添加" @click="addBaseType"> </el-button>
          <el-button type="text" icon="el-icon-edit" title="编辑" @click="editBaseType"> </el-button>
          <el-button type="text" icon="el-icon-delete" title="删除" @click="deleteBaseType()"> </el-button>
        </el-row>
      </el-card>
      <!--自定义属性-->
      <el-card class="submain">
        <el-row class="submain-title">
          <span v-text="baseTypeSelect.baseTypeName"></span>
        </el-row>
        <el-row class="attrs-list">
          <el-col :span="4">
            <el-input placeholder="数据项名称" v-model="searchDTO.query.name" size="small" clearable></el-input>
          </el-col>
          <el-col :span="4" :offset="1">
            <el-select placeholder="数据项类型" v-model="searchDTO.query.attrType" size="small">
              <el-option v-for="item in itemOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4" :offset="1">
            <el-button @click="getAttrsList" icon="el-icon-search" size="small"></el-button>
          </el-col>
          <el-col :span="1" :offset="9">
            <div class="button-group">
              <el-button @click="attrAdd" size="mini">添加</el-button>
            </div>
          </el-col>
        </el-row>
        <el-table
          :data="tableList"
          ref="multipleTable"
          stripe
          size="mini"
          tooltip-effect="dark"
          style="width: 100% ; text-align: center"
        >
          <el-table-column align="center" prop="id" type="index" label="序号" width="80">
            <template slot-scope="scope">
              <span>{{ scope.$index + (searchDTO.current - 1) * searchDTO.size + 1 }} </span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="code" label="编码" width="140"> </el-table-column>
          <el-table-column align="center" prop="attrName" label="数据项名称"> </el-table-column>
          <el-table-column align="center" :formatter="formatterAttrType" label="数据项类型"> </el-table-column>
          <el-table-column v-if="false" align="center" prop="baseTypeName" label="所属类型id"> </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" title="编辑" @click="attrEdit(scope.row)">
              </el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" title="删除" @click="deleteAttr(scope.row.id)">
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-sort-up"
                title="上移"
                @click="upAttrSort(scope.row, scope.$index)"
              >
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-sort-down"
                title="下移"
                @click="downAttrSort(scope.row, scope.$index)"
              >
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-block">
          <el-pagination
            small
            background
            @current-change="getAttrsList"
            :current-page.sync="searchDTO.current"
            :page-size="searchDTO.size"
            layout="total, prev, pager, next, jumper"
            :total="searchDTO.total"
          >
          </el-pagination>
        </div>
      </el-card>
    </div>
    <!--基础属性类型编辑框-->
    <el-dialog title="编辑基础属性类型" :visible.sync="typeDialogFormVisible" width="30%" @close="closeTypeDialog">
      <el-form v-model="baseTypeSelect" label-width="100px" size="small">
        <el-form-item label="编码：">
          <el-input v-model="baseTypeEdit.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型名称：">
          <el-input v-model="baseTypeEdit.baseTypeName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeTypeDialog" size="mini">取 消</el-button>
        <el-button type="primary" @click="saveBaseType" size="mini">保 存 </el-button>
      </div>
    </el-dialog>
    <!--编辑自定义属性弹窗-->
    <el-dialog :title="dialogTitle" :visible.sync="attrEditDialogFormVisible" width="30%" @close="closeDialog">
      <el-form v-model="attrCur" label-width="100px" size="small">
        <el-form-item label="编码：">
          <el-input v-model="attrCur.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据项名称：">
          <el-input v-model="attrCur.attrName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据项类型：">
          <el-select v-model="attrCur.attrType" placeholder="请选择字段类型">
            <el-option
              v-for="item in itemOptions"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选项设置：" v-if="attrCur.attrType">
          <div v-if="attrCur.attrType === 'select' || attrCur.attrType === 'multiSelect'">
            <el-row v-for="(optionsItem, index) in attrCur.dataRange.options" :key="index" style="margin-bottom: 6px">
              <el-col :span="15">
                <el-input size="small" v-model="optionsItem.content"></el-input>
              </el-col>
              <el-col :span="6">
                <el-checkbox v-model="optionsItem.defaultChosen" style="margin-left: 20px">默认选中 </el-checkbox>
              </el-col>
              <el-col :span="3">
                <el-button
                  size="mini"
                  icon="el-icon-close"
                  circle
                  style="margin-left: 20px"
                  @click.prevent="removeOptionItem(optionsItem)"
                ></el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-button style="float: left" type="text" icon="el-icon-plus" @click="addOptionItem">
                添加选项
              </el-button>
            </el-row>
          </div>
          <div v-if="attrCur.attrType === 'number'">
            <el-row>
              <el-input-number
                :precision="2"
                placeholder="最小值"
                v-model="attrCur.dataRange.NumMin"
                :max="attrCur.dataRange.NumMax"
              ></el-input-number>
              <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
              <el-input-number
                :precision="2"
                placeholder="最大值"
                v-model="attrCur.dataRange.NumMax"
                :min="attrCur.dataRange.NumMin"
              ></el-input-number>
            </el-row>
          </div>
          <div v-if="attrCur.attrType === 'image'">
            <el-row>
              <el-input-number
                :precision="0"
                v-model="attrCur.dataRange.imgMaxNum"
                placeholder="最大张数"
              ></el-input-number>
            </el-row>
          </div>
          <div v-if="attrCur.attrType === 'text'">
            <el-row>
              <el-input size="small" placeholder="预设文本" v-model="attrCur.dataRange.presetText"></el-input>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item label="数值单位：" v-if="attrCur.attrType === 'number'">
          <el-input v-model="attrCur.dataRange.unit"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="mini">取 消</el-button>
        <el-button type="primary" @click="saveAttr()" size="mini">保 存 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Http from "@/utils/Http";
import Url from "@/api/url";

@Component({
  components: {}
})
export default class Index extends Vue {
  oparation: any = "add"; //保存操作，add：添加，edit：编辑
  selectIdx: any = 0;
  typeList: Array<any> = []; //基础属性类型列表
  //当前选中的基础属性类型
  baseTypeSelect: any = {
    id: "",
    baseTypeName: "",
    sort: ""
  };
  baseTypeEdit: any = {};
  tableList: Array<any> = []; //基础属性表格数据
  searchDTO: any = {
    current: 1,
    size: 10,
    total: 0,
    query: {
      baseTypeId: "",
      attrType: ""
    }
  }; //表格查询参数

  // 基础属性类型弹窗
  typeDialogFormVisible: any = false;

  // 自定义属性弹窗相关
  attrEditDialogFormVisible: Boolean = false; //弹窗是否显示
  dialogTitle: string = ""; //弹窗标题
  //自定义属性类型
  itemOptions: Array<any> = [
    {
      value: "select",
      label: "单项选择"
    },
    {
      value: "multiSelect",
      label: "多项选择"
    },
    {
      value: "number",
      label: "数值"
    },
    {
      value: "image",
      label: "图片"
    },
    {
      value: "text",
      label: "文本"
    },
    {
      value: "location",
      label: "定位"
    }
  ];
  //选中的自定义属性
  attrCur: any = {
    id: "",
    baseTypeId: "",
    code: "",
    attrName: "",
    attrType: "",
    sort: "",
    dataRange: {
      options: [],
      multiSelectedItems: []
    }
  };

  formatterAttrType(row: any) {
    switch (row.attrType) {
      case "select":
        return "单项选择";
      case "multiSelect":
        return "多项选择";
      case "number":
        return "数值";
      case "image":
        return "图片";
      case "text":
        return "文本";
      case "location":
        return "定位";
    }
  }

  //获取基础属性类型列表
  getBaseTypeList() {
    Http.get(Url.admin.getBaseTypeList).then((res: any) => {
      if (res.data.status) {
        this.typeList = res.data.data;
        this.baseTypeSelect = this.typeList[this.selectIdx];
        this.searchDTO.query.baseTypeId = this.baseTypeSelect.id;
        this.getAttrsList();
      }
    });
  }

  //基础属性类型点击事件，渲染自定义属性数据
  baseTypeClick(baseType: any, index: any) {
    this.selectIdx = index;
    this.baseTypeSelect = baseType;
    this.searchDTO.query.baseTypeId = baseType.id;
    this.getAttrsList();
  }

  //点击添加基础属性类型事件
  addBaseType() {
    this.oparation = "add";
    this.baseTypeEdit = {};
    this.typeDialogFormVisible = true;
  }

  //点击编辑基础属性类型事件
  editBaseType() {
    this.oparation = "edit";
    this.typeDialogFormVisible = true;
    this.baseTypeEdit = JSON.parse(JSON.stringify(this.baseTypeSelect));
  }

  //点击删除基础属性类型事件
  deleteBaseType() {
    let _this = this;
    this.$confirm("确认删除?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        Http.get(Url.admin.deleteBaseType+"/"+this.baseTypeSelect.id).then((res: any) => {
          if (res.status) {
            if (res.data.status) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });

              //重新获取列表
              _this.getBaseTypeList();
            } else {
              _this.$message({
                showClose: true,
                message: res.data.message,
                type: "error"
              });
            }
          }
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "取消操作"
        });
      });
  }

  //保存基础属性类型
  saveBaseType() {
    let url = Url.admin.addBaseType;
    if (this.oparation == "edit") {
      url = Url.admin.updateBaseType;
    }
    let baseType = this.baseTypeEdit;
    Http.post(url, baseType).then((res: any) => {
      if (res.data.status) {
        this.$message.success("操作成功");
        this.closeTypeDialog();
        this.getBaseTypeList();
        if (this.oparation == "add") {
          this.selectIdx = this.selectIdx + 1;
        }
      } else {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: "error"
        });
      }
    });
  }

  //关闭基础属性类型编辑窗口
  closeTypeDialog() {
    this.typeDialogFormVisible = false;
  }

  /**
   * 自定义属性相关
   */
  //获取基础属性类型对应的自定义属性列表
  getAttrsList() {
    Http.post(Url.admin.getBaseTypeAttrsList, this.searchDTO).then((res: any) => {
      if (res.data.status) {
        const result = res.data.data;
        this.tableList = result.records;
        this.searchDTO.current = result.current;
        this.searchDTO.total = result.total;
      }
    });
  }

  //===自定义属性弹窗相关================
  removeOptionItem(item: any) {
    let index = this.attrCur.dataRange.options.indexOf(item);
    if (index !== -1) {
      this.attrCur.dataRange.options.splice(index, 1);
    }
  }

  addOptionItem() {
    this.attrCur.dataRange.options.push({});
  }

  closeDialog() {
    this.attrEditDialogFormVisible = false;
  }

  //添加自定义属性
  attrAdd() {
    this.oparation = "add";
    if (!this.baseTypeSelect.id) {
      this.$message.error("尚未选在基础属性类型");
    }
    this.attrCur = {
      id: "",
      baseTypeId: this.baseTypeSelect.id,
      code: "",
      attrName: "",
      attrType: "",
      sort: "",
      dataRange: {
        options: [],
        multiSelectedItems: []
      }
    };
    this.dialogTitle = "新增" + this.baseTypeSelect.baseTypeName + "数据元";
    this.attrEditDialogFormVisible = true;
  }

  //编辑自定义属性
  attrEdit(attr: object) {
    this.oparation = "edit";
    this.attrCur = attr;
    this.dialogTitle = "编辑" + this.baseTypeSelect.baseTypeName + "数据元";
    this.attrCur.dataRange = JSON.parse(this.attrCur.dataRange);
    this.attrEditDialogFormVisible = true;
  }

  //保存自定义属性
  saveAttr() {
    let url = Url.admin.addAttr;
    if (this.oparation == "edit") {
      url = Url.admin.updateAttr;
    }
    this.attrCur.dataRange = JSON.stringify(this.attrCur.dataRange);
    Http.post(url, this.attrCur).then((res: any) => {
      if (res.data.status) {
        this.closeDialog();
        this.getAttrsList();
      } else {
        this.$message.warning(res.data.message);
      }
    });
  }

  //删除自定义属性
  deleteAttr(attrId: string) {
    let _this = this;
    this.$confirm("确认删除?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        Http.get(Url.admin.deleteBaseTypeAttr+"/"+attrId).then((res: any) => {
          if (res.status) {
            if (res.data.status) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getAttrsList();
            } else {
              _this.$message({
                showClose: true,
                message: res.data.message,
                type: "error"
              });
            }
          }
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "取消操作"
        });
      });
  }

  //上移自定义属性
  upAttrSort(attr: any, index: any) {
    const idx = index + this.searchDTO.size * (this.searchDTO.current - 1);
    if (idx > 0) {
      Http.post(Url.admin.upAttrSort, attr).then((res: any) => {
        if (res.status) {
          this.getAttrsList();
        }
      });
    } else {
      this.$message({
        showClose: true,
        message: "已经是第一条",
        type: "error"
      });
    }
  }

  //下移自定义属性
  downAttrSort(attr: any, index: any) {
    const idx = index + this.searchDTO.size * (this.searchDTO.current - 1);
    if (idx != this.searchDTO.total - 1) {
      Http.post(Url.admin.downAttrSort, attr).then((res: any) => {
        if (res.status) {
          this.getAttrsList();
        }
      });
    } else {
      this.$message({
        showClose: true,
        message: "已经是最后一条",
        type: "error"
      });
    }
  }

  mounted() {
    this.getBaseTypeList();
  }
}
</script>

<style scoped lang="less">
.main {
  display: flex;

  /deep/ .el-card__body {
    padding: 0 !important;
  }

  .submenu {
    width: 280px;
    margin-right: 10px;

    .type-list {
      padding: 0 16px 0 0;
      height: calc(100vh - 220px);
    }

    .type-active {
      background-color: #a7c8f5;

      /deep/ .el-input__inner {
        background-color: #a7c8f5 !important;
      }
    }

    .tool-bar {
      height: 35px;
      text-align: center;

      .el-button {
        margin: auto 15px;
      }
    }
  }

  .submain {
    width: calc(100vw - 480px);

    .attrs-list {
      padding: 20px;
    }

    .el-table .el-button {
      margin: auto 10px;
    }
  }

  .submain-title {
    color: #333;
    font-size: 16px;
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    background-color: #f4f4f5;
    font-weight: bold;
  }

  .el-select {
    width: 100%;
  }
}

/deep/ .el-input.list-item .el-input__inner {
  text-align: left;
  background-color: #ffffff;
  border: none !important;
  color: #333;
  cursor: pointer;
  padding: 10px 10px 10px 20px;
  box-sizing: border-box;
  line-height: 20px;
}

/deep/ .el-input.list-item .el-input__inner[type="text"] {
  height: 20px;
  padding: 0 !important;
  margin: 10px 10px 10px 20px !important;
  width: calc(100% - 30px);
}

/deep/ .el-input.list-item:nth-of-type(even) .el-input__inner {
  background-color: #f8f8f9;
}

.pagination-block {
  position: absolute;
  right: 40px;
  bottom: 30px;
}
</style>
