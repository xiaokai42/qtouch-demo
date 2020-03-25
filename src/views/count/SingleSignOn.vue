<!--
 author: xiaokai
 descr: 单点登录跳转页
 -->
<template>

</template>

<script lang="ts">
  import {
    Vue,
    Component,
    Prop,
    Model,
    Watch
  } from "vue-property-decorator";
  import Cookie from "js-cookie";
  import {
    Mutation
  } from "vuex-class";

  @Component({
    components: {},
    filters: {},
    mounted() {
      this.getTestMessages();
      this.$store.state.menu = {};
      this.$store.state.userInfo.token = "";
    }
  })

  export default class Count extends Vue {
    code: string = '';
    projectCode: string = '';
    projectSubCode: string = '';
    loginName: string = '';
    systemCode: string = '';
    amUrl: string = '';


    @Mutation("saveToken")
    saveToken!: any;
    @Mutation("setIsLogin")
    setIsLogin!: any;
    @Mutation("setUserName")
    setUserName!: any;
    @Mutation("saveMenu")
    saveMenu!: any;

    // 请求表格数据
    getTestMessages() {
      this.code = this.$route.query.tokenId;
      this.loginName = this.$route.query.loginName;
      this.systemCode = this.$route.query.systemCode;
      if (this.$route.query.projectCode) {
        this.projectCode = this.$route.query.projectCode;
      }
      if (this.$route.query.projectSubCode) {
        this.projectSubCode = this.$route.query.projectSubCode;
      }
      if (this.$route.query.amUrl) {
        this.amUrl = this.$route.query.amUrl;
      }
      let url = "api/token?token=" + this.code + "&loginName=" + this.loginName + "&systemCode=" + this.systemCode;
      this.$axios({
        method: "get",
        url: url
      }).then((res: any) => {
        if (res.data.status) {
          let token = res.data.data.accessToken;
          this.saveToken(token);
          this.setIsLogin(true);
          this.saveMenu(res.data.data.menus);
          this.setUserName(res.data.data.username);
          if (this.projectCode != '') {
            this.$router.push({
              name: 'projectSearch',
              params: {
                projectCode: this.projectCode,
                projectSubCode: this.projectSubCode
              }
            });
          } else {
            this.$router.push('/root');
          }
        } else {
          this.$message({
            type: 'error',
            message: res.data.message,
            onClose: () => {
              this.$router.push('/login');
            }
          });
        }
      });
    }
  }
</script>

<style scoped lang="less">

</style>
