<!--
  author: xxx
  组件说明
-->
<template>
  <!-- 组件内容主体 -->
  <div class="container">
    <div class="main_content" v-if="!userInfoDiv">
      <el-row :gutter="10" class="filter">
        <el-col style="width: 600px; float: left">
          <div style="height: 40px;font-size: 18px;line-height: 30px;font-weight: bold;">
            人员列表
          </div>
        </el-col>
        <el-col style="width: 60px; margin-right: 20px; float: right">
          <div class="button-group">
            <el-button size="small" icon="el-icon-plus" @click="createNewUser()">添加</el-button>
          </div>
        </el-col>
        <el-col style="width: 360px; margin-right: 20px; float: right">
          <el-input
            v-model="searchDTO.name"
            @clear="getAllUserListData"
            size="small"
            placeholder="请输入内容"
            class="input-with-select"
            clearable
          >
            <el-button @click="getAllUserListData" slot="append" icon="el-icon-search" class="search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="userListTableData"
        stripe
        :header-row-style="{ height: '60px' }"
        size="mini"
        tooltip-effect="dark"
        style="width: 100%; text-align: center"
      >
        <el-table-column align="center" label="序号" type="index" min-width="60"> </el-table-column>
        <el-table-column align="center" label="用户名" prop="userName" min-width="" show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center" prop="name" label="姓名" min-width="" show-overflow-tooltip> </el-table-column>
        <el-table-column align="center" label="性别" min-width="" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="font-size: 12px" v-if="scope.row.sex === 0">男</span>
            <span style="font-size: 12px" v-else>女</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="email" label="邮件地址" min-width="" show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center" prop="telephone1" label="手机1" min-width="" show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center" prop="mobile1" label="电话1" min-width="" show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center" label="操作" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" title="编辑" @click="userEdit(scope.row.id)">
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              title="删除"
              @click="handleDelete(scope.$index, scope.row)"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          :current-page.sync="searchDTO.currentPage"
          @current-change="getAllUserListData()"
          small
          background
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="searchDTO.total"
        >
        </el-pagination>
      </div>
    </div>
    <user-edit-form
      :user-info="userInfoForm"
      :mode="editMode"
      :query-limit="selectOrgChoice"
      v-if="userInfoDiv"
      @hiddenDiv="userInfoDiv = false"
    ></user-edit-form>
  </div>
</template>
<script lang="ts">
// 引入外部组件与ts
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import Http from "@/utils/Http";
import Url from "@/api/url";
import UserEditForm from "@/views/admins/person_manage/UserEditForm.vue";
@Component({
  components: { UserEditForm }
})
export default class Index extends Vue {
  userListTableData: Array<any> = [];
  name: any = "";
  loading: Boolean = false;
  searchDTO: any = {
    total: 0,
    pageSize: 10,
    currentPage: 1,
    name: ""
  };
  selectOrgChoice: any = 0;
  userInfoForm: any = {};
  userInfoDiv: Boolean = false;
  editMode: Boolean = false;

  createNewUser() {
    this.userInfoForm = {
      userInfo: {},
      roles: []
    };
    this.editMode = true;
    this.userInfoDiv = true;
  }
  userEdit(id: any) {
    const _this = this;
    Http.get(Url.admin.getUserInfo, { userId: id })
      .then((res: any) => {
        if (res.status) {
          this.userInfoForm = res.data.data;
          this.editMode = false;
          this.userInfoDiv = true;
        }
      })
      .catch(function() {
        _this.$message.error("获取该用户信息失败");
      });
  }
  handleDelete(index: any, data: any) {}
  getAllUserListData() {
    if (this.searchDTO.name != "") {
      this.searchDTO.name = this.searchDTO.name.split(" ").join("");
    }
    this.loading = true;
    Http.get(Url.admin.getAllUserList, this.searchDTO).then((res: any) => {
      if (res.data.status) {
        this.loading = false;
        this.userListTableData = res.data.data.list;
        this.searchDTO.total = res.data.data.totalResult;
      }
    });
  }

  created() {
    const start = this;
    Http.get(Url.admin.getRoleList).then((res: any) => {
      if (res.data.status) {
        start.selectOrgChoice = 0;
        res.data.data.forEach((item: any, index: any) => {
          if (item === "Root_Role") {
            start.selectOrgChoice = 1;
          }
        });
      } else {
        this.$message.error("请求失败");
      }
    });
    start.getAllUserListData();
  }
}
</script>

<style scoped lang="less">
.container {
  padding: 6px;
  min-height: calc(~"100vh - 100px");
  .main_content {
    width: 100%;
    padding: 12px 6px;
    min-height: calc(~"100vh - 100px");
    .block {
      position: absolute;
      bottom: 30px;
      right: 30px;
    }
  }
}
</style>
