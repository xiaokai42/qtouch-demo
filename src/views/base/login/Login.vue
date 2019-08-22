<template>
  <div class="login">
    <div class="login-box">
      <img src="@/assets/images/login-bg.jpg" width="549" height="420" />
      <div class="login-form">
        <div class="login-form-title">
          <img src="@/assets/images/login-logo.jpg" width="39" height="28" />
          <h1>重庆市住房和城乡建设委员会</h1>
        </div>
        <div class="secound-title">消防设计审查系统</div>
        <div class="form-box">
          <el-form :model="account" ref="loginRef" @submit.native.prevent :rules="ruleCustom">
            <el-form-item prop="username" class="form-item">
              <el-input type="text" v-model="account.username" clearable prefix-icon="el-icon-user"
                @on-enter="handleSubmit(`loginRef`)" name="username" placeholder="Username"></el-input>
            </el-form-item>
            <el-form-item prop="password" class="form-item">
              <el-input type="password" v-model="account.password" clearable prefix-icon="el-icon-lock"
                @on-enter="handleSubmit(`loginRef`)" name="password" placeholder="Password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSubmit(`loginRef`)" style="width: 100%;">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import qs from "qs";
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import Http from "@/utils/Http";
import Url from "@/api/url";
import Cookie from "js-cookie";
import { Mutation } from "vuex-class";

const namespace: string = "base";

@Component({
  components: {}
})
export default class Login extends Vue {
  account: any = {
    username: "",
    password: ""
  };

  ruleCustom: any = {
    username: [
      {
        validator: this.validateUsername,
        trigger: "blur"
      }
    ],
    password: [
      {
        validator: this.validatePassword,
        trigger: "blur"
      }
    ]
  };

  @Mutation("saveToken")
  saveToken!: any;
  @Mutation("setIsLogin")
  setIsLogin!: any;
  @Mutation("setUserName")
  setUserName!: any;
  @Mutation("saveMenu")
  saveMenu!: any;

  validateUsername(rule: any, value: string, callback: Function): void {
    if (value === "" || value.toString().trim() === "") {
      callback(new Error("请输入账号"));
    } else {
      callback();
    }
  }

  validatePassword(rule: any, value: string, callback: Function): void {
    if (value === "" || value.toString().trim() === "") {
      callback(new Error("请输入密码"));
    } else if (value.toString().trim().length < 6 || value.toString().trim().length > 18) {
      callback(new Error("密码长度应为 6 到 18 位"));
    } else {
      callback();
    }
  }

  handleSubmit(ref: string): void {
    let userName = this.account.username;
    let password = this.account.password;
    let loginRef: any = this.$refs[ref];

    loginRef.validate((valid: boolean) => {
      if (valid) {
        this.$axios.post(
          Url.base.login,
          qs.stringify({
            username: userName,
            password: password
          })
        )
          .then((response: any) => {
            if (response.data.status) {
              let token = response.data.data.accessToken;
              this.saveToken(token);
              this.setIsLogin(true);
              this.saveMenu(response.data.data.menus);
              this.setUserName(response.data.data.username);
              this.$router.push("/root");
            } else {
              this.$Message.error(response.data.message);
            }
          })
          .catch((error: any) => {
            if (error.status === 401) {
              this.$router.push("/login");
            } else {
              this.$Message.error("登录失败,请重试");
            }
          });
      }
    });
  }
}
</script>
<style scoped lang="less">
.login {
  width: auto;
  height: auto;
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  .login-box {
    width: 1100px;
    height: 420px;
    display: flex;
    box-shadow:0px 0px 15px #eee;
    .login-form {
      width: 551px;
      height: 420px;
      padding: 40px 80px;
      box-sizing: border-box;
      .login-form-title {
        height: 30px;
        display: flex;
        color: #2372EA;
        justify-content: center;
        h1 {
          font-size: 18px;
          margin-left: 5px;
          line-height: 30px;
        }
      }
      .secound-title {
        color: #2372EA;
        margin: 10px 0;
        font-size: 24px;
        text-align: center;
      }
      .form-box {
        width: 100%;
        height: 200px;
        margin: 40px 0 20px 0;
      }
    }
  }
}
</style>
