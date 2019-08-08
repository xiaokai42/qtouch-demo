<!--
  author: zhengdandan
  date: 2019-05-23
  组件说明:
-->
<template>
  <div class="container">
    <div class="main">
      <el-tabs type="border-card" class="content">
        <el-tab-pane label="基本信息" class="pane-content">
          <div class="form-content">
            <el-form
              size="small"
              label-width="150px"
              ref="personDetailsForm"
              :model="personDetailsForm"
              :rules="personDetailsFormRules"
              v-loading="formLoading"
            >
              <el-row :gutter="0">
                <el-col :span="8">
                  <el-form-item label="姓名：" prop="realName">
                    <el-input v-model="personDetailsForm.realName" placeholder="请输入" :disabled="disabled"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="手机号：" prop="mobile">
                    <el-input v-model="personDetailsForm.mobile" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="人员类型：" prop="typeDetailId">
                    <el-cascader
                      :options="personTypeOptions"
                      v-model="personDetailsForm.typeDetailId"
                      :props="typeDetailProps"
                      @change="getCustomOptions"
                      style="width: 100%"
                      clearable
                    >
                      <template slot-scope="{ node, data }">
                        <span>{{ data.name }}</span>
                        <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                      </template>
                    </el-cascader>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="所属组织：" prop="organizationIds">
                    <!--                    <el-cascader-->
                    <!--                      expand-trigger="hover"-->
                    <!--                      :options="orgOptions"-->
                    <!--                      v-model="personDetailsForm.organizationId"-->
                    <!--                      filterable-->
                    <!--                      :props="typeDetailProps"-->
                    <!--                      style="width: 100%"-->
                    <!--                    ></el-cascader>-->
                    <el-cascader
                      :options="orgOptions"
                      v-model="personDetailsForm.organizationIds"
                      :props="organizationProps"
                      style="width: 100%"
                      clearable
                    >
                      <template slot-scope="{ node, data }">
                        <span>{{ data.name }}</span>
                        <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                      </template>
                    </el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="角色：" prop="roleIds">
                    <el-select
                      v-model="personDetailsForm.roleIds"
                      multiple
                      placeholder="请选择"
                      style="width: 100%"
                      :disabled="disabled"
                    >
                      <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="height: 51px">
                  <el-form-item label="性别：" prop="gender">
                    <el-radio-group v-model="personDetailsForm.gender">
                      <el-radio-button label="男"></el-radio-button>
                      <el-radio-button label="女"></el-radio-button>
                      <el-radio-button label="保密"></el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="出生年月：" prop="birthDay">
                    <el-date-picker
                      v-model="personDetailsForm.birthDay"
                      type="date"
                      clearable
                      placeholder="选择日期"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd "
                      style="width: 100%"
                      :disabled="disabled"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="邮箱：" prop="email">
                    <el-input v-model="personDetailsForm.email" placeholder="请输入" :disabled="disabled"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="电话：" prop="telPhone">
                    <el-input v-model="personDetailsForm.telPhone" placeholder="请输入" :disabled="disabled"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="传感器：">
                    <el-input size="small" disabled>
                      <el-button
                        slot="append"
                        icon="el-icon-setting"
                        class="search"
                        @click="sensorIntroduction"
                        style="color: #fff;background: #409eff;"
                      ></el-button>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item label="上传图片：">
                  <el-upload
                    ref="upload"
                    class="avatar-uploader"
                    v-loading="loading"
                    :show-file-list="false"
                    action="/test/file/upload"
                    :http-request="customHttpRequest"
                    accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                    :disabled="disabled"
                  >
                    <img v-if="personDetailsForm.photo" :src="personDetailsForm.photo" class="avatar" alt="" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-button type="text" disabled>
                    自定义属性
                  </el-button>
                </el-col>
              </el-row>

              <!--自定义属性列表展示-->
              <el-row :gutter="0" class="customRow">
                <custom-input :customOptions="customOptions" ref="custom-input"></custom-input>
              </el-row>
            </el-form>
          </div>
          <div class="block">
            <el-button size="small" @click="switchToPersonList">返回 </el-button>
            <el-button type="primary" size="small" @click="savePerson('personDetailsForm')" v-show="visible"
              >保存
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="传感器" class="pane-content">
          <el-row :gutter="10" class="filter">
            <el-col :span="5">
              <el-input size="small" placeholder="请输入内容" class="input-with-select" clearable>
                <el-button slot="append" icon="el-icon-search" class="search"></el-button>
              </el-input>
            </el-col>
          </el-row>
          <el-table
            ref="multipleTable"
            :data="pagination.tableData"
            stripe
            :header-row-style="{ height: '60px' }"
            height="calc(100vh - 200px)"
            size="small"
            tooltip-effect="dark"
            style="width: 100%; text-align: center"
          >
            <el-table-column align="center" label="序号" type="index" min-width="60"> </el-table-column>
            <el-table-column align="center" type="selection" min-width="60"> </el-table-column>
            <el-table-column align="center" prop="sensorId" label="传感器ID" show-overflow-tooltip> </el-table-column>
            <el-table-column align="center" label="操作" width="120">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="text"
                  icon="el-icon-view"
                  title="查看"
                  @click="handleEdit(scope.$index, scope.row)"
                >
                </el-button>
                <el-button
                  size="small"
                  type="text"
                  icon="el-icon-edit"
                  title="编辑"
                  @click="openSensorForm('编辑', scope.row)"
                >
                </el-button>
                <el-button size="small" type="text" icon="el-icon-delete" title="删除" @click="handleDelete(scope.row)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination small :page-size="10" layout="total, prev, pager, next, jumper" :total="pagination.total">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!--引入传感器弹窗-->
      <el-dialog title="传感器" :visible.sync="sensorDialogVisible" width="30%">
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="sensorDialogVisible = false">取 消 </el-button>
          <el-button size="small" type="primary">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import CustomInput from "@/components/custom_input/CustomInput.vue";
import Http from "@/utils/Http";
import Url from "@/api/url";
import Utils from "@/utils/utils";
import store from "@/store";

@Component({
  components: { CustomInput }
})
export default class PersonDetails extends Vue {
  formLoading: any = false; //form加载
  @Prop({ type: String })
  listRowId!: any;
  @Prop({ type: String })
  method!: any;
  // 用于父组件给组件传值
  customOptions: Array<any> = [];
  // 人员基本属性表单(没有包括自定义属性)
  personDetailsForm: any = {};
  // 人员基本属性表单规则(没有包括自定义属性)
  personDetailsFormRules: any = {
    mobile: [
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
    ],
    realName: [
      {
        required: true,
        message: "该选项为必填项",
        trigger: "change"
      }
    ]
  };
  // 人员类型选项
  personTypeOptions: Array<any> = [];
  // 当前用户能看到的所有组织
  orgOptions: Array<any> = [];
  // 组织角色
  roleOptions: Array<any> = [];
  // 输入框是否可输入，用于查看情况
  disabled: boolean = false;
  // 隐藏确定按钮，用于查看情况
  visible: boolean = true;
  // 图片相关
  loading: boolean = false;
  // 分页信息
  pagination: any = {
    // 查询关键字
    condition: "",
    // 表格信息
    tableData: [],
    // 用于查询和显示某页数据
    currentPage: 1,
    // 分页条数
    pageSize: 10,
    // 总条数
    total: 0
  };
  // 传感器弹窗
  sensorDialogVisible: any = false;
  // 通用适配prop
  typeDetailProps: any = {
    label: "name",
    value: "id",
    checkStrictly: true
  };
  // 组织机构prop
  organizationProps: any = {
    label: "name",
    value: "id",
    checkStrictly: true,
    multiple: true
  };

  created() {
    if (this.listRowId) {
      this.getPersonInfo(this.listRowId);
    }
    this.getPersonTypes();
    this.getOrgInfo();
    this.getRoleList();
  }
  // 获取人员信息
  getPersonInfo(personId: any) {
    this.formLoading = true;
    Http.get(Url.person.getPersonInfoById, { personId: personId }).then((response: any) => {
      this.formLoading = false;
      if (response.data.status) {
        this.personDetailsForm = response.data.data;
        if (this.personDetailsForm.extInfoVO) {
          this.customOptions = this.personDetailsForm.extInfoVO;
        }
        this.personDetailsForm.typeDetailId = this.personDetailsForm.typeDetailId.split(",");
      }
    });
  }
  // 切换到部件列表页面
  @Emit("switch")
  switchToPersonList() {}
  // 获取人员类型
  getPersonTypes() {
    Http.get(Url.typeDetail.findTypeTree + "/person").then((response: any) => {
      if (response.data.status) {
        this.personTypeOptions = response.data.data;
        Utils.removeEmptyChildren(this.personTypeOptions);
      }
    });
  }
  // 获得自定义属性
  getCustomOptions() {
    Http.get(Url.typeDetail.getTemplateByTypeDetaiId + "/" + this.personDetailsForm.typeDetailId).then(
      (response: any) => {
        if (response.data.status) {
          this.customOptions = response.data.data;
        }
      }
    );
  }
  // 获取组织机构
  getOrgInfo() {
    Http.get(Url.organizaition.getOrgTreeData).then((res: any) => {
      if (res.data.status) {
        this.orgOptions = res.data.data;
        Utils.removeEmptyChildren(this.orgOptions);
      }
    });
  }
  // 获取角色列表
  getRoleList() {
    Http.get(Url.auth.roleList).then((res: any) => {
      if (res.data.status) {
        this.roleOptions = res.data.data;
      }
    });
  }
  // 打开传感器引入弹窗
  sensorIntroduction() {
    this.sensorDialogVisible = true;
  }
  // 自定义上传文件
  customHttpRequest(data: any) {
    this.loading = true;
    let fData = Utils.createUploadForm(data.file);
    this.$axios.post(data.action, fData.formData, fData.config).then((response: any) => {
      this.loading = false;
      if (response.data.status) {
        this.$message.success("图片上传成功！！");
        this.personDetailsForm.photo = response.data.data.accessUrl;
      }
    });
  }
  // 获得组件CustomInput填充之后的数据
  async getFilledCustomOptions() {
    return await (this.$refs["custom-input"] as any).formValidation();
  }
  // 保存人员信息
  savePerson(personDetailsForm: any) {
    this.getFilledCustomOptions().then((data: any) => {
      if (data) {
        this.personDetailsForm.extInfo = data;
      }
      // let tempObject = Object.assign({}, this.personDetailsForm);
      let tempObject = JSON.parse(JSON.stringify(this.personDetailsForm));
      (this.$refs[personDetailsForm] as any).validate((valid: any) => {
        if (valid) {
          tempObject.typeDetailId = Utils.lastOfArr(tempObject.typeDetailId);
          // tempObject.organizationIds = this.dataProcessing(tempObject.organizationIds);
          let tempArray: Array<any> = [];
          tempObject.organizationIds.forEach((item: Array<any>) => {
            tempArray.push(Utils.lastOfArr(item));
          });
          tempObject.organizationIds = tempArray;
          // console.log(tempObject);
          //验证手机号是否绑定账号信息
          Http.get(Url.person.findByMobile, {
            mobile: tempObject.mobile
          }).then((response: any) => {
            if (response.data.status) {
              if (response.data.data) {
                let res = response.data.data;
                if (res.realName != tempObject.realName) {
                  //提示账号存在，显示账号的手机和姓名，让用户确认是否用账号的姓名替换现在的姓名，确认后执行保存
                  this.$confirm(
                    "手机号【" + res.mobile + "】已绑定用户【" + res.realName + "】，是否使用该用户名替换当前用户？",
                    "提示",
                    {
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      type: "warning"
                    }
                  )
                    .then(() => {
                      tempObject.accountId = res.id;
                      this.doSave(tempObject);
                    })
                    .catch(() => {
                      this.$message({
                        type: "info",
                        message: "操作取消"
                      });
                    });
                } else {
                  this.doSave(tempObject);
                }
              } else {
                this.doSave(tempObject);
              }
            } else {
              this.$message.error(response.data.message);
            }
          });
        }
      });
    });
  }
  // 提交后台保存
  doSave(tempObject: any) {
    let url = Url.person.add;
    if (this.method == "edit") {
      url = Url.person.update;
    }
    Http.post(url, tempObject).then((response: any) => {
      if (response.data.status) {
        this.$message.success(response.data.message);
        this.switchToPersonList();
      } else {
        this.$message.error(response.data.message);
      }
    });
  }
  // 数据处理
  dataProcessing(data: Array<any>) {
    let tempArray: Array<any> = [];
    data.forEach(item => {
      tempArray.push(item.pop());
    });
    return tempArray;
  }
}
</script>

<style lang="less" scoped>
@import "~assets/style/modelDetail.less";
</style>
