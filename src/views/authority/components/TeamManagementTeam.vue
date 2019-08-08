<template>
  <div class="sub-container">
    <el-form size="small" label-width="150px" ref="form" :model="form" :rules="formRules" v-loading="loading">
      <el-form-item label="团队名称：" prop="name">
        <el-input style="width: 220px;" v-model="form.name" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="团队类型：" prop="tenantType">
        <el-select style="width: 220px;" v-model="form.tenantType" placeholder="请输入">
          <el-option v-for="(item, index) in tenantTypeMap" :value="index" :label="item" :key="index"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="管理员：" prop="userName">
        <el-input style="width: 220px;" v-model="form.userName" placeholder="请输入"></el-input>
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
 * @Description: 团队管理团队表单
 * @Author: liuyang
 * @Date: 2019-06-28 10:42
 */
import { Vue, Component, Prop } from "vue-property-decorator";
import Http from "@/utils/Http";
import Url from "@/api/url";

@Component({})
export default class TeamManagementTeam extends Vue {
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
    tenantType: {
      required: true,
      message: "该选项为必填项",
      trigger: "change"
    },
    userName: {
      required: true,
      message: "该选项为必填项",
      trigger: "change"
    }
  };
  loading: boolean = false;
  tenantTypeMap: any = {
    SYSTEM: "系统团队",
    INTENANT: "用户团队"
  };
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
      } = await Http.post(this.form.id ? Url.auth.updateTenant : Url.auth.addTenant, this.form);
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
