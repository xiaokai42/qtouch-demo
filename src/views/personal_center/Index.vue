<template>
    <div class="my-container">
      <div class="main">
        <el-row style="width: 100%;margin-bottom: 10px">
          <el-col :span="24">
            <el-card>
              <div slot="header" class="clearfix card-header">
                <i class="el-icon-info header-icon"></i>
                <span class="header-title">基本信息</span>
                <el-button type="primary" size="small" style="float: right;" @click="handleSave">保存</el-button>
              </div>
              <div>
                <el-form :model="userInfo" ref="userInfo" :rules="formRules" label-width="80px" label-position="left">
                  <el-row :gutter="40">
                    <el-col :span="8">
                      <el-form-item label="用户名" prop="userName">
                        <el-input :disabled="isFirstChange" v-model="userInfo.userName">
                          <el-button v-if="isFirstChange" slot="append" icon="el-icon-edit" @click="changeAccount"></el-button>
                          <el-button  v-else slot="append" @click="goChangeAccout">确认</el-button>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="真实姓名" prop="realName">
                        <el-input v-model="userInfo.realName"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="手机" prop="mobile">
                        <el-input v-model="userInfo.mobile"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="性别" prop="gender">
                        <el-radio-group v-model="userInfo.gender">
                          <el-radio-button label="男"></el-radio-button>
                          <el-radio-button label="女"></el-radio-button>
                          <el-radio-button label="保密"></el-radio-button>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="生日" prop="birthDay">
                        <el-date-picker v-model="userInfo.birthDay"></el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </el-card>
          </el-col>
          <el-col :span="24" style="margin-top: 20px" v-for="(team,index) in userInfo.accountTeamVOS" :key="index">
            <el-card>
              <div slot="header" class="clearfix card-header">
                <i class="el-icon-s-flag header-icon"></i>
                <div class="header-title">团队信息{{index+1}}——<span style="color: #2678e7;">{{team.tenantName}}</span></div>
              </div>
              <el-row :gutter="40">
                <el-col :span="12">
                  <el-row style="height: 50px">
                    <el-col :span="4">
                      <span style="font-size: 16px;line-height: 40px">所属团队:</span>
                    </el-col>
                    <el-col :span="20">
                      <el-input disabled v-model="team.tenantName"></el-input>
                    </el-col>
                  </el-row>
                  <el-row style="height: 50px">
                    <el-col :span="4">
                      <span style="font-size: 16px;line-height: 40px">联系电话:</span>
                    </el-col>
                    <el-col :span="20">
                      <el-input disabled v-model="team.telPhone"></el-input>
                    </el-col>
                  </el-row>
                  <el-row style="height: 50px">
                    <el-col :span="4">
                      <span style="font-size: 16px;line-height: 40px">邮箱:</span>
                    </el-col>
                    <el-col :span="20">
                      <el-input disabled v-model="team.email"></el-input>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row>
                    <el-col :span="4">
                      <span style="font-size: 16px;line-height: 40px">头像:</span>
                    </el-col>
                    <el-col :span="20">
                      <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="team.photo" :src="team.photo" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="24">
                  <el-divider>其他信息</el-divider>
                </el-col>
                <el-col :span="24">
                  <el-col :span="8" v-for="item in team.extInfoVO">
                    <el-row style="height: 50px">
                      <el-col :span="4">
                        <span style="font-size: 16px;line-height: 40px">{{item.name}}:</span>
                      </el-col>
                      <el-col :span="20">
                        <el-input disabled v-model="item.value"></el-input>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import * as _ from "lodash";
import Http from "@/utils/Http";
import Url from "@/api/url";
import {Getter} from "vuex-class";
import qs from 'qs';

@Component({})
export default class Index extends Vue{

  @Getter("getUserName")
  userName!: any;

  userInfo:any={
    accoutId:"",
    userName:"",
    realName:"王晓峰",
    mobile:"1333333333",
    gender:"男",
    birthDay:"1987-2-3",
    accountTeamVOS:[
      {
        personId:"",
        email:"ddd",
        tenantName:"ddd",
        telPhone:"ddd",
        phone:"ddd",
        extInfoVO:[
          {
            name:"ddd",
            attrId:"ddd",
            value:"dd",
            attrType:"dd",
            dataRage:"dd",
            mustInput:"dd"
          }
        ]
      }
    ]
  };
  isFirstChange:boolean=true;
  formRules: any = {
    userName: {
      required: true,
      message: "该选项为必填项",
      trigger: "change"
    },
    realName: {
      required: true,
      message: "该选项为必填项",
      trigger: "change"
    },
    mobile: {
      required: true,
      message: "该选项为必填项",
      trigger: "change"
    },
    gender: {
      required: true,
      message: "该选项为必填项",
      trigger: "change"
    }
  };
  handleAvatarSuccess(){

  }
  beforeAvatarUpload(){
    //TODO 图片上传
      this.$notify.info("很抱歉，暂时不能上传图片")
  }
  //校验字段并保存信息
  handleSave() {
    const userInfo: any = this.$refs.userInfo;
    userInfo.validate((flag: boolean) => {
      if (flag) {
        this.saveForm();
      }
    });
  };
  //保存团队头像
  saveTeamPhoto(){

  }

  //提交基本信息表单
  saveForm(){
    Http.post(Url.personInfo.updateBaseUserInfo,{
      "realName":this.userInfo.realName,
      "mobile":this.userInfo.mobile,
      "gender":this.userInfo.gender,
      "birthDay":this.userInfo.birthDay
    }).then((res:any)=>{
      if (res.data.status){
        this.$message.success("保存成功")
      }
    })
  };

  //判断账户名是否为空
  changeAccount(){
    if (this.userInfo.userName==null||this.userInfo.userName===""){
      this.isFirstChange = false;
    } else {
      this.isFirstChange = true;
      this.$notify.warning("用户名只能更改一次")
    }
  }

  goChangeAccout(){
    if (this.userInfo.userName==""){
      this.$message.warning("用户名不能为空!")
    } else {
      Http.get(Url.personInfo.changeUserName,{"userName":this.userInfo.userName}).then((res:any)=>{
        if (res.data.status) {
          this.$message.success("用户名修改成功")
        }
      })
    }
  }


  // 获取账户信息
  getAccountInfo(){
    let self = this;
    Http.get(Url.personInfo.getAccountInfo).then((res:any)=>{
      if (res.data.status){
        self.userInfo = res.data.data;
      }else {
        self.$message.warning(res.data.message)
      }
    })
  }
  mounted(){
    this.getAccountInfo();
  }
}
</script>

<style scoped lang="less">
.my-container{
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .main{
    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }
    .clearfix:after {
      clear: both
    }
    .card-header{
      .header-icon{
        color: #2678e7;
        font-size: 18px;
        margin: 0 15px 0 5px;
        display: inline-block;
        line-height: 1;
        width: 18px;
        height: 18px;
        vertical-align: bottom;
      }
      .header-title{
        font-weight: bolder;
        font-size: 18px;
        margin: 0;
        line-height: 1;
        vertical-align: bottom;
        display: inline-block;
      }
    }
    .team-header{
      & span{
        font-size: 18px;
        color: #2678e7;
        font-weight: bolder;
        margin-left: 10px;
      }
    }
    .avatar-uploader{
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      height: 150px;
      width: 150px;
      .avatar-uploader-icon{
        font-size: 28px;
        color: #8c939d;
        width: 150px;
        height: 150px;
        line-height: 150px;
        text-align: center;
        &:hover{
          color:#409eff
        }
      }
      &:hover{
        border-color: #409eff;
      }
      .avatar{
        width: 150px;
        height: 150px;
        display: block;
      }
    }

  }
}
</style>
