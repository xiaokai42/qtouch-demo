<!--
  author: zhengdandan
  date: 2019-05-19
  组件说明:
-->
<template>
  <div class="cantainer">
    <!--内容主体-->
    <div class="main">
      <!--基础属性类型列表-->
      <el-card class="submenu">
        <el-row class="submain-title"
          >组织机构类型
          <el-button
            style="right: 16px; position: absolute; height: 50px"
            type="text"
            icon="el-icon-plus"
            title="添加一级节点"
            @click="editTypeAndAttr('addTop')"
            >添加一级节点
          </el-button>
        </el-row>
        <el-row class="org-type-tree">
          <el-tree
            :data="treeData"
            node-key="id"
            :props="defaultProps"
            :default-expand-all="true"
            :expand-on-click-node="false"
            :check-on-click-node="true"
            :highlight-current="true"
            :indent="32"
            ref="typeTree"
            @node-click="typeNodeClick"
          ></el-tree>
        </el-row>
        <el-row class="tool-bar">
          <el-button type="text" icon="el-icon-plus" title="添加子节点" @click="editTypeAndAttr('add')"
            >添加子节点
          </el-button>
          <el-button type="text" icon="el-icon-edit" title="编辑" @click="editTypeAndAttr('edit')"> </el-button>
          <el-button type="text" icon="el-icon-delete" title="删除" @click="deleteType"> </el-button>
        </el-row>
      </el-card>
      <!--自定义属性-->
      <el-card class="submain">
        <el-row class="submain-title">
          <i class="el-icon-info icon-blue"></i><span v-text="orgTypeSelected.name"></span><span>自定义属性</span>
        </el-row>
        <div class="submain-content">
          <el-row>
            <i class="el-icon-menu icon-blue"></i><span class="second-title">基础属性</span>
            <el-row>
              <el-col :span="3"><label class="attr-label">组织机构类型名称：</label></el-col>
              <el-col :span="6">
                <el-input v-model="orgTypeSelected.name" readonly="readonly" disabled="disabled"></el-input>
              </el-col>
            </el-row>
          </el-row>
          <el-divider></el-divider>
          <el-row class="custom-attr">
            <el-row><i class="el-icon-menu icon-blue"></i><span class="second-title">自定义属性</span></el-row>
            <el-row class="seach-box">
              <el-col :span="7">
                <el-input
                  placeholder="请输入内容"
                  @clear="getAttrList"
                  v-model="searchDTO.condition"
                  class="input-with-select"
                  clearable
                >
                  <el-button slot="append" @click="getAttrList" icon="el-icon-search" class="search"></el-button>
                </el-input>
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
              <el-table-column align="center" prop="code" label="编码" width="140"> </el-table-column>
              <el-table-column align="center" prop="attrName" label="数据项名称"> </el-table-column>
              <el-table-column align="center" :formatter="formatterAttrType" label="数据项类型"> </el-table-column>
              <el-table-column align="center" prop="need" label="是否必填">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.mustInput" :change="mustInputChange(scope.row)"></el-checkbox>
                </template>
              </el-table-column>
              <!--<el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    title="配置选项"
                    @click="editDataRange(scope.row)">配置选项
                  </el-button>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-sort-up"
                    title="上移"
                    @click="upAttrSort(scope.row, scope.$index)">
                  </el-button>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-sort-down"
                    title="下移"
                    @click="downAttrSort(scope.row, scope.$index)">
                  </el-button>
                </template>
              </el-table-column>-->
            </el-table>
          </el-row>
        </div>
      </el-card>
    </div>
    <!--编辑组织类型弹窗-->
    <el-dialog title="编辑组织机构类型" :visible.sync="typeEditDialogFormVisible" width="55%" @close="closeTypeDialog">
      <el-form label-width="140px" :model="orgTypeEdit">
        <el-row>
          <el-col :span="12">
            <el-form-item label="组织机构类型名称">
              <el-input v-model="orgTypeEdit.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编码">
              <el-input v-model="orgTypeEdit.code" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider></el-divider>
      <el-row class="transfer-box">
        <el-transfer
          v-model="transferData.selected"
          filterable
          :titles="['未选择', '已选择']"
          :button-texts="['取消', '绑定']"
          :format="{ noChecked: '${total}', hasChecked: '${checked}/${total}' }"
          :data="transferData.data"
        >
        </el-transfer>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeTypeDialog">取 消</el-button>
        <el-button type="primary" @click="saveTypeAndAttr()">保 存</el-button>
      </div>
    </el-dialog>

    <!--编辑配置项弹窗-->
    <el-dialog title="编辑配置项" :visible.sync="itemEditDialogFormVisible" width="30%" @close="closeTypeDialog">
      <el-form v-model="dataRange">
        <el-row v-for="(optionItem, index) in dataRange.options" :key="index">
          <el-col :span="22">
            <el-form-item label-width="100px" label="选项内容：">
              <el-input size="small" v-model="optionItem.content"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label-width="20px">
              <el-button
                type="text"
                size="small"
                icon="el-icon-delete"
                @click.prevent="removeOptionsItem(optionItem)"
              ></el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label-width="20px">
            <el-button size="mini" type="text" icon="el-icon-plus" @click="addOptionsItem">添加选项 </el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeItemDialog">取 消</el-button>
        <el-button type="primary" @click="saveItem()">保 存</el-button>
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
export default class AttrManage extends Vue {
  //组织机构树
  treeData: any = [];
  //树props
  defaultProps: any = {
    label: "name",
    children: "children"
  };
  //选中的树节点
  orgTypeSelected: any = {};
  orgTypeEdit: any = {};
  //自定义属性表格
  tableList: any = [];
  //查询条件
  searchDTO: any = {
    currentPage: 1,
    pageSize: 10,
    total: 0,
    condition: "",
    typeId: ""
  }; //表格查询参数

  //自定义属性穿梭数据
  transferData: any = {
    data: [],
    selected: []
  };
  //组织机构编辑弹窗是否可见
  typeEditDialogFormVisible: any = false;

  //配置项编辑弹窗是否可见
  itemEditDialogFormVisible: any = false;
  dataRange: any = {};

  //监测当前选中的基础属性类型，有变化则更新自定义属性
  @Watch("orgTypeSelected")
  watchBaseTypeCur(newParam: any, oldParam: any) {
    if (newParam.id != oldParam.id) {
      this.searchDTO.typeId = newParam.id;
      this.getAttrList();
    }
  }

  /*
   * 格式化数据项类型
   * */
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

  /**
   * 树节点点击事件
   * @param data
   */
  typeNodeClick(data: any) {
    this.orgTypeSelected = Object.assign({}, data);
  }

  /**
   * 获取组织机构类型树
   */
  getTreeData() {
    let _this = this;
    Http.get(Url.organizaition.getTreeData).then((res: any) => {
      if (res.status) {
        if (res.data.status) {
          _this.treeData = res.data.data;
        }
      }
    });
  }

  /**
   * 自定义属性表格数据
   */
  getAttrList() {
    let _this = this;
    Http.get(Url.organizaition.getAttrList, this.searchDTO).then((res: any) => {
      if (res.status) {
        if (res.data.status) {
          let result = res.data;
          _this.tableList = result.data.records;
          _this.searchDTO.currentPage = result.data.current;
          _this.searchDTO.total = result.data.total;
        }
      }
    });
  }

  mustInputChange(row: any) {
    let _this = this;
    Http.post(Url.organizaition.saveCustomAttrItems, row).then((res: any) => {
      if (res.status) {
        if (res.data.status) {
          console.log(res);
        }
      }
    });
  }

  /**
   * 获取组织机构和自定义属性，用于transfer
   */
  getTypeAndAttrs() {
    let _this = this;
    Http.get(Url.organizaition.getTypeAndAttrs, {
      typeId: this.orgTypeEdit.id
    }).then((res: any) => {
      if (res.status) {
        if (res.data.status) {
          let result = res.data.data;
          _this.transferData.data = [];
          result.data.forEach(function(item: any) {
            _this.transferData.data.push({
              key: item.id,
              label: item.attrName
            });
          });
          _this.transferData.selected = result.selected;
        }
      }
    });
  }

  //编辑类型节点
  editTypeAndAttr(op: any) {
    //添加一级节点
    if (op == "addTop") {
      this.orgTypeEdit = {};
    }
    //添加节点
    if (op == "add") {
      let id = this.orgTypeSelected.id;
      this.orgTypeEdit = {};
      this.orgTypeEdit.parentId = id;
    }
    //编辑节点
    if (op == "edit") {
      if (!((document as any).getElementsByClassName("is-current").length > 0)) {
        this.$message({
          showClose: true,
          message: "未选择任何节点",
          type: "error"
        });
        return;
      }
      this.orgTypeEdit = Object.assign({}, this.orgTypeSelected);
    }

    this.typeEditDialogFormVisible = true;
    this.getTypeAndAttrs();
  }

  //删除节点，逻辑删除
  deleteType() {
    this.$confirm("确认删除?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        Http.get(Url.organizaition.deleteType, {
          typeId: this.orgTypeSelected.id
        }).then((res: any) => {
          if (res.status) {
            if (res.data.status) {
              this.$message.success("操作成功");
              this.getTreeData();
            } else {
              this.$message({
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

  /*
   * 关闭
   * */
  closeTypeDialog() {
    this.typeEditDialogFormVisible = false;
    this.orgTypeEdit = {};
  }

  /*
   * 保存类型和类型的自定义属性
   * */
  saveTypeAndAttr() {
    let _this = this;
    let typeVO = this.orgTypeEdit;
    typeVO.attrs = this.transferData.selected;
    Http.post(Url.organizaition.saveOrUpdateTypeAndAttrs, typeVO).then((res: any) => {
      if (res.status) {
        if (res.data.status) {
          _this.$message.success("操作成功");
          _this.closeTypeDialog();
          _this.getTreeData();
        } else {
          _this.$message({
            showClose: true,
            message: res.data.message,
            type: "error"
          });
        }
      }
    });
  }

  //=========================选项配置相关=========================

  /**
   * 编辑选项
   * @param data
   */
  editDataRange(data: any) {
    this.itemEditDialogFormVisible = true;
    this.dataRange = JSON.parse(data.dataRange);
    this.dataRange.id = data.id;
  }

  // 删除某个选项配置item
  removeOptionsItem(item: any) {
    let index = this.dataRange.options.indexOf(item);
    if (index !== -1) {
      this.dataRange.options.splice(index, 1);
    }
  }

  // 添加选项配置item
  addOptionsItem() {
    this.dataRange.options.push({
      content: "",
      mustChoose: false
    });
  }

  //关闭选项配置弹窗
  closeItemDialog() {
    this.itemEditDialogFormVisible = false;
  }

  //保存选项配置
  saveItem() {
    let _this = this;
    let opt = {
      id: this.dataRange.id,
      dataRange: JSON.stringify({ options: this.dataRange.options })
    };
    // opt = JSON.stringify(opt);
    Http.post(Url.organizaition.saveCustomAttrItems, opt).then((res: any) => {
      if (res.status) {
        if (res.data.status) {
          this.$message.success("操作成功");
          this.closeItemDialog();
          this.getAttrList();
        } else {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: "error"
          });
        }
      }
    });
  }

  mounted() {
    this.getTreeData();
  }
}
</script>

<style scoped lang="less">
.org-type-tree {
  padding: 0 16px;
  height: calc(100vh - 200px);
}

/deep/ .el-tree-node__content {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color: #333;
}

.transfer-box {
  text-align: center;

  /deep/ .el-transfer-panel {
    width: 43%;
    margin: auto;
    text-align: left;
  }
}
</style>
