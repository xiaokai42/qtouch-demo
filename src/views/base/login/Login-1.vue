<template>
  <div class="login">
    <div class="login-form">
      <div class="login-header">
        <img src="@/assets/images/qTouchBig.png" width="200px" alt="" style="margin-left: -10%" />
      </div>
      <Form :label-width="80" :model="account" ref="loginRef" @submit.native.prevent :rules="ruleCustom">
        <FormItem label="账号：" prop="username" class="form-item">
          <Input v-model="account.username" clearable @on-enter="handleSubmit(`loginRef`)" name="username" />
        </FormItem>
        <FormItem label="密码：" prop="password" class="form-item">
          <Input
            v-model="account.password"
            type="password"
            @on-enter="handleSubmit(`loginRef`)"
            clearable
            name="password"
          />
        </FormItem>
        <FormItem>
          <Button @click="handleSubmit(`loginRef`)">登录</Button>
        </FormItem>
      </Form>
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
        Http.post(
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
  position: relative;
  width: auto;
  min-height: 100vh;
  height: auto;
  background-color: #252a2f;
  .login-form {
    width: 380px;
    height: 400px;
    padding: 30px;
    color: #ffffff !important;
    text-align: center;
    position: absolute;
    left: calc(~"50vw - 190px");
    top: calc(~"50vh - 200px");
    .login-header {
      margin: 0 80px 40px 100px;
    }
  }
}
</style>
