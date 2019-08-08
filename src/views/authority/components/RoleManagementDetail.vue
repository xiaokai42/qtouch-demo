<template>
  <div class="sub-container">
    <el-form size="small" label-width="150px" ref="form" :model="form" :rules="formRules" v-loading="loading">
      <el-form-item label="角色名称：" prop="name">
        <el-input style="width: 220px;" v-model="form.name" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="编码：" prop="code">
        <el-input style="width: 220px;" v-model="form.code" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="角色类型：" prop="roleType">
        <el-select style="width: 220px;" v-model="form.roleType" placeholder="请输入">
          <el-option label="超级管理员" value="TENANT_SUPER_ADMIN"></el-option>
          <el-option label="自定义角色" value="NORMAL"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="默认角色：" prop="defaultRole">
        <el-radio v-model="form.defaultRole" placeholder="请输入" :label="true">是</el-radio>
        <el-radio v-model="form.defaultRole" placeholder="请输入" :label="false">否</el-radio>
      </el-form-item>
      <el-form-item label="描述：" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入" :rows="3"></el-input>
      </el-form-item>
    </el-form>
    <div class="btn">
      <el-button size="small" @click="handleBack">返回</el-button>
      <el-button type="primary" size="small" @click="handleSave">{{ data ? "保存" : "添加" }}</el-button>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * @Description: 角色管理详情
 * @Author: liuyang
 * @Date: 2019-06-27 14:35
 */
import { Vue, Component, Prop } from "vue-property-decorator";
import Http from "@/utils/Http";
import Url from "@/api/url";

@Component({})
export default class RoleManagementDetail extends Vue {
  @Prop({
    type: Object,
    default: () => ({
      defaultRole: false
    })
  })
  data!: any;
  form: any = this.data;
  formRules: any = {
    name: {
      required: true,
      message: "该选项为必填项",
      trigger: "change"
    },
    code: {
      required: true,
      message: "该选项为必填项",
      trigger: "change"
    },
    roleType: {
      required: true,
      message: "该选项为必填项",
      trigger: "change"
    },
    defaultRole: {
      required: true,
      message: "该选项为必填项",
      trigger: "change"
    }
  };
  loading: boolean = false;
  created(): void {}

  handleSave() {
    const form: any = this.$refs.form;
    form.validate((flag: boolean) => {
      if (flag) {
        this.saveForm();
      }
    });
  }

  async saveForm() {
    this.loading = true;
    try {
      let {
        data: { data, status, message }
      } = await Http.post(this.form.id ? Url.auth.updateRole : Url.auth.addRole, this.form);
      if (status) {
        this.$message.success(this.form.id ? "修改成功" : "添加成功");
        this.handleBack();
      } else {
        this.$message.error(message);
      }
    } finally {
      this.loading = false;
    }
  }

  handleBack() {
    this.$emit("hidden");
  }
}
</script>

<style scoped lang="less">
.sub-container {
  position: relative;
  min-height: calc(100vh - 180px);
  padding-bottom: 62px !important;
}

.btn {
  position: absolute;
  right: 20px;
  bottom: 12px;
}
</style>
