<!--
  @author: lei.xu
  @date: 2019/05/26
  description TODO 自定义属性配置公共组件
-->
<template>
  <div class="main loading-area">
    <div class="content">
      <el-card shadow="hover" class="left-tree">
        <!--        <div class="tree-title">-->
        <!--          {{ typeObject.name }}-->
        <!--        </div>-->
        <div slot="header" class="tree-title">
          <span>{{ typeObject.name }}</span>
          <el-button
            style="float: right; padding: 0; border: 0; line-height: 50px"
            type="text"
            @click="openTypeTreeNodeForm('addTop', '')"
            >添加一级节点
          </el-button>
        </div>
        <div class="tree-body">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="treeMessage.filterText"
            size="small"
            style="margin-bottom: 10px"
          >
          </el-input>
          <div class="tree-content">
            <el-tree
              class="filter-tree"
              :data="treeMessage.data"
              :props="treeMessage.defaultProps"
              node-key="id"
              default-expand-all
              highlight-current
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              @node-click="handleNodeClick"
              ref="tree"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span
                  style="display: inline-block; text-overflow: ellipsis;overflow: hidden;white-space: nowrap;word-break: keep-all;"
                  :style="{ width: 190 - (node.level - 1) * 18 + 'px' }"
                  :title="node.label"
                >
                  {{ node.label }}
                </span>
                <span>
                  <el-button
                    type="text"
                    size="mini"
                    @click="openTypeTreeNodeForm('add', data)"
                    class="el-icon-plus"
                    title="添加子节点"
                  >
                  </el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click="openTypeTreeNodeForm('edit', data)"
                    class="el-icon-edit"
                    title="编辑节点"
                  >
                  </el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click="remove(node, data)"
                    class="el-icon-delete"
                    title="删除节点"
                  >
                  </el-button>
                </span>
              </span>
            </el-tree>
          </div>
        </div>
      </el-card>
      <el-card shadow="hover" class="right-content">
        <div slot="header" class="content-title">
          <icon class="el-icon-info icon-blue"></icon>
          <span>{{ basicForm.name }}详情</span>
        </div>
        <div class="basic-attribute">
          <div class="basic-attribute-header">
            <div class="attribute-title">
              <icon class="el-icon-menu icon-blue"></icon>
              基础信息
            </div>
          </div>
          <div class="basic-attribute-body">
            <el-form label-width="100px" size="mini" status-icon :model="basicForm" ref="">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="名称：" prop="name">
                    <el-input size="small" v-model="basicForm.name" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="父节点名称：">
                    <el-input size="small" disabled v-model="basicForm.parentName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="编号：" prop="code">
                    <el-input size="small" v-model="basicForm.code" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="custom-attribute">
          <div class="custom-attribute-header">
            <div class="attribute-title">
              <icon class="el-icon-menu icon-blue"></icon>
              自定义信息
            </div>
          </div>
          <div class="custom-attribute-body">
            <el-row :gutter="10" class="filter">
              <el-col :span="5">
                <el-input
                  size="small"
                  @input="getCustomAttributeList"
                  v-model="pagination.condition"
                  placeholder="请输入关键字"
                  clearable
                >
                </el-input>
              </el-col>
            </el-row>
            <el-table
              ref="multipleTable"
              :data="pagination.tableData"
              stripe
              :header-row-style="{ height: '60px' }"
              size="mini"
              tooltip-effect="dark"
              style="width: 100%; text-align: center"
            >
              <el-table-column align="center" label="序号" type="index" min-width="60"> </el-table-column>
              <el-table-column align="center" prop="code" label="编码"> </el-table-column>
              <el-table-column align="center" prop="attrName" label="数据项名称"> </el-table-column>
              <el-table-column align="center" label="数据项类型">
                <template slot-scope="scope">
                  <span>{{ scope.row.attrType | formatterAttrType }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="mustInput" label="是否必填">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.mustInput"
                    @change="mustInputChange(scope.row)"
                    active-text="是"
                    inactive-text="否"
                  >
                  </el-switch>
                </template>
              </el-table-column>
            </el-table>
            <div class="block">
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
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 添加或编辑类型树节点弹窗 -->
    <el-dialog title="企业信息" v-if="typeTreeNodeDialog" :visible.sync="typeTreeNodeDialog" width="40%">
      <el-form label-width="100px" size="mini" status-icon :model="dialogBasicForm" ref="dialogBasicForm">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="名称：" prop="name">
              <el-input size="small" v-model="dialogBasicForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编码：" prop="code">
              <el-input size="small" v-model="dialogBasicForm.code"></el-input>
            </el-form-item>
          </el-col>
          <!--          <el-col :span="24">-->
          <!--            <el-form-item label="备注说明：">-->
          <!--              <el-input type="textarea" :rows="8"-->
          <!--                        resize="none"></el-input>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
        </el-row>
        <el-divider></el-divider>
        <el-row class="transfer-box">
          <el-transfer
            v-model="transferData.selected"
            filterable
            :titles="['未选择', '已选择']"
            :button-texts="['解绑', '绑定']"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}'
            }"
            :data="transferData.data"
          >
          </el-transfer>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="typeTreeNodeDialog = false">取 消 </el-button>
        <el-button size="mini" type="primary" @click="saveTypeAndAttr()">确 定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import Http from "@/utils/Http";
import Url from "@/api/url";

@Component({
  // 过滤器
  filters: {
    formatterAttrType(data: any) {
      switch (data) {
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
  }
})
export default class BasicPropertyConfig extends Vue {
  method: any = "add"; //保存方式，add：添加，edit：更新
  // 父组件传参
  @Prop({ type: Object, required: true })
  typeObject!: any;
  // 类型树信息
  treeMessage: any = {
    // 过滤条件
    filterText: "",
    // tree数据
    data: [],
    // 配置选项
    defaultProps: {
      children: "children",
      label: "name"
    }
  };
  // 选中表单信息
  basicForm: any = {};
  // 弹窗表单信息
  dialogBasicForm: any = {};
  // 分页信息
  pagination: any = {
    // 查询关键字
    condition: "",
    // 用于查询和显示某页数据
    currentPage: 1,
    // 总条数
    total: 0,
    // 表格信息
    tableData: [],
    // 分页条数
    pageSize: 10
  };
  // 添加或编辑树节点弹窗
  typeTreeNodeDialog: boolean = false;
  //自定义属性穿梭数据
  transferData: any = {
    data: [],
    selected: []
  };

  created() {
    this.getTypeTreeData();
  }

  // 根据父组件参数获取类型树数据
  getTypeTreeData() {
    let _this = this;
    Http.get(Url.typeDetail.getTypeDetail + "/findTypeTree" + this.typeObject.url).then((res: any) => {
      if (res.status) {
        if (res.data.status) {
          _this.treeMessage.data = res.data.data;
          _this.$nextTick(() => {
            if (_this.$refs.tree) {
              (_this.$refs.tree as any).setCurrentKey(_this.basicForm.id); // treeBox 元素的ref   value 绑定的node-key
            }
          });
        }
      }
    });
  }

  // 根据父组件参数及树节点ID获取自定义属性列表
  getCustomAttributeList() {
    let _this = this;
    Http.post(Url.typeDetail.getTypeDetail + "/attr/pagingAttr" + this.typeObject.url + "/" + this.basicForm.id, {
      current: this.pagination.currentPage,
      size: 10,
      query: {
        name: "",
        code: "",
        attrType: ""
      }
    }).then((res: any) => {
      if (res.status) {
        if (res.data.status) {
          let result = res.data;
          _this.pagination.tableData = result.data.records;
          _this.pagination.currentPage = result.data.current;
          _this.pagination.total = result.data.total;
        }
      }
    });
  }

  // 树节点点击事件
  handleNodeClick(data: any) {
    this.basicForm = Object.assign({}, data);
    this.getCustomAttributeList();
  }

  // 是否必填改变
  mustInputChange = (row: any) => {
    Http.post(Url.typeDetail.saveCustomAttrItems, row);
  };

  // 监听是否tree过滤条件
  @Watch("treeMessage.filterText")
  setFilterText(val: any) {
    (this.$refs.tree as any).filter(val);
  }

  // 过滤tree
  filterNode(value: any, data: any) {
    if (!value) return true;
    return data[this.treeMessage.defaultProps.label].indexOf(value) !== -1;
  }

  // 打开节点弹窗
  openTypeTreeNodeForm(buttonName: any, data: any) {
    switch (buttonName) {
      case "add":
        this.method = "add";
        this.dialogBasicForm = {};
        this.dialogBasicForm.parentId = data.id;
        this.dialogBasicForm.level = data.level + 1;
        break;
      case "edit":
        this.method = "edit";
        this.dialogBasicForm = Object.assign({}, data);
        break;
      case "addTop":
        this.method = "add";
        this.dialogBasicForm = {};
        this.dialogBasicForm.level = 1;
        break;
    }
    this.typeTreeNodeDialog = true;
    this.getTypeAndAttrs();
  }

  // 删除节点
  remove(node: any, data: any) {
    this.$confirm("确认删除?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        Http.get(`${Url.typeDetail.deleteType}/${data.id}`).then((res: any) => {
          if (res.status) {
            if (res.data.status) {
              this.$message.success("操作成功");
              this.getTypeTreeData();
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

  // 获取组织机构和自定义属性，用于transfer
  getTypeAndAttrs() {
    let _this = this;
    Http.get(
      Url.typeDetail.getTypeDetail + "/attr/transferData" + this.typeObject.url + "/" + this.dialogBasicForm.id
    ).then((res: any) => {
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

  // 保存树节点
  saveTypeAndAttr() {
    let url = Url.typeDetail.getTypeDetail + "/addTypeAndAttrs" + this.typeObject.url;
    if (this.method == "edit") {
      url = Url.typeDetail.getTypeDetail + "/updateTypeAndAttrs" + this.typeObject.url;
    }
    let typeVO = this.dialogBasicForm;
    typeVO.attrs = this.transferData.selected;
    Http.post(url, typeVO).then((res: any) => {
      if (res.data.status) {
        this.$message.success("操作成功");
        this.typeTreeNodeDialog = false;
        this.getTypeTreeData();
        this.basicForm = res.data.data;
        this.getCustomAttributeList();
      } else {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: "error"
        });
      }
    });
  }
}
</script>

<style lang="less" scoped>
.main {
  height: 100%;
  min-height: 840px;
  padding: 20px;

  .content {
    display: flex;
    justify-content: space-between;

    width: 100%;
    height: 100%;

    .left-tree {
      width: 20%;
      height: 100%;
      min-width: 335px;

      .tree-title {
        font-size: 16px;
        font-weight: bold;
      }

      .tree-body {
        .tree-content {
          height: calc(~"100vh - 260px");
          overflow-y: auto;
          overflow-x: hidden;
        }
      }
    }

    .right-content {
      position: relative;
      width: 79%;
      min-width: 1000px;

      .content-title {
        font-size: 16px;
        font-weight: bold;
      }

      .basic-attribute {
        height: 20%;

        .basic-attribute-header {
          height: 40px;
          font-size: 16px;
        }
      }

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
    }
  }

  .transfer-box {
    text-align: center;

    /deep/ .el-transfer-panel {
      width: 35%;
      margin: auto;
      text-align: left;
    }
  }
}
</style>
<style lang="less">
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 10px;
}

.left-tree,
.right-content {
  .el-card__header {
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
    background: #f4f4f5;
  }
}

.tree-content::-webkit-scrollbar {
  width: 2px;
  height: 1px;
}

.tree-content::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #94bbd0;
}

.tree-content::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0);
}
</style>
