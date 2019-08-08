<template>
    <div class="container">
      <div class="main">
        <el-card class="card-box" style="width: 100%" shadow="nerver">
          <el-form class="formStyle" :model="userInfo" ref="userInfo" label-width="15%" label-position="left" :rules="rules" >
            <el-form-item label="初始密码" prop="password">
              <el-input v-model="userInfo.password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input type="password" v-model="userInfo.newPassword"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="repeatPass">
              <el-input type="password" v-model="userInfo.repeatPass"></el-input>
            </el-form-item>
            <el-form-item label-width="43%">
              <template>
                <el-button type="info" @click="clearData">重置</el-button>
                <el-button type="primary" @click="changePass">确认</el-button>
              </template>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import Http from "@/utils/Http";
import Url from "@/api/url";

@Component({})
export default class ChangePass extends Vue{

  userInfo:any = {
    password:"",
    newPassword:"",
    repeatPass:""
  };
  rules: any ={
    password:[
      { required: true, message: '请输入初始密码', trigger: 'blur' },
    ],
    newPassword: [
      { required: true, message: '请输入新的密码', trigger: 'blur' },
      { min: 6, message: '密码的长度不得少于6个字符', trigger: 'blur' }
    ],
    repeatPass: [
      { required: true, message: '请确认密码', trigger: 'blur' },
      { min: 6, message: '密码的长度不得少于6个字符', trigger: 'blur' }
    ],
  };
  clearData(){
    this.userInfo = {
      password:"",
      newPassword:"",
      repeatPass:""
    };
  }
  changePass(){
    if (this.userInfo.password=="") {
      this.$message.warning("请输入初始密码")
    }else if (this.userInfo.newPassword==""){
      this.$message.warning("新密码不能为空")
    } else {
      if (this.userInfo.newPassword!=this.userInfo.repeatPass){
        this.$message.warning("前后两次密码不一样，请重新输入");
      } else {
        Http.post(Url.personInfo.updatePasswoord,{
          oldPassword:this.userInfo.password,
          newPassword:this.userInfo.newPassword
        }).then((res:any)=>{
          if (res.data.status){
            this.$message.success("更新成功");
          } else {
            this.$message.warning(res.data.message);
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
  .card-box{
    display: flex;
    justify-content: center;
    .formStyle{
      width: 600px;
      height: 400px;
      margin-top: 200px
    }
  }
</style>
