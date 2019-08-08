import { GetterTree, MutationTree, ActionTree } from "vuex";
import { Module } from "vuex";

import { BaseState } from "@/store/modules/base/interface";
import { RootState } from "@/store/interface";
import * as types from "@/store/modules/base/types";
import Cookies from "js-cookie";
const ls = window.localStorage;

const state: BaseState = {
  token: "",
  isLogin: false
};

const getters: GetterTree<BaseState, RootState> = {
  getIsLogin(state: BaseState) {
    if (state.isLogin) {
      return state.isLogin;
    }
    if (Cookies.get("isLogin")) {
      return Cookies.get("isLogin");
    }
    return false;
  },
  [types.GET_TOKEN](state: BaseState) {
    if (state.token !== "") {
      return state.token;
    }
    if (Cookies.get("accessToken")) {
      return Cookies.get("accessToken");
    }
    return "";
  }
};

const mutations: MutationTree<BaseState> = {
  setIsLogin(state: BaseState, isLogin: any) {
    state.isLogin = isLogin;
    Cookies.set("isLogin", isLogin);
  },
  [types.SAVE_TOKEN](state: BaseState, token: any) {
    state.token = token;
    Cookies.set("accessToken", token);
  },
  [types.CLEAR_TOKEN]() {
    ls.removeItem("token");
    Cookies.remove("accessToken");
  },
  [types.CLEAR_ALL](state: BaseState) {
    ls.clear();
    state.token = "";
    state.isLogin = false;
    Cookies.remove();
  }
};

const actions: ActionTree<BaseState, RootState> = {};

export const base: Module<BaseState, RootState> = {
  state,
  getters,
  mutations,
  actions
};
