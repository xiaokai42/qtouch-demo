<!--
 author: xiaokai
 descr: 单点登录跳转页
 -->
<template>

</template>

<script lang="ts">
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import Cookie from "js-cookie";
import { Mutation } from "vuex-class";

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
    let url = "api/token?token="+this.code;
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
        this.$router.push("/root");
      } else {
        this.$Message.error(res.data.message);
      }
    });
  }
}
</script>

<style scoped lang="less">

</style>
