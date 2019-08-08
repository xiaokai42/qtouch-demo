<template>
  <div>
    <div class="form">
      <el-form ref="form" :model="form" :rules="formRules" label-width="100px" style="width: 100%;">
        <el-form-item label="表单名称：" prop="formName">
          <el-input placeholder="请输入" v-model="form.formName"></el-input>
        </el-form-item>
        <el-form-item label="项目标题：" prop="title">
          <el-input placeholder="请输入" v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="项目类型：" prop="type">
          <el-select placeholder="请选择" v-model="form.type" style="width: 100%;">
            <el-option
              v-for="(item, index) in typeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目备选项" v-if="form.type === 'checkbox' || form.type === 'select'" prop="options">
          <el-input
            placeholder="选项请用半角逗号分隔，例如：选项1,选项2"
            @input="transferOption($event)"
            v-model="form.option"
          ></el-input>
        </el-form-item>
        <el-form-item style="text-align: right;">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAddItem">
            增加
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="hr"></div>
    <div class="form">
      <el-form label-width="100px" style="width: 100%;">
        <el-form-item :label="item.title" prop="title" v-for="(item, index) in formItems" :key="index">
          <div class="inline">
            <el-input v-if="item.type === 'text'" v-model="item.value"></el-input>
            <el-input v-if="item.type === 'textarea'" type="textarea" :rows="3" v-model="item.value"></el-input>
            <el-checkbox-group v-if="item.type === 'checkbox'" v-model="item.value" style="width: 100%">
              <el-checkbox-button v-for="option in item.options" :label="option" :key="option">
                {{ option }}
              </el-checkbox-button>
            </el-checkbox-group>
            <el-select v-if="item.type === 'select'" v-model="item.value" placeholder="请选择" style="width: 100%">
              <el-option v-for="option in item.options" :key="option" :label="option" :value="option"> </el-option>
            </el-select>
            <el-input-number v-if="item.type === 'number'" v-model="item.value" style="width: 100%"></el-input-number>
            <el-upload
              v-if="item.type === 'upload'"
              class="upload-demo"
              drag
              action="/"
              :auto-upload="false"
              name="file"
              style="width: 100%"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <el-upload
              v-if="item.type === 'img'"
              class="upload-demo"
              action="/"
              :limit="9"
              accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
              multiple
              list-type="picture"
              style="width: 100%"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/jpeg/png/gif文件
              </div>
            </el-upload>
            <el-date-picker
              v-if="item.type === 'datetime'"
              v-model="item.value"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            ></el-date-picker>
            <el-time-picker
              v-if="item.type === 'time'"
              v-model="item.value"
              placeholder="选择时间"
              format="HH:mm"
              value-format="HH:mm"
              style="width: 100%"
            ></el-time-picker>
            <el-input v-if="item.type === 'position'" placeholder="选择坐标" v-model="item.value"></el-input>
            <el-button
              v-if="item.type === 'position'"
              icon="el-icon-location"
              style="margin-left: 10px;"
              @click="openMap"
            ></el-button>
            <el-cascader
              v-if="item.type === 'eventType'"
              placeholder="选择事件类型"
              expand-trigger="hover"
              :options="eventOptions"
              :props="prop"
              clearable
              :show-all-levels="false"
              style="width: 100%"
            ></el-cascader>
            <div class="del-btn">
              <el-button type="text" icon="el-icon-delete" @click="handleDelete(item, index)" style="float: right">
              </el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * @Author: liuyang
 * @Date: 2019-07-03 14:10
 */
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import Http from "@/utils/Http";
import Url from "@/api/url";

@Component({})
export default class FormDesigner extends Vue {
  @Prop({ type: Object, default: () => ({}) })
  data?: any;
  form: any = this.data;
  formRules: any = {
    title: {
      validator: (rule: any, value: any, callback: any) => {
        if (!value || value.trim() == "") {
          return callback(new Error("请输入项目标题"));
        }
        if (this.formItems.some((d: any) => d.title === value)) {
          return callback(new Error("项目标题不要重复"));
        }
        callback();
      },
      trigger: "blur"
    },
    type: { required: true, message: "请选择项目类型", trigger: "change" },
    options: { required: true, message: "请设定项目备选项", trigger: "blur" }
  };
  typeOptions: Array<any> = [
    {
      value: "text",
      label: "文本输入"
    },
    {
      value: "textarea",
      label: "多行文本输入"
    },
    {
      value: "checkbox",
      label: "多项选择"
    },
    {
      value: "select",
      label: "单项项选择"
    },
    {
      value: "number",
      label: "整数输入"
    },
    {
      value: "datetime",
      label: "日期时间"
    },
    {
      value: "time",
      label: "时间"
    },
    {
      value: "upload",
      label: "上传组件"
    },
    {
      value: "img",
      label: "图片"
    },
    {
      value: "position",
      label: "位置"
    },
    {
      value: "eventType",
      label: "事件类型"
    }
  ];
  formItems: Array<any> = this.data.formDef ? JSON.parse(this.data.formDef) : [];
  eventOptions: Array<any> = [];
  prop: any = {
    value: "id",
    label: "eventTypeName"
  };

  transferOption(value: string) {
    this.form.options = value
      .trim()
      .replace(new RegExp("，", "g"), ",")
      .split(",");
  }

  // 添加一项表单
  handleAddItem() {
    let form: any = this.$refs.form;
    form.validate((flag: boolean) => {
      if (flag) {
        let tmp: any = JSON.parse(JSON.stringify(this.form));
        if (tmp.type == "checkbox" || tmp.type == "upload" || tmp.type == "img") {
          tmp.value = [];
        } else {
          tmp.value = "";
        }
        this.formItems.push(tmp);
        this.form = {
          formName: this.form.formName
        };
        this.$nextTick(() => {
          form.clearValidate();
        });
      }
    });
  }

  handleDelete(item: any, index: number) {
    this.$confirm("将要删除项目:" + item.title + ",是否继续？", "确认", {
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    }).then(() => {
      this.formItems.splice(index, 1);
    });
  }

  // 获取事件类型
  async getEventType() {
    let {
      data: { data, status, message }
    } = await Http.get(Url.admin.getEventType, {
      orgId: 0
    });
    if (status) {
      this.eventOptions = data.detail;
    } else {
      this.$message.error(message);
    }
  }

  // 检查表单名称
  async checkFormName() {
    let {
      data: { data, status, message }
    } = await Http.get(Url.admin.checkFormName, {
      formName: this.form.formName
    });
    if (status) {
      if (!data) {
        this.$message.info("表单名称已使用");
      }
      return data;
    } else {
      this.$message.error(message);
    }
  }

  // 保存表单
  async save(callback: any) {
    try {
      if (!this.formItems.length) {
        return this.$message.info("请添加项目");
      }
      if (!this.data.id && !(await this.checkFormName())) {
        return;
      }
      let formId = this.form.id;
      let {
        data: { data, status, message }
      } = await Http[formId ? "put" : "post"](Url.admin[formId ? "updateFormDefine" : "addFormDefine"], {
        id: this.data.id,
        formName: this.form.formName,
        formDef: JSON.stringify(this.formItems)
      });
      if (status) {
        callback(formId ? formId : data);
      } else {
        this.$message.error(message);
        callback();
      }
    } catch (e) {
      callback();
    }
  }

  created(): void {
    // this.getEventType();
  }
}
</script>

<style scoped lang="less">
.form {
  width: 500px;
  margin: auto;
}

.hr {
  margin-bottom: 20px;
  height: 1px;
  background: #e8e8e8;
}

.inline {
  display: flex;
  .del-btn {
    margin-left: 50px;
  }
}
</style>
