<!--
  author: xxx
  组件说明
-->
<template>
  <!-- 组件内容主体 -->
  <el-tabs class="main_content">
    <el-tab-pane label="基本信息" class="pane-content">
      <el-row :gutter="10" class="filter">
        <el-col :span="24">
          <div class="button-group">
            <el-button size="mini" @click="changeDiv()" type="primary">
              返回
            </el-button>
            <el-button size="mini" v-show="isDeleteUserVisible">
              删除
            </el-button>
          </div>
        </el-col>
      </el-row>
      <el-form
        label-position="right"
        :rules="userInfoRules"
        size="mini"
        style="margin-top: 20px"
        label-width="120px"
        :model="userInfoForm"
        ref="userInfoRef"
      >
        <el-row>
          <el-col style="width: 520px">
            <el-form-item label="用户名：" prop="userName">
              <el-input v-model.trim="userInfoForm.userName" :disabled="isUserNameDisabled"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password" v-if="mode">
              <el-input type="password" v-model="userInfoForm.password"></el-input>
            </el-form-item>
            <el-form-item label="出生年月：">
              <el-date-picker
                v-model="userInfoForm.birthday"
                type="date"
                style="width: 100%"
                placeholder="此参数非必选"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="电话1：">
              <el-input v-model="userInfoForm.telephone1"></el-input>
            </el-form-item>
            <el-form-item label="手机1：">
              <el-input v-model="userInfoForm.mobile1"></el-input>
            </el-form-item>
            <el-form-item label="GPS传感器：">
              <el-input v-model="userInfoForm.gpsSensorId"></el-input>
            </el-form-item>
          </el-col>
          <el-col style="width: 40px">&nbsp;</el-col>
          <el-col style="width: 520px">
            <el-form-item label="姓名：">
              <el-input v-model.trim="userInfoForm.name"></el-input>
            </el-form-item>
            <el-form-item label="性别：">
              <el-radio-group v-model="userInfoForm.sex" class="input-position">
                <el-radio :label="0">男</el-radio>
                <el-radio :label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="邮箱地址：">
              <el-input v-model="userInfoForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话2：">
              <el-input v-model="userInfoForm.telephone2"></el-input>
            </el-form-item>
            <el-form-item label="手机2：">
              <el-input v-model="userInfoForm.mobile2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="角色列表：">
            <el-button size="mini" @click="addOrgAndRole()">添加</el-button>
          </el-form-item>
        </el-row>

        <!--添加组织角色的模态框-->
        <org-and-role
          :org-dialog-visible="orgEditDialogVisible"
          :user-role="selectOrgChoice"
          :user-role-list="userRoles"
          @selectedOAR="selectedNewOrgAndRole"
        ></org-and-role>

        <!--删除确认框-->
        <el-popover ref="popoverDelete" v-model="visibleDelete">
          <h4 style="text-align: center">是否删除该用户？</h4>
          <div style="text-align: center">
            <el-button size="mini" type="text" @click="visibleDelete = false">
              取消
            </el-button>
            <el-button size="mini" type="text" @click="deleteUser()">
              确定
            </el-button>
          </div>
        </el-popover>
      </el-form>
      <div class="block">
        <el-button size="mini" @click="saveUserInfo()" type="primary">保存 </el-button>
      </div>
    </el-tab-pane>

    <el-tab-pane label="传感器" class="pane-content">
      <!--        <sensor></sensor>-->
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts">
// 引入外部组件与ts
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import Http from "@/utils/Http";
import Url from "@/api/url";
import OrgAndRole from "@/views/admins/person_manage/OrgAndRole.vue";
@Component({
  components: { OrgAndRole }
})
export default class UserEditForm extends Vue {
  @Prop({ type: Object, default: {} })
  userInfo!: any;
  @Prop({ type: Boolean, required: true, default: false })
  mode!: any; // true: 新建用户， false: 编辑用户
  @Prop({ type: Number, required: true, default: 0 })
  queryLimit!: Number; // 0: 当前用户及下属组织， 1: 所有组织

  userInfoForm: any = this.userInfo.userInfo;
  userRoles: any = this.userInfo.roles;
  editMode: Boolean = this.mode;

  userInfoRules: any = {
    userName: [
      {
        validator: this.validateUsername,
        required: true,
        trigger: "blur"
      }
    ],
    password: [
      {
        validator: this.validatePassword,
        required: true,
        trigger: "blur"
      }
    ]
  };
  isUserNameDisabled: Boolean = !this.mode; //用户名输入框是否可用
  isDeleteUserVisible: Boolean = !this.mode; //删除用户弹出框框是否显示
  visibleDelete: Boolean = false; //删除用户的弹出框是否显示
  selectOrgChoice: any = this.queryLimit; //判断查全部组织还是当前用户所属组织的标志
  checkUserName: Boolean = true; //用户名检查标志 true:成功 false:重复
  checkPassword: Boolean = true; //用户密码检查标志 true:成功 false:重复
  orgEditDialogVisible: Boolean = false;

  validateUsername(rule: any, value: string, callback: Function): void {
    let _this = this;
    if (value) {
      Http.get(Url.admin.checkUserName, { username: value })
        .then(function(response: any) {
          if (response.data.status == false) {
            callback(new Error("该用户名已经存在"));
            _this.checkUserName = false;
            if (response.status == "401") {
              _this.$router.push("/C001");
            }
          } else {
            _this.checkUserName = true;
          }
        })
        .catch(function() {
          _this.checkUserName = false;
          callback(new Error("服务异常"));
        });
    } else {
      callback("用户名不能为空");
      _this.checkUserName = false;
    }
  }
  validatePassword(rule: any, value: string, callback: Function): void {
    let reg = new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6,12}$");
    if (reg.test(value)) {
      this.userInfoForm.password = value;
      this.checkPassword = true;
      callback();
    } else {
      callback(new Error("6-12位必须包含数字和字母"));
      this.checkPassword = false;
    }
  }

  changeDiv() {
    this.$emit("hiddenDiv", false);
  }
  addOrgAndRole() {
    this.orgEditDialogVisible = true;
  }

  selectedNewOrgAndRole(val: any) {
    this.orgEditDialogVisible = val;
  }
  deleteUserOrg() {}
  deleteUser() {}
  saveUserInfo() {}

  created() {}
}
</script>

<style scoped lang="less">
.main_content {
  min-height: calc(~"100vh - 100px");
  .pane-content {
    min-height: calc(~"100vh - 160px");
    .filter {
      margin-bottom: 16px;
      .button-group {
        float: left;
      }
    }
  }
}
</style>
