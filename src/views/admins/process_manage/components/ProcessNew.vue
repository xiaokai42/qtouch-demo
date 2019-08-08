<template>
  <div class="my-main" v-loading="loading">
    <el-button size="small" style="position: absolute;right: 20px;top: 20px;z-index: 999;" @click="handleCancel"
      >返回</el-button
    >
    <div class="step">
      <el-steps :space="300" :active="state" finish-status="success" align-center>
        <el-step title="流程设计"></el-step>
        <el-step title="基础设置"></el-step>
        <el-step title="表单设计"></el-step>
        <el-step title="指派"></el-step>
      </el-steps>
    </div>
    <div class="body">
      <template v-if="state === 0">
        <div style="margin-top: 20px;">
          <el-upload
            style="display: inline-block;margin-left: 20px"
            :action="uploadProcessFileUrl"
            :data="uploadParam"
            :show-file-list="false"
            ref="upload"
            :on-success="handleUploadFileSuccess"
            :on-error="handleUploadFileSuccess"
            multiple
            :limit="1"
          >
            <el-button size="mini" type="primary">直接导入</el-button>
          </el-upload>
          <el-button v-if="data && !reDesign" size="mini" style="margin-left: 20px;" @click="handleReDesign"
            >重新设计</el-button
          >
        </div>
        <div v-if="!data || reDesign" class="iframe">
          <iframe ref="iframe" src="/bpmn/index.html" frameborder="0" width="100%" height="100%"></iframe>
        </div>
        <div v-else>
          <img :src="getProcessImage + '?procId=' + data.procdefId" alt="" />
        </div>
      </template>
      <template v-if="state === 1">
        <table class="form">
          <tr>
            <td>选择分组：</td>
            <td>
              <el-select placeholder="请选择" v-model="typeId" clearable style="width: 496px;">
                <el-option
                  v-for="(item, index) in typeOptions"
                  :key="index"
                  :label="item.procdefTypeName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td>可见组织：</td>
            <td>
              <el-transfer
                filterable
                v-model="orgValue"
                :data="invisibleOrgList"
                :titles="['组织列表', '可见组织']"
                :props="{ key: 'id', label: 'name' }"
              ></el-transfer>
            </td>
          </tr>
          <tr>
            <td>可见角色：</td>
            <td>
              <el-transfer
                filterable
                v-model="roleValue"
                :data="invisibleRoleList"
                :titles="['角色列表', '可见角色']"
                :props="{ key: 'id', label: 'name' }"
              ></el-transfer>
            </td>
          </tr>
          <tr>
            <td>可见用户：</td>
            <td>
              <el-transfer
                filterable
                v-model="userValue"
                :data="invisibleUserList"
                :titles="['用户列表', '可见用户']"
                :props="{ key: 'id', label: 'name' }"
              ></el-transfer>
            </td>
          </tr>
        </table>
      </template>
      <template v-if="state === 2">
        <div class="temp-form">
          <div class="inline">
            <div class="label">使用模板：</div>
            <el-switch v-model="useTemp"></el-switch>
            <el-button size="mini" style="margin-left: 20px;" v-if="!useTemp" @click="handleNewForm"
              >新建表单</el-button
            >
          </div>
          <div class="inline" v-if="useTemp">
            <div class="label">模板选择：</div>
            <el-select placeholder="请选择" v-model="formId" @change="handleSelectForm" clearable style="width: 100%;">
              <el-option
                v-for="(item, index) in formList"
                :key="index"
                :label="item.formName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="form-designer" v-if="designerVisible">
          <form-designer :data="formItem" style="margin-top: 20px;" ref="formDesigner"></form-designer>
        </div>
      </template>
      <template v-if="state === 3">
        <div class="assign">
          <div class="tip-bar"><i class="el-icon-info" style="color: #fadb14;"></i>每个任务节点不能同时指派人和组</div>
          <div style="padding: 20px;">
            <el-table :data="assignList" size="mini" stripe>
              <el-table-column align="center" property="userTask.name" label="任务名"> </el-table-column>
              <el-table-column align="center" label="指派人">
                <template slot-scope="scope">
                  <el-select
                    size="mini"
                    :multiple="scope.row.isCountersign"
                    :disabled="!!scope.row.orgId || !!scope.row.roleId"
                    v-model="scope.row.userId"
                    @clear="handleClear"
                    filterable
                    clearable
                    reserve-keyword
                    placeholder="请输入姓名"
                  >
                    <el-option
                      v-for="item in invisibleUserList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" label="指派组">
                <template slot-scope="scope">
                  <el-select
                    size="mini"
                    :disabled="!!scope.row.userId || !!scope.row.roleId"
                    reserve-keyword
                    v-model="scope.row.orgId"
                    @change="$forceUpdate()"
                    clearable
                    filterable
                    placeholder="请输入组织名"
                  >
                    <el-option
                      v-for="item in invisibleOrgList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" label="指派角色">
                <template slot-scope="scope">
                  <el-select
                    size="mini"
                    :disabled="!!scope.row.userId || !!scope.row.orgId"
                    v-model="scope.row.roleId"
                    filterable
                    clearable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in invisibleRoleList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" label="指派表单">
                <template slot-scope="scope">
                  <el-select size="small" clearable v-model="scope.row.formId" filterable placeholder="请选择">
                    <el-option
                      v-for="item in formList"
                      :key="item.id"
                      :label="item.formName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </div>
    <div class="btn">
      <el-button v-if="state !== 0" size="small" @click="handlePrev">上一步 </el-button>
      <el-button
        v-if="(state === 0 && data && !reDesign) || state === 1 || state === 2"
        size="small"
        type="primary"
        :disabled="!currentData"
        @click="currentData && handleNext()"
      >
        下一步
      </el-button>
      <el-button v-if="state === 3" size="small" type="primary" @click="handleRelease">
        {{ data ? "保存" : "发布" }}
      </el-button>
      <!--<el-button v-if="data && state === 0" size="small" @click="handleDownload"
        >下载</el-button
      >-->
      <el-button size="small" @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * @Author: liuyang
 * @Date: 2019-07-02 15:41
 */
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import FormDesigner from "@/components/form_designer/FormDesigner.vue";
import Http from "@/utils/Http";
import Url from "@/api/url";

@Component({
  components: {
    FormDesigner
  }
})
export default class ProcessNew extends Vue {
  @Prop({ type: Object })
  data?: any;
  loading: boolean = false;
  reDesign: boolean = false;
  state: 0 | 1 | 2 | 3 = 0;
  currentData: any = this.data || {};
  getProcessImage: string = Url.admin.getProcessImage;
  uploadProcessFileUrl: string = Url.admin.uploadProcessFile;
  uploadParam: any = { importState: 0 };
  typeId: string = this.data ? this.data.typeId : "";
  typeOptions: Array<any> = [];
  orgValue: Array<any> = [];
  invisibleOrgList: Array<any> = [];
  userValue: Array<any> = [];
  invisibleUserList: Array<any> = [];
  roleValue: Array<any> = [];
  invisibleRoleList: Array<any> = [];
  useTemp: boolean = false;
  searchFormName: string = "";
  formList: Array<any> = [];
  designerVisible: boolean = false;
  formDesigner: any = null;
  formId: string = "";
  formItem: any = null;
  assignList: Array<any> = [];

  async mounted() {
    if (!this.data || this.reDesign) {
      this.initIframe();
    }
  }

  initIframe() {
    this.$nextTick(() => {
      let iframe: any = this.$refs.iframe;
      iframe.contentWindow.addEventListener("load", function() {
        iframe.contentWindow.createNewDiagram();
      });
      iframe.contentWindow.finish = (data: any) => {
        this.saveProcessFile(data, 0);
      };
    });
  }

  handleReDesign() {
    this.reDesign = true;
    this.initIframe();
  }

  async saveProcessFile(xmlData: any, importState: number) {
    this.loading = true;
    try {
      let {
        data: { data, status, message }
      } = await Http.post(Url.admin.saveProcessFile, {
        text: xmlData,
        importState: importState
      });
      if (status) {
        if (data.message === "已经存在相同流程，是否更新此流程？") {
          this.$confirm(data.message, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.saveProcessFile(xmlData, 1);
          });
        } else {
          this.$message.success("导入成功");
          this.getProcdefById(data.data);
        }
      } else {
        this.$message.error(message);
      }
    } finally {
      this.loading = false;
    }
  }

  handleUploadFileSuccess(data: any) {
    if (data.message === "已经存在相同流程，是否更新此流程？") {
      this.$confirm(data.message, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let upload: any = this.$refs.upload;
        this.uploadParam = {
          importState: 1
        };
        upload.submit();
      });
    } else {
      this.$message.success("导入成功");
      this.uploadParam = {
        importState: 0
      };
      this.getProcdefById(data.data.data);
    }
  }

  async getProcdefById(id: string) {
    let {
      data: { data, status, message }
    } = await Http.get(Url.admin.getProcdefById, { id });
    if (status) {
      this.currentData = data;
      this.handleNext();
    } else {
      this.$message.error(message);
    }
  }
  // 获取所有流程类型
  async getAllProcessType() {
    let {
      data: { data, status, message }
    } = await Http.get(Url.admin.getAllProcessType);
    if (status) {
      this.typeOptions = data;
    } else {
      this.$message.error(message);
    }
  }
  // 更新流程类型
  async updateProcessType() {
    let {
      data: { data, status, message }
    } = await Http.put(Url.admin.updateProcessType, {
      id: this.currentData.id,
      typeId: this.typeId
    });
    if (status) {
      return true;
    } else {
      this.$message.error(message);
    }
  }
  // 获取不可见组织
  async getAllOrg() {
    let {
      data: { data, status, message }
    } = await Http.get(Url.admin.getAllOrg, {
      procdefKey: this.currentData.procdefKey
    });
    if (status) {
      this.invisibleOrgList = data.map((item: any) => {
        return {
          id: item.orgId,
          name: item.orgName
        };
      });
    } else {
      this.$message.error(message);
    }
  }
  // 获取不可见角色
  async getAllRole() {
    let {
      data: { data, status, message }
    } = await Http.get(Url.admin.getAllRole, {
      procdefKey: this.currentData.procdefKey
    });
    if (status) {
      this.invisibleRoleList = data.map((item: any) => {
        return {
          id: item.roleId,
          name: item.roleName
        };
      });
    } else {
      this.$message.error(message);
    }
  }
  // 获取不可见用户
  async getAllUser(userName?: string) {
    let {
      data: { data, status, message }
    } = await Http.get(Url.admin.getAllUser, {
      userName,
      procdefKey: this.currentData.procdefKey
    });
    if (status) {
      this.invisibleUserList = data.map((item: any) => {
        return {
          id: item.userId,
          name: item.userName
        };
      });
    } else {
      this.$message.error(message);
    }
  }
  // 获取可见组织
  async getProcessVisibleOrg() {
    let {
      data: { data, status, message }
    } = await Http.get(Url.admin.getProcessVisibleOrg, {
      procdefKey: this.currentData.procdefKey
    });
    if (status) {
      this.orgValue = data.map((d: any) => d.orgId);
    } else {
      this.$message.error(message);
    }
  }
  // 获取可见角色
  async getProcessVisibleRole() {
    let {
      data: { data, status, message }
    } = await Http.get(Url.admin.getProcessVisibleRole, {
      procdefKey: this.currentData.procdefKey
    });
    if (status) {
      this.roleValue = data.map((d: any) => d.roleId);
    } else {
      this.$message.error(message);
    }
  }
  // 获取可见用户
  async getProcessVisiblePerson() {
    let {
      data: { data, status, message }
    } = await Http.get(Url.admin.getProcessVisiblePerson, {
      procdefKey: this.currentData.procdefKey
    });
    if (status) {
      this.userValue = data.map((d: any) => d.userId);
    } else {
      this.$message.error(message);
    }
  }
  // 保存可见组织
  async saveProcessVisibleOrg() {
    let {
      data: { data, status, message }
    } = await Http.post(Url.admin.saveProcessVisibleOrg, {
      procdefKey: this.currentData.procdefKey,
      ids: this.orgValue
    });
    if (status) {
      return true;
    } else {
      this.$message.error(message);
    }
  }
  // 保存可见角色
  async saveProcessVisibleRole() {
    let {
      data: { data, status, message }
    } = await Http.post(Url.admin.saveProcessVisibleRole, {
      procdefKey: this.currentData.procdefKey,
      ids: this.roleValue
    });
    if (status) {
      return true;
    } else {
      this.$message.error(message);
    }
  }
  // 保存可见用户
  async saveProcessVisibleUser() {
    let {
      data: { data, status, message }
    } = await Http.post(Url.admin.saveProcessVisibleUser, {
      procdefKey: this.currentData.procdefKey,
      ids: this.userValue
    });
    if (status) {
      return true;
    } else {
      this.$message.error(message);
    }
  }
  // 获取所有表单
  async getAllFormList() {
    let {
      data: { data, status, message }
    } = await Http.get(Url.admin.getFormList, {
      formName: this.searchFormName,
      pageSize: 999999,
      pageNum: 1
    });
    if (status) {
      this.formList = data.records;
    } else {
      this.$message.error(message);
    }
  }
  // 获取流程表单
  async getProcdefByKey() {
    let {
      data: { data, status, message }
    } = await Http.get(Url.admin.getProcdefByKey, {
      procdefKey: this.currentData.procdefKey
    });
    if (status) {
      if (data) {
        this.formItem = this.formList.find((item: any) => item.id === data.formId);
        this.resetFormDesigner();
      }
    } else {
      this.$message.error(message);
    }
  }
  // 选择表单
  handleSelectForm(id: string) {
    this.formItem = this.formList.find((d: any) => d.id === id);
    this.resetFormDesigner();
  }
  // 新建表单
  handleNewForm() {
    this.formItem = {};
    this.resetFormDesigner();
  }
  // 重置 formDesigner 组件
  resetFormDesigner() {
    this.designerVisible = false;
    this.$nextTick(() => {
      this.designerVisible = true;
      this.$nextTick(() => {
        this.formDesigner = this.$refs.formDesigner;
      });
    });
  }
  // 保存表单设计
  saveFormDesign() {
    return new Promise(resolve => {
      this.formDesigner.save(async (formId: string) => {
        if (formId) {
          this.formId = formId;
          resolve(await this.saveProcessForm());
        } else {
          resolve(false);
        }
      });
    });
  }
  // 保存流程对应的表单
  async saveProcessForm() {
    let {
      data: { data, status, message }
    } = await Http.post(Url.admin.saveProcessForm, {
      procdefKey: this.currentData.procdefKey,
      formId: this.formId
    });
    if (status) {
      return true;
    } else {
      this.$message.error(message);
    }
  }
  // 获取节点指派情况
  async getAssignTaskList() {
    let {
      data: { data, status, message }
    } = await Http.get(Url.admin.getAssignTaskList, {
      processDefineId: this.currentData.procdefId
    });
    if (status) {
      data.shift();
      data.forEach((item: any) => {
        let userInfoVOS = item.userInfoVOS;
        if (userInfoVOS) {
          item.userId = item.isCountersign ? userInfoVOS.map((d: any) => d.userId) : userInfoVOS[0].userId;
        }
        let orgVO = item.orgVO;
        if (orgVO) {
          item.orgId = orgVO.orgId;
        }
        let roleVO = item.roleVO;
        if (roleVO) {
          item.roleId = roleVO.roleId;
        }
        //重置调用方法
        // if (!isReload) {
        //   if (currentValue.orgVO !== null) {
        //     currentValue.orgList.push(currentValue.orgVO)
        //     currentValue.userInfoDisable = true
        //     currentValue.orgId = currentValue.orgVO.orgId
        //   }
        //   if (currentValue.roleVO !== null) {
        //     currentValue.roleList.push(currentValue.roleVO)
        //     currentValue.roleId = currentValue.roleVO.roleId
        //   }
        //   if (currentValue.userInfoVOS !== null) {
        //     currentValue.orgStateDisable = true
        //     if (currentValue.countersign === false) {
        //       currentValue.userInfoList.push(currentValue.userInfoVOS[0])
        //       currentValue.userInfoId = currentValue.userInfoVOS[0].userId
        //     }
        //     else {
        //       currentValue.userInfoId = []
        //       currentValue.userInfoList = currentValue.userInfoVOS
        //       currentValue.userInfoVOS.forEach((item, index) => {
        //         currentValue.userInfoId.push(item.userId)
        //       })
        //     }
        //   }
        // }
      });
      this.assignList = data;
    } else {
      this.$message.error(message);
    }
  }
  handleClear() {
    console.log(arguments);
  }
  // 指派流程的各个节点信息
  async saveUserTaskDesignator() {
    let requestBody = this.assignList.map((item: any) => {
      let userInfoId = item.userId;
      if (!Array.isArray(userInfoId)) {
        userInfoId = [userInfoId];
      }
      return {
        formId: item.formId,
        processDefineId: this.currentData.procdefId,
        userTaskId: item.userTask.id,
        userInfoId: userInfoId,
        roleId: item.roleId,
        orgId: item.orgId
      };
    });
    let {
      data: { data, status, message }
    } = await Http.post(Url.admin.saveUserTaskDesignator, requestBody);
    if (status) {
      return true;
    } else {
      this.$message.error(message);
    }
  }

  async handleNext() {
    this.state++;
    switch (this.state) {
      case 1:
        this.getAllProcessType();
        this.getAllOrg();
        this.getAllUser();
        this.getAllRole();
        this.getProcessVisibleOrg();
        this.getProcessVisibleRole();
        this.getProcessVisiblePerson();
        break;
      case 2:
        await this.getAllFormList();
        this.data && this.getProcdefByKey();
        break;
      case 3:
        this.getAssignTaskList();
        break;
    }
  }

  handlePrev() {
    this.state--;
    if (this.state === 0) {
      this.initIframe();
    }
  }

  handleCancel() {
    this.$emit("hidden");
  }

  async handleRelease() {
    this.loading = true;
    try {
      let resStatus = (await Promise.all([
        this.updateProcessType(),
        this.saveProcessVisibleOrg(),
        this.saveProcessVisibleRole(),
        this.saveProcessVisibleUser(),
        this.saveFormDesign(),
        this.saveUserTaskDesignator()
      ])).every((d: any) => d === true);
      if (resStatus) {
        this.handleCancel();
        this.$message.success(this.data ? "保存成功" : "发布成功");
      }
    } finally {
      this.loading = false;
    }
  }
  // 下载流程图
  handleDownload() {
    window.open(Url.admin.downloadProcessFile + "?procdefId=" + this.currentData.procdefId);
  }

  created(): void {}
}
</script>

<style scoped lang="less">
.my-main {
  min-height: calc(100vh - 130px);
  position: relative;
  padding-bottom: 50px;
  background: #fff;
}

.step {
  padding-top: 20px;
  width: 1200px;
  margin: auto;
}

.iframe {
  height: 680px;
}

.temp-form {
  width: 500px;
  margin: 50px auto 0;
  .inline {
    margin-top: 15px;
    display: flex;
    align-items: center;
  }
  .label {
    flex: none;
    width: 100px;
    text-align: right;
    padding-right: 12px;
    font-size: 14px;
  }
}

.form-designer {
  width: 1000px;
  padding: 0 20px 50px;
  margin: 20px auto 0;
  border-radius: 8px;
  border: 1px solid #eaeaea;
}

.form {
  width: 630px;
  margin: 50px auto 0;
  td {
    padding: 10px;
  }
  td:nth-child(2n-1) {
    width: 100px;
    text-align: right;
  }
}

.assign {
  .tip-bar {
    margin-top: 20px;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    background: #f4f4f5;
    i {
      font-size: 16px;
      margin-right: 6px;
    }
  }
}

.btn {
  margin-top: 50px;
  text-align: center;
}
</style>
