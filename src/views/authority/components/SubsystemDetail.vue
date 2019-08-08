<template>
  <div class="sub-container">
    <el-form
      size="small"
      label-width="150px"
      ref="form"
      style="width: 33.33333%;"
      :model="form"
      :rules="formRules"
      v-loading="loading"
    >
      <el-form-item label="名称：" prop="subsystemName">
        <el-input v-model="form.subsystemName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="系统编码：" prop="subsystemName">
        <el-input v-model="form.code" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="版本：" prop="subsystemName">
        <el-input v-model="form.subsystemVersion" placeholder="请输入"></el-input>
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
 * @Description:
 * @Author: liuyang
 * @Date: 2019-06-27 13:51
 */
import { Vue, Component, Prop } from "vue-property-decorator";
import Http from "@/utils/Http";
import Url from "@/api/url";

@Component({})
export default class SubsystemDetail extends Vue {
  @Prop({ type: Object, default: () => ({}) })
  data!: any;
  form: any = this.data;
  formRules: any = {
    subsystemName: {
      required: true,
      message: "该选项为必填项",
      trigger: "change"
    },
    code: {
      required: true,
      message: "该选项为必填项",
      trigger: "change"
    },
    subsystemVersion: {
      required: true,
      message: "该选项为必填项",
      trigger: "change"
    }
  };
  loading: boolean = false;

  handleSave() {
    const form: any = this.$refs.form;
    form.validate((flag: boolean) => {
      if (flag) {
        this.saveSubsystem();
      }
    });
  }

  async saveSubsystem() {
    this.loading = true;
    try {
      let {
        data: { data, status, message }
      } = await Http.post(this.form.id ? Url.auth.updateSubsystem : Url.auth.addSubsystem, this.form);
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
}

.btn {
  position: absolute;
  right: 20px;
  bottom: 0px;
}
</style>
