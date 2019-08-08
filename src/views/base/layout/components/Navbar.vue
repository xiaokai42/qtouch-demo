<template>
  <div class="navbar">
    <breadcrumb class="breadcrumb-container" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb.vue";

@Component({
  components: {
    Breadcrumb
  }
})
export default class Navbar extends Vue {}
</script>

<style lang="less" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  /*margin-top: -10px;*/
  border-radius: 0 !important;
  .hamburger-container {
    line-height: 50px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
    height: 50px;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
