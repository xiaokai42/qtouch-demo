<!--
  author: xxx
  组件说明
-->
<template>
  <!-- 组件内容主体 -->
  <div>
    <!-- 已有组织/角色显示列表 -->
    <div v-if="userRolesHaving.length > 0">
      <el-row class="organizeAndRoleRow" v-for="(ORItem, index) in userRolesHaving" :key="index">
        <el-col style="width: 200px; float: left">
          <el-tag type="info" size="medium" color="#ffffff" style="width: 80%;margin-bottom: 10px">
            <span>组织{{ index + 1 }}：</span>{{ ORItem.sysOrg.orgName }}
            <!--  <i class="el-icon-close" @click="deleteOrg()"></i>  -->
          </el-tag>
        </el-col>
        <el-col style="max-width: 760px; min-width: 200px; float: left">
          <el-tag type="info" color="#ffffff" size="medium" style="width: 100%;margin-bottom: 10px">
            <span style="float: left">角色：</span>
            <div
              v-for="(role, index) in ORItem.sysRoles"
              :key="role.id"
              style="width: auto; margin: 0 10px; float: left"
            >
              {{ index + 1 }}、{{ role.roleName }}
            </div>
          </el-tag>
        </el-col>
      </el-row>
    </div>
    <!-- 添加组织/角色 模态框 -->
    <el-dialog
      title="添加组织与角色"
      :visible.sync="orgRoleVisible"
      center
      :show-close="false"
      v-if="orgRoleVisible"
      width="640px"
    >
      <el-form label-width="40px" size="mini" v-model="selectedOR">
        <el-form-item label="组织">
          <el-select
            v-model="selectedOR.sysOrg.id"
            filterable
            placeholder="请选择组织(可搜索)"
            @change="checkSelectedOrg"
            style="width: 100%"
          >
            <el-option v-for="org in allOrganizationList" :key="org.id" :label="org.orgName" :value="org.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <!--角色多选框-->
          <el-checkbox-group v-model="selectedOR.sysRoles">
            <el-checkbox
              style="width: 100px;margin-left: 10px"
              v-for="role in allRolesList"
              :label="role.id"
              :key="role.id"
              >{{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="addOrgRole()">
          确 定
        </el-button>
        <el-button size="mini" @click="closeDialog()">
          取 消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
// 引入外部组件与ts
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import Http from "@/utils/Http";
import Url from "@/api/url";

@Component
export default class OrgAndRole extends Vue {
  @Prop({ type: Boolean, default: false, required: true })
  orgDialogVisible!: Boolean;
  @Prop({ type: Number, default: 0, required: true })
  userRole!: Number;
  @Prop({ type: Array, required: true })
  userRoleList!: Array<any>;

  userRolesHaving: Array<any> = this.userRoleList; // 用户已有组织、角色列表
  allRolesList: Array<any> = []; // 所有角色列表
  selectedOR: any = {
    sysOrg: { id: "" },
    sysRoles: []
  };

  orgRoleVisible: Boolean = this.orgDialogVisible;
  requestRole: String = "other";
  organizations: Array<any> = [];
  allOrganizationList: Array<any> = [];
  checkedRolesData: Array<any> = [];

  // 验证选中的组织
  checkSelectedOrg(val: any) {
    this.userRolesHaving.forEach((value: any) => {
      if (value.sysOrg.id === val) {
        this.$message.error("选取组织与已在组织重复，请重新选择");
        this.selectedOR.sysOrg.id = "";
      }
    });
  }
  addOrgRole() {
    let _this = this;
    if (_this.selectedOR.sysOrg.id === "") {
      _this.$message.error("组织不能为空！");
    } else {
      if (_this.selectedOR.sysRoles.length == 0) {
        _this.$message.error("角色不能为空！");
      } else {
        _this.userRolesHaving.push(_this.supplementSelectedOR(_this.selectedOR));
        this.$emit("selectedOAR", false, _this.userRolesHaving);
      }
    }
  }
  closeDialog() {
    this.$emit("selectedOAR", false);
  }
  deleteOrg() {}
  beforeSelectLoad() {
    // 获取对应的所有角色列表、组织列表
    Http.get(Url.admin.getRoleList).then((res: any) => {
      if (res.status) {
        this.allRolesList = res.data.data;
      } else {
        this.$Message.warning("获取角色列表失败，请联系管理员");
      }
    });
    if (this.requestRole === "admin") {
      Http.get(Url.admin.getAllOrgList).then((res: any) => {
        if (res.status) {
          this.allOrganizationList = res.data.data;
        } else {
          this.$Message.warning("获取组织列表失败，请联系管理员");
        }
      });
    } else {
      Http.get(Url.admin.getOrgListByRole).then((res: any) => {
        if (res.status) {
          this.allOrganizationList = res.data.data;
        } else {
          this.$Message.warning("获取组织列表失败，请联系管理员");
        }
      });
    }
  }
  // 将添加的组织角色部分填充完整
  supplementSelectedOR(data: any) {
    this.allOrganizationList.forEach((item: any) => {
      if (item.id === data.sysOrg.id) {
        data.sysOrg = item;
      }
    });
    this.allRolesList.forEach((item: any) => {
      for (let i = 0; i < data.sysRoles.length; i++) {
        if (item.id === data.sysRoles[i]) {
          data.sysRoles[i] = item;
        }
      }
    });
    return data;
  }
  // getUserRolesHaving() {
  //   let i = 0;
  //   this.userRoleList.forEach((item: any) => {
  //     this.organizations[i] = item.sysOrg;
  //     this.organizations[i].index = i;
  //     this.roles[i] = item.sysRoles;
  //     i++;
  //   });
  //   this.roles.forEach((val: any) => {
  //     let tempArray: Array<any> = [];
  //     let k = 0;
  //     val.forEach((value: any) => {
  //       tempArray[k] = value.id;
  //       k++;
  //     });
  //     this.rolesId[i] = tempArray;
  //     i++;
  //   });
  // }

  beforeMount() {
    if (this.userRole === 1) {
      this.requestRole = "admin";
    } else {
      this.requestRole = "other";
    }
    this.beforeSelectLoad();
    // this.getUserRolesHaving();
  }

  @Watch("orgDialogVisible", { deep: true })
  setDialogVisible(newVal: any) {
    this.orgRoleVisible = newVal;
  }
  @Watch("userRole", { deep: true })
  setUserRole(newVal: any) {
    if (newVal === 1) {
      this.requestRole = "admin";
    } else {
      this.requestRole = "other";
    }
  }
  @Watch("userRoleList", { deep: true })
  setUserRoleList(newVal: any) {
    // this.getUserRolesHaving();
  }
}
</script>

<style scoped lang="less">
.organizeAndRoleRow {
  margin-left: 120px;
  min-height: 40px;
  overflow: auto;
}
</style>
