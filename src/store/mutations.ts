import { RootState } from "@/store/interface";
import Cookies from "js-cookie";

export const setUserInfo = (state: RootState, userInfo: any) => {
  state.userInfo = userInfo;
  localStorage.setItem("userInfo", JSON.stringify(userInfo));
};

export const setUserName = (state: RootState, userName: any) => {
  state.userInfo.userName = userName;
  localStorage.setItem("userName", userName);
};

export const saveMenu = (state: RootState, menu: any) => {
  state.menu = menu;
  localStorage.setItem("menu", JSON.stringify(menu));
};
