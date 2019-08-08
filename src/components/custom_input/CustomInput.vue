<!--
  @author: lei.xu
  @date: 2019/05/26
  description TODO 自定义属性展示组件
-->
<template>
  <div>
    <el-row :gutter="0">
      <el-col :span="8" v-for="(customOption, index) in customOptions" :key="index">
        <el-form
          size="small"
          label-width="150px"
          ref="customOptionForm"
          :model="customOption"
          :rules="customOptionRules"
        >
          <el-form-item :label="customOption.name + '：'" :prop="customOption.mustInput ? 'value' : null">
            <!-- 文本框 -->
            <el-input
              v-if="customOption.attrType === 'text'"
              v-model="customOption.value"
              placeholder="请输入"
            ></el-input>
            <!-- 单选框 -->
            <el-select v-if="customOption.attrType === 'select'" v-model="customOption.value" style="width: 100%">
              <el-option
                v-for="item in customOption.dataRange.options"
                :key="item.content"
                :label="item.content"
                :value="item.content"
              >
              </el-option>
            </el-select>
            <!-- 多选框 -->
            <el-select
              v-if="customOption.attrType === 'multiSelect'"
              v-model="customOption.value"
              multiple
              collapse-tags
              style="width: 100%"
            >
              <el-option
                v-for="item in customOption.dataRange.options"
                :key="item.content"
                :label="item.content"
                :value="item.content"
              >
              </el-option>
            </el-select>
            <!-- 数字框1 -->
            <!--            <el-input-number-->
            <!--              v-if="customOption.attrType === 'number'"-->
            <!--              v-model="customOption.value"-->
            <!--              controls-position="right"-->
            <!--              :min="customOption.dataRange.NumMin"-->
            <!--              :max="customOption.dataRange.NumMax"-->
            <!--              style="width: 90%"-->
            <!--            ></el-input-number>-->
            <!--            <span-->
            <!--              v-if="customOption.attrType === 'number'"-->
            <!--              style="font-size: 16px;padding-left: 10px; width: 10%;"-->
            <!--            >-->
            <!--              {{ customOption.dataRange.unit }}-->
            <!--            </span>-->
            <!-- 数字框2 -->
            <el-input
              v-if="customOption.attrType === 'number'"
              type="number"
              v-model="customOption.value"
              controls-position="right"
              :min="customOption.dataRange.NumMin"
              :max="customOption.dataRange.NumMax"
              clearable
              style="width: 100%"
            >
              <template slot="append" v-if="customOption.dataRange.unit">
                {{ customOption.dataRange.unit }}
              </template>
            </el-input>
            <!-- 图片 -->
            <div class="my-el-upload">
              <el-upload
                ref="uploadImg"
                v-loading="loading"
                v-if="customOption.attrType === 'image'"
                v-model="customOption.value"
                action="/test/file/upload"
                list-type="picture-card"
                :auto-upload="true"
                :limit="customOption.dataRange.imgMaxNum"
                accept="image/jpeg,image/gif,image/png,image/bmp"
                :http-request="customHttpRequest"
                :before-upload="customBeforeUpload"
                :on-exceed="customOnExceed"
                :on-preview="customOnPreview"
                :before-remove="customBeforeRemove"
                :on-remove="customOnRemove"
                :file-list="customOption.value"
                :show-file-list="true"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogImageVisible">
                <img width="100%" :src="dialogImageUrl" alt="" />
              </el-dialog>
            </div>
            <!-- 定位 -->
            <el-input
              v-if="customOption.attrType === 'location'"
              style="width: 100%"
              size="small"
              placeholder="定位地址"
              disabled
            >
              <el-button size="small" slot="append" icon="el-icon-location" @click="locationSelect"></el-button>
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogAMapVisible" width="50%">
      <div id="aMap" class="aMap">展示地图</div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogAMapVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="dialogAMapVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import Utils from "@/utils/utils";
import store from "@/store";

const AMap: any = (window as any).AMap;
@Component({})
export default class CustomInput extends Vue {
  // 子组件接收父组件传值
  @Prop({ type: Array, required: true })
  customOptions!: Array<any>;
  // 表单验证是否必填
  customOptionRules: any = {
    value: [
      {
        required: true,
        message: "该选项为必填项",
        trigger: "change"
      }
    ]
  };
  // 图片相关
  dialogImageUrl: any = "";
  dialogImageVisible: boolean = false;
  loading: boolean = false;
  // 定位相关
  dialogAMapVisible: boolean = false;
  // 地图样式相关
  map: any = "";
  center: any = [106.569137, 29.643814];
  zoom: number = 16;
  mapStyle: string = "amap://styles/1ee930c108ebbd53691071ed7b36cdac";

  @Watch("customOptions")
  dataTypeConversion() {
    Utils.convertFromExtInfoVO(this.customOptions);
  }

  created() {
    this.dataTypeConversion();
  }

  // 清空表单验证
  async cusResetFields() {
    let formRef: any = this.$refs["customOptionForm"];
    if (formRef) {
      formRef.forEach((item: any) => {
        item.clearValidate();
      });
    }
  }
  // 表单验证方法
  async formValidation() {
    let numberOfPass: number = 0;
    let formRef: any = this.$refs["customOptionForm"];
    if (formRef) {
      formRef.forEach((item: any) => {
        item.validate((valid: any) => {
          if (valid) {
            numberOfPass++;
          } else {
            return false;
          }
        });
      });
      if (formRef.length === numberOfPass) {
        let tempObject = JSON.parse(JSON.stringify(this.customOptions));
        Utils.convertToExtInfo(tempObject);
        return tempObject;
      } else {
        await Promise.reject("信息有误");
      }
    }
  }
  // 图片相关
  // 自定义上传文件
  customHttpRequest(data: any) {
    let config = {
      headers: {
        accessToken: "Bearer " + store.getters[`getToken`],
        "Content-Type": "multipart/form-data"
      }
      // 上传过程中显示进度条
      // onUploadProgress: (progressEvent: any) => {
      //   console.log("progressEvent");
      //   console.log(progressEvent);
      //   const complete = (progressEvent.loaded / progressEvent.total * 100 | 0);
      //   data.onProgress({ percent: complete });
      // }
    }; //添加请求头
    let formData = new FormData();
    formData.append("file", data.file);
    this.$axios.post(data.action, formData, config).then((response: any) => {
      if (response.data.status) {
        data.onSuccess();
        this.loading = false;
        this.$message.success("图片上传成功！！");
        this.customOptions.forEach((customOption: any) => {
          if (customOption.attrType === "image") {
            customOption.value.push({
              name: response.data.data.fileName,
              url: response.data.data.accessUrl
            });
          }
        });
      }
    });
  }
  // 上传前
  customBeforeUpload(file: any) {
    this.loading = true;
    const isJPG = file.type === "image/jpeg";
    const isGIF = file.type === "image/gif";
    const isPNG = file.type === "image/png";
    const isBMP = file.type === "image/bmp";
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJPG) {
      this.$message.error("上传图片必须是JPG/GIF/PNG/BMP 格式!");
    }
    if (!isLt2M) {
      this.$message.error("上传图片大小不能超过 2MB!");
    }
    return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
  }
  // 上传文件超出限制
  customOnExceed(file: any, filesList: any) {
    this.$message.warning("最多可以上传【" + filesList.length + "】张图片！！");
  }
  // 预览已上传图片
  customOnPreview(file: any) {
    this.dialogImageUrl = file.url;
    this.dialogImageVisible = true;
  }
  // 删除图片之前
  customBeforeRemove(file: any, fileList: any) {
    return this.$confirm(`确定移除图片【${file.name}】？`);
  }
  // 删除图片
  customOnRemove(file: any, fileList: any) {
    this.customOptions.forEach((customOption: any) => {
      if (customOption.attrType === "image") {
        customOption.value = fileList;
      }
    });
  }

  // 定位相关
  // 打开弹窗，选择定位
  locationSelect() {
    this.map = new AMap.Map("aMap", {
      center: this.center,
      zoom: this.zoom,
      mapStyle: this.mapStyle,
      resizeEnable: true
    });
    this.dialogAMapVisible = true;
  }
}
</script>

<style lang="less">
.my-el-upload {
  .el-upload-list--picture-card .el-upload-list__item {
    width: 72px;
    height: 72px;
  }
  .el-upload--picture-card {
    width: 72px;
    height: 72px;
    line-height: 80px;
  }
}
.cropper-content {
  .cropper {
    width: auto;
    height: 500px;
  }
}
.aMap {
  width: auto;
  height: 500px;
}
</style>
