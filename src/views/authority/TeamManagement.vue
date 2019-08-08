<template>
  <div class="my-container">
    <team-management-list
      v-if="!teamVisible && !navVisible && !appVisible && !baseTypeVisible"
      @showTeam="handleShowTeam"
      @showNav="handleShowNav"
      @showApp="handleShowApp"
      @showBaseType="handleShowBaseType"
    ></team-management-list>
    <team-management-team v-if="teamVisible" :data="teamItem" @hidden="handleHiddenTeam"></team-management-team>
    <team-management-nav v-if="navVisible" :data="teamItem" @hidden="handleHiddenNav"></team-management-nav>
    <team-management-app v-if="appVisible" :data="teamItem" @hidden="handleHiddenApp"></team-management-app>
    <team-management-base-type
      v-if="baseTypeVisible"
      :data="teamItem"
      @hidden="handleHiddenBaseType"
    ></team-management-base-type>
  </div>
</template>

<script lang="ts">
/**
 * @Description: 团队管理
 * @Author: liuyang
 * @Date: 2019-06-28 10:14
 */
import { Vue, Component, Prop } from "vue-property-decorator";
import TeamManagementList from "./components/TeamManagementList.vue";
import TeamManagementTeam from "./components/TeamManagementTeam.vue";
import TeamManagementNav from "./components/TeamManagementNav.vue";
import TeamManagementApp from "./components/TeamManagementApp.vue";
import TeamManagementBaseType from "./components/TeamManagementBaseType.vue";

@Component({
  components: {
    TeamManagementList,
    TeamManagementTeam,
    TeamManagementNav,
    TeamManagementApp,
    TeamManagementBaseType
  }
})
export default class TeamManagement extends Vue {
  teamVisible: boolean = false;
  navVisible: boolean = false;
  appVisible: boolean = false;
  baseTypeVisible: boolean = false;
  teamItem: any = {};

  handleShowTeam(teamItem: any) {
    this.teamItem = teamItem;
    this.teamVisible = true;
  }
  handleHiddenTeam() {
    this.teamVisible = false;
  }

  handleShowNav(teamItem: any) {
    this.teamItem = teamItem;
    this.navVisible = true;
  }

  handleHiddenNav() {
    this.navVisible = false;
  }

  handleShowApp(teamItem: any) {
    this.teamItem = teamItem;
    this.appVisible = true;
  }

  handleHiddenApp() {
    this.appVisible = false;
  }

  handleShowBaseType(teamItem: any) {
    this.teamItem = teamItem;
    this.baseTypeVisible = true;
  }

  handleHiddenBaseType() {
    this.baseTypeVisible = false;
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
