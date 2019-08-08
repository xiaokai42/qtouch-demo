import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";

import * as mutations from "@/store/mutations";
import * as getters from "@/store/getters";

import { RootState } from "@/store/interface";
import { base } from "@/store/modules/base";

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {
    version: "",
    userInfo: {
      orgId: "",
      orgName: "",
      userName: "",
      userId: "",
      token: ""
    },
    permissionList: [],
    menu: {}
  },
  getters,
  mutations,
  modules: {
    base
  }
};

export default new Vuex.Store<RootState>(store);
