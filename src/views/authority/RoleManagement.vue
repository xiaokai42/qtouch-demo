<template>
  <div class="my-container">
    <role-management-list
      v-if="!roleVisible && !navVisible"
      @showRole="handleShowRole"
      @showNav="handleShowNav"
    ></role-management-list>
    <role-management-detail v-if="roleVisible" :data="roleItem" @hidden="handleHiddenRole"></role-management-detail>
    <role-management-nav v-if="navVisible" :data="roleItem" @hidden="handleHiddenNav"></role-management-nav>
  </div>
</template>

<script lang="ts">
/**
 * @Description: 角色管理
 * @Author: liuyang
 * @Date: 2019-06-27 14:31
 */
import { Vue, Component, Prop } from "vue-property-decorator";
import RoleManagementList from "./components/RoleManagementList.vue";
import RoleManagementDetail from "./components/RoleManagementDetail.vue";
import RoleManagementNav from "./components/RoleManagementNav.vue";

@Component({
  components: {
    RoleManagementList,
    RoleManagementDetail,
    RoleManagementNav
  }
})
export default class RoleManagement extends Vue {
  roleVisible: boolean = false;
  navVisible: boolean = false;
  roleItem: any = {};

  handleShowRole(roleItem: any) {
    this.roleVisible = true;
    this.roleItem = roleItem;
  }
  handleShowNav(roleItem: any) {
    this.navVisible = true;
    this.roleItem = roleItem;
  }

  handleHiddenRole() {
    this.roleVisible = false;
  }

  handleHiddenNav() {
    this.navVisible = false;
  }
}
</script>

<style scoped lang="less">
.my-container {
  margin: 20px;
  padding: 20px;
  background: #fff;
}
</style>
