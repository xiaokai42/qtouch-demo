<template>
  <div class="error500">
    <div class="error500-body-con">
      <Card>
        <div class="error500-body-con-title">
          5
          <span class="error500-0-span">
            <Icon type="social-freebsd-devil"></Icon>
          </span>
          <span class="error500-0-span">
            <Icon type="social-freebsd-devil"></Icon>
          </span>
        </div>
        <p class="error500-body-con-message">Oops! the server is wrong</p>
        <div class="error500-btn-con">
          <Button @click="goHome" size="large" style="width: 200px;" type="text">返回首页</Button>
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
      name: "count"
    });
  }
}
</script>
<style lang="less" scoped>
@keyframes error500animation {
  0% {
    transform: rotateZ(0deg);
  }
  20% {
    transform: rotateZ(-10deg);
  }
  40% {
    transform: rotateZ(5deg);
  }
  60% {
    transform: rotateZ(-5deg);
  }
  80% {
    transform: rotateZ(10deg);
  }
  100% {
    transform: rotateZ(0deg);
  }
}
.error500 {
  .error500-body-con {
    width: 700px;
    height: 500px;
    position: absolute;
    left: 50%;
    top: 400px;
    transform: translate(-50%, -50%);
    .error500-body-con-title {
      text-align: center;
      font-size: 240px;
      font-weight: 700;
      color: #2d8cf0;
      height: 260px;
      line-height: 260px;
      margin-top: 40px;
      .error500-0-span {
        display: inline-block;
        position: relative;
        width: 170px;
        height: 170px;
        border-radius: 50%;
        border: 20px solid #ed3f14;
        color: #ed3f14;
        margin-right: 10px;
        transform-origin: center bottom;
        animation: error500animation 3s ease 0s infinite alternate;
        i {
          display: inline-block;
          font-size: 120px;
          position: absolute;
          bottom: -10px;
          left: 10px;
          transform-origin: center bottom;
          animation: error500animation 3s ease 0s infinite alternate;
        }
      }
    }
    .error500-body-con-message {
      display: block;
      text-align: center;
      font-size: 30px;
      font-weight: 500;
      letter-spacing: 4px;
      color: #dddde2;
    }
  }
  .error500-btn-con {
    text-align: center;
    padding: 20px 0;
    margin-bottom: 40px;
  }
}
</style>
