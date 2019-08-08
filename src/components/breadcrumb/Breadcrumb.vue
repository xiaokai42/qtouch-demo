<template>
  <el-breadcrumb class="app-breadcrumb" separator="/" v-if="$route.path !== '/root'">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index === levelList.length - 1" class="no-redirect">{{
          item.meta.title
        }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
// import { generateTitle } from "@/utils/i18n";
import pathToRegexp from "path-to-regexp";

export default {
  data() {
    return {
      levelList: null
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    // generateTitle,
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => {
        // console.log(item.name);
        if (item.name) {
          return true;
        }
      });
      const first = matched[0];
      if (
        first
        // first.name.trim().toLocaleLowerCase() !== "root".toLocaleLowerCase()
      ) {
        matched = [{ path: "/root", meta: { title: "首页" } }].concat(matched);
      }
      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false);
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route;
      let toPath = pathToRegexp.compile(path);
      return toPath(params);
    },
    handleLink(item) {
      const { redirect, path } = item;
      if (redirect) {
        this.$router.push(redirect);
        return;
      }
      this.$router.push(this.pathCompile(path));
    }
  }
};
</script>

<style lang="less" scoped>
.app-breadcrumb.el-breadcrumb {
  font-size: 16px;
  height: 40px;
  padding-left: 20px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  .no-redirect {
    cursor: default;

    color: #97a8be;
  }
}
</style>
