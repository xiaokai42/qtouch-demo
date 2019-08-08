<template>
  <div class="main">
    <div class="content">
      <el-card shadow="hover" class="left-tree">
        <div slot="header" class="tree-title">
          <span>菜单列表</span>
          <el-button
            style="float: right; padding: 0; border: 0; line-height: 50px"
            type="text"
            @click="openTypeTreeNodeForm('addTop', '')"
            >添加一级节点</el-button
          >
        </div>
        <div class="tree-body">
          <div class="tree-content">
            <el-tree
              class="filter-tree"
              :data="treeData"
              :props="defaultProps"
              node-key="id"
              default-expand-all
              highlight-current
              :expand-on-click-node="false"
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
                    @click.stop="() => openTypeTreeNodeForm('add', data, node.parent.data)"
                    class="el-icon-plus"
                    title="添加子节点"
                  >
                  </el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click.stop="() => openTypeTreeNodeForm('edit', data, node.parent.data)"
                    class="el-icon-edit"
                    title="编辑节点"
                  >
                  </el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click.stop="() => remove(node, data)"
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
          <span>{{ currentMenuName }}详情</span>
        </div>
        <div class="basic-attribute">
          <div class="basic-attribute-header">
            <div class="attribute-title"><icon class="el-icon-menu icon-blue"></icon>基础信息</div>
          </div>
          <div class="basic-attribute-body">
            <el-form label-width="100px" size="mini" status-icon :model="basicForm" ref="">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="所属系统：">
                    <el-input size="small" v-model="basicForm.subName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="上级菜单：">
                    <el-input size="small" disabled v-model="basicForm.parentName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="名称：">
                    <el-input size="small" v-model="basicForm.name" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="图标：">
                    <el-input size="small" v-model="basicForm.icon" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="编码：">
                    <el-input size="small" v-model="basicForm.code" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="内部路由：">
                    <el-input size="small" v-model="basicForm.innerRoute" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="路由：">
                    <el-input size="small" v-model="basicForm.path" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="打开方式：">
                    <el-input size="small" v-model="basicForm.targetName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="备注：">
                    <el-input type="textarea" :rows="3" size="small" v-model="basicForm.remark" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
        <el-divider></el-divider>
        <menu-func-manage
          :currentId="currentMenuId"
          :funcData="functionTableData"
          @update="getFuncData"
        ></menu-func-manage>
      </el-card>
    </div>
    <!-- 添加或编辑类型树节点弹窗 -->
    <el-dialog title="菜单信息" :visible.sync="typeTreeNodeDialog" :close-on-click-modal="false" width="680px">
      <el-form
        label-width="100px"
        size="mini"
        status-icon
        :model="dialogBasicForm"
        :rules="addRules"
        ref="dialogBasicForm"
      >
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="所属系统：" prop="subsystemCode">
              <el-select size="small" v-model="dialogBasicForm.subsystemCode">
                <el-option
                  v-for="(li, i) in sysOptions"
                  :key="i"
                  :value="li.code"
                  :label="li.subsystemName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上级菜单：" prop="parentName">
              <el-input size="small" disabled v-model="dialogBasicForm.parentName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称：" prop="name">
              <el-input size="small" v-model="dialogBasicForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图标：" prop="icon">
              <el-input size="small" v-model="dialogBasicForm.icon"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编码：" prop="code">
              <el-input size="small" v-model="dialogBasicForm.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="内部路由：" prop="innerRoute">
              <el-select size="small" v-model="dialogBasicForm.innerRoute">
                <el-option :value="true" label="是"></el-option>
                <el-option :value="false" label="否"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由：" prop="path">
              <el-input size="small" v-model="dialogBasicForm.path"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="打开方式：" prop="target">
              <el-select size="small" v-model="dialogBasicForm.target">
                <el-option v-for="(li, i) in openOption" :key="i" :value="li.id" :label="li.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark">
              <el-input type="textarea" :rows="3" size="small" v-model="dialogBasicForm.remark"></el-input>
            </el-form-item>
          </el-col>
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
import MenuFuncManage from "./components/MenuFuncManage.vue";
import Http from "@/utils/Http";
import Url from "@/api/url";
import utils from "@/utils/utils";

@Component({
  components: {
    MenuFuncManage
  }
})
export default class SystemMenu extends Vue {
  treeData = [];
  sysOptions: Array<any> = [];
  openOption: Array<any> = [
    { id: "_blank", label: "新窗口打开" },
    { id: "_self", label: "当前窗口打开" },
    { id: "framename", label: "指定位置打开" }
  ];
  // 配置选项
  defaultProps = {
    children: "children",
    label: "name"
  };
  currentMenuId = "";
  currentMenuName = "";
  // 选中表单信息
  basicForm: any = {};
  functionTableData: Array<any> = [];
  // 弹窗表单信息
  typeTreeNodeDialog: boolean = false;
  dialogBasicForm: any = {
    id: "",
    subsystemCode: "",
    parentId: null,
    parentName: "",
    name: "",
    icon: "",
    code: "",
    innerRoute: true,
    path: "",
    target: "_self",
    remark: ""
  };
  addRules = {
    subsystemCode: { required: true, message: "请选择子系统", trigger: "blur" },
    name: { required: true, message: "请输入名称", trigger: "blur" },
    code: { required: true, message: "请输入编码", trigger: "blur" },
    innerRoute: { required: true, message: "请选择路由", trigger: "blur" },
    path: { required: true, message: "请输入路由", trigger: "blur" }
  };

  created() {
    this.getSystemData();
    this.getTypeTreeData();
  }

  // 获取所属系统列表
  getSystemData() {
    Http.get(Url.auth.getSubsystemList).then((res: any) => {
      if (res.data.status) {
        this.sysOptions = res.data.data;
      } else {
        this.$message.error(res.data.message);
      }
    });
  }
  // 获取树数据
  getTypeTreeData() {
    Http.get(Url.auth.getMenuList).then((res: any) => {
      if (res.data.status) {
        this.treeData = res.data.data;
      } else {
        this.$message.error(res.data.message);
      }
    });
  }
  // 树节点点击事件
  handleNodeClick(data: any) {
    // console.log(data);
    this.currentMenuId = data.id;
    this.currentMenuName = data.name;
    this.getCustomAttributeList(data.id);
  }
  // 根据节点ID获取详细信息
  getCustomAttributeList(id: any) {
    Http.get(Url.auth.getMenuDetail + "/" + id).then((res: any) => {
      if (res.data.status) {
        this.basicForm = res.data.data;
        this.basicForm.innerRoute = this.basicForm.innerRoute ? "是" : "否";
        let i = this.sysOptions.findIndex((li: any) => li.code === this.basicForm.subsystemCode);
        this.basicForm.subName = this.sysOptions[i].subsystemName;
        let j = this.openOption.findIndex((li: any) => li.id === this.basicForm.target);
        this.basicForm.targetName = this.openOption[j].label;
        this.functionTableData = res.data.data.navigationOperations ? res.data.data.navigationOperations : [];
      } else {
        this.$message.error(res.data.message);
      }
    });
  }
  // 打开节点弹窗
  openTypeTreeNodeForm(buttonName: any, data: any, parent: any) {
    this.typeTreeNodeDialog = true;
    this.$nextTick(() => {
      let refs: any = this.$refs.dialogBasicForm;
      refs.resetFields();
      switch (buttonName) {
        case "add":
          this.dialogBasicForm = {
            id: "",
            subsystemCode: "",
            parentId: data.id,
            parentName: data.name,
            name: "",
            icon: "",
            code: "",
            innerRoute: true,
            path: "",
            target: "_self",
            remark: "",
            level: data.level + 1
          };
          break;
        case "edit":
          utils.mapValue(this.dialogBasicForm, data);
          this.dialogBasicForm.parentName = parent.name;
          break;
        case "addTop":
          this.dialogBasicForm = {
            id: "",
            subsystemCode: "",
            parentId: null,
            parentName: "",
            name: "",
            icon: "",
            code: "",
            innerRoute: true,
            path: "",
            target: "_self",
            remark: "",
            level: 1
          };
          break;
      }
    });
  }
  // 保存树节点
  saveTypeAndAttr() {
    let refs: any = this.$refs.dialogBasicForm;
    refs.validate((valid: boolean) => {
      if (valid) {
        let url = this.dialogBasicForm.id ? Url.auth.editMenu : Url.auth.addMenu;
        Http.post(url, this.dialogBasicForm).then((res: any) => {
          if (res.data.status) {
            this.$message.success("操作成功");
            this.typeTreeNodeDialog = false;
            this.getTypeTreeData();
            if (this.currentMenuId) {
              this.getCustomAttributeList(this.currentMenuId);
            } else {
              this.basicForm = {};
            }
          } else {
            this.$message({
              message: res.data.message,
              type: "error"
            });
          }
        });
      } else {
        return false;
      }
    });
  }
  // 删除节点
  remove(node: any, data: any) {
    this.$confirm("确认删除?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        Http.get(`${Url.auth.deleteMenu}${data.id}`).then((res: any) => {
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
      .catch(() => {});
  }

  getFuncData() {
    this.getCustomAttributeList(this.currentMenuId);
  }
}
</script>

<style lang="less" scoped>
.main {
  // height: 100%;
  min-height: 800px;
  padding: 20px;
  .content {
    display: flex;
    justify-content: space-between;
    width: 100%;
    min-height: 800px;
    .left-tree {
      width: 20%;
      height: 800px;
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
        // height: 20%;
        .basic-attribute-header {
          height: 40px;
          font-size: 16px;
        }
      }
    }
  }
}
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
  /deep/ .el-card__header {
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
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #94bbd0;
}

.tree-content::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0);
}
</style>
