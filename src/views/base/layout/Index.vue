<template>
  <div class="main" :class="layoutBodyClasses">
    <div class="header">
      <div class="logo">
        <span class="big"><img src="@/assets/images/main-logo.jpg" width="28" height="18" />重庆市住房和城乡建设委员会</span>
        <span class="min"></span>
      </div>
      <span class="header-btn" @click="isSidebarCollapse = !isSidebarCollapse">
        <i class="el-icon-menu"></i>
      </span>
      <div class="sub-logo">消防设计审查系统</div>
      <div class="right">
        <!-- <span class="header-btn">
          <Icon type="ios-notifications-outline" />
        </span> -->
        <el-tooltip :content="fullscreen ? '退出全屏' : '全屏'" popper-class="tipBg" placement="bottom">
          <span class="header-btn" @click="handleFullScreen">
            <Icon type="md-qr-scanner" />
          </span>
        </el-tooltip>
        <el-tooltip placement="bottom" popper-class="tipBg">
          <span class="header-btn">
            {{ userName }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <div slot="content">
            <el-button type="text" @click="personcenter"
              style="color: #ffffff; :hover: #409EFF; padding: 4px; margin-top: 0">
              个人中心
            </el-button>
            <br />
            <el-button type="text" @click="uodatePass"
              style="color: #ffffff; :hover: #409EFF; padding: 4px; margin-top: 0">
              修改密码
            </el-button>
            <br />
            <el-button type="text" style="color: #ffffff; :hover: #409EFF; padding: 4px" @click="logoutSystem">
              退出系统
            </el-button>
          </div>
        </el-tooltip>
      </div>
    </div>
    <div class="app-main">
      <div class="aside">
        <div class="menu">
          <el-menu
            router
            background-color="#252a2f"
            text-color="#999A9F"
            :unique-opened="true"
            :default-active="$route.path"
            class="inMenu"
            :collapse="isCollapse"
          >
            <template v-for="(menu_v, menu_k) in menuData">
              <el-submenu v-if="Object.keys(menu_v.children).length > 0" :key="menu_k" :index="menu_v.path">
                <template slot="title">
                  <i :class="menu_v.icon"></i>
                  <span slot="title"> {{ menu_v.name }}</span>
                </template>
                <el-menu-item
                  v-for="(menuChildren_v, menuChildren_k) in menu_v.children"
                  :key="menuChildren_k"
                  :index="menuChildren_v.path"
                >
                  <i :class="menuChildren_v.icon"></i>
                  <span slot="title"> {{ menuChildren_v.name }}</span>
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="menu_v.path" :key="menu_k">
                <i :class="menu_v.icon"></i>
                <span slot="title"> {{ menu_v.name }}</span>
              </el-menu-item>
            </template>
          </el-menu>
        </div>
      </div>
      <div class="app-body">
        <breadcrumb></breadcrumb>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Getter, Mutation } from "vuex-class";
import Http from "@/utils/Http";
import Url from "@/api/url";
import Cookie from "js-cookie";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb.vue";

@Component({
  components: {
    Breadcrumb
  }
})
export default class Index extends Vue {
  isSidebarCollapse: boolean = false;
  isCollapse: boolean = false;
  fullscreen: boolean = false;
  menuData: any[] = null;

  @Getter("getToken")
  token!: any;
  @Getter("getUserName")
  userName!: any;
  @Getter("getMenu")
  menu!: any;
  @Getter("getIsLogin")
  isLogin!: any;
  @Mutation("clearAll")
  clearAll!: any;

  /* @Watch("$route", { deep: true })
  checkRoute(newVal: any) {
    this.checkRoutePath(newVal.path);
  } */

  // 退出系统
  logoutSystem() {
    Http.post(Url.base.logout).then((res: any) => {
      if (res.data.status) {
        this.clearAll();
        this.$router.push({ path: "/login" });
      } else {
        this.$message.error(res.data.message);
      }
    });
  }

  personcenter() {
    this.$router.push("/mine");
  }

  uodatePass() {
    this.$router.push("/changePassword");
  }

  handleFullScreen() {
    let element: any = document.documentElement;
    let el: any = document;
    if (this.fullscreen) {
      if ((document as any).exitFullscreen) {
        el.exitFullscreen();
      } else if ((document as any).webkitCancelFullScreen) {
        el.webkitCancelFullScreen();
      } else if ((document as any).mozCancelFullScreen) {
        el.mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        el.msExitFullscreen();
      }
    } else {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        // IE11
        element.msRequestFullscreen();
      }
    }
    this.fullscreen = !this.fullscreen;
  }

  /* checkRoutePath(route: string) {
    let paths: any[] = this.menuData;
    if (paths.some((i: any) => i.path === route && !i.children)) {
      this.$router.push({ path: route });
    } else {
      let subMenu: any[] = [];
      paths.map((i: any) => {
        if (i.children && i.children !== []) {
          subMenu.push(...i.children);
        }
      });
      if (subMenu.some((i: any) => i.path === route)) {
        this.$router.push({ path: route });
      } else {
        this.$router.push({ path: "/403" });
      }
    }
  } */

  get layoutBodyClasses() {
    let classes = "";
    classes = this.isSidebarCollapse ? "sidebar-collapsed" : "";
    return classes;
  }

  created() {
    this.menuData = this.menu;
  }
}
</script>

<style scoped lang="less">
.main {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  -webkit-transition: width 0.5s;

  .header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: #2372EA;

    .logo {
      .big {
        display: block;
        transition: all ease-in-out 0.5s;
        img {
          margin-right: 3px;
          vertical-align: -3px;
        }
      }

      .min {
        display: none;
        transition: all ease-in-out 0.5s;
      }

      float: left;
      color: #fff;
      width: 216px;
      height: 50px;
      font-size: 14px;
      overflow: hidden;
      line-height: 50px;
      margin: 0 12px 0 8px;
      white-space: nowrap;
      //background: url("../../../assets/images/qTouchBig.png") no-repeat 30px 12px;
      background-size: 70% 60%;
      transition: all ease-in-out 0.5s;
    }

    .sub-logo {
      float: left;
      color: #fff;
      height: 50px;
      font-size: 14px;
      margin-left: 12px;
      line-height: 50px;
    }

    .header-btn {
      float: left;

      .el-badge__content {
        top: 14px;
        right: 7px;
        text-align: center;
        padding: 0 3px;
        color: #fff;
        border: none;
        white-space: nowrap;
        vertical-align: baseline;
        border-radius: 0.25em;
      }
      position: relative;
      overflow: hidden;
      height: 50px;
      display: inline-block;
      text-align: center;
      line-height: 50px;
      cursor: pointer;
      padding: 0 14px;
      color: #fff;
      z-index: 99;

      &:hover {
        background-color: #0861e7;
      }
    }

    .theme-switch {
      vertical-align: 10px;
    }

    .right {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  .app-main {
    position: absolute;
    top: 50px;
    left: 0;
    width: 100%;
    height: auto;
    min-height: calc(~"100vh - 50px");

    .aside {
      width: 236px;
      height: calc(~"100vh - 50px");
      position: absolute;
      top: 0;
      left: 0;
      background-color: #252a2f;
      transition: all ease-in-out 0.5s;

      .menu {
        overflow-y: auto;
        overflow-x: hidden;
        transition: all ease-in-out 0.5s;
        height: calc(~"100vh - 100px");

        .el-menu {
          border: none !important;
        }

        .el-menu-item {
          /*font-size: 12px;*/
        }

        .el-menu--vertical {
          min-width: 190px;
        }
      }
    }

    .app-body {
      position: absolute;
      width: calc(~"100% - 236px");
      left: 236px;
      height: calc(~"100vh - 50px");
      overflow-y: auto;
      transition: all ease-in-out 0.5s;
      background: rgb(240, 242, 245);
    }
  }
}

.sidebar-collapsed {
  .header {
    .logo {
      width: 0;
      opacity: 0;
      margin-top: 10px;
    }
  }

  .app-main {
    .aside {
      width: 0;
      height: calc(~"100vh - 50px");
    }

    .app-body {
      width: 100%;
      min-height: calc(~"100vh - 50px");
      overflow-y: auto;
      left: 0;
    }
  }
}
</style>
