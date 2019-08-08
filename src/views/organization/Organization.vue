<!--
  author: zhengdandan
  date: 2019-05-19
  组件说明: 组织机构管理
-->
<template>
  <div class="container">
    <!--内容主体-->
    <div class="main">
      <!--组织机构树-->
      <el-card shadow="hover" class="aside">
        <el-row class="submain-title"
          >组织机构树
          <el-button
            style="right: 16px; position: absolute; height: 50px"
            type="text"
            icon="el-icon-plus"
            title="添加一级节点"
            @click="event => editOrg('addTop', null, event)"
            >添加一级节点
          </el-button>
        </el-row>
        <el-row class="org-tree">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="treeMessage.filterText"
            size="small"
            style="margin-bottom: 10px"
          >
          </el-input>
          <el-tree
            class="filter-tree"
            :data="treeMessage.data"
            :props="defaultProps"
            node-key="id"
            default-expand-all
            highlight-current
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="orgTree"
            @node-click="orgNodeClick"
          >
            <div class="org-tree-node" slot-scope="{ node, data }">
              <span
                style="display: inline-block; text-overflow: ellipsis;overflow: hidden;white-space: nowrap;word-break: keep-all;"
                :style="{ width: 200 - (node.level - 1) * 18 + 'px' }"
                >{{ node.label }}</span
              >
              <span>
                <el-button type="text" size="mini" @click="event => editOrg('add', data, event)" class="el-icon-plus">
                </el-button>
                <el-button type="text" size="mini" @click="event => editOrg('edit', data, event)" class="el-icon-edit">
                </el-button>
                <el-button type="text" size="mini" @click="event => remove(data.id, event)" class="el-icon-delete">
                </el-button>
              </span>
            </div>
          </el-tree>
        </el-row>
      </el-card>
      <!--组织机构信息-->
      <el-card shadow="hover" class="section">
        <el-row class="submain-title">
          <i class="el-icon-info icon-blue"></i>
          <span v-text="orgInfo.baseInfo.name"></span><span>详情</span>
        </el-row>
        <div class="submain-content" v-if="rightInfoVisible">
          <!--组织信息表单-->
          <el-form
            size="small"
            label-width="150px"
            ref="detailsForm"
            :model="orgInfo.baseInfo"
            :rules="detailsFormRules"
            v-bind:class="editFlag == false ? 'form-readonly' : ''"
          >
            <!--基础信息-->
            <el-row>
              <el-row>
                <i class="el-icon-menu icon-blue"></i>
                <span class="second-title">基础信息</span>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="组织名称：" prop="name">
                    <el-input id="org-name" v-model="orgInfo.baseInfo.name" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="组织类型：" prop="typeDetailId">
                    <el-cascader
                      v-model="orgInfo.baseInfo.typeDetailId"
                      placeholder="输入类型名进行搜索"
                      style="width: 100%"
                      :options="typeDetailOptions"
                      :props="defaultProps"
                      expand-trigger="hover"
                      clearable
                      change-on-select
                      filterable
                      @visible-change="changeCustomOptions"
                    ></el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="组织编码：" prop="code">
                    <el-input v-model="orgInfo.baseInfo.code" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :space="12">
                  <el-form-item label="单位状态：" prop="enterpriseFlag">
                    <el-select v-model="orgInfo.baseInfo.enterpriseFlag">
                      <el-option
                        v-for="option in enterOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-row>
            <!--分割线-->
            <!--<el-divider></el-divider>-->
            <!--自定义属性-->
            <el-row class="custom-attr">
              <el-row>
                <i class="el-icon-menu icon-blue"></i>
                <span class="second-title">自定义信息</span>
              </el-row>
              <el-row :gutter="0" class="customRow">
                <custom-input :customOptions="customOptions" ref="custom-input"></custom-input>
              </el-row>
            </el-row>
          </el-form>
          <!--分割线-->
          <!--<el-divider></el-divider>-->
          <!--数据权限-->
          <el-row class="access-data">
            <el-row>
              <i class="el-icon-s-data icon-blue"></i>
              <span class="second-title">数据维护信息</span>
            </el-row>
            <el-form>
              <el-row>
                <div v-if="orgInfo.orgAccess.length > 0">
                  <el-col class="access-box" :span="8" v-for="access in orgInfo.orgAccess" :key="access.typeId">
                    <el-select
                      v-model="access.typeId"
                      placeholder="请选择"
                      :disabled="access.typeId != null"
                      @change="accessSelectChange"
                    >
                      <el-option
                        v-for="item in baseTypeList"
                        :key="item.id"
                        :label="item.baseTypeName"
                        :value="item.id"
                        :disabled="item.disabled"
                      >
                      </el-option>
                    </el-select>
                    <el-button
                      v-if="editFlag != false"
                      type="text"
                      icon="el-icon-delete"
                      @click="removeAccess(access)"
                    ></el-button>
                    <el-card shadow="never" style="overflow: auto;">
                      <el-tree
                        :id="access.typeId"
                        :data="access.treeData"
                        node-key="id"
                        ref="accessTree"
                        :props="defaultProps"
                        :default-expand-all="true"
                        show-checkbox
                        :default-checked-keys="access.access"
                        v-bind:class="editFlag != false ? '' : 'form-readonly'"
                      >
                      </el-tree>
                    </el-card>
                  </el-col>
                </div>
                <el-col class="access-box" :span="8" v-if="editFlag != false">
                  <el-button class="btn-common" type="primary" @click="addAccess" icon="el-icon-plus" size="mini" circle
                    >新增
                  </el-button>
                </el-col>
              </el-row>
            </el-form>
          </el-row>
        </div>
        <!--操作按钮-保存、取消-->
        <el-row v-if="editFlag === true" class="tool-bar">
          <el-button
            type="primary"
            icon="el-icon-error"
            class="icon-blue"
            size="mini"
            @click="handelCancelEditInfo"
            plain
            >取消
          </el-button>
          <el-button type="primary" icon="el-icon-success" class="icon-blue" size="mini" @click="saveOrgInfo" plain
            >保存
          </el-button>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import CustomInput from "@/components/custom_input/CustomInput.vue";
import Http from "@/utils/Http";
import Url from "@/api/url";
import Utils from "@/utils/utils";

@Component({
  components: { CustomInput }
})
export default class Organization extends Vue {
  method: any = ""; //编辑/添加
  rightInfoVisible: any = true; //右侧详情是否可见
  editFlag: any = false; // 编辑状态
  // 组织机构树
  treeMessage: any = {
    // 过滤条件
    filterText: "",
    // tree数据
    data: []
  };
  // 配置选项
  defaultProps: any = {
    value: "id",
    label: "name",
    children: "children"
  };
  // 选中的组织信息
  orgInfoCopy: any = {
    baseInfo: {},
    orgAccess: [] //{access: "", treeData: [], typeName: "", typeId: ""}
  };
  // 表单使用的组织信息
  orgInfo: any = {
    baseInfo: {},
    orgAccess: [] //{access: "", treeData: [], typeName: "", typeId: ""}
  };
  // 组织机构类型树
  typeDetailOptions: Array<any> = [];
  // 基本属性表单规则(没有包括自定义属性)
  detailsFormRules: any = {
    name: [
      {
        required: true,
        message: "该选项为必填项",
        trigger: "change"
      }
    ],
    code: [
      {
        required: true,
        message: "该选项为必填项",
        trigger: "change"
      }
    ],
    typeDetailId: [
      {
        required: true,
        message: "该选项为必填项",
        trigger: "change"
      }
    ]
  };
  // 自定义属性
  customOptions: Array<any> = [];
  customOptionsCopy: Array<any> = [];

  //单位属性下拉框
  enterOptions: any = [{ label: "否", value: 0 }, { label: "是", value: 1 }];

  //=================权限========================
  //数据绑定basetype下拉框，基础属性类型列表
  baseTypeList: any = [{ id: "" }, { baseTypeName: "" }];
  //备份属性数据
  baseTypeListCopy: any = [{ id: "" }, { baseTypeName: "" }];

  // 清空表单验证
  formValidateClear() {
    (this.$refs["detailsForm"] as any).clearValidate();
    if (this.customOptions.length > 0) {
      (this.$refs["custom-input"] as any).cusResetFields();
    }
  }

  // 过滤tree
  filterNode(value: any, data: any) {
    if (!value) return true;
    return data[this.defaultProps.label].indexOf(value) !== -1;
  }

  //获取组织机构树
  getTreeData() {
    Http.get(Url.organizaition.getOrgTreeData).then((res: any) => {
      if (res.data.status) {
        this.treeMessage.data = res.data.data;
        this.$nextTick(() => {
          (this.$refs.orgTree as any).setCurrentKey(this.orgInfo.baseInfo.id); // treeBox 元素的ref   value 绑定的node-key
        });
      }
    });
  }

  //获取基础属性类型列表
  getBaseTypeList() {
    Http.get(Url.admin.getBaseTypeList).then((res: any) => {
      if (res.status) {
        const result = res.data;
        this.baseTypeList = result.data;
        this.baseTypeListCopy = JSON.parse(JSON.stringify(this.baseTypeList));
      }
    });
  }

  //获取组织信息
  getOrgInfo(orgId: any) {
    Http.get(Url.organizaition.getOrgInfo + "/" + orgId).then((response: any) => {
      if (response.data.status) {
        this.orgInfo.baseInfo = response.data.data.orgInfo;
        this.orgInfo.baseInfo.typeDetailId = this.orgInfo.baseInfo.typeDetailId.split(",");
        this.orgInfo.baseInfo.enterpriseFlag =
          this.orgInfo.baseInfo.enterpriseFlag == null ? 0 : this.orgInfo.baseInfo.enterpriseFlag;
        this.orgInfo.orgAccess = response.data.data.orgAccess;
        this.orgInfo.orgAccess.forEach((item: any) => {
          // 禁用已经配置的选项
          this.baseTypeList.some((temp: any) => {
            if (temp.id == item.typeId) {
              temp.disabled = true;
              return true;
            }
          });
          item.access = item.access != null ? item.access.split(",") : [];
        });
        this.customOptions = this.orgInfo.baseInfo.extInfoVO ? this.orgInfo.baseInfo.extInfoVO : [];
        // 将选中的组织信息保存备份，取消时使用
        this.orgInfoCopy = JSON.parse(JSON.stringify(this.orgInfo));
        this.customOptionsCopy = JSON.parse(JSON.stringify(this.customOptions));
        this.formValidateClear();
      }
    });
  }

  //树节点点击事件
  orgNodeClick(data: any) {
    this.rightInfoVisible = true;
    this.editFlag = false;
    this.getOrgInfo(data.id); //获取选中的组织信息，填充到表单
  }

  //点击编辑组织机构信息
  editOrg(opt: any, data: any, event: any) {
    this.rightInfoVisible = true;
    this.editFlag = true;
    this.formValidateClear();
    this.baseTypeList = JSON.parse(JSON.stringify(this.baseTypeListCopy));
    switch (opt) {
      case "addTop":
        this.orgInfo = {
          baseInfo: {},
          orgAccess: []
        };
        this.customOptions = [];
        this.method = "add";
        break;
      case "add":
        this.orgInfo = {
          baseInfo: {},
          orgAccess: []
        };
        this.customOptions = [];
        this.orgInfo.baseInfo.parentId = data.id;
        this.method = "add";
        break;
      case "edit":
        this.getOrgInfo(data.id);
        this.method = "edit";
        break;
    }
    (document as any).getElementById("org-name").focus();
    event.stopPropagation();
  }

  //类型变化时重新渲染自定义信息
  changeCustomOptions(param: any) {
    if (!param) {
      let typeId = Utils.lastOfArr(this.orgInfo.baseInfo.typeDetailId);
      Http.get(Url.typeDetail.getTemplateByTypeDetaiId + "/" + typeId).then((res: any) => {
        if (res.status) {
          if (res.data.status) {
            this.customOptions = res.data.data;
          }
        }
      });
    }
  }

  // 组织类型
  getOrgType() {
    Http.get(Url.typeDetail.findTypeTree + "organization").then((res: any) => {
      if (res.data.status) {
        res.data.data && Utils.removeEmptyChildren(res.data.data);
        this.typeDetailOptions = res.data.data;
      }
    });
  }

  // 获得组件CustomInput填充之后的数据
  getFilledCustomOptions() {
    (this.$refs["custom-input"] as any).formValidation().then((data: any) => {
      //if (data) {
        this.doSave(); //请求后台保存
        this.orgInfo.baseInfo.extInfo = data;
      //}
    });
  }

  //保存组织机构基本信息
  saveOrgInfo() {
    //验证基本信息表单
    (this.$refs["detailsForm"] as any).validate((valid: any) => {
      if (valid) {
        //处理子组件自定义信息数据
        this.getFilledCustomOptions();
      } else {
        return false;
      }
    });
  }

  //请求后台保存组织信息
  doSave() {
    let url = Url.organizaition.addOrgBaseInfo;
    if (this.method == "edit") {
      url = Url.organizaition.updateOrgBaseInfo;
    }
    let org = JSON.parse(JSON.stringify(this.orgInfo.baseInfo));
    org.typeDetailId = Utils.lastOfArr(org.typeDetailId);
    Http.post(url, org).then((res: any) => {
      if (res.data.status) {
        this.orgInfo.baseInfo.id = res.data.data.id;
        this.saveOrgAccessInfo(res.data.data.id); //保存权限信息
      } else {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: "error"
        });
      }
    });
  }

  //删除组织机构
  remove(id: any, event: any) {
    this.$confirm("确认删除?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      Http.get(Url.organizaition.delete + "/" + id).then((res: any) => {
        if (res.data.status) {
          this.$message.success(res.data.message);
          this.orgInfo = {
            baseInfo: {},
            orgAccess: []
          };
          this.customOptions = [];
          this.getTreeData();
          this.formValidateClear();
        } else {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: "error"
          });
        }
      });
    });
    this.formValidateClear();
    event.stopPropagation();
  }

  // 取消信息编辑
  handelCancelEditInfo() {
    this.orgInfo = JSON.parse(JSON.stringify(this.orgInfoCopy));
    this.customOptions = JSON.parse(JSON.stringify(this.customOptionsCopy));
    this.editFlag = false;
    this.formValidateClear();
  }

  /**
   * -=====================
   * 权限相关
   */
  //数据权限下拉框值改变
  accessSelectChange(val: any) {
    let typeCode = "";
    this.baseTypeList.some((item: any) => {
      if (item.id == val) {
        typeCode = item.code;
        item.disabled = true;
        return true;
      }
    });
    //获取权限树
    Http.get(Url.typeDetail.findTypeTree + "/" + typeCode).then((res: any) => {
      if (res.status) {
        if (res.data.status) {
          this.orgInfo.orgAccess[this.orgInfo.orgAccess.length - 1].treeData = res.data.data;
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

  //增加数据权限按钮
  addAccess() {
    this.orgInfo.orgAccess.push({
      typeId: null,
      treeData: []
    });
  }

  // 移除权限项
  removeAccess(val: any) {
    Utils.removeArrItemByValue(this.orgInfo.orgAccess, val); //删除权限项
    this.baseTypeList.forEach((item: any) => {
      if (item.id == val.typeId) {
        item.disabled = false;
      }
    });
  }

  //保存权限信息
  saveOrgAccessInfo(orgId: any) {
    let saveArr: any = [];
    this.orgInfo.orgAccess.forEach((item: any, idx: any) => {
      let typeDetails: any = [];
      (this.$refs.accessTree as any).forEach((access: any) => {
        if (access.$attrs.id == item.typeId) {
          typeDetails = access.getCheckedKeys().toString();
          return true;
        }
      });
      let saveObj = {
        orgId: orgId,
        baseTypeId: item.typeId,
        typeDetails: typeDetails
      };
      saveArr.push(saveObj);
    });
    Http.post(Url.organizaition.saveOrgAccess + "/" + orgId, saveArr).then((res: any) => {
      if (res.data.status) {
        this.editFlag = false;
        this.$message(res.data.message);
        this.formValidateClear();
        this.getTreeData();
      } else {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: "error"
        });
      }
    });
  }

  created() {
    this.getTreeData(); //获取组织树
    this.getBaseTypeList(); //获取团队能见基础属性类型，用于编辑数据权限
    this.getOrgType(); //组织类型
    this.editFlag = false;
  }
}
</script>

<style scoped lang="less">
/deep/ .el-card__body {
  padding: 0 !important;
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

.org-tree {
  padding: 20px;
  height: calc(100vh - 200px);
  overflow: auto;
}

.row-half-width {
  width: 50%;
  display: inline-flex;
}

.access-data .el-select {
  width: 90%;
}

.access-data .el-card {
  width: 90%;
  border-radius: 0;
  margin-top: 10px;
  height: 296px;
  padding: 0 16px;
}

.submain-content {
  height: calc(100vh - 220px);
  overflow: auto;
  padding: 20px;
}

.tool-bar {
  height: 50px;
  text-align: center;

  .el-button {
    margin: auto 15px;
  }
}

.second-title {
  font-size: 14px;
  color: #333;
  font-weight: bold;
  height: 40px;
  line-height: 40px;
  display: inline-block;
}

.access-box {
  margin-top: 20px;
}

.org-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.info-edit {
  margin: 6px 10px;
  padding: 5px;
  box-sizing: border-box;
}

.tool-bar {
  position: absolute;
  bottom: 10px;
  right: 20px;
}
</style>
