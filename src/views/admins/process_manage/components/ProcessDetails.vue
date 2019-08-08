<!--
    @Author: lei.xu
    @description: 流程详情页面
-->
<template>
  <div class="container">
    <!--内容主体-->
    <div class="main">
      <div class="content">
        <el-row :gutter="10" style="margin-bottom: 10px">
          <el-col :span="5">
            <h3>流程定义管理</h3>
          </el-col>
          <el-col :span="19">
            <el-button size="mini" @click="switchToProcessList('返回')" style="float: right">返回 </el-button>
          </el-col>
        </el-row>
        <hr />
        <el-form label-width="100px" size="mini" status-icon style="margin-top: 20px">
          <el-row>
            <el-col :span="10">
              <el-form-item label="流程分类：">
                <el-select
                  v-model="processForm.processType"
                  style="width: 100%"
                  placeholder="请选择分类"
                  v-on:change="processTypeChange"
                >
                  <el-option
                    v-for="item in processTypeList"
                    :key="item.id"
                    :label="item.procdefTypeName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="流程名称：">
                <el-input v-model="processForm.processName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">&nbsp;</el-col>
            <el-col :span="10">
              <el-form-item label="流程标识：">
                <el-input v-model="processForm.processTag" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="修改时间：">
                <el-date-picker
                  v-model="processForm.lastUpdateTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  :disabled="true"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <hr />
        <el-row class="button-group">
          <el-upload
            style="display: inline-block;margin-right: 10px"
            action="/processdesigner/manager/process/uploadfile"
            ref="upload"
            :data="xtoken"
            multiple
            :limit="1"
          >
            <el-button size="mini" type="primary">导入</el-button>
          </el-upload>
          <el-button size="mini" type="primary">
            分类管理
          </el-button>
          <el-button size="mini" type="primary">
            表单设计
          </el-button>
          <el-button size="mini" type="primary" onclick="window.open('/html/bpmn/index.html')">
            流程设计
          </el-button>
          <el-button size="mini" type="primary" :disabled="buttonState">
            指派
          </el-button>
          <el-button size="mini" type="primary" :disabled="buttonState">
            表单
          </el-button>
          <el-button size="mini" type="primary" :disabled="buttonState">
            可见组织
          </el-button>

          <el-button size="mini" type="primary" :disabled="buttonState">
            可见用户
          </el-button>
          <el-button size="mini" type="primary" :disabled="buttonState">
            下载
          </el-button>
        </el-row>
        <hr />
        <el-row style="margin: 10px auto;">
          <p style="text-align: center; font-size: 14px">流程图展示</p>
        </el-row>
        <el-row class="flowchart">
          <!--          <img-->
          <!--            v-if="processForm.processImg"-->
          <!--            v-bind:src="processForm.processImg"-->
          <!--            alt="流程图"-->
          <!--            width="100%"-->
          <!--            height="100%"-->
          <!--          />-->
          <el-upload
            ref="upload"
            class="upload-demo"
            drag
            action="/api/file/upload"
            :limit="1"
            :auto-upload="false"
            :show-file-list="false"
            :on-exceed="filesExceed"
            :on-change="changeUpload"
          >
            <img
              v-if="processForm.processImg"
              :src="processForm.processImg"
              class="avatar"
              alt=""
              width="100%"
              height="100%"
            />
            <div v-else>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </div>
          </el-upload>
        </el-row>

        <!-- vueCropper 剪裁图片实现-->
        <el-dialog title="图片剪裁" :visible.sync="dialogVisible" width="60%" append-to-body>
          <div class="cropper-content">
            <div class="cropper" style="text-align:center">
              <vue-cropper
                ref="cropper"
                :img="option.img"
                :outputSize="option.size"
                :outputType="option.outputType"
                :info="true"
                :full="option.full"
                :canMove="option.canMove"
                :canMoveBox="option.canMoveBox"
                :fixedBox="option.fixedBox"
                :original="option.original"
                :autoCrop="option.autoCrop"
                :centerBox="option.centerBox"
                :high="option.high"
                :infoTrue="option.infoTrue"
              ></vue-cropper>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="finish" :loading="loading">确认 </el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Emit, Prop } from "vue-property-decorator";
import Http from "@/utils/Http";
import store from "@/store";

@Component({
  components: {}
})
export default class ProcessDetails extends Vue {
  @Prop({ type: Object })
  process!: any;

  //流程信息表单
  processForm: any = {
    //流程ID
    processId: "",
    //流程类型
    processType: "",
    //流程名称
    processName: "",
    //流程标识
    processTag: "",
    //流程上次更新时间
    lastUpdateTime: "",
    //流程图
    processImg: "http://120.79.86.132/group1/M00/00/00/rBLhrFzOseCABnK1AACXsiAAi2k207.jpg"
  };
  //流程分类下拉list
  processTypeList: Array<any> = [];
  buttonState: any = false;
  //指派数据map
  xtoken: any = { _csrf: "", importState: 0 };

  dialogVisible: any = false;
  // 裁剪组件的基础配置option
  option: any = {
    img: "", // 裁剪图片的地址
    info: true, // 裁剪框的大小信息
    outputSize: 0.8, // 裁剪生成图片的质量
    outputType: "jpeg", // 裁剪生成图片的格式
    canScale: true, // 图片是否允许滚轮缩放
    autoCrop: true, // 是否默认生成截图框
    // autoCropWidth: 100, // 默认生成截图框宽度
    // autoCropHeight: 100, // 默认生成截图框高度
    fixedBox: false, // 固定截图框大小 不允许改变
    fixed: true, // 是否开启截图框宽高固定比例
    fixedNumber: [7, 5], // 截图框的宽高比例
    full: true, // 是否输出原图比例的截图
    canMove: false, // 图片能否拖动
    canMoveBox: true, // 截图框能否拖动
    original: false, // 上传图片按照原始比例渲染
    centerBox: true, // 截图框是否被限制在图片里面
    infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
  };
  picsList: any = []; //页面显示的数组
  // 防止重复提交
  loading: any = false;

  imageUrl: any = "http://120.79.86.132/group1/M00/00/00/rBLhrFzOseCABnK1AACXsiAAi2k207.jpg";
  headers: any = {
    "Content-Type": "multipart/form-data",
    loginToken: ""
  };

  created() {
    this.getProcessTypeList();
    this.initialization();
  }

  //获取所有流程类型list
  getProcessTypeList() {
    let _this = this;
    Http.get("/admin/processdesigner/procdeftype/findAll").then((response: any) => {
      _this.processTypeList = response.data;
    });
  }

  //页面初始化加载
  initialization() {
    let _this = this;
    if (_this.process) {
      _this.processForm.processId = _this.process.id;
      Http.get("/admin/processdesigner/manager/process/" + _this.processForm.processId).then((response: any) => {
        _this.processForm.processType = Number(response.data.typeId);
        _this.processForm.processName = response.data.procdefName;
        _this.processForm.processTag = response.data.procdefKey;
        _this.processForm.lastUpdateTime = response.data.updateDatetime;
        _this.processForm.processImg = "/admin/processdesigner/manager/process/img/" + response.data.procdefId;
        console.log(_this.processForm.processImg);
      });
    }
  }

  //流程类型改变
  processTypeChange(processTypeId: number) {
    console.log(processTypeId);
    let _this = this;
    // _this.$axios.put('/admin/processdesigner/manager/updateProcessType/',
    //     ).then( (response: any) => {
    //   if (response.data === 1) {
    //     _this.$message.success('修改流程分类成功')
    //   } else {
    //     _this.$message.error('修改流程分类失败')
    //   }
    // })
  }

  //图片上传相关
  handleAvatarSuccess(res: any, file: any) {
    console.log("上传成功：");
    console.log(res);
    console.log(file);
    this.processForm.processImg = URL.createObjectURL(file.raw);
  }

  beforeAvatarUpload(file: any) {
    console.log("上传前：");
    console.log(file);
  }

  customUpload(param: any) {
    // this.dialogVisible = true;
    this.fileUpload(param.action, param.file);
    // let config = {
    //   headers: { "Content-Type": "multipart/form-data" }
    // }; //添加请求头
    // let form = new FormData();
    // form.append("file", param.file);
    // this.$axios.post(param.action, form, config).then((response: any) => {
    //   if (response.data.status) {
    //     this.processForm.processImg = response.data.data.accessUrl;
    //   }
    // });
    // 上传成功后将图片地址赋值给裁剪框显示图片
    // this.$nextTick(() => {
    //   this.option.img = "http://120.79.86.132/group1/M00/00/00/rBLhrFzOseCABnK1AACXsiAAi2k207.jpg";
    //   this.dialogVisible = true;
    // })
  }

  changeUpload(file: any, fileList: any) {
    console.log(file);
    if (
      file.name
        .split(".")
        .pop()
        .toLowerCase() === "svg"
    ) {
      this.fileUpload("/api/file/upload", file.raw);
    } else {
      let url = window.URL || (window as any).webkitURL;
      let img = new Image(); //手动创建一个Image对象
      img.src = url.createObjectURL(file.raw); //创建Image的对象的url
      this.option.img = img.src;
      this.dialogVisible = true;
    }
    // 上传成功后将图片地址赋值给裁剪框显示图片
    // this.$nextTick(() => {
    //   this.option.img = file.raw.uid;
    //   this.dialogVisible = true
    // })
  }

  filesExceed(file: any, filesList: any) {
    // this.fileUpload("/api/file/upload", file[0]);
    this.changeUpload({ name: file[0].name, raw: file[0] }, filesList);
  }

  // 点击裁剪，这一步是可以拿到处理后的地址
  finish() {
    (this.$refs.cropper as any).getCropBlob((data: any) => {
      let file = new (window as any).File([data], "流程图.jpg", {
        type: data.type
      });
      this.fileUpload("/api/file/upload", file);
    });
    this.dialogVisible = false;
    // (this.$refs.upload as any).submit();
  }

  //上传文件
  fileUpload(url: any, file: any) {
    // this.processForm.processImg = "";
    // console.log("上传文件");
    // console.log(url);
    // console.log(file);
    let config = {
      headers: {
        accessToken: "Bearer " + store.getters[`getToken`],
        "Content-Type": "multipart/form-data"
      }
    }; //添加请求头
    let formData = new FormData();
    formData.append("file", file);
    this.$axios.post(url, formData, config).then((response: any) => {
      if (response.data.status) {
        this.processForm.processImg = response.data.data.accessUrl;
        this.$message.success("图片上传成功！！");
      }
    });
  }

  @Emit("switch")
  switchToProcessList() {}
}
</script>

<style scoped lang="less">
.container {
  min-height: calc(~"100vh - 50px");

  .main {
    height: calc(~"100vh - 50px");
    min-height: 600px;
    padding: 20px;

    .content {
      width: 100%;
      position: relative;

      .filter {
        margin-bottom: 16px;
      }

      .button-group {
        text-align: center;
        margin: 10px auto;
      }
    }
  }
}
</style>
<style lang="less">
.flowchart {
  height: calc(~"100vh - 500px");
  min-height: 280px;

  .el-upload-dragger {
    width: calc(~"100vw - 242px");
    height: calc(~"100vh - 380px");
    min-height: 280px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .el-icon-upload {
      font-size: 67px;
      color: #c0c4cc;
      margin: 0 0 16px;
      line-height: 67px;
    }
  }
}

.cropper-content {
  .cropper {
    width: auto;
    height: 500px;
  }
}
</style>
