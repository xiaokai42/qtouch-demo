<template>
  <div class="error403">
    <div class="error403-body-con">
      <Card>
        <div class="error403-body-con-title">
          4
          <span class="error403-0-span">
            <Icon type="android-lock"></Icon>
          </span>
          <span class="error403-key-span">
            <i class="error403-text-3">3</i>
            <!-- <Icon size="220" type="ios-bolt"></Icon> -->
          </span>
        </div>
        <p class="error403-body-con-message">You don't have permission</p>
        <div class="error403-btn-con">
          <Button @click="goHome" size="large" style="width: 200px;" type="text">返回登录页</Button>
          <!-- <Button @click="backPage" size="large" style="width: 200px;margin-left: 40px;" type="primary">返回上一页</Button> -->
        </div>
      </Card>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {}
})
export default class App extends Vue {
  backPage() {
    this.$router.go(-1);
  }
  goHome() {
    this.$router.push({
      name: "login"
    });
  }
}
</script>
<style lang="less" scoped>
@keyframes error403animation {
  0% {
    transform: rotateZ(0deg);
  }
  40% {
    transform: rotateZ(-20deg);
  }
  45% {
    transform: rotateZ(-15deg);
  }
  50% {
    transform: rotateZ(-20deg);
  }
  55% {
    transform: rotateZ(-15deg);
  }
  60% {
    transform: rotateZ(-20deg);
  }
  100% {
    transform: rotateZ(0deg);
  }
}
.error403-body-con {
  width: 700px;
  height: 500px;
  position: absolute;
  left: 50%;
  top: 400px;
  transform: translate(-50%, -50%);
  .error403-body-con-title {
    text-align: center;
    font-size: 240px;
    font-weight: 700;
    color: #2d8cf0;
    height: 260px;
    line-height: 260px;
    margin-top: 40px;
    .error403-0-span {
      display: inline-block;
      position: relative;
      width: 170px;
      height: 170px;
      border-radius: 50%;
      border: 20px solid #ed3f14;
      color: #ed3f14;
      margin-right: 10px;
      i {
        display: inline-block;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .error403-key-span {
      display: inline-block;
      position: relative;
      left: 20px;
      width: 180px;
      height: 260px;
      border-radius: 50%;
      margin-right: 10px;
      vertical-align: top;
      i {
        display: inline-block;
        font-size: 260px;
        position: absolute;
        left: 40px;
        transform: translate(-50%, -60%);
        transform-origin: center bottom;
        animation: error403animation 2.8s ease 0s infinite;
      }
    }
  }
  .error403-body-con-message {
    display: block;
    text-align: center;
    font-size: 30px;
    font-weight: 500;
    letter-spacing: 4px;
    color: #dddde2;
  }
}
.error403-btn-con {
  text-align: center;
  padding: 20px 0;
  margin-bottom: 40px;
}
</style>
